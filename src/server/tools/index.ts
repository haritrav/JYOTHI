import {
  Scheme,
  ElectricityUpdate,
  RationUpdate,
  WorkOpportunity,
  HealthCamp,
  VaccinationSession,
  SupportCentre,
  CounsellingService,
  CounsellingRequest,
  ApplicationRecord,
  SupportedLanguage
} from '@/types';
import {
  VERIFIED_SCHEMES,
  VERIFIED_ELECTRICITY_UPDATES,
  VERIFIED_RATION_UPDATES,
  VERIFIED_WORK_OPPORTUNITIES,
  VERIFIED_HEALTH_CAMPS,
  VERIFIED_VACCINATION_SESSIONS,
  VERIFIED_SUPPORT_CENTRES,
  VERIFIED_COUNSELLING_SERVICES,
  INITIAL_APPLICATIONS
} from '@/data/verifiedData';

// In-memory data store for serverless execution
const inMemoryApplications: ApplicationRecord[] = [...INITIAL_APPLICATIONS];
const inMemoryCounselling: CounsellingRequest[] = [];

// 1. search_schemes()
export async function search_schemes(params: {
  category?: string;
  query?: string;
  language?: SupportedLanguage;
  minAge?: number;
}): Promise<Scheme[]> {
  const { category, query, language = 'ta' } = params;
  return VERIFIED_SCHEMES.filter(sc => {
    const matchCat = !category || category === 'all' || sc.category === category;
    const matchQuery = !query ||
      sc.title[language].toLowerCase().includes(query.toLowerCase()) ||
      sc.whoItIsFor[language].toLowerCase().includes(query.toLowerCase()) ||
      sc.mainBenefit[language].toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });
}

// 2. check_preliminary_eligibility()
export async function check_preliminary_eligibility(params: {
  schemeId: string;
  gender: 'female' | 'male' | 'other';
  age: number;
  annualIncome?: number;
  landAcres?: number;
}): Promise<{
  schemeId: string;
  isEligible: boolean;
  score: number;
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  disclaimer: string;
}> {
  const scheme = VERIFIED_SCHEMES.find(s => s.id === params.schemeId) || VERIFIED_SCHEMES[0];
  const matched: string[] = [];
  const unmatched: string[] = [];

  if (params.gender === 'female') {
    matched.push('Gender requirement (Female) satisfied');
  } else {
    unmatched.push('Scheme is exclusively for women');
  }

  if (scheme.eligibilityCriteria.minAge && params.age >= scheme.eligibilityCriteria.minAge) {
    matched.push(`Age (${params.age}) is above minimum requirement (${scheme.eligibilityCriteria.minAge})`);
  } else if (scheme.eligibilityCriteria.minAge) {
    unmatched.push(`Age is below ${scheme.eligibilityCriteria.minAge}`);
  }

  if (params.annualIncome && scheme.eligibilityCriteria.maxAnnualIncome) {
    if (params.annualIncome <= scheme.eligibilityCriteria.maxAnnualIncome) {
      matched.push('Annual income is within eligibility limit');
    } else {
      unmatched.push('Annual income exceeds ceiling');
    }
  }

  const isEligible = unmatched.length === 0;

  return {
    schemeId: scheme.id,
    isEligible,
    score: Math.round((matched.length / (matched.length + unmatched.length || 1)) * 100),
    matchedCriteria: matched,
    unmatchedCriteria: unmatched,
    disclaimer: 'This is a preliminary check only. Final eligibility is determined exclusively by the authorized government department.'
  };
}

// 3. get_local_updates()
export async function get_local_updates(params: {
  district?: string;
  block?: string;
  village?: string;
}): Promise<{
  electricity: ElectricityUpdate[];
  ration: RationUpdate[];
  work: WorkOpportunity[];
}> {
  return {
    electricity: VERIFIED_ELECTRICITY_UPDATES,
    ration: VERIFIED_RATION_UPDATES,
    work: VERIFIED_WORK_OPPORTUNITIES
  };
}

// 4. get_electricity_updates()
export async function get_electricity_updates(params?: {
  block?: string;
  village?: string;
}): Promise<ElectricityUpdate[]> {
  return VERIFIED_ELECTRICITY_UPDATES;
}

// 5. get_ration_updates()
export async function get_ration_updates(params?: {
  shopNumber?: string;
  village?: string;
}): Promise<RationUpdate[]> {
  return VERIFIED_RATION_UPDATES;
}

// 6. get_work_opportunities()
export async function get_work_opportunities(params?: {
  type?: string;
  panchayat?: string;
}): Promise<WorkOpportunity[]> {
  return VERIFIED_WORK_OPPORTUNITIES;
}

// 7. get_health_camps()
export async function get_health_camps(params?: {
  category?: string;
  district?: string;
}): Promise<HealthCamp[]> {
  if (params?.category && params.category !== 'all') {
    return VERIFIED_HEALTH_CAMPS.filter(c => c.category === params.category);
  }
  return VERIFIED_HEALTH_CAMPS;
}

