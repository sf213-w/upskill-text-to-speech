# Speech2Text Healthcare Translation App - Complete Database Setup

## Overview

This database structure supports an end-to-end healthcare journey translation service for non-English speaking patients, tracking their complete care process from identifying ailments to post-visit follow-ups.

---

## Table of Contents

1. [Database Architecture](#database-architecture)
2. [Complete SQL Schema](#complete-sql-schema)
3. [Implementation Guide](#implementation-guide)
4. [API Examples](#api-examples)

---

## Database Architecture

### Core Entities

#### 1. **patients**

Stores patient profile information and preferences.

- Primary identifier: `id` (UUID)
- Tracks language preferences for translation
- Stores contact and demographic information
- Includes insurance information for provider network searches

#### 2. **care_providers**

Medical professionals and facilities database.

- Supports search by specialty, location, and language
- Tracks network affiliations for insurance matching
- Includes contact and appointment booking information

#### 3. **appointments**

Central table tracking the healthcare journey timeline.

- Links patients to care providers
- Tracks appointment status (scheduled, completed, cancelled)
- Records appointment type (initial, follow-up, specialist)
- Stores administrative form completion status

#### 4. **conversations**

Captures all patient-physician dialogue during consultations.

- Stores original and translated text
- Links to specific appointments
- Includes speaker identification
- Supports searchable conversation history with metadata tags

#### 5. **prescriptions**

Post-visit medication recommendations.

- Links to appointments
- Tracks fulfillment status
- Stores pharmacy information
- Includes translated instructions

#### 6. **referrals**

Specialist care referrals that loop back to the care journey.

- Links referring and target providers
- Tracks referral status
- Stores reason and urgency

#### 7. **care_recommendations**

Non-medication post-visit guidance (lifestyle, exercise, diet, physiotherapy).

- Stores recommendation type and translated instructions
- Tracks compliance/completion
- Links to supporting documents

#### 8. **documents**

Stores metadata for all documents (forms, instruction sheets, conversation transcripts).

- Links to various entities (appointments, prescriptions, recommendations)
- Tracks document type and translation status
- Stores file paths or URLs for actual document storage

#### 9. **insurance_providers**

Insurance company information for network searches.

- Supports provider network matching
- Stores plan details

#### 10. **search_history**

Tracks user searches for care providers.

- Helps refine search algorithms
- Provides user journey insights

### Database Relationships

patients (1) ----< (M) appointments
care_providers (1) ----< (M) appointments
appointments (1) ----< (M) conversations
appointments (1) ----< (M) prescriptions
appointments (1) ----< (M) referrals
appointments (1) ----< (M) care_recommendations
appointments (1) ----< (M) documents
insurance_providers (1) ----< (M) patients
insurance_providers (1) ----< (M) care_providers (through network_affiliations)
patients (1) ----< (M) search_history

### Key Features

#### Multi-language Support

- All patient-facing content fields support translation
- Original and translated text stored separately
- Language codes follow ISO 639-1 standard

#### Timestamps

- All tables include `created_at` and `updated_at` timestamps
- Conversation entries include precise timestamps for dialog flow
- Appointment scheduling includes timezone support

#### Security Considerations

- Patient data requires HIPAA compliance measures
- Row Level Security (RLS) policies ensure patients only access their own data
- Healthcare providers only access their assigned patients
- Admin role for system management

#### Search & Retrieval

- Full-text search on conversations using metadata tags
- Indexed fields for provider search (specialty, location, language)
- Appointment history easily retrievable with related documents

### Data Volume Planning

- Initial capacity: 100 patients
- Expected data growth:
  - ~5-10 appointments per patient per year
  - ~20-50 conversation entries per appointment
  - ~2-3 documents per appointment
  - Estimated total: ~10,000-15,000 conversation records in first year

### Performance Optimization

- Indexes on foreign keys for join performance
- Composite index on patient_id + created_at for timeline queries
- GiN index on conversation metadata for tag searches
- Partial indexes on active appointments

---

## Complete SQL Schema

Copy everything below and paste it into your Supabase SQL Editor:

```sql
-- =====================================================
-- Speech2Text Healthcare Translation App
-- Supabase Database Schema
-- Version: 1.0
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE appointment_status AS ENUM (
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE appointment_type AS ENUM (
  'initial_consultation',
  'follow_up',
  'specialist_referral',
  'emergency',
  'routine_checkup'
);

CREATE TYPE document_type AS ENUM (
  'intake_form',
  'consent_form',
  'insurance_card',
  'prescription',
  'lab_result',
  'conversation_transcript',
  'instruction_sheet',
  'referral_letter',
  'other'
);

CREATE TYPE recommendation_type AS ENUM (
  'diet',
  'exercise',
  'physiotherapy',
  'lifestyle_change',
  'mental_health',
  'follow_up_care',
  'other'
);

CREATE TYPE referral_status AS ENUM (
  'pending',
  'sent',
  'acknowledged',
  'appointment_scheduled',
  'completed',
  'cancelled'
);

CREATE TYPE speaker_type AS ENUM (
  'patient',
  'physician',
  'nurse',
  'translator',
  'other_staff'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Insurance Providers
CREATE TABLE insurance_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  website_url TEXT,
  portal_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(50),
  primary_language VARCHAR(10) NOT NULL, -- ISO 639-1 code (e.g., 'es', 'zh', 'ar')
  secondary_languages TEXT[], -- Array of language codes
  phone VARCHAR(20),
  email VARCHAR(255),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  insurance_provider_id UUID REFERENCES insurance_providers(id),
  insurance_member_id VARCHAR(100),
  insurance_group_number VARCHAR(100),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(100),
  medical_history TEXT,
  allergies TEXT,
  current_medications TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care Providers (Physicians, Specialists, Clinics)
CREATE TABLE care_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  provider_type VARCHAR(100), -- 'physician', 'specialist', 'clinic', 'hospital'
  specialty VARCHAR(255),
  languages_spoken TEXT[], -- Array of language codes
  phone VARCHAR(20),
  email VARCHAR(255),
  website_url TEXT,
  booking_url TEXT,
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accepts_new_patients BOOLEAN DEFAULT true,
  average_wait_time_days INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Network Affiliations (Many-to-Many: Insurance <-> Care Providers)
CREATE TABLE network_affiliations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insurance_provider_id UUID REFERENCES insurance_providers(id) ON DELETE CASCADE,
  care_provider_id UUID REFERENCES care_providers(id) ON DELETE CASCADE,
  network_tier VARCHAR(50), -- 'in-network', 'out-of-network', 'preferred'
  effective_date DATE,
  termination_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(insurance_provider_id, care_provider_id)
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  care_provider_id UUID NOT NULL REFERENCES care_providers(id),
  appointment_type appointment_type NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  scheduled_datetime TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  chief_complaint TEXT, -- Main reason for visit
  chief_complaint_translated TEXT,
  appointment_notes TEXT,
  forms_completed BOOLEAN DEFAULT false,
  forms_completion_date TIMESTAMPTZ,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations (Patient-Physician Dialog)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  speaker speaker_type NOT NULL,
  speaker_name VARCHAR(255),
  original_text TEXT NOT NULL,
  original_language VARCHAR(10) NOT NULL,
  translated_text TEXT,
  target_language VARCHAR(10),
  sequence_number INTEGER NOT NULL, -- Order of dialog
  audio_file_url TEXT, -- Link to audio recording if applicable
  confidence_score DECIMAL(3, 2), -- Translation confidence (0.00-1.00)
  metadata JSONB, -- Flexible field for tags, keywords, medical terms
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prescriptions
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  duration VARCHAR(100),
  instructions TEXT,
  instructions_translated TEXT,
  prescribing_provider_name VARCHAR(255),
  pharmacy_name VARCHAR(255),
  pharmacy_phone VARCHAR(20),
  pharmacy_address TEXT,
  prescription_number VARCHAR(100),
  date_prescribed DATE DEFAULT CURRENT_DATE,
  date_filled DATE,
  refills_allowed INTEGER DEFAULT 0,
  refills_remaining INTEGER,
  status VARCHAR(50) DEFAULT 'prescribed', -- 'prescribed', 'sent_to_pharmacy', 'filled', 'cancelled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  referring_provider_id UUID REFERENCES care_providers(id),
  referred_to_provider_id UUID REFERENCES care_providers(id),
  specialty_needed VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  reason_translated TEXT,
  urgency VARCHAR(50), -- 'routine', 'urgent', 'emergency'
  status referral_status DEFAULT 'pending',
  referral_date DATE DEFAULT CURRENT_DATE,
  expiration_date DATE,
  authorization_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care Recommendations (Lifestyle, Exercise, Diet, etc.)
CREATE TABLE care_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  recommendation_type recommendation_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  description_translated TEXT,
  instructions TEXT,
  instructions_translated TEXT,
  duration_weeks INTEGER,
  frequency VARCHAR(100),
  target_goals TEXT,
  compliance_status VARCHAR(50), -- 'not_started', 'in_progress', 'completed', 'discontinued'
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents (Forms, Instruction Sheets, Transcripts)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES care_recommendations(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_name VARCHAR(255),
  file_path TEXT, -- Path in Supabase Storage
  file_url TEXT, -- Public or signed URL
  file_size_kb INTEGER,
  mime_type VARCHAR(100),
  original_language VARCHAR(10),
  is_translated BOOLEAN DEFAULT false,
  translated_file_url TEXT,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB, -- Tags, keywords, OCR data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search History
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  search_type VARCHAR(50), -- 'symptom', 'specialty', 'location', 'provider_name'
  filters JSONB, -- Location, insurance, language preferences
  results_count INTEGER,
  selected_provider_id UUID REFERENCES care_providers(id),
  search_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Patients
CREATE INDEX idx_patients_primary_language ON patients(primary_language);
CREATE INDEX idx_patients_insurance ON patients(insurance_provider_id);

-- Care Providers
CREATE INDEX idx_care_providers_specialty ON care_providers(specialty);
CREATE INDEX idx_care_providers_city ON care_providers(city);
CREATE INDEX idx_care_providers_languages ON care_providers USING GIN(languages_spoken);
CREATE INDEX idx_care_providers_location ON care_providers(latitude, longitude);

-- Appointments
CREATE INDEX idx_appointments_patient ON appointments(patient_id, scheduled_datetime DESC);
CREATE INDEX idx_appointments_provider ON appointments(care_provider_id, scheduled_datetime);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(scheduled_datetime);

-- Conversations
CREATE INDEX idx_conversations_appointment ON conversations(appointment_id, sequence_number);
CREATE INDEX idx_conversations_metadata ON conversations USING GIN(metadata);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp);

-- Prescriptions
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id, date_prescribed DESC);
CREATE INDEX idx_prescriptions_appointment ON prescriptions(appointment_id);

-- Referrals
CREATE INDEX idx_referrals_patient ON referrals(patient_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_referred_to ON referrals(referred_to_provider_id);

-- Care Recommendations
CREATE INDEX idx_recommendations_patient ON care_recommendations(patient_id);
CREATE INDEX idx_recommendations_appointment ON care_recommendations(appointment_id);
CREATE INDEX idx_recommendations_type ON care_recommendations(recommendation_type);

-- Documents
CREATE INDEX idx_documents_patient ON documents(patient_id, upload_date DESC);
CREATE INDEX idx_documents_appointment ON documents(appointment_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_metadata ON documents USING GIN(metadata);

-- Search History
CREATE INDEX idx_search_history_patient ON search_history(patient_id, search_timestamp DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Patients can only see their own data
CREATE POLICY patients_select_own ON patients
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY patients_update_own ON patients
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Appointments: patients see their own, providers see their patients
CREATE POLICY appointments_select_patient ON appointments
  FOR SELECT USING (auth.uid()::text = patient_id::text);

CREATE POLICY appointments_insert_patient ON appointments
  FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);

-- Conversations: linked to appointments
CREATE POLICY conversations_select ON conversations
  FOR SELECT USING (
    appointment_id IN (
      SELECT id FROM appointments WHERE patient_id::text = auth.uid()::text
    )
  );

-- Prescriptions: patients see their own
CREATE POLICY prescriptions_select_patient ON prescriptions
  FOR SELECT USING (auth.uid()::text = patient_id::text);

-- Referrals: patients see their own
CREATE POLICY referrals_select_patient ON referrals
  FOR SELECT USING (auth.uid()::text = patient_id::text);

-- Care Recommendations: patients see their own
CREATE POLICY recommendations_select_patient ON care_recommendations
  FOR SELECT USING (auth.uid()::text = patient_id::text);

-- Documents: patients see their own
CREATE POLICY documents_select_patient ON documents
  FOR SELECT USING (auth.uid()::text = patient_id::text);

-- Search History: patients see their own
CREATE POLICY search_history_select_patient ON search_history
  FOR SELECT USING (auth.uid()::text = patient_id::text);

CREATE POLICY search_history_insert_patient ON search_history
  FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_care_providers_updated_at BEFORE UPDATE ON care_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_providers_updated_at BEFORE UPDATE ON insurance_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_care_recommendations_updated_at BEFORE UPDATE ON care_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample insurance provider
INSERT INTO insurance_providers (name, contact_phone, website_url, portal_url)
VALUES 
  ('Blue Cross Blue Shield', '1-800-555-0100', 'https://www.bcbs.com', 'https://portal.bcbs.com'),
  ('United Healthcare', '1-800-555-0200', 'https://www.uhc.com', 'https://portal.uhc.com');

-- Insert sample care providers
INSERT INTO care_providers (name, provider_type, specialty, languages_spoken, phone, city, state, zip_code)
VALUES 
  ('Dr. Sarah Johnson', 'physician', 'Family Medicine', ARRAY['en', 'es'], '555-0101', 'Boston', 'MA', '02101'),
  ('Dr. Michael Chen', 'specialist', 'Cardiology', ARRAY['en', 'zh'], '555-0102', 'Boston', 'MA', '02102'),
  ('City Medical Clinic', 'clinic', 'Primary Care', ARRAY['en', 'es', 'fr'], '555-0103', 'Cambridge', 'MA', '02138');

-- Insert sample patient (password would be set through Supabase Auth separately)
INSERT INTO patients (first_name, last_name, date_of_birth, primary_language, phone, email, city, state, zip_code)
VALUES 
  ('Maria', 'Garcia', '1985-03-15', 'es', '555-1001', 'maria.garcia@email.com', 'Boston', 'MA', '02101');
