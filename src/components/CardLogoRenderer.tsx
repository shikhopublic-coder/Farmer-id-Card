import React from 'react';
import { AgriStackLogo } from './AgriStackLogo';
import { NationalEmblem, StateEmblem } from './Emblems';

interface PrimaryLogoProps {
  type?: 'agristack' | 'pmkisan' | 'digital_india' | 'custom';
  customUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryLogoRenderer: React.FC<PrimaryLogoProps> = ({
  type = 'agristack',
  customUrl,
  className = '',
  size = 'md',
}) => {
  if (type === 'custom' && customUrl) {
    const height = size === 'sm' ? 24 : size === 'lg' ? 44 : 34;
    return (
      <div className={`inline-flex items-center justify-start select-none ${className}`}>
        <img
          src={customUrl}
          alt="Custom Logo"
          style={{ height: `${height}px`, maxHeight: `${height}px` }}
          className="max-w-[145px] object-contain"
        />
      </div>
    );
  }

  if (type === 'pmkisan') {
    return (
      <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
        <svg height="32" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* PM-KISAN emblem badge */}
          <circle cx="20" cy="20" r="17" fill="#006837" />
          <circle cx="20" cy="20" r="14" fill="#ffffff" />
          {/* Saffron & Green arc */}
          <path d="M7 20 A13 13 0 0 1 33 20" stroke="#F58220" strokeWidth="2.5" fill="none" />
          <path d="M7 20 A13 13 0 0 0 33 20" stroke="#006837" strokeWidth="2.5" fill="none" />
          <text x="20" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#006837" fontFamily="sans-serif">PM</text>
          {/* Text PM-KISAN */}
          <text x="44" y="22" fill="#006837" fontSize="18" fontWeight="800" fontFamily="sans-serif">PM-KISAN</text>
          <text x="44" y="33" fill="#F58220" fontSize="9" fontWeight="700" fontFamily="sans-serif">SAMMAN NIDHI</text>
        </svg>
      </div>
    );
  }

  if (type === 'digital_india') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <svg height="30" viewBox="0 0 150 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="4" y="22" fill="#F58220" fontSize="16" fontWeight="800" fontFamily="sans-serif">Digital</text>
          <text x="56" y="22" fill="#006837" fontSize="16" fontWeight="800" fontFamily="sans-serif">India</text>
          <text x="4" y="32" fill="#64748B" fontSize="8" fontWeight="600" fontFamily="sans-serif">Power To Empower</text>
        </svg>
      </div>
    );
  }

  // Default AgriStack Logo
  return <AgriStackLogo size={size} className={className} />;
};

interface SecondaryEmblemProps {
  type?: 'national' | 'state' | 'digital_india' | 'custom';
  customUrl?: string;
  stateId: string;
  className?: string;
  height?: number;
}

export const SecondaryEmblemRenderer: React.FC<SecondaryEmblemProps> = ({
  type = 'state',
  customUrl,
  stateId,
  className = '',
  height = 54,
}) => {
  if (type === 'custom' && customUrl) {
    return (
      <div className={`inline-flex items-center justify-end select-none ${className}`}>
        <img
          src={customUrl}
          alt="Custom Emblem"
          style={{ height: `${height}px`, maxHeight: `${height}px` }}
          className="max-w-[70px] object-contain"
        />
      </div>
    );
  }

  if (type === 'national') {
    return <NationalEmblem height={height} className={className} />;
  }

  // Default state or national emblem
  return <StateEmblem stateId={stateId} height={height} className={className} />;
};
