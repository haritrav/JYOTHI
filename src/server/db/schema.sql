-- ============================================================
-- JYOTHI / SAKHI PRODUCTION DATABASE SCHEMA
-- PostgreSQL / Supabase with Row Level Security (RLS)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. LANGUAGES
CREATE TABLE IF NOT EXISTS languages (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    flag VARCHAR(10) NOT NULL,
    locale VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO languages (id, name, native_name, flag, locale) VALUES
('ta', 'Tamil', 'தமிழ்', '🇮🇳', 'ta-IN'),
('hi', 'Hindi', 'हिन्दी', '🇮🇳', 'hi-IN'),
('te', 'Telugu', 'తెలుగు', '🇮🇳', 'te-IN'),
('ml', 'Malayalam', 'മലയാളം', '🇮🇳', 'ml-IN')
ON CONFLICT (id) DO NOTHING;

-- 2. LOCATIONS
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_search ON locations(state, district, block, village);

-- 3. USERS & PREFERENCES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_hash VARCHAR(256),
    preferred_language VARCHAR(10) REFERENCES languages(id) DEFAULT 'ta',
    location_id UUID REFERENCES locations(id),
    text_size VARCHAR(20) DEFAULT 'normal',
    high_contrast BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. OFFICIAL SOURCES
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_name VARCHAR(255) NOT NULL,
    portal_url TEXT NOT NULL,
    helpline_number VARCHAR(50),
    state VARCHAR(100),
    verification_status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. GOVERNMENT SCHEMES
CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    title_ta TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_te TEXT NOT NULL,
    title_ml TEXT NOT NULL,
    who_it_is_for_ta TEXT NOT NULL,
    who_it_is_for_hi TEXT NOT NULL,
    who_it_is_for_te TEXT NOT NULL,
    who_it_is_for_ml TEXT NOT NULL,
    main_benefit_ta TEXT NOT NULL,
    main_benefit_hi TEXT NOT NULL,
    main_benefit_te TEXT NOT NULL,
    main_benefit_ml TEXT NOT NULL,
    benefit_amount VARCHAR(100),
    eligibility_summary_ta TEXT NOT NULL,
    eligibility_summary_hi TEXT NOT NULL,
    eligibility_summary_te TEXT NOT NULL,
    eligibility_summary_ml TEXT NOT NULL,
    min_age INT,
    max_age INT,
    gender VARCHAR(20) DEFAULT 'female',
    max_annual_income NUMERIC,
    official_source_id UUID REFERENCES sources(id),
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    last_updated DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. REQUIRED DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(100) PRIMARY KEY,
    name_ta VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NOT NULL,
    name_ml VARCHAR(255) NOT NULL,
    what_is_it_ta TEXT NOT NULL,
    what_is_it_hi TEXT NOT NULL,
    what_is_it_te TEXT NOT NULL,
    what_is_it_ml TEXT NOT NULL,
    why_needed_ta TEXT NOT NULL,
    why_needed_hi TEXT NOT NULL,
    why_needed_te TEXT NOT NULL,
    why_needed_ml TEXT NOT NULL,
    where_to_find_ta TEXT NOT NULL,
    where_to_find_hi TEXT NOT NULL,
    where_to_find_te TEXT NOT NULL,
    where_to_find_ml TEXT NOT NULL,
    icon_name VARCHAR(50) DEFAULT 'FileText'
);

