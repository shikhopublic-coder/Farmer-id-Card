import React from 'react';
import { FarmerProfile } from '../types/farmer';
import { FarmerCardFront } from './FarmerCardFront';
import { FarmerCardBack } from './FarmerCardBack';
import { Printer, X, Download, Scissors } from 'lucide-react';
import { downloadCardPdf } from '../utils/exportCard';

interface PrintSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  lang: 'en' | 'hi';
  onDownloadComplete?: () => void;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang,
  onDownloadComplete,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const frontTarget = document.getElementById('farmer-card-front-export')
      ? 'farmer-card-front-export'
      : 'sheet-front';
    const backTarget = document.getElementById('farmer-card-back-export')
      ? 'farmer-card-back-export'
      : 'sheet-back';
    await downloadCardPdf(frontTarget, backTarget, profile.name);
    if (onDownloadComplete) {
      setTimeout(() => {
        onClose();
        onDownloadComplete();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'hi' ? 'पीवीसी कार्ड प्रिंट शीट (A4 / फोटो पेपर)' : 'PVC Card Print Sheet Preview (A4 / Photo Paper)'}
            </h3>
            <p className="text-xs text-slate-500">
              CR80 Standard Size (85.6mm × 54mm) · 300 DPI high-resolution ready
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'प्रिंट करें (Print)' : 'Print Sheet'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Simulating A4) */}
        <div className="p-8 overflow-y-auto bg-slate-100 flex-1 flex justify-center">
          <div className="w-[794px] min-h-[1123px] bg-white shadow-xl p-10 border border-slate-300 flex flex-col items-center">
            {/* Sheet Header */}
            <div className="w-full text-center pb-6 mb-8">
              <h2 className="text-lg font-extrabold text-[#006837] tracking-wide">
                AgriStack - Digital Farmer ID Card (PVC Print Format)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Government of India · Ministry of Agriculture & Farmers Welfare
              </p>
            </div>

            {/* Side-by-Side Dual Format */}
            <div className="w-full">
              <div className="flex items-center justify-center gap-6 p-4">
                {/* Front Side scaled */}
                <div className="flex flex-col items-center">
                  <div className="p-1.5 border border-dashed border-slate-400">
                    <div className="scale-75 origin-top-left -mr-40 -mb-24">
                      <div id="sheet-front">
                        <FarmerCardFront profile={profile} />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 mt-3 tracking-wide">FRONT SIDE</span>
                </div>

                {/* Back Side scaled */}
                <div className="flex flex-col items-center">
                  <div className="p-1.5 border border-dashed border-slate-400">
                    <div className="scale-75 origin-top-left -mr-40 -mb-24">
                      <div id="sheet-back">
                        <FarmerCardBack profile={profile} />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 mt-3 tracking-wide">BACK SIDE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
