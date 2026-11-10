import React from 'react';
import { FarmerProfile } from '../types/farmer';
import { STATES_CONFIG } from '../data/states';
import { PrimaryLogoRenderer, SecondaryEmblemRenderer } from './CardLogoRenderer';

interface FarmerCardBackProps {
  profile: FarmerProfile;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const FarmerCardBack: React.FC<FarmerCardBackProps> = ({
  profile,
  cardRef,
  className = '',
}) => {
  const stateConfig = STATES_CONFIG[profile.stateId] || STATES_CONFIG.assam;
  const isAssamDefault = profile.stateId === 'assam' || !profile.stateId;
  const hasCustomLogo = profile.primaryLogoType && profile.primaryLogoType !== 'agristack';

  // Compute formatted address if override not provided
  const computedAddress =
    profile.fullAddressOverride ||
    `C/O ${profile.careOf || 'Father Name'}, Vill-${profile.village || 'Gaon Name'}, District, ${
      profile.state || stateConfig.name
    }, India, ${profile.pincode || '400001'}`;

  const isGreenFarmerTemplate = !profile.backTemplate || profile.backTemplate === 'green_farmer';

  if (isGreenFarmerTemplate) {
    // 4-Column Table Records (display up to 3 rows)
    const records = profile.landRecords && profile.landRecords.length > 0
      ? profile.landRecords.slice(0, 3)
      : [{ id: '1', khata: '241', khasra: '*', area: '0.370626' }];

    const isShareLayout = profile.backTableType === 'khata_khasra_area_share';

    return (
      <div
        ref={cardRef}
        id="farmer-card-back"
        className={`relative w-[680px] h-[429px] max-w-full rounded-[20px] border-2 border-[#bbf7d0] shadow-xl overflow-hidden select-none font-card-serif text-black ${className}`}
        style={{
          aspectRatio: '1579 / 996',
          containerType: 'inline-size',
        }}
      >
        {/* 100% Authentic User Uploaded Back Background Card 1 */}
        <img
          src="/assets/aistudio/Card1_9d1d7609.jpg"
          alt="Farmer ID Card Back"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
        />

        {/* 1. Left Vertical Strip: Download Date (Extra bold and larger) */}
        <div className="absolute left-[0.8%] top-[10%] bottom-[10%] w-[4.2%] z-20 flex items-center justify-center pointer-events-none">
          <span
            className="font-[900] text-black tracking-wider whitespace-nowrap font-card-serif"
            style={{
              fontSize: 'clamp(11px, 1.85cqw, 25px)',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            Download Date : {profile.downloadDate || '25/06/2026'}
          </span>
        </div>

        {/* 2. Center Header (Perfectly centered between the two logos at 54.7%, with adjusted font size) */}
        <div
          className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none"
          style={{
            top: '0.8%',
            height: '17.8%',
            left: '54.7%',
            transform: 'translateX(-50%)',
            width: '63%',
          }}
        >
          <p
            className="font-[700] text-[#b45309] whitespace-nowrap leading-none font-card-assamese tracking-normal"
            style={{ fontSize: 'clamp(16px, 2.85cqw, 42px)' }}
          >
            {stateConfig.regionalMinistryName || 'কৃষি আৰু কৃষক কল্যাণ মন্ত্ৰালয়'}
          </p>
          <h1
            className="font-[900] text-[#006837] tracking-tight whitespace-nowrap leading-none mt-1 font-card-serif"
            style={{ fontSize: 'clamp(18px, 3.3cqw, 48px)' }}
          >
            Ministry of Agri & Farmers Welfare
          </h1>
        </div>

        {/* 3. Address Section (Between green line and table, larger and bold) */}
        <div
          className="absolute z-10 flex flex-col justify-center gap-1 pointer-events-none"
          style={{
            left: '5.5%',
            right: '4.5%',
            top: '23.0%',
            height: '22.0%',
          }}
        >
          <p
            className="font-[900] text-black font-card-serif"
            style={{ fontSize: 'clamp(16px, 2.8cqw, 39px)' }}
          >
            Address:
          </p>
          <p
            className="font-card-serif font-[900] text-black leading-snug break-words"
            style={{ fontSize: 'clamp(13.5px, 2.4cqw, 35px)' }}
          >
            {computedAddress}
          </p>
        </div>

        {/* 4. 4-Column Table Header Row (All English: Village | Survey No | Sub Survey No | Area (Hectares)) */}
        {/* Column 1 Header */}
        <div
          className="absolute z-10 flex items-center justify-center px-1 pointer-events-none"
          style={{
            left: '3.61%',
            width: '31.92%',
            top: '47.49%',
            height: '7.03%',
          }}
        >
          <span
            className="font-card-serif font-[900] text-black text-center truncate"
            style={{ fontSize: 'clamp(13px, 2.3cqw, 33px)' }}
          >
            {isShareLayout ? 'Survey No' : 'Village'}
          </span>
        </div>

        {/* Column 2 Header (Changed from Khata to Survey No) */}
        <div
          className="absolute z-10 flex items-center justify-center px-1 pointer-events-none"
          style={{
            left: '35.53%',
            width: '24.06%',
            top: '47.49%',
            height: '7.03%',
          }}
        >
          <span
            className="font-card-serif font-[900] text-black text-center truncate"
            style={{ fontSize: 'clamp(13px, 2.2cqw, 32px)' }}
          >
            {isShareLayout ? 'Sub Survey No' : 'Survey No'}
          </span>
        </div>

        {/* Column 3 Header (Changed from Khasra to Sub Survey No) */}
        <div
          className="absolute z-10 flex items-center justify-center px-1 pointer-events-none"
          style={{
            left: '59.59%',
            width: '13.81%',
            top: '47.49%',
            height: '7.03%',
          }}
        >
          <span
            className="font-card-serif font-[900] text-black text-center truncate"
            style={{ fontSize: 'clamp(11.5px, 1.95cqw, 28px)' }}
          >
            {isShareLayout ? 'Area (Ha)' : 'Sub Survey No'}
          </span>
        </div>

        {/* Column 4 Header (All English) */}
        <div
          className="absolute z-10 flex items-center justify-center px-1 pointer-events-none"
          style={{
            left: '73.40%',
            width: '22.93%',
            top: '47.49%',
            height: '7.03%',
          }}
        >
          <span
            className="font-card-serif font-[900] text-black text-center truncate"
            style={{ fontSize: 'clamp(13px, 2.2cqw, 32px)' }}
          >
            {isShareLayout ? 'Share' : 'Area (Hectares)'}
          </span>
        </div>

        {/* 5. 4-Column Table Data Rows */}
        {records.map((rec, idx) => {
          // Precise top percentages for Row 1, Row 2, Row 3
          const rowTops = ['54.52%', '61.45%', '68.07%'];
          const rowHeights = ['6.93%', '6.62%', '6.73%'];
          const topVal = rowTops[idx];
          const heightVal = rowHeights[idx];

          const col1Val = isShareLayout
            ? rec.khata || '241'
            : rec.village || profile.village || 'Odlaguri No.1';
          const col2Val = isShareLayout ? (rec.khasra || '*') : (rec.khata || '241');
          const col3Val = isShareLayout ? (rec.area || '0.370626') : (rec.khasra || '*');
          const col4Val = isShareLayout
            ? (rec.share ? rec.share.replace(/स्वयं/g, 'Self') : '100% (Self)')
            : rec.area || '0.370626';

          return (
            <React.Fragment key={rec.id || idx}>
              {/* Col 1 Value */}
              <div
                className="absolute z-10 flex items-center justify-center px-2 pointer-events-none"
                style={{
                  left: '3.61%',
                  width: '31.92%',
                  top: topVal,
                  height: heightVal,
                }}
              >
                <span
                  className="font-card-serif font-[900] text-black truncate"
                  style={{ fontSize: 'clamp(14px, 2.5cqw, 35px)' }}
                >
                  {col1Val}
                </span>
              </div>

              {/* Col 2 Value */}
              <div
                className="absolute z-10 flex items-center justify-center px-1 pointer-events-none"
                style={{
                  left: '35.53%',
                  width: '24.06%',
                  top: topVal,
                  height: heightVal,
                }}
              >
                <span
                  className="font-card-serif font-[900] text-black tabular-nums"
                  style={{ fontSize: 'clamp(15px, 2.6cqw, 37px)' }}
                >
                  {col2Val}
                </span>
              </div>

              {/* Col 3 Value */}
              <div
                className="absolute z-10 flex items-center justify-center px-1 pointer-events-none"
                style={{
                  left: '59.59%',
                  width: '13.81%',
                  top: topVal,
                  height: heightVal,
                }}
              >
                <span
                  className="font-card-serif font-[900] text-black tabular-nums"
                  style={{ fontSize: 'clamp(15px, 2.6cqw, 37px)' }}
                >
                  {col3Val}
                </span>
              </div>

              {/* Col 4 Value */}
              <div
                className="absolute z-10 flex items-center justify-center px-1 pointer-events-none"
                style={{
                  left: '73.40%',
                  width: '22.93%',
                  top: topVal,
                  height: heightVal,
                }}
              >
                <span
                  className="font-card-serif font-[900] text-black tabular-nums"
                  style={{ fontSize: 'clamp(15px, 2.6cqw, 37px)' }}
                >
                  {col4Val}
                </span>
              </div>
            </React.Fragment>
          );
        })}

        {/* 6. Footer Helpline Number (Sitting next to the telephone icon at left: 9.8%) */}
        <div
          className="absolute z-10 flex items-center pointer-events-none"
          style={{
            left: '9.82%',
            top: '86.8%',
            height: '6.2%',
          }}
        >
          <span
            className="font-[900] text-black tracking-wider tabular-nums font-card-serif"
            style={{ fontSize: 'clamp(17px, 2.9cqw, 42px)' }}
          >
            {stateConfig.helpline || '1800-123-4567'}
          </span>
        </div>

        {/* 7. Footer Portal URL (Sitting next to the globe icon at left: 69.5%) */}
        <div
          className="absolute z-10 flex items-center pointer-events-none"
          style={{
            left: '69.5%',
            top: '86.8%',
            height: '6.2%',
          }}
        >
          <span
            className="font-[900] text-black tracking-tight font-card-serif"
            style={{ fontSize: 'clamp(15.5px, 2.7cqw, 39px)' }}
          >
            {stateConfig.portalUrl || 'www.asfr.agristack.gov.in'}
          </span>
        </div>
      </div>
    );
  }

  // Classic AgriStack Wheat Card Option
  const firstRecord =
    profile.landRecords && profile.landRecords.length > 0
      ? profile.landRecords[0]
      : { khata: '1', khasra: '2', area: '0.056961' };

  const isDefaultBack =
    isAssamDefault &&
    !hasCustomLogo &&
    (!profile.downloadDate || profile.downloadDate === '25/06/2026') &&
    (profile.fullAddressOverride ===
      'C/O Father Name, Vill-Gaon Name, District, Maharastra, India, 400001' ||
      profile.fullAddressOverride ===
        'C/O  Father Name,  Vill-Gaon Name, District, Maharastra, India, 400001' ||
      !profile.fullAddressOverride ||
      computedAddress.includes('Father Name')) &&
    firstRecord.khata === '1' &&
    firstRecord.khasra === '2' &&
    firstRecord.area === '0.056961';

  return (
    <div
      ref={cardRef}
      id="farmer-card-back"
      className={`relative w-[680px] h-[438px] max-w-full rounded-[20px] bg-[#fbfbf8] border-2 border-[#d5dad0] shadow-xl overflow-hidden select-none font-card-serif text-black ${className}`}
      style={{
        aspectRatio: '1026 / 662',
      }}
    >
      {isDefaultBack ? (
        /* If default, show the 100% identical authentic image provided by the user */
        <img
          src="/assets/aistudio/image_7b231579.png"
          alt="AgriStack Card Back Original"
          className="w-full h-full object-fill pointer-events-none select-none rounded-[18px]"
        />
      ) : (
        /* Dynamic Overlay on top of the authentic template */
        <>
          <img
            src="/assets/aistudio/template_back.png"
            alt="AgriStack Card Template Back"
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
                  {stateConfig.regionalMinistryName}
                </p>
                <h1 className="text-[26px] font-bold text-[#006837] tracking-tight leading-none mt-1 font-card-serif">
                  Ministry of Agri & Farmers Welfare
                </h1>
              </div>
              <div className="w-[65px] shrink-0 flex justify-end items-center">
                <SecondaryEmblemRenderer
                  type={profile.secondaryLogoType || 'state'}
                  customUrl={profile.customSecondaryLogoUrl}
                  stateId={profile.stateId}
                  height={52}
                />
              </div>
            </div>
          )}

          {/* Dynamic Download Date on Left Strip (if changed from default) */}
          {profile.downloadDate && profile.downloadDate !== '25/06/2026' && (
            <div className="absolute left-[0.5%] top-[6%] bottom-[6%] w-[33px] bg-[#f7f8f3] z-20 flex items-center justify-center">
              <span
                className="text-[13px] font-bold text-black tracking-wider whitespace-nowrap font-card-serif"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                Download Date : {profile.downloadDate}
              </span>
            </div>
          )}

          {/* Dynamic Address String on the White Address Box */}
          <div
            className="absolute z-10 flex items-center px-1.5"
            style={{
              left: '6.0%',
              top: '32.8%',
              width: '87.0%',
              height: '6.2%',
            }}
          >
            <span className="font-card-serif font-bold text-[17px] text-black leading-snug truncate">
              {computedAddress}
            </span>
          </div>

          {/* Land Records Table Values (Sitting inside the authentic thick rounded black table) */}
          {/* Khata Cell */}
          <div
            className="absolute z-10 flex items-center justify-center"
            style={{
              left: '7.3%',
              width: '28.3%',
              top: '50.3%',
              height: '5.6%',
            }}
          >
            <span className="font-card-serif font-bold text-[22px] text-black tabular-nums">
              {firstRecord.khata}
            </span>
          </div>

          {/* Khasra Cell */}
          <div
            className="absolute z-10 flex items-center justify-center"
            style={{
              left: '36.2%',
              width: '27.8%',
              top: '50.3%',
              height: '5.6%',
            }}
          >
            <span className="font-card-serif font-bold text-[22px] text-black tabular-nums">
              {firstRecord.khasra}
            </span>
          </div>

          {/* Area Cell */}
          <div
            className="absolute z-10 flex items-center justify-center"
            style={{
              left: '64.8%',
              width: '28.0%',
              top: '50.3%',
              height: '5.6%',
            }}
          >
            <span className="font-card-serif font-bold text-[22px] text-black tabular-nums">
              {firstRecord.area}
            </span>
          </div>

          {/* Dynamic Footer Helpline & Portal Overrides (if state is changed from Assam) */}
          {!isAssamDefault && (
            <div className="absolute z-20 left-[4%] right-[4%] bottom-[2.5%] flex items-center justify-between px-3 bg-[#fbfbf8]/95 py-0.5 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 fill-black"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.02l-2.2 2.19z" />
                </svg>
                <span className="text-[19px] font-bold text-black tracking-wider tabular-nums font-card-serif">
                  {stateConfig.helpline}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 stroke-black fill-none stroke-[2.2]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                <span className="text-[19px] font-bold text-black tracking-tight font-card-serif">
                  {stateConfig.portalUrl}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

