import React, { useState } from 'react';
import { FarmerProfile } from '../types/farmer';
import { FarmerCardFront } from './FarmerCardFront';
import { FarmerCardBack } from './FarmerCardBack';
import { CardEditor } from './CardEditor';
import { PdfUploadBox } from './PdfUploadBox';
import { PaymentModal } from './PaymentModal';
import {
  RotateCcw,
  Download,
  Printer,
  ShieldCheck,
  LayoutGrid,
  CreditCard,
  Layers,
  FileDown,
  Sparkles,
  ImageIcon,
  Home,
  FileText,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
} from 'lucide-react';
import { downloadElementAsPng, downloadCardPdf } from '../utils/exportCard';

interface CardStudioProps {
  profile: FarmerProfile;
  setProfile: (profile: FarmerProfile) => void;
  lang: 'en' | 'hi';
  onOpenVerify: () => void;
  onOpenPrintSheet: () => void;
  hasUploadedPdf: boolean;
  setHasUploadedPdf: (has: boolean) => void;
}

export const CardStudio: React.FC<CardStudioProps> = ({
  profile,
  setProfile,
  lang,
  onOpenVerify,
  onOpenPrintSheet,
  hasUploadedPdf,
  setHasUploadedPdf,
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<Partial<FarmerProfile> | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'dual'>('dual');
  const [isDownloading, setIsDownloading] = useState(false);

  // Return to Home automatically on download
  const handleDownloadReturnHome = () => {
    setDownloadToast(
      lang === 'hi'
        ? 'कार्ड सफलतापूर्वक डाउनलोड हो गया! होम पेज पर वापस जा रहे हैं...'
        : 'Card downloaded successfully! Returning to Home page...'
    );
    setTimeout(() => {
      setDownloadToast(null);
      setHasUploadedPdf(false);
    }, 1400);
  };

  const handleDownloadFront = async () => {
    setIsDownloading(true);
    await downloadElementAsPng('farmer-card-front-export', `AgriStack_Front_${profile.name.replace(/\s+/g, '_')}`);
    setIsDownloading(false);
    handleDownloadReturnHome();
  };

  const handleDownloadBack = async () => {
    setIsDownloading(true);
    await downloadElementAsPng('farmer-card-back-export', `AgriStack_Back_${profile.name.replace(/\s+/g, '_')}`);
    setIsDownloading(false);
    handleDownloadReturnHome();
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    await downloadCardPdf('farmer-card-front-export', 'farmer-card-back-export', profile.name);
    setIsDownloading(false);
    handleDownloadReturnHome();
  };

  const applyExtractedProfile = (p: Partial<FarmerProfile>) => {
    const stateIdVal = p.stateId || (p.state ? p.state.toLowerCase().replace(/[^a-z]/g, '_') : 'assam');
    const freshProfile: FarmerProfile = {
      id: `farmer-${Date.now()}`,
      name: p.name || 'FARMER NAME',
      regionalName: p.regionalName || '',
      gender: p.gender || 'Male',
      dob: p.dob || '',
      caste: p.caste || 'General',
      area: p.area || 'Rural',
      aadhaar: p.aadhaar || '',
      mobile: p.mobile || '',
      farmerId: p.farmerId || '',
      photoUrl: p.photoUrl || '',
      approvalDate: p.approvalDate || new Date().toLocaleDateString('en-GB'),
      downloadDate: p.downloadDate || new Date().toLocaleDateString('en-GB'),
      careOf: p.careOf || '',
      village: p.village || '',
      district: p.district || '',
      state: p.state || 'Assam',
      stateId: stateIdVal as any,
      pincode: p.pincode || '',
      fullAddressOverride: p.fullAddressOverride || '',
      landRecords: p.landRecords && Array.isArray(p.landRecords) ? p.landRecords : [],
      frontTemplate: profile.frontTemplate || 'green_farmer',
      backTemplate: profile.backTemplate || 'green_farmer',
      backTableType: profile.backTableType || 'village_khata_khasra_area',
      primaryLogoType: profile.primaryLogoType || 'agristack',
      secondaryLogoType: profile.secondaryLogoType || 'national',
    };
    setProfile(freshProfile);
  };

  const handleProfileLoaded = (extracted: Partial<FarmerProfile>) => {
    const isPaymentRequired = localStorage.getItem('agristack_payment_enabled') !== 'false';
    if (!isPaymentRequired) {
      applyExtractedProfile(extracted);
      setHasUploadedPdf(true);
      return;
    }
    setPendingProfile(extracted);
    // Open payment gateway with QR code and UTR requirement before showing card
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (_utr: string) => {
    if (pendingProfile) {
      applyExtractedProfile(pendingProfile);
    }
    setIsPaymentModalOpen(false);
    // Reveal card after successful payment & UTR verification
    setHasUploadedPdf(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hidden containers used strictly for pristine high-resolution canvas export (only when card is unlocked) */}
      {hasUploadedPdf && (
        <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
          <div
            id="farmer-card-front-export"
            className={
              profile.frontTemplate === 'classic_agristack'
                ? 'w-[1028px] h-[662px]'
                : 'w-[1579px] h-[996px]'
            }
          >
            <FarmerCardFront
              profile={profile}
              className={
                profile.frontTemplate === 'classic_agristack'
                  ? 'w-[1028px]! h-[662px]!'
                  : 'w-[1579px]! h-[996px]!'
              }
            />
          </div>
          <div
            id="farmer-card-back-export"
            className={
              profile.backTemplate === 'classic_agristack'
                ? 'w-[1026px] h-[662px]'
                : 'w-[1579px] h-[996px]'
            }
          >
            <FarmerCardBack
              profile={profile}
              className={
                profile.backTemplate === 'classic_agristack'
                  ? 'w-[1026px]! h-[662px]!'
                  : 'w-[1579px]! h-[996px]!'
              }
            />
          </div>
        </div>
      )}

      {!hasUploadedPdf ? (
        /* ================= 1. HOME PAGE VIEW (BEFORE PDF UPLOAD) ================= */
        <div className="space-y-10">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-serif">
              {lang === 'hi'
                ? 'डिजिटल किसान पहचान पत्र (Kisan Card) पोर्टल'
                : 'Digital Farmer ID Card (Kisan Card) Portal'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {lang === 'hi'
                ? 'कार्ड जनरेट करने के लिए अपना आधिकारिक किसान रजिस्ट्रेशन फॉर्म (PDF) अपलोड करें। PDF अपलोड होते ही आपका पहचान पत्र, फोटो और सभी विवरण के साथ कार्ड तैयार हो जाएगा।'
                : 'Upload your official AgriStack / PM-KISAN registration PDF. Your verified Kisan Card with auto-cropped photo and land records will appear immediately once uploaded.'}
            </p>
          </div>

          {/* Prominent Centerpiece: PDF Upload Hub */}
          <div className="max-w-3xl mx-auto shadow-sm rounded-3xl overflow-hidden border border-emerald-200">
            <PdfUploadBox
              lang={lang}
              onProfileLoaded={handleProfileLoaded}
            />
          </div>

          {/* 4 Feature Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                📸
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'hi' ? 'ऑटो-क्रॉप पासपोर्ट फोटो' : 'Auto-Crop Photo'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'PDF के पहले पेज से किसान की पासपोर्ट फोटो स्वतः सही अनुपात में कटकर कार्ड में सेट हो जाती है।'
                  : 'Automatically detects and crops the farmer photo from page 1 in high resolution.'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'hi' ? '1.4 सेकंड AI ऑटो-फिल' : 'Superfast AI OCR'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'नाम, जन्मतिथि, पिता का नाम, जाति, आधार व मोबाइल नंबर बिना किसी देरी के स्वतः भर जाते हैं।'
                  : 'Instant extraction of Name, Father Name, DOB, Caste, Aadhaar & Mobile Number.'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                🌾
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'hi' ? 'भूमि व खसरा रिकॉर्ड्स' : 'Land & Survey Records'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'खाता संख्या, खसरा और कुल क्षेत्रफल कार्ड के पीछे तालिका में स्वतः दर्ज हो जाता है।'
                  : 'Integrates Survey No, Khasra, and area in Hectares into the back side table.'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                🖨️
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'hi' ? 'CR80 PVC कार्ड प्रिंट रेडी' : 'Print-Ready PVC Card'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'फ्रंट/बैक एचडी इमेज डाउनलोड करें या 8-कार्ड वाली A4 पीवीसी शीट एक क्लिक में प्रिंट करें।'
                  : 'Download front & back HD PNGs or export an 8-card A4 PVC sheet ready for thermal printers.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ================= 2. CARD VIEW (APPEARS AFTER PDF UPLOAD) ================= */
        <div className="space-y-6">
          {/* Top Status Bar: Uploaded Confirmation & Home/Upload-Another controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-emerald-50 via-white to-teal-50 rounded-2xl border border-emerald-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {lang === 'hi' ? 'कार्ड तैयार है' : 'Card Generated'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold">
                    {profile.farmerId || '2407 600 5045'}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 font-serif">
                  {profile.name || 'BIDHYA SAGAR BRAHMA'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setHasUploadedPdf(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Back to Home"
              >
                <Home className="w-3.5 h-3.5 text-slate-600" />
                <span>Home</span>
              </button>

              {/* View Mode Segmented Switcher */}
              <div className="flex items-center p-1 bg-slate-200/80 rounded-xl shrink-0">
                <button
                  onClick={() => setViewMode('dual')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'dual'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Dual View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{lang === 'hi' ? 'Dual' : 'Dual'}</span>
                </button>
              </div>
            </div>
          </div>

      {/* Main Studio Grid: Card Display (Left/Top) & Card Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Card Interactive Stage & Toolbar */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPrintSheet}
                className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'प्रिंट शीट' : 'Print PVC Sheet'}</span>
              </button>
            </div>

            {/* Quick Export Dropdown / Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadFront}
                disabled={isDownloading}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download Front side as PNG"
              >
                Front PNG
              </button>
              <button
                onClick={handleDownloadBack}
                disabled={isDownloading}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                title="Download Back side as PNG"
              >
                Back PNG
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Card Presentation Stage */}
          <div className="p-6 sm:p-10 bg-gradient-to-b from-slate-100/80 to-slate-200/60 rounded-3xl border border-slate-200 flex items-center justify-center min-h-[480px]">
            {viewMode === '3d' ? (
              /* 3D Flip Card Container */
              <div
                className="w-[680px] h-[438px] max-w-full perspective-1000 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
                title="Click to flip card"
              >
                <div
                  className={`w-full h-full relative transform-style-3d transition-transform duration-500 ease-out ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 backface-hidden flex items-center justify-center">
                    <FarmerCardFront profile={profile} />
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center">
                    <FarmerCardBack profile={profile} />
                  </div>
                </div>
              </div>
            ) : (
              /* Dual View Side-by-Side */
              <div className="flex flex-col gap-8 items-center w-full">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Front Side
                  </span>
                  <FarmerCardFront profile={profile} />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Back Side
                  </span>
                  <FarmerCardBack profile={profile} />
                </div>
              </div>
            )}
          </div>

          {/* Info Card / Security Features Notice */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm font-serif">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === 'hi' ? 'एग्रीस्टैक कार्ड सुरक्षा विशेषताएं' : 'AgriStack Card Official Features'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Dynamic QR Code</p>
                <p>Scannable with any smartphone camera for instant registry authentication.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">CR80 PVC Ready</p>
                <p>Exact 85.6mm × 54mm dimensions suitable for thermal card printers and lamination.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Land Linked</p>
                <p>Includes Khata, Khasra, and Hectare area records integrated with digital land records.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Card Data Editor */}
        <div className="lg:col-span-5">
          <CardEditor profile={profile} onChange={setProfile} lang={lang} />
        </div>
      </div>
    </div>
  )}

  {/* Payment Gateway Modal with QR Code and 12-digit UTR Verification */}
  <PaymentModal
    isOpen={isPaymentModalOpen}
    onClose={() => setIsPaymentModalOpen(false)}
    onPaymentSuccess={handlePaymentSuccess}
    farmerName={pendingProfile?.name || profile.name}
    farmerId={pendingProfile?.farmerId || profile.farmerId}
    lang={lang}
  />

  {/* Download Notification Banner with Auto-Redirect */}
  {downloadToast && (
    <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-950 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in slide-in-from-bottom duration-200">
      <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-5 h-5 text-emerald-300 animate-pulse" />
      </div>
      <div>
        <p className="text-sm font-serif">{downloadToast}</p>
        <p className="text-[11px] text-emerald-300 font-sans">AgriStack Digital Agriculture Mission</p>
      </div>
    </div>
  )}
</div>
  );
};
