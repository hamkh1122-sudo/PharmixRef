
export enum DoseRoute {
  ORAL = 'Oral',
  IV = 'Intravenous (IV)',
  IM = 'Intramuscular (IM)',
  SC = 'Subcutaneous (SC)',
  NEB = 'Nebulized',
  RECTAL = 'Rectal',
  TOPICAL = 'Topical'
}

export enum SafetyStatus {
  SAFE = 'Safe',
  CAUTION = 'Caution',
  CONTRAINDICATED = 'Contraindicated',
  NOT_RECOMMENDED = 'Not Recommended'
}

export interface DosingInfo {
  standard: string;
  maximum: string;
  frequency: string;
  route: DoseRoute[];
  notes?: string;
}

export interface PediatricDosing extends DosingInfo {
  weightBased?: string; // e.g., "15mg/kg"
  ageRestrictions?: string;
}

export interface Medicine {
  id: string;
  name: string;
  brandNames: string[];
  class: string;
  indications: string[];
  adultDose: DosingInfo;
  pediatricDose: PediatricDosing;
  safetyFlags: {
    adults: SafetyStatus;
    pediatrics: SafetyStatus;
    pregnancy: SafetyStatus;
    elderly: SafetyStatus;
  };
  contraindications: string[];
  precautions: string[];
  sideEffects: string[];
  emergencyUse: boolean;
  isVerified: boolean;
  source: string;
}

export interface SearchFilters {
  query: string;
  emergencyOnly: boolean;
  class?: string;
}
