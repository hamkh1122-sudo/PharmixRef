
import { Medicine, DoseRoute, SafetyStatus } from '../types';

export const LOCAL_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    brandNames: ['Panadol', 'Tylenol', 'Calpol'],
    class: 'Non-opioid Analgesic & Antipyretic',
    indications: ['Mild to moderate pain', 'Pyrexia'],
    adultDose: {
      standard: '500mg - 1g',
      maximum: '4g per 24 hours',
      frequency: 'Every 4-6 hours',
      route: [DoseRoute.ORAL, DoseRoute.IV, DoseRoute.RECTAL]
    },
    pediatricDose: {
      standard: '15mg/kg',
      maximum: '60mg/kg/day',
      frequency: 'Every 4-6 hours',
      route: [DoseRoute.ORAL, DoseRoute.RECTAL],
      weightBased: '15mg/kg per dose',
      ageRestrictions: 'Safe from 2 months (post-vaccination fever)'
    },
    safetyFlags: {
      adults: SafetyStatus.SAFE,
      pediatrics: SafetyStatus.SAFE,
      pregnancy: SafetyStatus.SAFE,
      elderly: SafetyStatus.SAFE
    },
    contraindications: ['Hypersensitivity', 'Severe hepatic impairment'],
    precautions: ['Alcoholism', 'Chronic malnutrition', 'Renal impairment'],
    sideEffects: ['Hepatotoxicity (overdose)', 'Skin rash', 'Blood disorders (rare)'],
    emergencyUse: false,
    isVerified: true,
    source: 'BNF / WHO Guidelines'
  },
  {
    id: '2',
    name: 'Adrenaline (Epinephrine)',
    brandNames: ['EpiPen', 'Adrenaclick'],
    class: 'Sympathomimetic (Catecholamine)',
    indications: ['Anaphylaxis', 'Cardiac arrest', 'Acute asthma'],
    adultDose: {
      standard: '500mcg (0.5mL of 1:1000)',
      maximum: 'Repeat after 5 mins if needed',
      frequency: 'STAT / PRN',
      route: [DoseRoute.IM, DoseRoute.IV]
    },
    pediatricDose: {
      standard: '10mcg/kg (0.01mL/kg of 1:1000)',
      maximum: '300mcg - 500mcg per dose',
      frequency: 'STAT / PRN',
      route: [DoseRoute.IM],
      weightBased: '10mcg/kg',
      ageRestrictions: 'Dose adjusted by weight/age'
    },
    safetyFlags: {
      adults: SafetyStatus.SAFE,
      pediatrics: SafetyStatus.SAFE,
      pregnancy: SafetyStatus.CAUTION,
      elderly: SafetyStatus.CAUTION
    },
    contraindications: ['No absolute contraindications in emergency anaphylaxis'],
    precautions: ['Hyperthyroidism', 'Hypertension', 'Diabetes'],
    sideEffects: ['Tachycardia', 'Arrhythmia', 'Palpitations', 'Tremor'],
    emergencyUse: true,
    isVerified: true,
    source: 'Resuscitation Council UK / ILCOR'
  },
  {
    id: '3',
    name: 'Amoxicillin',
    brandNames: ['Amoxil'],
    class: 'Penicillin Antibiotic',
    indications: ['Bacterial infections', 'UTI', 'Pneumonia', 'Otitis Media'],
    adultDose: {
      standard: '250mg - 500mg',
      maximum: '3g daily (in severe cases)',
      frequency: 'TDS (Three times daily)',
      route: [DoseRoute.ORAL, DoseRoute.IV]
    },
    pediatricDose: {
      standard: '20-40mg/kg daily in divided doses',
      maximum: '90mg/kg/day for severe otitis media',
      frequency: 'TDS / BD',
      route: [DoseRoute.ORAL],
      weightBased: '20-30mg/kg/dose'
    },
    safetyFlags: {
      adults: SafetyStatus.SAFE,
      pediatrics: SafetyStatus.SAFE,
      pregnancy: SafetyStatus.SAFE,
      elderly: SafetyStatus.SAFE
    },
    contraindications: ['Penicillin hypersensitivity'],
    precautions: ['Renal impairment', 'Glandular fever'],
    sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
    emergencyUse: false,
    isVerified: true,
    source: 'BNF'
  },
  {
    id: '4',
    name: 'Salbutamol',
    brandNames: ['Ventolin'],
    class: 'Short-acting Beta-2 Agonist (SABA)',
    indications: ['Acute bronchospasm', 'Asthma', 'COPD'],
    adultDose: {
      standard: '100-200mcg (1-2 puffs)',
      maximum: '800mcg daily (unless supervised)',
      frequency: 'PRN',
      route: [DoseRoute.NEB, DoseRoute.ORAL]
    },
    pediatricDose: {
      standard: '100mcg (1 puff)',
      maximum: '2.5mg - 5mg via nebulizer in acute severe asthma',
      frequency: 'PRN',
      route: [DoseRoute.NEB, DoseRoute.ORAL]
    },
    safetyFlags: {
      adults: SafetyStatus.SAFE,
      pediatrics: SafetyStatus.SAFE,
      pregnancy: SafetyStatus.SAFE,
      elderly: SafetyStatus.SAFE
    },
    contraindications: ['Hypersensitivity'],
    precautions: ['Tachycardia', 'Hypokalemia'],
    sideEffects: ['Fine tremor', 'Headache', 'Tachycardia'],
    emergencyUse: true,
    isVerified: true,
    source: 'GINA Guidelines'
  }
];
