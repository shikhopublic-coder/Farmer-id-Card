import React from 'react';
import { AgriStackLogo } from './AgriStackLogo';
import { LegalPageType } from './LegalPagesView';
import { Lock } from 'lucide-react';

export type NavTabType = 'studio' | 'admin' | LegalPageType;

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems: { id: NavTabType; label: string }[] = [
    { id: 'studio', label: 'Home' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'refund', label: 'Refund Policy' },
    { id: 'disclaimer', label: 'Disclaimer' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 no-print">
      {/* Official Government Tricolor Header Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#f97316] via-white to-[#16a34a]" />

      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 py-2 flex flex-wrap items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => setActiveTab('studio')}
          className="flex items-center gap-3 shrink-0 cursor-pointer"
        >
          <AgriStackLogo size="sm" />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <span className="text-sm font-bold tracking-tight text-slate-800 whitespace-nowrap hidden sm:inline font-serif">
            Digital Farmer Registry
          </span>
        </div>

        {/* Zone 2: Navigation, Legal Pages & Admin Login */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <nav className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs sm:text-sm font-semibold text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'admin'
                ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-500/40'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};