// 8. get_child_health_events()
export async function get_child_health_events(): Promise<{
  vaccinationSessions: VaccinationSession[];
  poshanAdvisory: string;
}> {
  return {
    vaccinationSessions: VERIFIED_VACCINATION_SESSIONS,
    poshanAdvisory: 'Poshan Abhiyaan: Breastfeeding for first 6 months and iron-rich supplementary diet recommended.'
  };
}

// 9. get_vaccination_sessions()
export async function get_vaccination_sessions(params?: {
  village?: string;
  targetAge?: string;
}): Promise<VaccinationSession[]> {
  return VERIFIED_VACCINATION_SESSIONS;
}

// 10. get_user_applications()
export async function get_user_applications(userId?: string): Promise<ApplicationRecord[]> {
  return inMemoryApplications;
}

// 11. get_support_centres()
export async function get_support_centres(params?: {
  type?: string;
  district?: string;
}): Promise<SupportCentre[]> {
  return VERIFIED_SUPPORT_CENTRES;
}

// 12. get_one_stop_centres()
export async function get_one_stop_centres(district?: string): Promise<SupportCentre[]> {
  return VERIFIED_SUPPORT_CENTRES.filter(c => c.type === 'one_stop_centre');
}

// 13. get_legal_support()
export async function get_legal_support(): Promise<{
  legalAidHotline: string;
  availableProtectionOrders: string[];
  rightsOverview: Record<SupportedLanguage, string>;
}> {
  return {
    legalAidHotline: '15100',
    availableProtectionOrders: [
      'Protection from Domestic Violence Act (Section 18)',
      'Right to Reside in Shared Household (Section 19)',
      'Monetary Relief & Maintenance (Section 20)',
      'Temporary Child Custody Orders (Section 21)'
    ],
    rightsOverview: {
      ta: 'பெண்களுக்கு 100% இலவச அரசு வழக்கறிஞர் மற்றும் இடைக்கால பாதுகாப்பு உத்தரவு பெற முழு உரிமை உண்டு.',
      hi: 'महिलाओं को पूरी तरह मुफ्त सरकारी वकील और तत्काल सुरक्षा आदेश पाने का कानूनी अधिकार है।',
      te: 'మహిళలకు ఉచిత ప్రభుత్వ న్యాయవాది మరియు రక్షణ ఉత్తర్వులు పొందే హక్కు ఉంది.',
      ml: 'സ്ത്രീകൾക്ക് സൗജന്യ സർക്കാർ അഭിഭാഷകനും സംരക്ഷണ ഉത്തരവും ലഭിക്കാൻ അർഹതയുണ്ട്.'
    }
  };
}

// 14. get_counselling_services()
export async function get_counselling_services(): Promise<CounsellingService[]> {
  return VERIFIED_COUNSELLING_SERVICES;
}

// 15. request_counselling()
export async function request_counselling(params: {
  userName: string;
  preferredLanguage: SupportedLanguage;
  ageRange: string;
  preferredMode: 'phone' | 'video' | 'in_person';
  preferredTime: string;
  notes?: string;
}): Promise<{
  success: boolean;
  requestId: string;
  message: string;
  assignedProvider: string;
}> {
  const requestId = `CNSL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const record: CounsellingRequest = {
    id: requestId,
    userName: params.userName,
    preferredLanguage: params.preferredLanguage,
    ageRange: params.ageRange,
    preferredMode: params.preferredMode,
    preferredTime: params.preferredTime,
    notes: params.notes,
    status: 'received',
    createdAt: new Date().toISOString()
  };

  inMemoryCounselling.push(record);

  return {
    success: true,
    requestId,
    message: 'Your counselling request has been registered. A female counselor will call at your chosen time.',
    assignedProvider: 'District Women Empowerment & Counselling Cell'
  };
}

// 16. get_emergency_contacts()
export async function get_emergency_contacts(): Promise<{
  nationalEmergency: string;
  womenHelpline: string;
  childHelpline: string;
  mentalHealthHelpline: string;
  legalAidHelpline: string;
}> {
  return {
    nationalEmergency: '112',
    womenHelpline: '181',
    childHelpline: '1098',
    mentalHealthHelpline: '14416',
    legalAidHelpline: '15100'
  };
}

// 17. get_women_helpline()
export async function get_women_helpline(): Promise<{
  number: string;
  hours: string;
  isFree: boolean;
  services: string[];
}> {
  return {
    number: '181',
    hours: '24 Hours, 7 Days a week',
    isFree: true,
    services: [
      'Immediate rescue and police linkage',
      'One Stop Centre (OSC) temporary shelter referral',
      'Free medical examination arrangement',
      'Psychological first aid & counselling'
    ]
  };
}

// 18. get_user_notification_preferences()
export async function get_user_notification_preferences(): Promise<{
  electricityAlerts: boolean;
  rationStockAlerts: boolean;
  vaccinationReminders: boolean;
  schemesAlerts: boolean;
  safeMaskingEnabled: boolean;
}> {
  return {
    electricityAlerts: true,
    rationStockAlerts: true,
    vaccinationReminders: true,
    schemesAlerts: true,
    safeMaskingEnabled: true
  };
}
