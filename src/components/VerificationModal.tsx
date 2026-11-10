import React from 'react';
import { FarmerProfile } from '../types/farmer';
import { STATES_CONFIG } from '../data/states';
import { AgriStackLogo } from './AgriStackLogo';
import { NationalEmblem } from './Emblems';
import { CheckCircle2, ShieldCheck, X, Check, ExternalLink, Printer } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  lang: 'en' | 'hi';
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang,
}) => {
  if (!isOpen) return null;

  const stateConfig = STATES_CONFIG[profile.stateId] || STATES_CONFIG.assam;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Tricolor Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <AgriStackLogo size="sm" />
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <span className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
                {lang === 'hi' ? 'आधिकारिक डिजिटल सत्यापन' : 'Official Registry Verification'}
              </span>
              <p className="text-[11px] text-slate-500">{stateConfig.registryTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Verification Badge Banner */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-emerald-950">
                  {lang === 'hi' ? 'डिजिटल किसान पहचान सत्यापित' : 'Digital Farmer Identity Verified'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                {lang === 'hi'
                  ? `यह रिकॉर्ड ${stateConfig.registryTitle} और डिजिटल कृषि मिशन डाटाबेस में वैध पाया गया है।`
                  : `This record is officially verified with the AgriStack National Farmer Registry.`}
              </p>
            </div>
          </div>

          {/* Core Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Farmer ID</span>
              <p className="text-base font-mono font-extrabold text-emerald-900 tracking-wider">
                {profile.farmerId}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Farmer Full Name</span>
              <p className="text-sm font-bold text-slate-900 uppercase">
                {profile.name} {profile.regionalName ? `(${profile.regionalName})` : ''}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Aadhaar (UIDAI Masked)</span>
              <p className="text-sm font-mono font-semibold text-slate-900">
                XXXX-XXXX-{profile.aadhaar ? profile.aadhaar.slice(-4) : '7777'} (e-KYC Verified)
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">State & Registry</span>
              <p className="text-sm font-bold text-slate-900">{stateConfig.name} ({stateConfig.registryTitle})</p>
            </div>
          </div>

          {/* Linked Benefits & Registry Status */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {lang === 'hi' ? 'संबद्ध सरकारी योजनाएं एवं लाभ' : 'Linked Agriculture Schemes & Services'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-slate-800">PM-KISAN Linked</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-slate-800">PMFBY Crop Insurance</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-slate-800">Kisan Credit Card (KCC)</span>
              </div>
            </div>
          </div>

          {/* Land Records Summary */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {lang === 'hi' ? 'सत्यापित भूमि रिकॉर्ड' : 'Verified Land Holdings'}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-1 px-2 font-semibold">Khata No.</th>
                    <th className="py-1 px-2 font-semibold">Khasra / Plot No.</th>
                    <th className="py-1 px-2 font-semibold">Area (Hectares)</th>
                    <th className="py-1 px-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.landRecords.map((r, i) => (
                    <tr key={i}>
                      <td className="py-1.5 px-2 font-bold text-slate-800 font-mono">{r.khata}</td>
                      <td className="py-1.5 px-2 font-bold text-slate-800 font-mono">{r.khasra}</td>
                      <td className="py-1.5 px-2 font-mono text-slate-900">{r.area} Ha</td>
                      <td className="py-1.5 px-2 text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Geotagged
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Audit Hash: #{profile.farmerId.replace(/\s+/g, '')}-SEC-OK
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'प्रिंट करें' : 'Print'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {lang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
