export interface LandRecord {
  id: string;
  khata: string;
  khasra: string;
  area: string; // e.g., "0.056961"
  village?: string;
  share?: string;
}

export interface StateRegistryConfig {
  id: string;
  name: string;
  hindiName: string;
  regionalGovtName: string; // e.g. "ভাৰত চৰকাৰ"
  regionalMinistryName: string; // e.g. "কৃষি আৰু কৃষক কল্যাণ মন্ত্ৰালয়"
  regionalNameLabel: string; // e.g. "নাম"
  regionalFatherLabel?: string; // e.g. "পিতাৰ নাম"
  registryTitle: string; // e.g. "Assam Farmer Registry"
  helpline: string; // e.g. "1800-123-4567"
  portalUrl: string; // e.g. "www.asfr.agristack.gov.in"
  stateCode: string;
}

export interface FarmerProfile {
  id: string;
  // Personal Info
  name: string; // e.g. "JOHN DON"
  regionalName: string; // in local script or Hindi
  gender: 'Male' | 'Female' | 'Other';
  dob: string; // e.g. "01/01/1990"
  caste: 'General' | 'OBC' | 'SC' | 'ST';
  area: 'Rural' | 'Urban' | 'Semi-Urban';
  aadhaar: string; // e.g. "9999 8888 7777"
  mobile?: string; // e.g. "9365762645"
  farmerId: string; // e.g. "1234 000 5678"
  photoUrl: string;
  
  // Dates
  approvalDate: string; // e.g. "15/12/2025"
  downloadDate: string; // e.g. "25/06/2026"
  
  // Address
  careOf: string; // e.g. "Father Name"
  village: string; // e.g. "Vill-Gaon Name"
  district: string; // e.g. "District"
  state: string; // e.g. "Maharashtra"
  pincode: string; // e.g. "400001"
  fullAddressOverride?: string;
  
  // Land Records
  landRecords: LandRecord[];
  
  // State config
  stateId: string;

  // Custom Logo and Emblem Options
  primaryLogoType?: 'agristack' | 'pmkisan' | 'digital_india' | 'custom';
  customPrimaryLogoUrl?: string;
  secondaryLogoType?: 'national' | 'state' | 'digital_india' | 'custom';
  customSecondaryLogoUrl?: string;

  // Template Background Options
  frontTemplate?: 'green_farmer' | 'classic_agristack';
  backTemplate?: 'green_farmer' | 'classic_agristack';
  backTableType?: 'village_khata_khasra_area' | 'khata_khasra_area_share';
}
