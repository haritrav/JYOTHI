export type SupportedLanguage = 'ta' | 'hi' | 'te' | 'ml';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  locale: string;
  sampleGreeting: string;
  description: string;
}

export type TextSize = 'normal' | 'large' | 'xlarge';

export interface UserLocation {
  state: string;
  district: string;
  block: string;
  village: string;
}

export interface Scheme {
  id: string;
  title: Record<SupportedLanguage, string>;
  category: 'financial' | 'maternity' | 'education' | 'housing' | 'livelihood' | 'agriculture';
  whoItIsFor: Record<SupportedLanguage, string>;
  mainBenefit: Record<SupportedLanguage, string>;
  benefitAmount?: string;
  eligibilitySummary: Record<SupportedLanguage, string>;
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    gender?: 'female' | 'any';
    maxAnnualIncome?: number;
    landOwnershipMaxAcres?: number;
    otherCriteria?: Record<SupportedLanguage, string[]>;
  };
  requiredDocuments: Array<{
    id: string;
    name: Record<SupportedLanguage, string>;
    whatIsIt: Record<SupportedLanguage, string>;
    whyNeeded: Record<SupportedLanguage, string>;
    whereToFind: Record<SupportedLanguage, string>;
    icon: string;
  }>;
  applicationSteps: Array<{
    stepNumber: number;
    title: Record<SupportedLanguage, string>;
    instruction: Record<SupportedLanguage, string>;
    audioPrompt?: Record<SupportedLanguage, string>;
  }>;
  howToApply: Record<SupportedLanguage, string>;
  whereToApply: Record<SupportedLanguage, string>;
  officialSource: string;
  sourceUrl: string;
  lastUpdated: string;
  status: 'active' | 'upcoming' | 'expired';
}

export interface ElectricityUpdate {
  id: string;
  location: {
    state: string;
    district: string;
    block: string;
    area: string;
  };
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  affectedVillages: string[];
  reason: Record<SupportedLanguage, string>;
  officialSource: string;
  sourceContact: string;
  lastUpdated: string;
  status: 'scheduled' | 'in_progress' | 'restored';
}

export interface RationUpdate {
  id: string;
  shopNumber: string;
  location: {
    state: string;
    district: string;
    block: string;
    village: string;
  };
  dealerName: string;
  distributionMonth: string;
  openTimings: string;
  itemsAvailable: Array<{
    item: Record<SupportedLanguage, string>;
    quantityPerCard: string;
    price: string;
    inStock: boolean;
  }>;
  officialInstructions: Record<SupportedLanguage, string>;
  officialSource: string;
  helpline: string;
  lastUpdated: string;
}

export interface WorkOpportunity {
  id: string;
  title: Record<SupportedLanguage, string>;
  type: 'mgnrega_100_day' | 'shg_enterprise' | 'rural_artisan' | 'agriculture_support';
  location: {
    state: string;
    district: string;
    block: string;
    panchayat: string;
  };
  workDescription: Record<SupportedLanguage, string>;
  startDate: string;
  durationDays: number;
  dailyWage: string;
  eligibility: Record<SupportedLanguage, string>;
  howToApply: Record<SupportedLanguage, string>;
  contactPerson: string;
  contactNumber: string;
  officialSource: string;
  lastUpdated: string;
}

export interface HealthCamp {
  id: string;
  category: 'adult' | 'women' | 'eye' | 'dental' | 'general' | 'child';
  title: Record<SupportedLanguage, string>;
  date: string;
  startTime: string;
  endTime: string;
  venue: Record<SupportedLanguage, string>;
  location: {
    state: string;
    district: string;
    block: string;
    village: string;
  };
  servicesOffered: Record<SupportedLanguage, string[]>;
  doctorSpecialists: string;
  officialSource: string;
  contactNumber: string;
  isFree: boolean;
  medicinesProvided: boolean;
  lastUpdated: string;
}

export interface VaccinationSession {
  id: string;
  title: Record<SupportedLanguage, string>;
  targetGroup: Record<SupportedLanguage, string>;
  targetAge: string;
  vaccinesAvailable: string[];
  sessionDate: string;
  timings: string;
  venue: Record<SupportedLanguage, string>;
  location: {
    state: string;
    district: string;
    block: string;
    village: string;
  };
  ashaWorkerName: string;
  ashaContact: string;
  officialSource: string;
  importantNotes: Record<SupportedLanguage, string>;
  lastUpdated: string;
}

export interface SupportCentre {
  id: string;
  name: Record<SupportedLanguage, string>;
  type: 'one_stop_centre' | 'women_helpline_cell' | 'legal_aid_clinic' | 'short_stay_home' | 'hospital_support';
  address: Record<SupportedLanguage, string>;
  distanceKm: string;
  operatingHours: string;
  phoneNumber: string;
  emergencyNumber: string;
  services: Record<SupportedLanguage, string[]>;
  verifiedOfficial: boolean;
  location: {
    state: string;
    district: string;
    block: string;
  };
}

export interface CounsellingService {
  id: string;
  providerName: string;
  type: 'tele_manas' | 'government_health' | 'verified_ngo' | 'licensed_counselor';
  serviceTitle: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  languagesSupported: SupportedLanguage[];
  modes: Array<'phone' | 'video' | 'in_person'>;
  tollFreeNumber?: string;
  isFree: boolean;
  availability: string;
  verifiedSource: string;
}

export interface CounsellingRequest {
  id: string;
  userName: string;
  preferredLanguage: SupportedLanguage;
  ageRange: string;
  preferredMode: 'phone' | 'video' | 'in_person';
  preferredTime: string;
  notes?: string;
  status: 'received' | 'assigned' | 'contacted' | 'completed';
  createdAt: string;
}

export interface ApplicationRecord {
  id: string;
  schemeId: string;
  schemeTitle: string;
  applicantName: string;
  applicantAge: string;
  village: string;
  block: string;
  district: string;
  state: string;
  submissionDate: string;
  status: 'submitted' | 'under_review' | 'field_verification' | 'approved' | 'disbursed';
  statusSteps: Array<{
    label: Record<SupportedLanguage, string>;
    done: boolean;
    date?: string;
  }>;
  trackingNumber: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  notifyOnEmergency: boolean;
}

export interface SafetyPlan {
  trustedContacts: TrustedContact[];
  safePlaceAddress: string;
  emergencyBagChecklist: Array<{ item: string; packed: boolean }>;
  personalNotes: string;
  localCentreId?: string;
  lastUpdated: string;
}

export interface AppNotification {
  id: string;
  category: 'important' | 'this_week' | 'general' | 'support_sensitive';
  type: 'electricity' | 'ration' | 'mgnrega' | 'scheme' | 'health_camp' | 'vaccination' | 'safety_support';
  title: Record<SupportedLanguage, string>;
  safePreviewTitle: Record<SupportedLanguage, string>;
  message: Record<SupportedLanguage, string>;
  isSensitive: boolean;
  date: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  adminUser: string;
  action: string;
  category: string;
  details: string;
  timestamp: string;
}
