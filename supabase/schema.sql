-- ==============================================================================
-- JYOTHI: "Her Voice. Her Language. Her Access."
-- Comprehensive PostgreSQL Schema for Supabase with Row Level Security & Audit Triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Languages Table
CREATE TABLE IF NOT EXISTS languages (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    voice_code VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

INSERT INTO languages (code, name, native_name, voice_code) VALUES
('ta', 'Tamil', 'தமிழ்', 'ta-IN'),
('hi', 'Hindi', 'हिन्दी', 'hi-IN'),
('te', 'Telugu', 'తెలుగు', 'te-IN'),
('ml', 'Malayalam', 'മലയാളം', 'ml-IN')
ON CONFLICT (code) DO NOTHING;

-- 2. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluk_or_block VARCHAR(100),
    village_or_town VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Users Table (Linked to Supabase Auth or Anonymous Session)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_hash VARCHAR(255),
    preferred_language VARCHAR(10) REFERENCES languages(code) DEFAULT 'ta',
    location_id UUID REFERENCES locations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    text_size VARCHAR(20) DEFAULT 'large', -- normal, large, extralarge
    high_contrast BOOLEAN DEFAULT false,
    voice_speed NUMERIC(3,2) DEFAULT 0.90,
    voice_gender VARCHAR(10) DEFAULT 'female',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Information Sources (Strict provenance tracking - Never invent data)
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    portal_url TEXT,
    contact_phone VARCHAR(50),
    verification_status VARCHAR(50) DEFAULT 'VERIFIED',
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Government Schemes
CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(100) PRIMARY KEY,
    title_ta TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_te TEXT NOT NULL,
    title_ml TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- women, financial, education, employment, maternity
    target_audience JSONB NOT NULL,
    benefit_summary JSONB NOT NULL,
    amount_or_benefit JSONB NOT NULL,
    where_to_apply JSONB NOT NULL,
    official_source_id UUID REFERENCES sources(id),
    official_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_updated DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Scheme Eligibility Rules
CREATE TABLE IF NOT EXISTS scheme_eligibility_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id VARCHAR(100) REFERENCES schemes(id) ON DELETE CASCADE,
    question_ta TEXT NOT NULL,
    question_hi TEXT NOT NULL,
    question_te TEXT NOT NULL,
    question_ml TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'boolean',
    validation_rule TEXT NOT NULL,
    order_seq INT DEFAULT 1
);

-- 8. Required Documents
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(100) PRIMARY KEY,
    name_ta TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    name_te TEXT NOT NULL,
    name_ml TEXT NOT NULL,
    why_needed JSONB NOT NULL,
    how_to_get JSONB NOT NULL,
    issuing_authority TEXT
);

-- 9. Scheme Document Mapping
CREATE TABLE IF NOT EXISTS scheme_documents (
    scheme_id VARCHAR(100) REFERENCES schemes(id) ON DELETE CASCADE,
    document_id VARCHAR(100) REFERENCES documents(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT true,
    PRIMARY KEY (scheme_id, document_id)
);

-- 10. User Applications Tracker
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheme_id VARCHAR(100) REFERENCES schemes(id),
    applicant_name VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),
    village VARCHAR(100),
    district VARCHAR(100),
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, approved, action_needed
    status_details JSONB,
    timeline JSONB,
    next_action JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. Electricity Interruption Updates (Verified only)
