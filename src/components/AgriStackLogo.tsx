import React from 'react';

interface AgriStackLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AgriStackLogo: React.FC<AgriStackLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 24 : size === 'lg' ? 44 : 32;

  return (
    <div className={`inline-flex items-center select-none font-bold tracking-tight ${className}`}>
      {/* SVG representation of AgriStack official identity */}
      <svg
        height={height}
        viewBox="0 0 170 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="AgriStack Logo"
      >
        {/* Agri in rich green #0b6638 */}
        <text
          x="2"
          y="31"
          fill="#006837"
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="31"
          letterSpacing="-0.5px"
        >
          Agri
        </text>

        {/* Small sprout leaf on the 'i' of Agri */}
        <path
          d="M62 8 C62 5, 65 3, 67 5 C69 7, 67 11, 64 11 C62.5 11, 62 9.5, 62 8 Z"
          fill="#39B54A"
        />

        {/* 'St' in warm golden saffron #f58220 */}
        <text
          x="69"
          y="31"
          fill="#F58220"
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="31"
          letterSpacing="-0.5px"
        >
          St
        </text>

        {/* Honeycomb leaf icon integrated in 'a' / central symbol */}
        <g transform="translate(101, 8)">
          {/* Hexagon cell 1 */}
          <polygon
            points="7,0 14,4 14,12 7,16 0,12 0,4"
            fill="none"
            stroke="#8DC63F"
            strokeWidth="1.8"
          />
          {/* Hexagon cell 2 */}
          <polygon
            points="7,10 14,14 14,22 7,26 0,22 0,14"
            fill="none"
            stroke="#8DC63F"
            strokeWidth="1.8"
          />
          {/* Hexagon cell 3 top right */}
          <polygon
            points="14,5 21,9 21,17 14,21 7,17 7,9"
            fill="none"
            stroke="#39B54A"
            strokeWidth="1.8"
          />
          {/* Small inner node */}
          <circle cx="7" cy="13" r="1.5" fill="#006837" />
        </g>

        {/* 'ck' in warm golden saffron */}
        <text
          x="123"
          y="31"
          fill="#F58220"
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="31"
          letterSpacing="-0.5px"
        >
          ck
        </text>
      </svg>
    </div>
  );
};
