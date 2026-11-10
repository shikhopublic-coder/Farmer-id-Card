import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeComponent: React.FC<QRCodeProps> = ({ value, size = 200, className = '' }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate high-resolution QR code (480px) to prevent any blurriness or fading
    QRCode.toDataURL(value, {
      width: 480,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('QR code generation failed', err));
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={`w-full h-full aspect-square bg-white flex items-center justify-center ${className}`}
      >
        <span className="text-[10px] text-slate-400">QR Code</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="Verification QR Code"
      style={{ imageRendering: 'pixelated' }}
      className={`w-full h-full object-contain aspect-square select-none ${className}`}
    />
  );
};
