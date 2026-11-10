import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export const downloadElementAsPng = async (
  elementId: string,
  fileName: string
): Promise<boolean> => {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  try {
    // Generate at 2.5x pixel ratio for ultra-crisp print quality
    // skipFonts prevents SecurityError: Failed to read the 'cssRules' property from cross-origin Google Fonts
    const dataUrl = await toPng(node, {
      pixelRatio: 2.5,
      quality: 1,
      backgroundColor: '#ffffff',
      skipFonts: true,
      fontEmbedCSS: '',
    });

    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }

    return true;
  } catch (err) {
    console.error('Failed to export image:', err);
    return false;
  }
};

export const downloadCardPdf = async (
  frontId: string,
  backId: string,
  farmerName: string
): Promise<boolean> => {
  const frontNode = document.getElementById(frontId);
  const backNode = document.getElementById(backId);

  if (!frontNode || !backNode) {
    console.error('Card elements not found');
    return false;
  }

  try {
    // Render both front and back without querying cross-origin stylesheet rules
    const frontPng = await toPng(frontNode, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      skipFonts: true,
      fontEmbedCSS: '',
    });
    const backPng = await toPng(backNode, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      skipFonts: true,
      fontEmbedCSS: '',
    });

    // Create A4 PDF (210 x 297 mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Standard CR80 ID Card dimensions: 85.6mm x 53.98mm
    const cardWidth = 85.6;
    const cardHeight = 53.98;

    // Header in PDF
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 104, 55); // Forest green
    pdf.text('AgriStack - Digital Farmer ID Card (PVC Print Format)', 105, 25, {
      align: 'center',
    });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      'Government of India · Ministry of Agriculture & Farmers Welfare',
      105,
      32,
      { align: 'center' }
    );

    // Front Card placed on left
    const startY = 50;
    const xFront = 18;
    const xBack = 108;

    pdf.addImage(frontPng, 'PNG', xFront, startY, cardWidth, cardHeight);
    pdf.addImage(backPng, 'PNG', xBack, startY, cardWidth, cardHeight);

    // Light cutting guide border
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineDashPattern([2, 2], 0);
    pdf.rect(xFront - 1, startY - 1, cardWidth + 2, cardHeight + 2);
    pdf.rect(xBack - 1, startY - 1, cardWidth + 2, cardHeight + 2);

    // Label notes below
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);
    pdf.text('FRONT SIDE', xFront + cardWidth / 2, startY + cardHeight + 7, {
      align: 'center',
    });
    pdf.text('BACK SIDE', xBack + cardWidth / 2, startY + cardHeight + 7, {
      align: 'center',
    });

    // Save PDF
    const cleanName = (farmerName || 'Farmer').trim().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    pdf.save(`${cleanName || 'Farmer_ID'}.pdf`);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    return true;
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    return false;
  }
};
