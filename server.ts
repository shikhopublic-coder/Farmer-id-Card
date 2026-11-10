import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import { execSync } from 'child_process';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API endpoint to parse Farmer Registration PDF or Image using Gemini 3.8 Flash
app.post('/api/parse-farmer-pdf', async (req, res) => {
  try {
    const { pdfBase64, mimeType = 'application/pdf', photoBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ error: 'No pdfBase64 provided in request body.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set in environment.');
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Clean base64 string
    const cleanBase64 = pdfBase64.replace(/^data:[^;]+;base64,/, '');
    const contentParts: any[] = [];
    let isMultiImagePdf = false;
    let firstPageJpgBuf: Buffer | null = null;

    // If PDF is uploaded, extract all embedded JPEG streams (page 1 top, page 1 bottom, page 2 land records)
    if (mimeType === 'application/pdf') {
      try {
        const pdfBuf = Buffer.from(cleanBase64, 'base64');
        let idx = 0;
        while (contentParts.length < 3) {
          const sIdx = pdfBuf.indexOf(Buffer.from('stream'), idx);
          if (sIdx === -1) break;
          const eIdx = pdfBuf.indexOf(Buffer.from('endstream'), sIdx);
          if (eIdx === -1) break;

          let dataStart = sIdx + 6;
          if (pdfBuf[dataStart] === 0x0d && pdfBuf[dataStart + 1] === 0x0a) dataStart += 2;
          else if (pdfBuf[dataStart] === 0x0a) dataStart += 1;

          if (pdfBuf[dataStart] === 0xff && pdfBuf[dataStart + 1] === 0xd8) {
            const jpgBuf = pdfBuf.subarray(dataStart, eIdx);
            if (!firstPageJpgBuf) {
              firstPageJpgBuf = jpgBuf;
            }
            contentParts.push({
              inlineData: {
                data: jpgBuf.toString('base64'),
                mimeType: 'image/jpeg',
              },
            });
          }
          idx = eIdx + 9;
        }
        if (contentParts.length > 0) {
          isMultiImagePdf = true;
        }
      } catch (err) {
        console.warn('PDF stream extraction error:', err);
      }
    }

    if (contentParts.length === 0) {
      contentParts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      });
    }

    const prompt = `You are an expert Government of India document digitization and OCR specialist.
Analyze this official AgriStack / Kisan "Farmer Registration Form" (or land registry document).
Extract all official fields carefully and return a JSON object with this exact structure:

{
  "name": "Full farmer name in English (uppercase, e.g. BIDHYA SAGAR BRAHMA)",
  "regionalName": "Farmer name in regional language / script (e.g. Assamese বিদ্যা ব্রহ্ম or Hindi), leave empty if not present",
  "gender": "Male" or "Female" or "Other",
  "dob": "Date of Birth formatted DD/MM/YYYY (e.g. 21/08/1984)",
  "caste": "ST" or "SC" or "OBC" or "General",
  "area": "Rural" or "Urban" or "Semi-Urban",
  "aadhaar": "Aadhaar number if present, or format last 4 digits e.g. 9999 8888 7777 or XXXX XXXX 0526",
  "mobile": "10-digit mobile number from Contact Details on page 1 (e.g. 9365762645)",
  "farmerId": "Farmer ID or unique registration number formatted with spaces like 2407 600 5045 or 1234 000 5678",
  "careOf": "Father, Husband, or Identifier name in English (e.g. Sachindra Brahma)",
  "village": "Village / Gaon name (e.g. Odlaguri No.1)",
  "district": "District name (e.g. Kokrajhar)",
  "state": "State name (e.g. Assam)",
  "stateId": "assam" or "uttar_pradesh" or "maharashtra" or "bihar" or "rajasthan" or "madhya_pradesh" or "gujarat" or "national",
  "pincode": "PIN code (e.g. 783360 or 781001)",
  "approvalDate": "Date of registration / approval formatted DD/MM/YYYY (e.g. 26/12/2025)",
  "downloadDate": "Download date formatted DD/MM/YYYY (or current date)",
  "fullAddressOverride": "Formatted full address line, e.g. C/O Sachindra Brahma, Vill-Odlaguri No.1, P O Bhodeaguri, Kokrajhar, Assam, India, 783360",
  "landRecords": [
    {
      "village": "Village name (e.g. Odlaguri No.1)",
      "khata": "Survey Number extracted from 'S No.' in document (e.g. '241')",
      "khasra": "* (since Sub Survey No is not present in document, always put '*')",
      "area": "Area in Hectares (e.g. 0.370626)"
    }
  ]
}

Ensure all values are accurately captured from the document. Return ONLY raw JSON without markdown code fences.`;

    contentParts.push({ text: prompt });

    // Select candidate models based on MIME types
    const candidateModels =
      isMultiImagePdf || mimeType.startsWith('image/')
        ? ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash']
        : ['gemini-flash-latest', 'gemini-3.8-flash'];

    let responseText = '{}';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: contentParts,
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} attempt error:`, err?.message || err);
      }
    }

    if (responseText === '{}' && lastError) {
      throw lastError;
    }
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch {
      // Fallback regex match for json
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      }
    }

    // Attach photo from client or automatically extract and crop from PDF stream
    let finalPhotoUrl = photoBase64 || null;
    if (!finalPhotoUrl && (firstPageJpgBuf || (cleanBase64 && mimeType.startsWith('image/')))) {
      try {
        const pageBuf = firstPageJpgBuf || Buffer.from(cleanBase64, 'base64');
        const tmpPagePath = `/tmp/pdf_page_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const tmpPhotoPath = `/tmp/pdf_crop_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        fs.writeFileSync(tmpPagePath, pageBuf);
        // Crop photo using ImageMagick: x: 1826, y: 220, w: 172, h: 202
        execSync(`convert "${tmpPagePath}" -crop 172x202+1826+220 -quality 95 "${tmpPhotoPath}"`);
        const croppedBuf = fs.readFileSync(tmpPhotoPath);
        finalPhotoUrl = `data:image/jpeg;base64,${croppedBuf.toString('base64')}`;
        try { fs.unlinkSync(tmpPagePath); fs.unlinkSync(tmpPhotoPath); } catch {}
      } catch (err) {
        console.warn('Server automatic photo extraction note:', err);
      }
    }

    if (finalPhotoUrl) {
      parsedData.photoUrl = finalPhotoUrl;
    }

    // Clean and normalize extracted farmer data directly from document
    if (parsedData.name) {
      parsedData.name = parsedData.name.trim().toUpperCase();
    }
    if (parsedData.farmerId) {
      const rawId = parsedData.farmerId.replace(/\s+/g, '');
      if (rawId.length >= 11) {
        parsedData.farmerId = `${rawId.slice(0, 4)} ${rawId.slice(4, 7)} ${rawId.slice(7)}`;
      } else {
        parsedData.farmerId = rawId;
      }
    }
    if (parsedData.mobile) {
      parsedData.mobile = parsedData.mobile.replace(/[^0-9]/g, '').slice(-10);
    }
    if (parsedData.state && !parsedData.stateId) {
      const s = parsedData.state.toLowerCase();
      if (s.includes('assam')) parsedData.stateId = 'assam';
      else if (s.includes('uttar')) parsedData.stateId = 'uttar_pradesh';
      else if (s.includes('bihar')) parsedData.stateId = 'bihar';
      else if (s.includes('rajasthan')) parsedData.stateId = 'rajasthan';
      else if (s.includes('madhya')) parsedData.stateId = 'madhya_pradesh';
      else if (s.includes('maharashtra')) parsedData.stateId = 'maharashtra';
      else if (s.includes('gujarat')) parsedData.stateId = 'gujarat';
      else parsedData.stateId = 'national';
    }

    // Map land records dynamically from the document
    if (parsedData.landRecords && Array.isArray(parsedData.landRecords) && parsedData.landRecords.length > 0) {
      parsedData.landRecords = parsedData.landRecords.map((lr: any, idx: number) => {
        const surveyNo = lr.khata && lr.khata !== '1' ? lr.khata : (lr.khasra && lr.khasra !== '*' ? lr.khasra : (lr.khata || ''));
        return {
          id: lr.id || `land-${idx + 1}`,
          village: lr.village || parsedData.village || '',
          khata: surveyNo || '',
          khasra: lr.khasra || '*',
          area: lr.area || '',
        };
      });
    } else {
      parsedData.landRecords = [];
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error parsing PDF with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process document',
    });
  }
});

// Setup Vite middlewares in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const portNum = Number(process.env.PORT) || 3000;
  app.listen(portNum, '0.0.0.0', () => {
    console.log(`Server listening on port ${portNum}`);
  });
}

startServer();
