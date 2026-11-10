import React from 'react';

export const NationalEmblem: React.FC<{ className?: string; height?: number }> = ({
  className = '',
  height = 54,
}) => {
  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        height={height}
        viewBox="0 0 60 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-stone-800"
      >
        {/* Ashoka Lion Capital Detailed Silhouette */}
        {/* Central Crown / Lions */}
        <g stroke="currentColor" strokeWidth="1" fill="#2d2b28">
          {/* Central Lion Head */}
          <path d="M25 6 C25 3, 35 3, 35 6 C38 8, 38 15, 36 20 C34 23, 26 23, 24 20 C22 15, 22 8, 25 6 Z" />
          <circle cx="28" cy="11" r="1.5" fill="#fefae0" />
          <circle cx="32" cy="11" r="1.5" fill="#fefae0" />
          {/* Muzzle / Whiskers */}
          <path d="M28 14 Q30 16 32 14" stroke="#fefae0" strokeWidth="0.8" fill="none" />
          <path d="M30 14 L30 17" stroke="#fefae0" strokeWidth="0.8" />
          
          {/* Left Lion Head */}
          <path d="M12 9 C10 6, 20 6, 22 10 C24 14, 23 20, 19 22 C15 22, 11 18, 12 9 Z" />
          <circle cx="16" cy="13" r="1.2" fill="#fefae0" />

          {/* Right Lion Head */}
          <path d="M48 9 C50 6, 40 6, 38 10 C36 14, 37 20, 41 22 C45 22, 49 18, 48 9 Z" />
          <circle cx="44" cy="13" r="1.2" fill="#fefae0" />

          {/* Manes & Shoulders */}
          <path d="M15 22 C10 26, 8 36, 12 42 C16 46, 24 47, 30 47 C36 47, 44 46, 48 42 C52 36, 50 26, 45 22 C40 25, 36 26, 30 26 C24 26, 20 25, 15 22 Z" />
          
          {/* Mane curls detailing */}
          <path d="M22 28 Q20 34 26 36 M38 28 Q40 34 34 36 M30 29 L30 41" stroke="#fefae0" strokeWidth="0.7" fill="none" />
          <path d="M17 32 Q15 38 22 41 M43 32 Q45 38 38 41" stroke="#fefae0" strokeWidth="0.7" fill="none" />

          {/* Abacus / Base platform with Ashoka Chakra and animals */}
          <rect x="10" y="48" width="40" height="9" rx="1.5" fill="#2d2b28" />
          
          {/* Ashoka Chakra in center of abacus */}
          <circle cx="30" cy="52.5" r="3.2" fill="none" stroke="#fefae0" strokeWidth="0.8" />
          <circle cx="30" cy="52.5" r="0.8" fill="#fefae0" />
          <path d="M30 49.3 L30 55.7 M26.8 52.5 L33.2 52.5 M27.7 50.2 L32.3 54.8 M27.7 54.8 L32.3 50.2" stroke="#fefae0" strokeWidth="0.5" />

          {/* Galloping Horse (left) and Bull (right) silhouettes */}
          <circle cx="18" cy="52.5" r="1.5" fill="#fefae0" />
          <circle cx="42" cy="52.5" r="1.5" fill="#fefae0" />

          {/* Lotus Bell Base */}
          <path d="M14 58 C16 63, 24 64, 30 64 C36 64, 44 63, 46 58 Z" fill="#2d2b28" />
          <line x1="8" y1="65" x2="52" y2="65" stroke="#2d2b28" strokeWidth="1.2" />
        </g>
        {/* Motto: Satyamev Jayate */}
        <text
          x="30"
          y="72"
          textAnchor="middle"
          fontSize="4.8"
          fontWeight="bold"
          fontFamily="'Noto Sans Devanagari', sans-serif"
          fill="#1c1917"
          letterSpacing="0.2px"
        >
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
};

export const StateEmblem: React.FC<{ stateId: string; className?: string; height?: number }> = ({
  stateId,
  className = '',
  height = 54,
}) => {
  // If state is Assam, render Assam seal (Rhino, tea twigs, and dual text)
  if (stateId === 'assam') {
    return (
      <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
        <svg
          height={height}
          viewBox="0 0 64 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-stone-800"
        >
          {/* Top text 'অসম চৰকাৰ' */}
          <text
            x="32"
            y="7"
            textAnchor="middle"
            fontSize="4.5"
            fontWeight="bold"
            fontFamily="'Noto Sans Bengali', sans-serif"
            fill="#1c1917"
          >
            অসম চৰকাৰ
          </text>

          {/* Ashoka emblem in middle */}
          <g transform="translate(6, 4) scale(0.85)">
            <NationalEmblem height={52} />
          </g>

          {/* Bottom text 'GOVERNMENT OF ASSAM' */}
          <text
            x="32"
            y="70"
            textAnchor="middle"
            fontSize="3.8"
            fontWeight="600"
            fontFamily="sans-serif"
            fill="#292524"
            letterSpacing="-0.2px"
          >
            GOVERNMENT OF ASSAM
          </text>
        </svg>
      </div>
    );
  }

  // Default national or other state emblem
  return <NationalEmblem height={height} className={className} />;
};