-- 7. SCHEME DOCUMENT MAPPING
CREATE TABLE IF NOT EXISTS scheme_documents (
    scheme_id VARCHAR(100) REFERENCES schemes(id) ON DELETE CASCADE,
    document_id VARCHAR(100) REFERENCES documents(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (scheme_id, document_id)
);

-- 8. USER APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheme_id VARCHAR(100) REFERENCES schemes(id),
    scheme_title VARCHAR(255) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_age VARCHAR(10),
    village VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    submission_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ELECTRICITY UPDATES
CREATE TABLE IF NOT EXISTS electricity_updates (
    id VARCHAR(100) PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    area VARCHAR(255) NOT NULL,
    title_ta TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_te TEXT NOT NULL,
    title_ml TEXT NOT NULL,
    description_ta TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    description_te TEXT NOT NULL,
    description_ml TEXT NOT NULL,
    schedule_date VARCHAR(100) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    affected_villages TEXT[] NOT NULL,
    reason_ta TEXT NOT NULL,
    reason_hi TEXT NOT NULL,
    reason_te TEXT NOT NULL,
    reason_ml TEXT NOT NULL,
    official_source VARCHAR(255) NOT NULL,
    source_contact VARCHAR(100) DEFAULT '1912',
    status VARCHAR(50) DEFAULT 'scheduled',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. RATION UPDATES (PDS)
CREATE TABLE IF NOT EXISTS ration_updates (
    id VARCHAR(100) PRIMARY KEY,
    shop_number VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    dealer_name VARCHAR(255) NOT NULL,
    distribution_month VARCHAR(100) NOT NULL,
    open_timings VARCHAR(255) NOT NULL,
    stock_items JSONB NOT NULL,
    official_instructions_ta TEXT NOT NULL,
    official_instructions_hi TEXT NOT NULL,
    official_instructions_te TEXT NOT NULL,
    official_instructions_ml TEXT NOT NULL,
    official_source VARCHAR(255) NOT NULL,
    helpline VARCHAR(50) DEFAULT '1967',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. EMPLOYMENT & 100-DAY MGNREGA WORKS
CREATE TABLE IF NOT EXISTS employment_updates (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(50) DEFAULT 'mgnrega_100_day',
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    panchayat VARCHAR(100) NOT NULL,
    title_ta TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_te TEXT NOT NULL,
    title_ml TEXT NOT NULL,
    work_description_ta TEXT NOT NULL,
    work_description_hi TEXT NOT NULL,
    work_description_te TEXT NOT NULL,
    work_description_ml TEXT NOT NULL,
    start_date VARCHAR(100) NOT NULL,
    duration_days INT DEFAULT 14,
    daily_wage VARCHAR(100) NOT NULL,
    eligibility_ta TEXT NOT NULL,
    eligibility_hi TEXT NOT NULL,
    eligibility_te TEXT NOT NULL,
    eligibility_ml TEXT NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_number VARCHAR(100) NOT NULL,
    official_source VARCHAR(255) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. HEALTH CAMPS
CREATE TABLE IF NOT EXISTS health_camps (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    title_ta TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_te TEXT NOT NULL,
    title_ml TEXT NOT NULL,
    date VARCHAR(100) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    venue_ta TEXT NOT NULL,
    venue_hi TEXT NOT NULL,
    venue_te TEXT NOT NULL,
    venue_ml TEXT NOT NULL,
    services_ta TEXT[] NOT NULL,
    services_hi TEXT[] NOT NULL,
    services_te TEXT[] NOT NULL,
    services_ml TEXT[] NOT NULL,
    doctor_specialists VARCHAR(255) NOT NULL,
    official_source VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50) DEFAULT '104',
    is_free BOOLEAN DEFAULT TRUE,
    medicines_provided BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. VACCINATION SESSIONS
CREATE TABLE IF NOT EXISTS vaccination_sessions (
    id VARCHAR(100) PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    title_ta TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_te TEXT NOT NULL,
    title_ml TEXT NOT NULL,
    target_group_ta TEXT NOT NULL,
    target_group_hi TEXT NOT NULL,
    target_group_te TEXT NOT NULL,
    target_group_ml TEXT NOT NULL,
    target_age VARCHAR(50) NOT NULL,
    vaccines_available TEXT[] NOT NULL,
    session_date VARCHAR(100) NOT NULL,
    timings VARCHAR(100) NOT NULL,
    venue_ta TEXT NOT NULL,
    venue_hi TEXT NOT NULL,
    venue_te TEXT NOT NULL,
    venue_ml TEXT NOT NULL,
    asha_worker_name VARCHAR(255) NOT NULL,
    asha_contact VARCHAR(50) NOT NULL,
    official_source VARCHAR(255) NOT NULL,
    important_notes_ta TEXT NOT NULL,
    important_notes_hi TEXT NOT NULL,
    important_notes_te TEXT NOT NULL,
    important_notes_ml TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. SUPPORT CENTRES (ONE STOP CENTRES / SAKHI)
CREATE TABLE IF NOT EXISTS support_centres (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(50) DEFAULT 'one_stop_centre',
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    name_ta TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    name_te TEXT NOT NULL,
    name_ml TEXT NOT NULL,
    address_ta TEXT NOT NULL,
    address_hi TEXT NOT NULL,
    address_te TEXT NOT NULL,
    address_ml TEXT NOT NULL,
    distance_km VARCHAR(50) NOT NULL,
    operating_hours VARCHAR(100) DEFAULT 'Open 24x7',
    phone_number VARCHAR(100) NOT NULL,
    emergency_number VARCHAR(50) DEFAULT '181',
    services_ta TEXT[] NOT NULL,
    services_hi TEXT[] NOT NULL,
    services_te TEXT[] NOT NULL,
    services_ml TEXT[] NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. COUNSELLING SERVICES & REQUESTS
CREATE TABLE IF NOT EXISTS counselling_services (
    id VARCHAR(100) PRIMARY KEY,
    provider_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'tele_manas',
    service_title_ta TEXT NOT NULL,
    service_title_hi TEXT NOT NULL,
    service_title_te TEXT NOT NULL,
    service_title_ml TEXT NOT NULL,
    toll_free_number VARCHAR(100) DEFAULT '14416',
    is_free BOOLEAN DEFAULT TRUE,
    availability VARCHAR(100) DEFAULT '24x7',
    verified_source VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS counselling_requests (
    id VARCHAR(100) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) REFERENCES languages(id),
    age_range VARCHAR(50) NOT NULL,
    preferred_mode VARCHAR(50) NOT NULL,
    preferred_time VARCHAR(100) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'received',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title_ta TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_te TEXT NOT NULL,
    title_ml TEXT NOT NULL,
    safe_preview_ta TEXT NOT NULL,
    safe_preview_hi TEXT NOT NULL,
    safe_preview_te TEXT NOT NULL,
    safe_preview_ml TEXT NOT NULL,
    message_ta TEXT NOT NULL,
    message_hi TEXT NOT NULL,
    message_te TEXT NOT NULL,
    message_ml TEXT NOT NULL,
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip_hash VARCHAR(256),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for verified non-sensitive tables
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to verified schemes" ON schemes FOR SELECT USING (status = 'active');

ALTER TABLE electricity_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to electricity updates" ON electricity_updates FOR SELECT USING (TRUE);

ALTER TABLE ration_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to ration updates" ON ration_updates FOR SELECT USING (TRUE);

ALTER TABLE health_camps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to health camps" ON health_camps FOR SELECT USING (TRUE);

ALTER TABLE vaccination_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to vaccination sessions" ON vaccination_sessions FOR SELECT USING (TRUE);

ALTER TABLE support_centres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to support centres" ON support_centres FOR SELECT USING (TRUE);
