export type SupportedLanguage = 'ta' | 'hi' | 'te' | 'ml';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voiceLangCode: string;
  welcomeGreeting: string;
  voicePrompt: string;
}

export interface UserLocation {
  state: string;
  district: string;
  block?: string;
  village?: string;
  pincode?: string;
}

export interface Scheme {
  id: string;
  title: Record<SupportedLanguage, string>;
  category: 'women' | 'financial' | 'education' | 'skills' | 'employment' | 'agriculture' | 'maternity';
  targetAudience: Record<SupportedLanguage, string>;
  benefitSummary: Record<SupportedLanguage, string>;
  amountOrBenefit: Record<SupportedLanguage, string>;
  eligibilityQuestions: {
    id: string;
    question: Record<SupportedLanguage, string>;
    type: 'boolean' | 'age' | 'income' | 'select';
    options?: Record<SupportedLanguage, string>[];
    validCondition: string; // e.g. "age >= 18 && age <= 45" or "answer === true"
  }[];
  requiredDocuments: {
    id: string;
    name: Record<SupportedLanguage, string>;
    whyNeeded: Record<SupportedLanguage, string>;
    howToGet: Record<SupportedLanguage, string>;
  }[];
  stepsToApply: {
    stepNumber: number;
    instruction: Record<SupportedLanguage, string>;
    details: Record<SupportedLanguage, string>;
  }[];
  whereToApply: Record<SupportedLanguage, string>;
  officialSource: string;
  officialUrl: string;
  lastUpdated: string;
  status: 'active' | 'archived';
}

export interface ElectricityUpdate {
  id: string;
  area: Record<SupportedLanguage, string>;
  district: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: Record<SupportedLanguage, string>;
  affectedVillages: string[];
  subStation: string;
  source: string;
  contactHelpline: string;
  lastUpdated: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface RationUpdate {
  id: string;
  shopNumber: string;
  shopName: Record<SupportedLanguage, string>;
  location: Record<SupportedLanguage, string>;
  district: string;
  distributionDates: string;
  timings: string;
  commodities: {
    item: Record<SupportedLanguage, string>;
    quantityPerCard: string;
    price: string;
    stockStatus: 'available' | 'low-stock' | 'exhausted';
  }[];
  specialInstructions: Record<SupportedLanguage, string>;
  source: string;
  lastUpdated: string;
}

export interface EmploymentUpdate {
  id: string;
  title: Record<SupportedLanguage, string>;
  schemeName: string; // e.g. "MGNREGS 100-Day Work" or "DDU-GKY Skill Training"
  location: Record<SupportedLanguage, string>;
  district: string;
  dailyWageOrStipend: string;
  duration: string;
  eligibility: Record<SupportedLanguage, string>;
  howToApply: Record<SupportedLanguage, string>;
  contactPerson: string;
  contactNumber: string;
  officialSource: string;
  lastUpdated: string;
}

export interface HealthCamp {
  id: string;
  title: Record<SupportedLanguage, string>;
  category: 'adult' | 'women' | 'child' | 'eye' | 'dental' | 'general' | 'vaccination';
  date: string;
  timings: string;
  venue: Record<SupportedLanguage, string>;
  villageOrTown: string;
  district: string;
  servicesProvided: Record<SupportedLanguage, string>[];
  isFree: boolean;
  doctorsAvailable: string;
  contactNumber: string;
  organizer: string;
  source: string;
  lastUpdated: string;
}

export interface VaccinationSession {
  id: string;
  sessionTitle: Record<SupportedLanguage, string>;
  targetGroup: Record<SupportedLanguage, string>; // e.g. "Infants 0-12 months, Pregnant Mothers"
  date: string;
  timings: string;
  centreName: Record<SupportedLanguage, string>;
  address: Record<SupportedLanguage, string>;
  district: string;
  vaccinesAvailable: string[];
  ashaWorkerName?: string;
  ashaWorkerPhone?: string;
  officialSource: string;
  medicalDisclaimer: Record<SupportedLanguage, string>;
  lastUpdated: string;
}

export interface SupportCentre {
  id: string;
  name: Record<SupportedLanguage, string>;
  type: 'one_stop_centre' | 'women_helpline' | 'shelter_home' | 'legal_aid_clinic' | 'counselling_centre';
  district: string;
  address: Record<SupportedLanguage, string>;
  phone: string;
  tollFree?: string;
  operatingHours: string;
  services: Record<SupportedLanguage, string>[];
  distanceApprox?: string;
  directionsHelp: Record<SupportedLanguage, string>;
  officialSource: string;
  verified: boolean;
}

export interface CounsellingService {
  id: string;
  providerName: Record<SupportedLanguage, string>;
  category: 'tele_manas' | 'district_mental_health' | 'ngo_counsellor' | 'crisis_support';
  phoneNumber: string;
  operatingHours: string;
  cost: '100% Free' | 'Government Subsidized';
  supportedLanguages: SupportedLanguage[];
  servicesOffered: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  officialSource: string;
}

export interface CounsellingRequest {
  id: string;
  name: string;
  preferredLanguage: SupportedLanguage;
  ageRange: string;
  contactPreference: 'phone' | 'in-person';
  phoneNumber?: string;
  preferredTimeSlot: string;
  optionalNotes?: string;
  createdAt: string;
  status: 'received' | 'in-touch' | 'completed';
}

export interface TrustedContact {
  name: string;
  phone: string;
  relationship: string;
  quickNote?: string;
}

export interface SafetyPlan {
  trustedContact: TrustedContact;
  safePlaces: string[];
  emergencyBagItems: string[];
  importantNumbers: { name: string; phone: string }[];
  safePasscode?: string;
  lastUpdated: string;
}

export interface UserApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  applicantName: string;
  applicantPhone: string;
  village: string;
  district: string;
  submissionDate: string;
  status: 'submitted' | 'under_review' | 'documents_verified' | 'approved' | 'action_needed';
  statusDetails: Record<SupportedLanguage, string>;
  timeline: {
    date: string;
    step: Record<SupportedLanguage, string>;
    done: boolean;
  }[];
  nextAction: Record<SupportedLanguage, string>;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH';
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}
