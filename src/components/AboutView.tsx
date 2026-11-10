import React from 'react';
import { AgriStackLogo } from './AgriStackLogo';
import { NationalEmblem } from './Emblems';
import { Check, ShieldCheck, Sprout, Landmark, Cpu, Database } from 'lucide-react';

export const AboutView: React.FC<{ lang: 'en' | 'hi' }> = ({ lang }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-slate-800">
      {/* Hero Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center justify-center gap-4">
          <AgriStackLogo size="md" />
          <NationalEmblem height={48} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif">
          {lang === 'hi'
            ? 'एग्रीस्टैक: डिजिटल कृषि मिशन एवं किसान पहचान पत्र'
            : 'AgriStack: Digital Public Infrastructure for Agriculture'}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          {lang === 'hi'
            ? 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार द्वारा प्रत्येक भारतीय किसान को विशिष्ट डिजिटल किसान आईडी (Farmer ID) प्रदान करने की राष्ट्रीय पहल।'
            : 'An initiative by the Ministry of Agriculture & Farmers Welfare, Government of India, creating a verifiable single source of truth for Indian farmers.'}
        </p>
      </div>

      {/* 3 Core Pillars of AgriStack */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-serif">
          {lang === 'hi' ? 'एग्रीस्टैक के तीन मुख्य स्तंभ' : 'Three Core Pillars of AgriStack'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Farmers' Registry</h3>
            <p className="text-xs text-slate-600">
              A dynamic, authenticated database linking farmer identity (Aadhaar e-KYC), social category, and family demographics to an 11-digit Unique Farmer ID.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Geo-Referenced Village Maps</h3>
            <p className="text-xs text-slate-600">
              Cadastral digitization linking specific land plots (Khata and Khasra/Survey numbers) directly with real geographical boundaries.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Crop Sown Registry</h3>
            <p className="text-xs text-slate-600">
              Digital crop survey records enabling swift disbursal of PM-KISAN, crop insurance (PMFBY), MSP procurement, and disaster relief.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits to Farmers */}
      <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-emerald-950 font-serif">
          {lang === 'hi' ? 'किसान आईडी कार्ड के प्रत्यक्ष लाभ' : 'Key Benefits of the AgriStack Farmer ID Card'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-900">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Paperless, instant verification for PM-KISAN 6,000 INR annual income support.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Hassle-free Kisan Credit Card (KCC) loans without repeated land title verification.</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Automated claim settlements under Pradhan Mantri Fasal Bima Yojana (PMFBY).</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>Direct access to subsidized fertilizers, quality seeds, and customized agro-advisories.</span>
          </div>
        </div>
      </div>

      {/* Printing & CR80 Standard Note */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs text-slate-600">
        <h3 className="font-bold text-slate-900 text-sm">Printing & CSC Guidelines</h3>
        <p>
          This portal generates standard CR80 format cards (85.6mm × 54mm, 3.370 × 2.125 inches), the exact size of PAN cards and Aadhaar PVC cards. Common Service Centers (CSC) and Jan Seva Kendras can print directly using PVC ID card printers or thermal dye-sublimation printers, or print on photo paper and laminate using standard 250-micron pouches.
        </p>
      </div>
    </div>
  );
};
