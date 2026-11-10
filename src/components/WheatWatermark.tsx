import React from 'react';

export const WheatWatermark: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.32,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1028 662"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wheatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9da882" />
            <stop offset="50%" stopColor="#c5ad7d" />
            <stop offset="100%" stopColor="#8d9b6e" />
          </linearGradient>
          <linearGradient id="wheatGrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b4be99" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d3be92" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Left arched wheat stalk (behind the photo) */}
        <g transform="translate(-10, 40) scale(1.15)" stroke="url(#wheatGrad)">
          {/* Main Arched Stem */}
          <path d="M70 540 C95 410, 115 260, 155 50" fill="none" strokeWidth="2.8" />
          
          {/* Grains / Kernels on left stem */}
          {[
            { y: 65, x: 153, angle: -35 },
            { y: 95, x: 149, angle: 30 },
            { y: 125, x: 144, angle: -40 },
            { y: 155, x: 139, angle: 35 },
            { y: 185, x: 133, angle: -42 },
            { y: 215, x: 127, angle: 38 },
            { y: 245, x: 120, angle: -45 },
            { y: 280, x: 113, angle: 40 },
            { y: 315, x: 105, angle: -45 },
            { y: 350, x: 98, angle: 42 },
            { y: 385, x: 92, angle: -48 },
            { y: 420, x: 86, angle: 45 },
            { y: 455, x: 80, angle: -50 },
          ].map((k, i) => (
            <g key={`l-${i}`} transform={`translate(${k.x}, ${k.y}) rotate(${k.angle})`}>
              {/* Grain Body */}
              <path
                d="M0 0 C-7 -18, -5 -38, 0 -48 C5 -38, 7 -18, 0 0 Z"
                fill="url(#wheatGrainGrad)"
                stroke="#8a9a6d"
                strokeWidth="0.8"
              />
              {/* Awn / Long Whisker */}
              <path d="M0 -48 Q-5 -85, -15 -115" stroke="#a2926c" strokeWidth="0.8" fill="none" />
            </g>
          ))}
        </g>

        {/* Left secondary wheat stalk */}
        <g transform="translate(45, 120) scale(0.95)" stroke="url(#wheatGrad)">
          <path d="M40 520 C60 390, 80 250, 120 70" fill="none" strokeWidth="2.2" />
          {[
            { y: 85, x: 118, angle: -32 },
            { y: 115, x: 114, angle: 28 },
            { y: 145, x: 109, angle: -38 },
            { y: 175, x: 103, angle: 33 },
            { y: 205, x: 98, angle: -40 },
            { y: 235, x: 92, angle: 36 },
            { y: 270, x: 85, angle: -42 },
            { y: 305, x: 79, angle: 38 },
          ].map((k, i) => (
            <g key={`l2-${i}`} transform={`translate(${k.x}, ${k.y}) rotate(${k.angle})`}>
              <path
                d="M0 0 C-6 -16, -4 -34, 0 -42 C4 -34, 6 -16, 0 0 Z"
                fill="url(#wheatGrainGrad)"
                stroke="#8a9a6d"
                strokeWidth="0.8"
              />
              <path d="M0 -42 Q-4 -75, -12 -100" stroke="#a2926c" strokeWidth="0.7" fill="none" />
            </g>
          ))}
        </g>

        {/* Right decorative wheat sheaf in background (above and around QR code) */}
        <g transform="translate(850, 70) scale(1.1)" stroke="url(#wheatGrad)">
          <path d="M120 540 C100 410, 78 260, 38 60" fill="none" strokeWidth="2.8" />
          {[
            { y: 75, x: 42, angle: 35 },
            { y: 105, x: 47, angle: -30 },
            { y: 135, x: 53, angle: 40 },
            { y: 165, x: 60, angle: -35 },
            { y: 195, x: 68, angle: 42 },
            { y: 225, x: 76, angle: -38 },
            { y: 260, x: 84, angle: 45 },
            { y: 295, x: 92, angle: -40 },
            { y: 330, x: 100, angle: 45 },
            { y: 370, x: 107, angle: -42 },
            { y: 410, x: 114, angle: 48 },
          ].map((k, i) => (
            <g key={`r-${i}`} transform={`translate(${k.x}, ${k.y}) rotate(${k.angle})`}>
              <path
                d="M0 0 C-7 -18, -5 -38, 0 -48 C5 -38, 7 -18, 0 0 Z"
                fill="url(#wheatGrainGrad)"
                stroke="#9a8c66"
                strokeWidth="0.8"
              />
              <path d="M0 -48 Q5 -85, 15 -115" stroke="#9a8c66" strokeWidth="0.8" fill="none" />
            </g>
          ))}
        </g>

        {/* Delicate botanical leaves arching in background */}
        <path
          d="M60 480 Q140 380, 220 420"
          stroke="#9da882"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.4"
        />
        <path
          d="M880 340 Q800 240, 720 280"
          stroke="#c5ad7d"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.35"
        />
      </svg>
    </div>
  );
};
