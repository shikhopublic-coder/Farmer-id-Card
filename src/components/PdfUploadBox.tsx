import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FarmerProfile } from '../types/farmer';
import { parseFarmerDocument } from '../utils/pdfParser';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PdfUploadBoxProps {
  onProfileLoaded: (profile: Partial<FarmerProfile>) => void;
  lang: 'en' | 'hi';
  compact?: boolean;
}

const LOADING_STEPS = [
  {
    en: 'Reading PDF document structure',
    hi: 'PDF दस्तावेज़ लोड व पढ़ा जा रहा है',
  },
  {
    en: 'Scanning Page 1 & auto-cropping farmer photo',
    hi: 'पेज 1 से किसान की पासपोर्ट फोटो ऑटो-क्रॉप हो रही है',
  },
  {
    en: 'Extracting Name, DOB, Farmer ID & Land Records',
    hi: 'नाम, जन्मतिथि, किसान ID व भूमि रिकॉर्ड निकाले जा रहे हैं',
  },
  {
    en: 'Generating digital Kisan ID Card',
    hi: 'डिजिटल किसान पहचान पत्र तैयार किया जा रहा है',
  },
];

export const PdfUploadBox: React.FC<PdfUploadBoxProps> = ({
  onProfileLoaded,
  lang,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [fileName, setFileName] = useState<string>('Registration_Form.pdf');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processPdfFile = async (file: File | Blob, customName = 'Farmer_Registration.pdf') => {
    // 1. Exact STARTING of Loading Screen
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setProgress(15);
    setActiveStepIndex(0);
    setFileName(file instanceof File ? file.name : customName);
    setProcessStep(
      lang === 'hi' ? 'PDF दस्तावेज़ पढ़ा जा रहा है...' : 'Reading PDF document...'
    );

    let progressTimer: any = null;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileDataUrl = reader.result as string;

        // Step 1: Scanning Page 1 & photo auto-crop
        setProgress(38);
        setActiveStepIndex(1);
        setProcessStep(
          lang === 'hi'
            ? 'पेज 1 से फोटो स्कैन व ऑटो-क्रॉप हो रही है...'
            : 'Scanning page 1 & auto-cropping farmer photo...'
        );

        // Smoothly advance progressive AI extraction while backend/parser runs
        progressTimer = setInterval(() => {
          setProgress((prev) => {
            if (prev < 92) {
              const inc = prev < 50 ? 4 : prev < 75 ? 2 : 1;
              const next = prev + inc;
              if (next >= 48) {
                setActiveStepIndex(2);
                setProcessStep(
                  lang === 'hi'
                    ? 'AI विवरण, पहचान पत्र व भूमि रिकॉर्ड निकाल रहा है...'
                    : 'AI extracting personal details, ID & land records...'
                );
              }
              return next;
            }
            return prev;
          });
        }, 220);

        const result = await parseFarmerDocument(file, fileDataUrl);
        if (progressTimer) clearInterval(progressTimer);

        if (result.success && result.profile) {
          // Exact ENDING of Loading Screen: Jump to 100%, show completion
          setProgress(100);
          setActiveStepIndex(3);
          setProcessStep(
            lang === 'hi'
              ? 'कार्ड सफलतापूर्वक तैयार हो गया!'
              : 'Kisan Card generated successfully!'
          );
          setSuccessMsg(
            lang === 'hi'
              ? `PDF से विवरण सफलतापूर्वक प्राप्त किए गए (${result.profile.name || 'किसान'})`
              : `Extracted details for ${result.profile.name || 'Farmer'} successfully!`
          );

          onProfileLoaded(result.profile);

          try {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }

          // Smooth transition out after user sees 100% complete
          setTimeout(() => {
            setIsProcessing(false);
          }, 400);
        } else {
          setErrorMsg(result.error || 'Failed to extract data from this PDF.');
        }
      };

      reader.onerror = () => {
        if (progressTimer) clearInterval(progressTimer);
        setErrorMsg('Error reading file.');
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      if (progressTimer) clearInterval(progressTimer);
      console.error('PDF parsing error:', err);
      setErrorMsg(err.message || 'Error processing PDF');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPdfFile(file, file.name);
    }
    // reset input so re-selecting same file triggers change
    e.target.value = '';
  };

  // Dedicated Full-Screen Loading Screen Overlay: Exact Starting to Ending
  const loadingOverlay =
    isProcessing && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 relative overflow-hidden">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AgriStack Auto-Fill AI</span>
              </div>

              {/* Visual Animation Box: Scanner or Success Check */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                {errorMsg ? (
                  <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-400 flex items-center justify-center text-rose-600 shadow-md">
                    <AlertCircle className="w-12 h-12" />
                  </div>
                ) : progress >= 100 ? (
                  <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 animate-in zoom-in-75 duration-300 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                ) : (
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/70 border border-emerald-300/80 flex items-center justify-center text-emerald-700 shadow-md">
                    <FileText className="w-10 h-10 animate-pulse text-emerald-700" />
                    {/* Laser Scanning Beam */}
                    <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-bounce" />
                  </div>
                )}
              </div>

              {/* Title and Step Subtitle */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-slate-900 font-serif">
                  {errorMsg
                    ? lang === 'hi'
                      ? 'PDF पढ़ने में समस्या'
                      : 'Extraction Failed'
                    : progress >= 100
                    ? lang === 'hi'
                      ? 'किसान कार्ड तैयार हो गया!'
                      : 'Kisan Card Ready!'
                    : lang === 'hi'
                    ? 'PDF दस्तावेज़ स्कैन हो रहा है...'
                    : 'Processing PDF Document...'}
                </h3>
                <p className="text-xs font-medium text-slate-600 min-h-[2rem] flex items-center justify-center px-2">
                  {errorMsg ? errorMsg : processStep}
                </p>
                <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs mx-auto">
                  {fileName}
                </p>
              </div>

              {/* Progress Bar & Percentage */}
              {!errorMsg && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="text-emerald-700">
                      {lang === 'hi' ? 'प्रक्रिया प्रगति' : 'Extraction Progress'}
                    </span>
                    <span className="font-mono text-emerald-800">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full transition-all duration-300 ease-out shadow-xs"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 4-Step Checklist */}
              {!errorMsg && (
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-left space-y-2 text-xs">
                  {LOADING_STEPS.map((st, i) => {
                    const isDone = activeStepIndex > i || progress >= 100;
                    const isCurrent = activeStepIndex === i && progress < 100;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 transition-colors ${
                          isDone
                            ? 'text-emerald-800 font-semibold'
                            : isCurrent
                            ? 'text-slate-900 font-bold'
                            : 'text-slate-400 font-normal'
                        }`}
                      >
                        {isDone ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="truncate">{st[lang]}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* If error: Close button */}
              {errorMsg && (
                <button
                  type="button"
                  onClick={() => {
                    setIsProcessing(false);
                    setErrorMsg(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'hi' ? 'बंद करें' : 'Close'}
                </button>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  if (compact) {
    return (
      <>
        {loadingOverlay}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              {isProcessing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5" />
              )}
              <span>
                {isProcessing
                  ? processStep
                  : lang === 'hi'
                  ? '📄 PDF अपलोड करें (ऑटो-फिल)'
                  : 'Upload PDF to Auto-Fill'}
              </span>
            </button>
          </div>

          {successMsg && (
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{successMsg}</span>
            </p>
          )}
          {errorMsg && (
            <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {loadingOverlay}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-2xl border-2 border-dashed border-emerald-300 p-5 shadow-xs text-slate-800 relative overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Info */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-emerald-950 font-serif">
                  AgriStack PDF Upload
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                {lang === 'hi'
                  ? 'AgriStack रजिस्ट्रेशन फॉर्म (Farmer Registration Form) PDF अपलोड करते ही नाम, पिता का नाम, फोटो, जन्मतिथि, जाति, खसरा, खाता और क्षेत्रफल स्वतः कार्ड में भर जाएगा।'
                  : 'Upload your AgriStack / PM-KISAN registration PDF to automatically extract farmer photo, name, father name, DOB, caste, address, and land records.'}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>
                {isProcessing
                  ? processStep
                  : lang === 'hi'
                  ? 'अपना PDF चुनें (Browse PDF File)'
                  : 'Browse PDF File'}
              </span>
            </button>
          </div>
        </div>

        {/* Progress or Status Notification */}
        {isProcessing && (
          <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>{processStep}</span>
          </div>
        )}

        {successMsg && !isProcessing && (
          <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center gap-2 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && !isProcessing && (
          <div className="mt-3 pt-3 border-t border-rose-200 flex items-center gap-2 text-xs font-bold text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </>
  );
};
