import React, { useState } from 'react';
import { FarmerProfile } from '../types/farmer';
import { SAMPLE_FARMERS } from '../data/samples';
import { STATES_CONFIG } from '../data/states';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  FileText,
  UserCheck,
  ArrowRight,
  Printer,
} from 'lucide-react';

interface VerifyViewProps {
  currentProfile: FarmerProfile;
  onSelectProfile: (profile: FarmerProfile) => void;
  lang: 'en' | 'hi';
  onNavigateToStudio: () => void;
}

export const VerifyView: React.FC<VerifyViewProps> = ({
  currentProfile,
  onSelectProfile,
  lang,
  onNavigateToStudio,
}) => {
  const [searchId, setSearchId] = useState<string>(currentProfile.farmerId);
  const [matchedProfile, setMatchedProfile] = useState<FarmerProfile | null>(currentProfile);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = searchId.replace(/\s+/g, '').toLowerCase();

    // Look for match in current profile or sample farmers
    const found =
      [currentProfile, ...SAMPLE_FARMERS].find(
        (p) =>
          p.farmerId.replace(/\s+/g, '').toLowerCase() === cleanSearch ||
          p.name.toLowerCase().includes(searchId.toLowerCase()) ||
          p.aadhaar.replace(/\s+/g, '') === cleanSearch
      ) || null;

    setMatchedProfile(found);
    setHasSearched(true);
  };

  const stateConfig = matchedProfile
    ? STATES_CONFIG[matchedProfile.stateId] || STATES_CONFIG.assam
    : STATES_CONFIG.assam;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>AgriStack National Farmer Registry Verification Portal</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
          {lang === 'hi' ? 'किसान पहचान सत्यापन (Farmer ID Verification)' : 'Verify Farmer Credentials'}
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          {lang === 'hi'
            ? 'किसान आईडी संख्या या आधार संख्या दर्ज करके आधिकारिक डिजिटल कृषि रजिस्ट्री रिकॉर्ड सत्यापित करें।'
            : 'Enter the 11-digit AgriStack Farmer ID or Name to verify active registry credentials and linked benefits.'}
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="flex gap-2 p-1.5 bg-white rounded-2xl border-2 border-emerald-600/30 shadow-md focus-within:border-emerald-600 transition-colors">
          <div className="flex-1 flex items-center pl-3 gap-2">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Farmer ID (e.g. 1234 000 5678) or Name"
              className="w-full text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            {lang === 'hi' ? 'सत्यापित करें' : 'Verify Now'}
          </button>
        </div>
      </form>

      {/* Results View */}
      {hasSearched && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
          {matchedProfile ? (
            <>
              {/* Official Verified Status Header */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-emerald-950 font-serif">
                        {matchedProfile.name}
                      </h2>
                      <span className="px-2 py-0.5 text-xs font-extrabold bg-emerald-200 text-emerald-900 rounded-full">
                        ACTIVE REGISTERED
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Farmer ID: <span className="font-mono font-bold">{matchedProfile.farmerId}</span> · Registry: {stateConfig.registryTitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectProfile(matchedProfile);
                    onNavigateToStudio();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                >
                  <span>{lang === 'hi' ? 'कार्ड स्टूडियो में खोलें' : 'Open in Card Studio'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Farmer Details Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Personal Information
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Name</span>
                      <span className="font-bold text-slate-900">{matchedProfile.name}</span>
                    </div>
                    {matchedProfile.regionalName && (
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500">Regional Name</span>
                        <span className="font-bold text-slate-900">{matchedProfile.regionalName}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Gender & DOB</span>
                      <span className="font-semibold text-slate-900">
                        {matchedProfile.gender} · {matchedProfile.dob}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Social Category / Caste</span>
                      <span className="font-semibold text-slate-900">{matchedProfile.caste}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Aadhaar (UIDAI Verified)</span>
                      <span className="font-mono font-bold text-slate-900">
                        XXXX-XXXX-{matchedProfile.aadhaar ? matchedProfile.aadhaar.slice(-4) : '7777'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Registry & Governance
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Approval Date</span>
                      <span className="font-semibold text-slate-900">{matchedProfile.approvalDate}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Download Date</span>
                      <span className="font-semibold text-slate-900">{matchedProfile.downloadDate}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">State Registry</span>
                      <span className="font-semibold text-slate-900">{stateConfig.registryTitle}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Helpline</span>
                      <span className="font-mono font-bold text-slate-900">{stateConfig.helpline}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Portal Domain</span>
                      <span className="font-semibold text-slate-900">{stateConfig.portalUrl}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Land Holdings */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Verified Land Parcels ({matchedProfile.landRecords.length})
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Khata No.</th>
                        <th className="py-2 px-3 font-semibold">Khasra / Plot No.</th>
                        <th className="py-2 px-3 font-semibold">Area</th>
                        <th className="py-2 px-3 font-semibold">Cadastral Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matchedProfile.landRecords.map((l, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-bold text-slate-900 font-mono">{l.khata}</td>
                          <td className="py-2 px-3 font-bold text-slate-900 font-mono">{l.khasra}</td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-800">{l.area} Hectares</td>
                          <td className="py-2 px-3 text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> e-Bhulekh Synchronized
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Matching Farmer ID Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please check the 11-digit Farmer ID number or select one of the pre-loaded profiles from the preset list.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
