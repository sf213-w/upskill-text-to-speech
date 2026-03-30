-- ============================================================
-- Care Clarity — Database Migration
-- Version: 1.1.0
-- Date: 2026-03-30
-- Description: Adds tables required by PRD v1.0 for onboarding,
--              health dashboard, document handling, and caregiver access.
-- ============================================================


-- ------------------------------------------------------------
-- 1. patient_profiles
-- Extends patients with app-specific state: language preference,
-- onboarding status, identity verification, and privacy level.
-- Required by PRD §5.9 and §5.91.
-- ------------------------------------------------------------

CREATE TABLE patient_profiles (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id           uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  preferred_language   text NOT NULL DEFAULT 'en',       -- ISO 639-1 code e.g. 'es', 'zh', 'hi'
  onboarding_status    text NOT NULL DEFAULT 'pending'   -- pending | in_progress | complete
                         CHECK (onboarding_status IN ('pending', 'in_progress', 'complete')),
  identity_verified    boolean NOT NULL DEFAULT false,
  privacy_level        text NOT NULL DEFAULT 'standard'  -- standard | restricted | caregiver_shared
                         CHECK (privacy_level IN ('standard', 'restricted', 'caregiver_shared')),
  notes                text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (patient_id)  -- one profile per patient
);

CREATE INDEX idx_patient_profiles_patient_id ON patient_profiles(patient_id);


-- ------------------------------------------------------------
-- 2. consent_records
-- Stores each signed consent form with timestamp and language.
-- Required by PRD §5.91.
-- ------------------------------------------------------------

CREATE TABLE consent_records (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  consent_type  text NOT NULL,   -- e.g. 'hipaa', 'terms_of_service', 'data_sharing', 'ai_interpretation'
  language      text NOT NULL,   -- ISO 639-1 code — language form was presented in
  signed        boolean NOT NULL DEFAULT false,
  signed_at     timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_consent_records_patient_id ON consent_records(patient_id);
CREATE INDEX idx_consent_records_type       ON consent_records(consent_type);


-- ------------------------------------------------------------
-- 3. uploaded_documents
-- Handles intake forms, prescriptions, referral notes, and
-- lifestyle instruction sheets. Stores original + translated text.
-- Required by PRD §5.3, §5.6, §5.8.
-- ------------------------------------------------------------

CREATE TABLE uploaded_documents (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id   uuid REFERENCES appointments(id) ON DELETE SET NULL,
  document_type    text NOT NULL   -- intake_form | prescription | referral | lifestyle | pharmacy
                     CHECK (document_type IN ('intake_form', 'prescription', 'referral', 'lifestyle', 'pharmacy')),
  storage_url      text,           -- on-device or temporary blob URL; no server-side persistence per §6.4
  source_language  text NOT NULL DEFAULT 'en',
  target_language  text,           -- language it was translated into
  original_text    text,           -- extracted text from document
  translated_text  text,           -- translated output
  confidence_score float8,         -- 0–1, from Azure Translator + LLM validation
  status           text NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'processing', 'complete', 'failed')),
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_uploaded_documents_patient_id     ON uploaded_documents(patient_id);
CREATE INDEX idx_uploaded_documents_appointment_id ON uploaded_documents(appointment_id);
CREATE INDEX idx_uploaded_documents_type           ON uploaded_documents(document_type);


-- ------------------------------------------------------------
-- 4. lab_results
-- One of the five dashboard data categories in PRD §5.92.
-- ------------------------------------------------------------

CREATE TABLE lab_results (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  test_name        text NOT NULL,
  result_value     text,           -- stored as text to accommodate ranges, qualitative results, etc.
  unit             text,           -- e.g. 'mg/dL', 'mmol/L'
  reference_range  text,           -- e.g. '70–99 mg/dL'
  status           text NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'final', 'corrected', 'cancelled')),
  result_date      date,
  ordering_provider_id uuid REFERENCES care_providers(id) ON DELETE SET NULL,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lab_results_patient_id ON lab_results(patient_id);
CREATE INDEX idx_lab_results_date       ON lab_results(result_date DESC);


-- ------------------------------------------------------------
-- 5. care_plans
-- One of the five dashboard data categories in PRD §5.92.
-- Links patient to authoring provider with start/end dates.
-- ------------------------------------------------------------

CREATE TABLE care_plans (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  care_provider_id  uuid REFERENCES care_providers(id) ON DELETE SET NULL,
  title             text NOT NULL,
  description       text,
  status            text NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'completed', 'cancelled', 'on_hold')),
  start_date        date,
  end_date          date,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_care_plans_patient_id ON care_plans(patient_id);
CREATE INDEX idx_care_plans_status     ON care_plans(status);


-- ------------------------------------------------------------
-- 6. messages
-- Bidirectional secure messaging between patient and provider.
-- One of the five dashboard data categories in PRD §5.92.
-- ------------------------------------------------------------

CREATE TABLE messages (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  care_provider_id  uuid REFERENCES care_providers(id) ON DELETE SET NULL,
  sender_type       text NOT NULL
                      CHECK (sender_type IN ('patient', 'provider')),
  subject           text,
  body              text NOT NULL,
  language          text NOT NULL DEFAULT 'en',   -- language the body was composed in
  translated_body   text,                          -- translation of body if applicable
  read              boolean NOT NULL DEFAULT false,
  sent_at           timestamptz NOT NULL DEFAULT now(),
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_patient_id  ON messages(patient_id);
CREATE INDEX idx_messages_provider_id ON messages(care_provider_id);
CREATE INDEX idx_messages_sent_at     ON messages(sent_at DESC);


-- ------------------------------------------------------------
-- 7. caregivers
-- Stores delegated access relationships. A patient can grant
-- one or more caregivers access to their dashboard data.
-- Required by PRD §5.92.
-- ------------------------------------------------------------

CREATE TABLE caregivers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name          text NOT NULL,
  email         text,
  phone         text,
  relationship  text,             -- e.g. 'spouse', 'parent', 'child', 'friend'
  access_level  text NOT NULL DEFAULT 'read'
                  CHECK (access_level IN ('read', 'full')),
  granted_at    timestamptz NOT NULL DEFAULT now(),
  revoked_at    timestamptz,      -- null = still active
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_caregivers_patient_id ON caregivers(patient_id);


-- ------------------------------------------------------------
-- 8. Patches to existing tables
-- ------------------------------------------------------------

-- patients: replace the unresolved insurance_provider_id FK with
-- plain text fields until an insurance_providers table is built.
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS insurance_provider_name text,
  ADD COLUMN IF NOT EXISTS insurance_member_id     text,
  ADD COLUMN IF NOT EXISTS insurance_group_number  text;

-- care_providers: surface the insurance_provider_id FK that was
-- referenced in patients but never defined.
-- (Dropping the FK constraint only — column stays for future use.)
ALTER TABLE patients
  DROP CONSTRAINT IF EXISTS patients_insurance_provider_id_fkey;


-- ------------------------------------------------------------
-- 9. Updated_at triggers (applies to all new tables that have it)
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patient_profiles_updated_at
  BEFORE UPDATE ON patient_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_uploaded_documents_updated_at
  BEFORE UPDATE ON uploaded_documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lab_results_updated_at
  BEFORE UPDATE ON lab_results
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_care_plans_updated_at
  BEFORE UPDATE ON care_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_caregivers_updated_at
  BEFORE UPDATE ON caregivers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
