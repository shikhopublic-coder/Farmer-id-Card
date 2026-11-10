import React from 'react';
import { FarmerProfile } from '../types/farmer';
import { STATES_CONFIG } from '../data/states';
import { PrimaryLogoRenderer, SecondaryEmblemRenderer } from './CardLogoRenderer';
import { QRCodeComponent } from './QRCodeComponent';

interface FarmerCardFrontProps {
  profile: FarmerProfile;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const FarmerCardFront: React.FC<FarmerCardFrontProps> = ({
  profile,
  cardRef,
  className = '',
}) => {
  const stateConfig = STATES_CONFIG[profile.stateId] || STATES_CONFIG.assam;
  const isAssamDefault = profile.stateId === 'assam' || !profile.stateId;
  const hasCustomLogo = profile.primaryLogoType && profile.primaryLogoType !== 'agristack';

  // Construct QR verification payload or URL
  const qrVerificationData = JSON.stringify({
    agriStackId: profile.farmerId,
    name: profile.name,
    regionalName: profile.regionalName,
    state: stateConfig.name,
    dob: profile.dob,
    gender: profile.gender,
    aadhaarMasked: profile.aadhaar ? `XXXX-XXXX-${profile.aadhaar.slice(-4)}` : '',
    approvalDate: profile.approvalDate,
    registry: stateConfig.registryTitle,
    verifyUrl: `https://${stateConfig.portalUrl}/verify?farmerId=${encodeURIComponent(
      profile.farmerId.replace(/\s+/g, '')
    )}`,
  });

  // Check if current front data is identical to the user's authentic original image
  const isDefaultFront =
    isAssamDefault &&
    !hasCustomLogo &&
    (!profile.name || profile.name.trim().toUpperCase() === 'JOHN DON') &&
    (!profile.farmerId || profile.farmerId.replace(/\s+/g, '') === '12340005678') &&
    (!profile.dob || profile.dob === '01/01/1990') &&
    (!profile.gender || profile.gender.toLowerCase() === 'male') &&
    (!profile.caste || profile.caste.toUpperCase() === 'ST') &&
    (!profile.area || profile.area.toLowerCase() === 'rural') &&
    (!profile.aadhaar || profile.aadhaar.replace(/\s+/g, '') === '999988887777') &&
    (!profile.approvalDate || profile.approvalDate === '15/12/2025') &&
    (!profile.photoUrl ||
      profile.photoUrl === '/assets/aistudio/sample_farmer_photo.png' ||
      profile.photoUrl.includes('sample_farmer_photo'));

  const cleanPhotoUrl =
    profile.photoUrl &&
    profile.photoUrl !== '/assets/aistudio/image_a2d78567.png' &&
    !profile.photoUrl.includes('image_a2d78567')
      ? profile.photoUrl
      : '/assets/aistudio/sample_farmer_photo.png';

  const isGreenFarmerTemplate = !profile.frontTemplate || profile.frontTemplate === 'green_farmer';

  if (isGreenFarmerTemplate) {
    return (
      <div
        ref={cardRef}
        id="farmer-card-front"
        className={`relative w-[680px] h-[429px] max-w-full rounded-[20px] border-2 border-[#bbf7d0] shadow-xl overflow-hidden select-none font-card-serif text-black ${className}`}
        style={{
          aspectRatio: '1579 / 996',
          containerType: 'inline-size',
        }}
      >
        {/* 100% Authentic User Uploaded Background Card 2 */}
        <img
          src="/assets/aistudio/Card2_7e3c3452.jpg"
          alt="Farmer ID Card Front"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
        />

        {/* 1. Left Vertical Strip: Approval Date (Aligned cleanly with bottom of photo, extra bold and larger) */}
        <div
          className="absolute z-20 flex flex-col justify-end items-center pointer-events-none"
          style={{
            left: '0.8%',
            top: '20.0%',
            bottom: '34.0%',
            width: '4.2%',
          }}
        >
          <span
            className="font-[900] text-black tracking-wider whitespace-nowrap font-card-serif"
            style={{
              fontSize: 'clamp(11.5px, 1.95cqw, 26px)',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            Approval Date : {profile.approvalDate || '15/12/2025'}
          </span>
        </div>

        {/* 2. Center Header (Bolder, noticeably larger, zero collision with whitespace-nowrap) */}
        <div
          className="absolute top-[0.6%] left-[21.0%] right-[12.0%] h-[18.2%] flex flex-col items-center justify-center text-center z-10 pointer-events-none"
        >
          <p
            className="font-[800] text-[#b45309] whitespace-nowrap leading-none font-card-assamese"
            style={{ fontSize: 'clamp(20px, 3.6cqw, 52px)' }}
          >
            {stateConfig.regionalGovtName}
          </p>
          <h1
            className="font-[900] text-[#006837] tracking-tight whitespace-nowrap leading-none mt-1.5 font-card-serif"
            style={{ fontSize: 'clamp(28px, 5.0cqw, 72px)' }}
          >
            Government of India
          </h1>
        </div>

        {/* 3. Farmer Photo Box (Cleanly covers background silhouette, framed, non-distorted) */}
        <div
          className="absolute z-10 overflow-hidden flex items-center justify-center bg-white rounded-[2px]"
          style={{
            left: '6.0%',
            top: '25.2%',
            width: '20.6%',
            height: '40.8%',
          }}
        >
          <img
            src={cleanPhotoUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 4. Dynamic Field Values Grid (Extra bold font-[900], compact neat line spacing, perfectly aligned) */}
        <div
          className="absolute z-10 flex flex-col justify-between pointer-events-none"
          style={{
            left: '28.0%',
            top: profile.regionalName ? (profile.mobile ? '25.0%' : '26.2%') : (profile.mobile ? '26.2%' : '27.8%'),
            width: '47.5%',
            height: profile.regionalName ? (profile.mobile ? '38.0%' : '33.8%') : (profile.mobile ? '33.5%' : '29.0%'),
          }}
        >
          {/* Regional Name (if present) */}
          {profile.regionalName && (
            <div className="flex items-center leading-none">
              <span
                className="w-[28%] shrink-0 font-card-assamese font-[900] text-black"
                style={{ fontSize: 'clamp(12px, 2.05cqw, 28px)' }}
              >
                {stateConfig.regionalNameLabel || 'নাম'} :
              </span>
              <span
                className="flex-1 font-card-assamese font-[900] text-black truncate leading-normal"
                style={{ fontSize: 'clamp(12.5px, 2.15cqw, 30px)' }}
              >
                {profile.regionalName}
              </span>
            </div>
          )}

          {/* Name */}
          <div className="flex items-center leading-none">
            <span
              className="w-[28%] shrink-0 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12px, 2.05cqw, 28px)' }}
            >
              Name :
            </span>
            <span
              className="flex-1 font-card-serif font-[900] text-black uppercase tracking-wide truncate"
              style={{ fontSize: 'clamp(12.5px, 2.15cqw, 30px)' }}
            >
              {profile.name || 'JOHN DON'}
            </span>
          </div>

          {/* Gender */}
          <div className="flex items-center leading-none">
            <span
              className="w-[28%] shrink-0 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12px, 2.05cqw, 28px)' }}
            >
              Gender :
            </span>
            <span
              className="flex-1 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12.5px, 2.15cqw, 30px)' }}
            >
              {profile.gender || 'Male'}
            </span>
          </div>

          {/* DOB */}
          <div className="flex items-center leading-none">
            <span
              className="w-[28%] shrink-0 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12px, 2.05cqw, 28px)' }}
            >
              DOB :
            </span>
            <span
              className="flex-1 font-card-serif font-[900] text-black tabular-nums"
              style={{ fontSize: 'clamp(12.5px, 2.15cqw, 30px)' }}
            >
              {profile.dob || '01/01/1990'}
            </span>
          </div>

          {/* Caste */}
          <div className="flex items-center leading-none">
            <span
              className="w-[28%] shrink-0 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12px, 2.05cqw, 28px)' }}
            >
              Caste :
            </span>
            <span
              className="flex-1 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12.5px, 2.15cqw, 30px)' }}
            >
              {profile.caste || 'ST'}
            </span>
          </div>

          {/* Area */}
          <div className="flex items-center leading-none">
            <span
              className="w-[28%] shrink-0 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12px, 2.05cqw, 28px)' }}
            >
              Area :
            </span>
            <span
              className="flex-1 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12.5px, 2.15cqw, 30px)' }}
            >
              {profile.area || 'Rural'}
            </span>
          </div>

          {/* Aadhaar */}
          <div className="flex items-center leading-none">
            <span
              className="w-[28%] shrink-0 font-card-serif font-[900] text-black"
              style={{ fontSize: 'clamp(12px, 2.05cqw, 28px)' }}
            >
              Aadhaar :
            </span>
            <span
              className="flex-1 font-card-serif font-[900] text-black tracking-wider tabular-nums"
              style={{ fontSize: 'clamp(12.5px, 2.15cqw, 30px)' }}
            >
              {profile.aadhaar || '9999 8888 7777'}
            </span>
          </div>

          {/* Mobile Number (Directly below Aadhaar) */}
          {profile.mobile && (
            <div className="flex items-center leading-none">
              <span
                className="w-[28%] shrink-0 font-card-serif font-[900] text-black"
                style={{ fontSize: 'clamp(12px, 2.05cqw, 28px)' }}
              >
                Mobile :
              </span>
              <span
                className="flex-1 font-card-serif font-[900] text-black tracking-wider tabular-nums"
                style={{ fontSize: 'clamp(12.5px, 2.15cqw, 30px)' }}
              >
                {profile.mobile}
              </span>
            </div>
          )}
        </div>

        {/* 5. Dynamic QR Code (True square dimensions, rendered razor-sharp without stretching or fading) */}
        <div
          className="absolute z-10 flex items-center justify-center bg-white p-1 rounded-[2px]"
          style={{
            left: '76.4%',
            top: '40.3%',
            width: '19.4%',
            height: '30.8%',
          }}
        >
          <QRCodeComponent value={qrVerificationData} />
        </div>

        {/* 6. Farmer ID (Noticeably larger and extra bold font-[900]) */}
        <div
          className="absolute z-10 flex items-center justify-center pointer-events-none"
          style={{
            left: '0',
            right: '0',
            top: '70.8%',
            height: '11.8%',
          }}
        >
          <div className="inline-flex items-center gap-3">
            <span
              className="font-[900] text-[#006837] font-card-serif tracking-tight"
              style={{ fontSize: 'clamp(22px, 3.9cqw, 54px)' }}
            >
              Farmer ID :
            </span>
            <span
              className="font-[900] text-black font-card-serif tracking-[3px] tabular-nums"
              style={{ fontSize: 'clamp(24px, 4.4cqw, 62px)' }}
            >
              {profile.farmerId || '1234 000 5678'}
            </span>
          </div>
        </div>

        {/* 7. Bottom Registry Title (Moved upward closer just below the yellow line, extra bold and large) */}
        <div
          className="absolute z-10 top-[84.8%] left-0 right-0 text-center pointer-events-none"
        >
          <h2
            className="font-[900] text-[#006837] tracking-wider font-card-serif leading-tight"
            style={{ fontSize: 'clamp(24px, 4.3cqw, 60px)' }}
          >
            {stateConfig.registryTitle}
          </h2>
        </div>
      </div>
    );
  }

  // Classic AgriStack Wheat Card Option
  return (
    <div
      ref={cardRef}
      id="farmer-card-front"
      className={`relative w-[680px] h-[438px] max-w-full rounded-[20px] bg-[#fbfbf8] border-2 border-[#d5dad0] shadow-xl overflow-hidden select-none font-card-serif text-black ${className}`}
      style={{
        aspectRatio: '1028 / 662',
      }}
    >
      {isDefaultFront ? (
        /* If default, show the 100% identical authentic image provided by the user */
        <img
          src="/assets/aistudio/image_a2d78567.png"
          alt="AgriStack Card Front Original"
          className="w-full h-full object-fill pointer-events-none select-none rounded-[18px]"
        />
      ) : (
        /* Dynamic Overlay on top of the pristine authentic template */
        <>
          <img
            src="/assets/aistudio/template_front.png"
            alt="AgriStack Card Template Front"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
          />

          {/* Dynamic Header Overrides only if State is changed or Custom Logo is chosen */}
          {(!isAssamDefault || hasCustomLogo) && (
            <div className="absolute top-[3%] left-[4%] right-[4%] z-20 flex items-center justify-between bg-[#fbfbf8]/95 py-1 px-2 rounded-lg">
              <div className="w-[145px] shrink-0 flex items-center">
                <PrimaryLogoRenderer
                  type={profile.primaryLogoType || 'agristack'}
                  customUrl={profile.customPrimaryLogoUrl}
                  size="md"
                />
              </div>
              <div className="flex-1 text-center px-1">
                <p className="text-[17px] font-bold text-[#e08518] leading-tight font-card-serif">
                  {stateConfig.regionalGovtName}
                </p>
                <h1 className="text-[28px] font-bold text-[#006837] tracking-tight leading-none mt-0.5 font-card-serif">
                  Government of India
                </h1>
              </div>
              <div className="w-[65px] shrink-0 flex justify-end items-center">
                <SecondaryEmblemRenderer
                  type={profile.secondaryLogoType || 'national'}
                  customUrl={profile.customSecondaryLogoUrl}
                  stateId={profile.stateId}
                  height={52}
                />
              </div>
            </div>
          )}

          {/* Dynamic Approval Date on Left Strip (if changed from default) */}
          {profile.approvalDate && profile.approvalDate !== '15/12/2025' && (
            <div className="absolute left-[0.5%] top-[6%] bottom-[6%] w-[33px] bg-[#f7f8f3] z-20 flex items-center justify-center">
              <span
                className="text-[13px] font-bold text-black tracking-wider whitespace-nowrap font-card-serif"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                Approval Date : {profile.approvalDate}
              </span>
            </div>
          )}

          {/* Farmer Photo Box */}
          <div
            className="absolute z-10 rounded-[4px] overflow-hidden"
            style={{
              left: '7.2%',
              top: '28.7%',
              width: '22.37%',
              height: '43.8%',
            }}
          >
            <img
              src={profile.photoUrl || '/assets/aistudio/sample_farmer_photo.png'}
              alt={profile.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Dynamic Field Values (Sitting on white patches exactly like original card) */}
          {/* 1. Regional Name (if present) */}
          {profile.regionalName && (
            <div
              className="absolute z-10 flex items-center"
              style={{ left: '49.0%', top: '26.8%' }}
            >
              <span className="font-card-serif font-bold text-[18px] text-black">
                {profile.regionalName}
              </span>
            </div>
          )}

          {/* 2. English Name */}
          <div
            className="absolute z-10 flex items-center"
            style={{ left: '49.0%', top: '34.0%' }}
          >
            <span className="font-card-serif font-bold text-[18px] text-black tracking-wide uppercase">
              {profile.name || 'JOHN DON'}
            </span>
          </div>

          {/* 3. Gender */}
          <div
            className="absolute z-10 flex items-center"
            style={{ left: '49.0%', top: '40.6%' }}
          >
            <span className="font-card-serif font-bold text-[18px] text-black">
              {profile.gender || 'Male'}
            </span>
          </div>

          {/* 4. DOB */}
          <div
            className="absolute z-10 flex items-center"
            style={{ left: '49.0%', top: '47.3%' }}
          >
            <span className="font-card-serif font-bold text-[18px] text-black tabular-nums">
              {profile.dob || '01/01/1990'}
            </span>
          </div>

          {/* 5. Caste */}
          <div
            className="absolute z-10 flex items-center"
            style={{ left: '49.0%', top: '54.0%' }}
          >
            <span className="font-card-serif font-bold text-[18px] text-black">
              {profile.caste || 'ST'}
            </span>
          </div>

          {/* 6. Area */}
          <div
            className="absolute z-10 flex items-center"
            style={{ left: '49.0%', top: '60.7%' }}
          >
            <span className="font-card-serif font-bold text-[18px] text-black">
              {profile.area || 'Rural'}
            </span>
          </div>

          {/* 7. Aadhaar */}
          <div
            className="absolute z-10 flex items-center"
            style={{ left: '49.0%', top: '67.4%' }}
          >
            <span className="font-card-serif font-bold text-[18px] text-black tracking-wider tabular-nums">
              {profile.aadhaar || '9999 8888 7777'}
            </span>
          </div>

          {/* Mobile (Directly below Aadhaar) */}
          {profile.mobile && (
            <div
              className="absolute z-10 flex items-center"
              style={{ left: '49.0%', top: '72.8%' }}
            >
              <span className="font-card-serif font-bold text-[17px] text-black tracking-wider tabular-nums">
                {profile.mobile}
              </span>
            </div>
          )}

          {/* 8. Farmer ID */}
          <div
            className="absolute z-10 flex items-center"
            style={{ left: '46.8%', top: '78.0%' }}
          >
            <span className="font-card-serif font-bold text-[22px] text-black tracking-[1.5px] tabular-nums">
              {profile.farmerId || '1234 000 5678'}
            </span>
          </div>

          {/* 9. Dynamic QR Code */}
          <div
            className="absolute z-10 flex items-center justify-center bg-white p-1"
            style={{
              left: '77.2%',
              top: '52.5%',
              width: '17.5%',
              height: '27.2%',
            }}
          >
            <QRCodeComponent value={qrVerificationData} size={114} />
          </div>

          {/* Dynamic Registry Footer Text (if state is changed from Assam) */}
          {!isAssamDefault && (
            <div
              className="absolute z-20 left-0 right-0 text-center bg-[#fbfbf8]/95 py-0.5"
              style={{ bottom: '2.8%' }}
            >
              <h2 className="text-[20px] font-bold text-black tracking-wide font-card-serif">
                {stateConfig.registryTitle}
              </h2>
            </div>
          )}
        </>
      )}
    </div>
  );
};
