/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SAMPLE_FARMERS } from './data/samples';
import { FarmerProfile } from './types/farmer';
import { Navbar, NavTabType } from './components/Navbar';
import { CardStudio } from './components/CardStudio';
import { LegalPagesView, LegalPageType } from './components/LegalPagesView';
import { AdminPortal } from './components/AdminPortal';
import { VerificationModal } from './components/VerificationModal';
import { PrintSheetModal } from './components/PrintSheetModal';
import { STATES_CONFIG } from './data/states';

export default function App() {
  const [profile, setProfile] = useState<FarmerProfile>(SAMPLE_FARMERS[0]);
  const [lang] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<NavTabType>('studio');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);
  const [hasUploadedPdf, setHasUploadedPdf] = useState(false);

  const currentStateConfig = STATES_CONFIG[profile.stateId] || STATES_CONFIG.assam;

  return (
    <div className="min-h-screen bg-[#f8faf7] text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Port based on Tab */}
      <main className="flex-1 pb-16">
        {activeTab === 'studio' ? (
          <CardStudio
            profile={profile}
            setProfile={setProfile}
            lang={lang}
            onOpenVerify={() => setIsVerifyModalOpen(true)}
            onOpenPrintSheet={() => setIsPrintSheetOpen(true)}
            hasUploadedPdf={hasUploadedPdf}
            setHasUploadedPdf={setHasUploadedPdf}
          />
        ) : activeTab === 'admin' ? (
          <AdminPortal onBackHome={() => setActiveTab('studio')} />
        ) : (
          <LegalPagesView
            activePage={activeTab as LegalPageType}
            onSelectPage={(page) => setActiveTab(page)}
            onBackHome={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* Verification Dialog Modal */}
      <VerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        profile={profile}
        lang={lang}
      />

      {/* PVC Card Print Sheet Modal */}
      <PrintSheetModal
        isOpen={isPrintSheetOpen}
        onClose={() => setIsPrintSheetOpen(false)}
        profile={profile}
        lang={lang}
        onDownloadComplete={() => {
          setHasUploadedPdf(false);
          setActiveTab('studio');
        }}
      />

      {/* Footer with All Legal Pages & Admin Login */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AgriStack</span>
            <span>·</span>
            <span>Digital Agriculture Mission</span>
            <span>·</span>
            <span>{currentStateConfig.registryTitle}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('refund')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('disclaimer')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className="text-emerald-800 hover:text-emerald-950 font-bold transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