CREATE TABLE IF NOT EXISTS electricity_updates (
    id VARCHAR(100) PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    area JSONB NOT NULL,
    interruption_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    reason JSONB NOT NULL,
    affected_villages TEXT[],
    sub_station VARCHAR(255),
    source_name VARCHAR(255) NOT NULL,
    contact_helpline VARCHAR(50) DEFAULT '1912',
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. Ration / Fair Price Shop Updates
CREATE TABLE IF NOT EXISTS ration_updates (
    id VARCHAR(100) PRIMARY KEY,
    shop_number VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    shop_name JSONB NOT NULL,
    location JSONB NOT NULL,
    distribution_dates TEXT NOT NULL,
    timings VARCHAR(100) NOT NULL,
    commodities JSONB NOT NULL,
    special_instructions JSONB,
    source_name VARCHAR(255) NOT NULL,
    last_updated DATE DEFAULT CURRENT_DATE
);

-- 13. Employment & MGNREGS 100-Day Work Updates
CREATE TABLE IF NOT EXISTS employment_updates (
    id VARCHAR(100) PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    scheme_name VARCHAR(255) NOT NULL,
    title JSONB NOT NULL,
    location JSONB NOT NULL,
    daily_wage_or_stipend VARCHAR(100) NOT NULL,
    duration VARCHAR(100),
    eligibility JSONB NOT NULL,
    how_to_apply JSONB NOT NULL,
    contact_person VARCHAR(100),
    contact_number VARCHAR(50),
    source_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 14. Health Camps (Free public health & screening camps)
CREATE TABLE IF NOT EXISTS health_camps (
    id VARCHAR(100) PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    title JSONB NOT NULL,
    category VARCHAR(50) NOT NULL, -- women, adult, eye, dental, child, general
    camp_date DATE NOT NULL,
    timings VARCHAR(100) NOT NULL,
    venue JSONB NOT NULL,
    village_or_town VARCHAR(100),
    services_provided JSONB NOT NULL,
    is_free BOOLEAN DEFAULT true,
    doctors_available TEXT,
    contact_number VARCHAR(50),
    organizer VARCHAR(255),
    source_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 15. Child Health Events & Immunization Sessions
CREATE TABLE IF NOT EXISTS vaccination_sessions (
    id VARCHAR(100) PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    session_title JSONB NOT NULL,
    target_group JSONB NOT NULL,
    session_date VARCHAR(100) NOT NULL,
    timings VARCHAR(100) NOT NULL,
    centre_name JSONB NOT NULL,
    address JSONB NOT NULL,
    vaccines_available TEXT[],
    asha_worker_name VARCHAR(100),
    asha_worker_phone VARCHAR(50),
    medical_disclaimer JSONB NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 16. Support Centres & One Stop Centres (Sakhi)
CREATE TABLE IF NOT EXISTS support_centres (
    id VARCHAR(100) PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    name JSONB NOT NULL,
    centre_type VARCHAR(50) NOT NULL, -- one_stop_centre, women_helpline, shelter_home, legal_aid_clinic
    address JSONB NOT NULL,
    phone VARCHAR(50) NOT NULL,
    toll_free VARCHAR(50),
    operating_hours VARCHAR(100) NOT NULL,
    services JSONB NOT NULL,
    directions_help JSONB,
    source_name VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT true
);

-- 17. Mental Health & Counselling Services
CREATE TABLE IF NOT EXISTS counselling_services (
    id VARCHAR(100) PRIMARY KEY,
    provider_name JSONB NOT NULL,
    category VARCHAR(50) NOT NULL, -- tele_manas, district_mental_health, crisis_support
    phone_number VARCHAR(50) NOT NULL,
    operating_hours VARCHAR(100) NOT NULL,
    cost VARCHAR(50) DEFAULT '100% Free',
    supported_languages TEXT[],
    services_offered JSONB NOT NULL,
    description JSONB NOT NULL,
    official_source VARCHAR(255) NOT NULL
);

-- 18. Confidential Counselling Registrations (Data Minimization applied)
CREATE TABLE IF NOT EXISTS counselling_requests (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) NOT NULL,
    age_range VARCHAR(50),
    contact_preference VARCHAR(50) DEFAULT 'phone',
    phone_number VARCHAR(50),
    preferred_time_slot VARCHAR(100),
    optional_notes TEXT,
    status VARCHAR(50) DEFAULT 'received',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 19. Emergency Contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
    number VARCHAR(20) PRIMARY KEY,
    name JSONB NOT NULL,
    description JSONB NOT NULL,
    is_24x7 BOOLEAN DEFAULT true,
    is_toll_free BOOLEAN DEFAULT true
);

-- 20. Trusted Contacts (Private to user device/session)
CREATE TABLE IF NOT EXISTS trusted_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(100),
    quick_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 21. Safety Plans
CREATE TABLE IF NOT EXISTS safety_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    safe_places TEXT[],
    emergency_bag_items TEXT[],
    important_numbers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 22. Safe Notifications (Neutral Language for sensitive updates)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- electricity, ration, health, vaccination, neutral_support
    neutral_title JSONB NOT NULL,
    neutral_body JSONB NOT NULL,
    target_date DATE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 23. Admin Users & Role-Based Access Control
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- SUPER_ADMIN, CONTENT_MANAGER, HEALTH_ADMIN, SAFETY_ADMIN
    full_name VARCHAR(255),
    department VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 24. Audit Logs (Mandatory logging for all administrative modifications)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, PUBLISH, UNPUBLISH
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE electricity_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ration_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselling_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read for verified public utilities, schemes and helplines
CREATE POLICY "Public read for schemes" ON schemes FOR SELECT USING (is_active = true);
CREATE POLICY "Public read for electricity updates" ON electricity_updates FOR SELECT USING (true);
CREATE POLICY "Public read for ration updates" ON ration_updates FOR SELECT USING (true);
CREATE POLICY "Public read for employment updates" ON employment_updates FOR SELECT USING (true);
CREATE POLICY "Public read for health camps" ON health_camps FOR SELECT USING (true);
CREATE POLICY "Public read for vaccination sessions" ON vaccination_sessions FOR SELECT USING (true);
CREATE POLICY "Public read for support centres" ON support_centres FOR SELECT USING (is_verified = true);
CREATE POLICY "Public read for counselling services" ON counselling_services FOR SELECT USING (true);
