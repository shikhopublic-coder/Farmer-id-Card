import React, { useRef, useState } from 'react';
import { FarmerProfile, LandRecord } from '../types/farmer';
import { STATES_CONFIG } from '../data/states';
import { PdfUploadBox } from './PdfUploadBox';
import {
  Upload,
  Camera,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles,
  Calculator,
  User,
  MapPin,
  FileSpreadsheet,
  Check,
  ImageIcon,
  Shield,
} from 'lucide-react';

interface CardEditorProps {
  profile: FarmerProfile;
  onChange: (updated: FarmerProfile) => void;
  lang: 'en' | 'hi';
}

export const CardEditor: React.FC<CardEditorProps> = ({ profile, onChange, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const primaryLogoInputRef = useRef<HTMLInputElement>(null);
  const secondaryLogoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [showConverter, setShowConverter] = useState(false);
  const [converterValue, setConverterValue] = useState<string>('1');
  const [converterUnit, setConverterUnit] = useState<'acre' | 'bigha' | 'guntha'>('acre');

  // Handle custom primary logo upload
  const handlePrimaryLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...profile,
          primaryLogoType: 'custom',
          customPrimaryLogoUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle custom secondary emblem upload
  const handleSecondaryLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...profile,
          secondaryLogoType: 'custom',
          customSecondaryLogoUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload from computer
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...profile,
          photoUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Start webcam
  const startCamera = async () => {
    try {
      setShowWebcam(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Webcam not accessible:', err);
      setShowWebcam(false);
    }
  };

  // Capture frame from webcam
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 300, 360);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onChange({
          ...profile,
          photoUrl: dataUrl,
        });
      }
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
    setShowWebcam(false);
  };

  // Generate random 11-digit formatted Farmer ID
  const generateRandomFarmerId = () => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const p3 = Math.floor(1000 + Math.random() * 9000);
    onChange({
      ...profile,
      farmerId: `${p1} ${p2} ${p3}`,
    });
  };

  // Land Records Management
  const addLandRecord = () => {
    const newRecord: LandRecord = {
      id: `land-${Date.now()}`,
      khata: String(profile.landRecords.length + 1),
      khasra: String(profile.landRecords.length + 2),
      area: '0.125000',
    };
    onChange({
      ...profile,
      landRecords: [...profile.landRecords, newRecord],
    });
  };

  const updateLandRecord = (index: number, field: keyof LandRecord, val: string) => {
    const updated = [...profile.landRecords];
    updated[index] = { ...updated[index], [field]: val };
    onChange({
      ...profile,
      landRecords: updated,
    });
  };

  const removeLandRecord = (index: number) => {
    const updated = profile.landRecords.filter((_, i) => i !== index);
    onChange({
      ...profile,
      landRecords: updated.length > 0 ? updated : [{ id: '1', khata: '1', khasra: '1', area: '0.050000' }],
    });
  };

  // Quick unit converter to Hectares
  const calculateHectares = (val: number, unit: 'acre' | 'bigha' | 'guntha'): string => {
    if (isNaN(val) || val <= 0) return '0.000000';
    let hectares = 0;
    if (unit === 'acre') hectares = val * 0.404686;
    if (unit === 'bigha') hectares = val * 0.2529; // standard benchmark bigha
    if (unit === 'guntha') hectares = val * 0.010117;
    return hectares.toFixed(6);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6 text-slate-800">
      {/* Header and Quick Pre-fills */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'hi' ? 'किसान कार्ड डेटा प्रविष्टि' : 'Farmer Card Details'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'कार्ड पर विवरण तुरंत अपडेट होगा' : 'Real-time sync with card preview'}
              </p>
            </div>
          </div>
        </div>

        {/* State / Registry selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {lang === 'hi' ? 'राज्य / किसान रजिस्ट्री चुनें' : 'State / Farmer Registry'}
          </label>
          <select
            value={profile.stateId}
            onChange={(e) => {
              const stateId = e.target.value;
              const stateConfig = STATES_CONFIG[stateId];
              onChange({
                ...profile,
                stateId,
                state: stateConfig.name,
              });
            }}
            className="w-full text-sm font-semibold rounded-lg border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {Object.values(STATES_CONFIG).map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} - {st.registryTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Card Theme Info - Locked to newly uploaded background */}
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              {lang === 'hi' ? 'कार्ड बैकग्राउंड (सक्रिय)' : 'Card Background (Active)'}
            </label>
            <span className="text-[11px] font-semibold text-emerald-700">
              {lang === 'hi' ? 'फ्रंट + बैक' : 'Front + Back'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/50 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>{lang === 'hi' ? 'नया हरा बैकग्राउंड (AgriStack Card 1 & 2)' : 'AgriStack New Background'}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              {lang === 'hi' ? 'सक्रिय' : 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Logo & Emblem Settings Section */}
      <div id="logo-settings-section" className="space-y-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <ImageIcon className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'hi' ? 'कार्ड लोगो व प्रतीक' : 'Card Logos & Emblems'}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
            {lang === 'hi' ? 'लाइव सिंक' : 'Live Preview'}
          </span>
        </div>

        {/* 1. Primary Left Logo Options - Only AgriStack and Custom */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              {lang === 'hi' ? 'मुख्य लोगो (बायां कोना)' : 'Primary Logo (Top-Left)'}
            </label>
            <span className="text-[10px] text-slate-500">AgriStack / Custom</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...profile, primaryLogoType: 'agristack', customPrimaryLogoUrl: undefined })}
              className={`p-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                (!profile.primaryLogoType || profile.primaryLogoType === 'agristack')
                  ? 'border-emerald-600 bg-emerald-100/80 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              AgriStack
            </button>
            <button
              type="button"
              onClick={() => primaryLogoInputRef.current?.click()}
              className={`p-2 text-xs font-semibold rounded-xl border text-center flex items-center justify-center gap-1 transition-all cursor-pointer ${
                profile.primaryLogoType === 'custom'
                  ? 'border-emerald-600 bg-emerald-100/80 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                  : 'border-dashed border-emerald-400 bg-white text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>{lang === 'hi' ? 'नया लोगो अपलोड' : 'Upload Logo'}</span>
            </button>
          </div>

          {/* Hidden File Input for Custom Primary Logo */}
          <input
            ref={primaryLogoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePrimaryLogoUpload}
            className="hidden"
          />

          {profile.primaryLogoType === 'custom' && profile.customPrimaryLogoUrl && (
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-300">
              <div className="flex items-center gap-2">
                <img src={profile.customPrimaryLogoUrl} alt="Custom Logo" className="h-7 max-w-[80px] object-contain border p-0.5 rounded bg-slate-50" />
                <span className="text-xs font-semibold text-emerald-900">
                  {lang === 'hi' ? 'कस्टम लोगो सक्रिय है' : 'Custom logo active'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...profile, primaryLogoType: 'agristack', customPrimaryLogoUrl: undefined })}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                {lang === 'hi' ? 'रीसेट करें' : 'Reset to AgriStack'}
              </button>
            </div>
          )}
        </div>

        {/* 2. Secondary Right Emblem Options - Only Ashoka and Custom */}
        <div className="space-y-2 pt-2 border-t border-emerald-200/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              {lang === 'hi' ? 'दायां प्रतीक चिन्ह (Right Emblem)' : 'Right Emblem'}
            </label>
            <span className="text-[10px] text-slate-500">Ashoka / Custom</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...profile, secondaryLogoType: 'national', customSecondaryLogoUrl: undefined })}
              className={`p-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                (!profile.secondaryLogoType || profile.secondaryLogoType === 'national')
                  ? 'border-emerald-600 bg-emerald-100/80 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {lang === 'hi' ? 'अशोक स्तम्भ' : 'Ashoka Emblem'}
            </button>
            <button
              type="button"
              onClick={() => secondaryLogoInputRef.current?.click()}
              className={`p-2 text-xs font-semibold rounded-xl border text-center flex items-center justify-center gap-1 transition-all cursor-pointer ${
                profile.secondaryLogoType === 'custom'
                  ? 'border-emerald-600 bg-emerald-100/80 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500'
                  : 'border-dashed border-emerald-400 bg-white text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>{lang === 'hi' ? 'कस्टम सील' : 'Upload Seal'}</span>
            </button>
          </div>

          {/* Hidden File Input for Custom Secondary Emblem */}
          <input
            ref={secondaryLogoInputRef}
            type="file"
            accept="image/*"
            onChange={handleSecondaryLogoUpload}
            className="hidden"
          />

          {profile.secondaryLogoType === 'custom' && profile.customSecondaryLogoUrl && (
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-300">
              <div className="flex items-center gap-2">
                <img src={profile.customSecondaryLogoUrl} alt="Custom Emblem" className="h-7 max-w-[40px] object-contain border p-0.5 rounded bg-slate-50" />
                <span className="text-xs font-semibold text-emerald-900">
                  {lang === 'hi' ? 'कस्टम सील सक्रिय है' : 'Custom emblem active'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ ...profile, secondaryLogoType: 'national', customSecondaryLogoUrl: undefined })}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                {lang === 'hi' ? 'रीसेट करें' : 'Reset to Ashoka'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section 1: Farmer Photo & Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <User className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? '1. व्यक्तिगत विवरण' : '1. Personal Information'}</span>
        </div>

        {/* Photo Upload & Webcam */}
        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="relative w-16 h-20 rounded-md border border-slate-300 bg-white overflow-hidden shrink-0">
            {profile.photoUrl ? (
              <img
                src={
                  profile.photoUrl === '/assets/aistudio/image_a2d78567.png'
                    ? '/assets/aistudio/sample_farmer_photo.png'
                    : profile.photoUrl
                }
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                No Photo
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-xs font-medium text-slate-700">
              {lang === 'hi' ? 'किसान की फोटो अपलोड करें' : 'Farmer Passport Photo'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg flex items-center gap-1.5 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'फ़ाइल चुनें' : 'Upload File'}
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg flex items-center gap-1.5 shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'कैमरा फोटो' : 'Take Photo'}
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...profile, photoUrl: '/assets/aistudio/sample_farmer_photo.png' })}
                className="px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800"
              >
                {lang === 'hi' ? 'डिफ़ॉल्ट फोटो' : 'Reset to Sample'}
              </button>
            </div>
          </div>
        </div>

        {/* Webcam Capture Modal / Box */}
        {showWebcam && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
            <p className="text-xs font-bold text-emerald-900">
              {lang === 'hi' ? 'लाइव वेबकैम पूर्वावलोकन' : 'Live Camera Preview'}
            </p>
            <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border-2 border-emerald-500 bg-black">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                {lang === 'hi' ? 'फोटो लें (Capture)' : 'Capture'}
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Full Name English */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Farmer Full Name (English)
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onChange({ ...profile, name: e.target.value.toUpperCase() })}
              placeholder="e.g. JOHN DON"
              className="w-full text-sm font-bold uppercase rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Regional Script Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Regional Script Name
            </label>
            <input
              type="text"
              value={profile.regionalName}
              onChange={(e) => onChange({ ...profile, regionalName: e.target.value })}
              placeholder="e.g. Regional Name"
              className="w-full text-sm font-semibold rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Gender
            </label>
            <select
              value={profile.gender}
              onChange={(e) =>
                onChange({ ...profile, gender: e.target.value as 'Male' | 'Female' | 'Other' })
              }
              className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'hi' ? 'जन्म तिथि (DD/MM/YYYY)' : 'Date of Birth (DOB)'}
            </label>
            <input
              type="text"
              value={profile.dob}
              onChange={(e) => onChange({ ...profile, dob: e.target.value })}
              placeholder="01/01/1990"
              className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Caste */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'hi' ? 'जाति वर्ग' : 'Caste Category'}
            </label>
            <select
              value={profile.caste}
              onChange={(e) =>
                onChange({ ...profile, caste: e.target.value as 'General' | 'OBC' | 'SC' | 'ST' })
              }
              className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="OBC">OBC (Other Backward Class)</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'hi' ? 'क्षेत्र प्रकार' : 'Area'}
            </label>
            <select
              value={profile.area}
              onChange={(e) =>
                onChange({
                  ...profile,
                  area: e.target.value as 'Rural' | 'Urban' | 'Semi-Urban',
                })
              }
              className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Rural">Rural</option>
              <option value="Semi-Urban">Semi-Urban</option>
              <option value="Urban">Urban</option>
            </select>
          </div>

          {/* Aadhaar */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'hi' ? 'आधार संख्या' : 'Aadhaar Number'}
            </label>
            <input
              type="text"
              value={profile.aadhaar}
              onChange={(e) => onChange({ ...profile, aadhaar: e.target.value })}
              placeholder="9999 8888 7777"
              className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Mobile Number (Directly below Aadhaar) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {lang === 'hi' ? 'मोबाइल नंबर (Mobile No.)' : 'Mobile Number'}
            </label>
            <input
              type="text"
              value={profile.mobile || ''}
              onChange={(e) => onChange({ ...profile, mobile: e.target.value })}
              placeholder="9365762645"
              className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Farmer ID with Random Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-emerald-800">
                {lang === 'hi' ? 'किसान आईडी (Farmer ID)' : 'Farmer ID'}
              </label>
              <button
                type="button"
                onClick={generateRandomFarmerId}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                {lang === 'hi' ? 'नया बनाएं' : 'Randomize'}
              </button>
            </div>
            <input
              type="text"
              value={profile.farmerId}
              onChange={(e) => onChange({ ...profile, farmerId: e.target.value })}
              placeholder="1234 000 5678"
              className="w-full text-sm font-mono font-bold text-emerald-950 rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Approval Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Approval Date
            </label>
            <input
              type="text"
              value={profile.approvalDate}
              onChange={(e) => onChange({ ...profile, approvalDate: e.target.value })}
              placeholder="15/12/2025"
              className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Download Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Download Date
            </label>
            <input
              type="text"
              value={profile.downloadDate}
              onChange={(e) => onChange({ ...profile, downloadDate: e.target.value })}
              placeholder="25/06/2026"
              className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Address (Back of Card) */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? '2. पता विवरण (कार्ड का पिछला हिस्सा)' : '2. Address Details (Card Back)'}</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {lang === 'hi' ? 'पूर्ण पता (Address Line)' : 'Full Official Address'}
          </label>
          <textarea
            rows={2}
            value={profile.fullAddressOverride || ''}
            onChange={(e) => onChange({ ...profile, fullAddressOverride: e.target.value })}
            placeholder="C/O Father Name, Vill-Gaon Name, District, Maharastra, India, 400001"
            className="w-full text-sm font-medium rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Section 3: Land Records Table (Khata, Khasra, Area) */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '3. भूमि रिकॉर्ड (Survey No, Sub Survey No, Area)' : '3. Land Records (Village, Survey No, Sub Survey No, Area)'}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowConverter(!showConverter)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Calculator className="w-3.5 h-3.5" />
            {lang === 'hi' ? 'क्षेत्रफल कनवर्टर' : 'Area Calculator'}
          </button>
        </div>

        {/* Quick Area Converter Dropdown */}
        {showConverter && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <p className="text-xs font-bold text-amber-900">
              {lang === 'hi' ? 'हेक्टेयर कनवर्टर (Acre / Bigha / Guntha -> Hectare)' : 'Convert to Hectares'}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                value={converterValue}
                onChange={(e) => setConverterValue(e.target.value)}
                className="w-24 px-2 py-1 text-sm bg-white border border-amber-300 rounded-md font-mono"
              />
              <select
                value={converterUnit}
                onChange={(e) => setConverterUnit(e.target.value as 'acre' | 'bigha' | 'guntha')}
                className="px-2 py-1 text-sm bg-white border border-amber-300 rounded-md font-medium"
              >
                <option value="acre">Acres</option>
                <option value="bigha">Bigha</option>
                <option value="guntha">Guntha</option>
              </select>
              <span className="text-xs text-amber-900 font-bold">=</span>
              <span className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-md text-sm font-bold font-mono">
                {calculateHectares(parseFloat(converterValue), converterUnit)} Ha
              </span>
            </div>
          </div>
        )}

        {/* Land Record Rows (Support up to 3 for the table) */}
        <div className="space-y-2">
          {profile.landRecords.slice(0, 3).map((rec, index) => (
            <div
              key={rec.id || index}
              className="grid grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr_auto] gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200"
            >
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase truncate">
                  {profile.backTableType === 'khata_khasra_area_share' ? 'Survey No' : 'Village'}
                </label>
                <input
                  type="text"
                  value={
                    profile.backTableType === 'khata_khasra_area_share'
                      ? rec.khata
                      : rec.village !== undefined
                      ? rec.village
                      : profile.village || 'Gaon Name'
                  }
                  onChange={(e) => {
                    if (profile.backTableType === 'khata_khasra_area_share') {
                      updateLandRecord(index, 'khata', e.target.value);
                    } else {
                      updateLandRecord(index, 'village', e.target.value);
                    }
                  }}
                  placeholder="Odlaguri No.1"
                  className="w-full text-xs font-bold bg-white rounded border border-slate-300 px-2 py-1 truncate"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase truncate">
                  {profile.backTableType === 'khata_khasra_area_share' ? 'Sub Survey No' : 'Survey No'}
                </label>
                <input
                  type="text"
                  value={profile.backTableType === 'khata_khasra_area_share' ? rec.khasra : rec.khata}
                  onChange={(e) => {
                    if (profile.backTableType === 'khata_khasra_area_share') {
                      updateLandRecord(index, 'khasra', e.target.value);
                    } else {
                      updateLandRecord(index, 'khata', e.target.value);
                    }
                  }}
                  placeholder="241"
                  className="w-full text-xs font-bold bg-white rounded border border-slate-300 px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase truncate">
                  {profile.backTableType === 'khata_khasra_area_share' ? 'Area' : 'Sub Survey No'}
                </label>
                <input
                  type="text"
                  value={profile.backTableType === 'khata_khasra_area_share' ? rec.area : rec.khasra}
                  onChange={(e) => {
                    if (profile.backTableType === 'khata_khasra_area_share') {
                      updateLandRecord(index, 'area', e.target.value);
                    } else {
                      updateLandRecord(index, 'khasra', e.target.value);
                    }
                  }}
                  placeholder="*"
                  className="w-full text-xs font-bold bg-white rounded border border-slate-300 px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase truncate">
                  {profile.backTableType === 'khata_khasra_area_share' ? 'Share' : 'Area (Hectares)'}
                </label>
                <input
                  type="text"
                  value={
                    profile.backTableType === 'khata_khasra_area_share'
                      ? rec.share || '100% (Self)'
                      : rec.area
                  }
                  onChange={(e) => {
                    if (profile.backTableType === 'khata_khasra_area_share') {
                      updateLandRecord(index, 'share', e.target.value);
                    } else {
                      updateLandRecord(index, 'area', e.target.value);
                    }
                  }}
                  placeholder="0.056961"
                  className="w-full text-xs font-mono font-bold bg-white rounded border border-slate-300 px-2 py-1"
                />
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => removeLandRecord(index)}
                  disabled={profile.landRecords.length === 1}
                  className={`p-1.5 rounded-md ${
                    profile.landRecords.length === 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-rose-600 hover:bg-rose-50'
                  }`}
                  title="Remove plot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {profile.landRecords.length < 4 && (
            <button
              type="button"
              onClick={addLandRecord}
              className="w-full py-2 text-xs font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 border border-dashed border-emerald-300 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {lang === 'hi' ? '+ नया भूमि खसरा / खाता जोड़ें' : '+ Add Land Parcel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
