# Care Clarity — Database Schema Reference

> **Version:** 1.1.0 · **Updated:** 2026-03-30
>
> **Legend:** `PK` = Primary Key · `FK` = Foreign Key · `★` = Added in v1.1.0

---

## Table of Contents

1. [care\_providers](#care_providers)
2. [patients](#patients)
3. [patient\_profiles ★](#patient_profiles-)
4. [consent\_records ★](#consent_records-)
5. [appointments](#appointments)
6. [prescriptions](#prescriptions)
7. [referrals](#referrals)
8. [uploaded\_documents ★](#uploaded_documents-)
9. [lab\_results ★](#lab_results-)
10. [care\_plans ★](#care_plans-)
11. [messages ★](#messages-)
12. [caregivers ★](#caregivers-)
13. [conversations](#conversations)
14. [sessions](#sessions)
15. [Relationships](#relationships)

---

## care_providers

Stores the directory of healthcare providers including contact info, location, and availability.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `name` | `text` | |
| `provider_type` | `text` | e.g. physician, specialist |
| `specialty` | `text` | |
| `languages_spoken` | `text[]` | ISO 639-1 codes, e.g. `["en","es"]` |
| `phone` | `text` | |
| `email` | `text` | |
| `website_url` | `text` | |
| `booking_url` | `text` | |
| `address_line1` | `text` | |
| `address_line2` | `text` | |
| `city` | `text` | |
| `state` | `text` | |
| `zip_code` | `text` | |
| `country` | `text` | |
| `latitude` | `float8` | |
| `longitude` | `float8` | |
| `accepts_new_patients` | `boolean` | |
| `average_wait_time_days` | `integer` | |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

## patients

Stores patient demographic and contact information.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `first_name` | `text` | |
| `last_name` | `text` | |
| `date_of_birth` | `date` | |
| `gender` | `text` | |
| `phone` | `text` | |
| `email` | `text` | |
| `address_line1` | `text` | |
| `address_line2` | `text` | |
| `city` | `text` | |
| `state` | `text` | |
| `zip_code` | `text` | |
| `country` | `text` | |
| `insurance_provider_name` | `text` | ★ Replaces unresolved FK |
| `insurance_member_id` | `text` | ★ |
| `insurance_group_number` | `text` | ★ |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

> **Note:** `insurance_provider_id uuid FK` from v1.0 has been replaced with plain text fields. A dedicated `insurance_providers` table is deferred to a future release per the PRD out-of-scope rationale.

---

## patient_profiles ★

Extends `patients` with app-specific state: language preference, onboarding progress, identity verification, and privacy settings. One row per patient.

**PRD references:** §5.9, §5.91

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients (UNIQUE) |
| `preferred_language` | `text` | ISO 639-1 code. Default: `en` |
| `onboarding_status` | `text` | `pending` · `in_progress` · `complete` |
| `identity_verified` | `boolean` | Default: `false` |
| `privacy_level` | `text` | `standard` · `restricted` · `caregiver_shared` |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

---

## consent_records ★

Stores each signed consent form with timestamp and the language in which it was presented. Multiple rows per patient — one per consent type.

**PRD references:** §5.91

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `consent_type` | `text` | e.g. `hipaa` · `terms_of_service` · `data_sharing` · `ai_interpretation` |
| `language` | `text` | ISO 639-1 code — language form was presented in |
| `signed` | `boolean` | Default: `false` |
| `signed_at` | `timestamptz` | Null until signed |
| `created_at` | `timestamptz` | |

---

## appointments

Links a patient to a care provider for a scheduled visit.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `care_provider_id` | `uuid` | FK → care_providers |
| `scheduled_datetime` | `timestamptz` | |
| `status` | `text` | e.g. `scheduled` · `completed` · `cancelled` |
| `appointment_type` | `text` | |
| `appointment_notes` | `text` | |
| `duration_minutes` | `integer` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

## prescriptions

Records medications prescribed to a patient.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `medication_name` | `text` | |
| `dosage` | `text` | |
| `frequency` | `text` | |
| `instructions` | `text` | |
| `refills_remaining` | `integer` | |
| `status` | `text` | e.g. `active` · `expired` · `cancelled` |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

## referrals

Tracks when a patient is referred from one provider to another.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `referring_provider_id` | `uuid` | FK → care_providers |
| `referred_to_provider_id` | `uuid` | FK → care_providers |
| `reason` | `text` | |
| `status` | `text` | e.g. `pending` · `completed` |
| `urgency` | `text` | e.g. `routine` · `urgent` |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |

---

## uploaded_documents ★

Handles all document upload and translation flows: intake forms, post-visit prescriptions, referral notes, lifestyle instruction sheets, and pharmacy interactions. Stores both the extracted original text and its translation.

**PRD references:** §5.3, §5.6, §5.7, §5.8

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `appointment_id` | `uuid` | FK → appointments (nullable) |
| `document_type` | `text` | `intake_form` · `prescription` · `referral` · `lifestyle` · `pharmacy` |
| `storage_url` | `text` | On-device or temporary blob URL. No server-side persistence per PRD §6.4 |
| `source_language` | `text` | ISO 639-1 code. Default: `en` |
| `target_language` | `text` | Language translated into |
| `original_text` | `text` | Text extracted from document |
| `translated_text` | `text` | Translation output |
| `confidence_score` | `float8` | 0–1, from Azure Translator + LLM validation layer |
| `status` | `text` | `pending` · `processing` · `complete` · `failed` |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

---

## lab_results ★

Stores patient lab results. One of the five data categories displayed on the health dashboard.

**PRD references:** §5.92

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `ordering_provider_id` | `uuid` | FK → care_providers (nullable) |
| `test_name` | `text` | |
| `result_value` | `text` | Text type to accommodate ranges and qualitative results |
| `unit` | `text` | e.g. `mg/dL` · `mmol/L` |
| `reference_range` | `text` | e.g. `70–99 mg/dL` |
| `status` | `text` | `pending` · `final` · `corrected` · `cancelled` |
| `result_date` | `date` | |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

---

## care_plans ★

Provider-issued care plans assigned to a patient. One of the five data categories displayed on the health dashboard.

**PRD references:** §5.92

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `care_provider_id` | `uuid` | FK → care_providers (nullable) |
| `title` | `text` | |
| `description` | `text` | |
| `status` | `text` | `active` · `completed` · `cancelled` · `on_hold` |
| `start_date` | `date` | |
| `end_date` | `date` | |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

---

## messages ★

Bidirectional secure messaging between patients and providers. One of the five data categories displayed on the health dashboard. The `language` column feeds the translation layer so messages can be displayed in the patient's preferred language.

**PRD references:** §5.92

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `care_provider_id` | `uuid` | FK → care_providers (nullable) |
| `sender_type` | `text` | `patient` · `provider` |
| `subject` | `text` | |
| `body` | `text` | Message content in composed language |
| `language` | `text` | ISO 639-1 code — language body was composed in |
| `translated_body` | `text` | Translation of body if applicable |
| `read` | `boolean` | Default: `false` |
| `sent_at` | `timestamptz` | |
| `created_at` | `timestamptz` | |

---

## caregivers ★

Stores delegated access relationships. A patient can grant one or more caregivers access to their dashboard data. `revoked_at` being null indicates the grant is still active.

**PRD references:** §5.92

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `name` | `text` | |
| `email` | `text` | |
| `phone` | `text` | |
| `relationship` | `text` | e.g. `spouse` · `parent` · `child` · `friend` |
| `access_level` | `text` | `read` · `full` |
| `granted_at` | `timestamptz` | |
| `revoked_at` | `timestamptz` | Null = active grant |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | Auto-updated via trigger |

---

## conversations

Stores individual translated utterances linked to an appointment. Used by the live consultation interpreter feature.

**PRD references:** §5.4

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `appointment_id` | `uuid` | FK → appointments |
| `target_language` | `text` | ISO 639-1 code |
| `original_text` | `text` | |
| `translated_text` | `text` | |
| `speaker_name` | `text` | |
| `confidence_score` | `float8` | Translation confidence 0–1 |
| `created_at` | `timestamptz` | |

---

## sessions *(app-local)*

Stores full real-time translation sessions created by the Care Clarity app. Independent of the `conversations` table. Sessions are ephemeral by default and only persisted when the user opts in to save a transcript.

**PRD references:** §5.4, §5.5

| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` | PK |
| `exchanges` | `jsonb` | Array of `{ speaker, original, translated, timestamp }` |
| `created_at` | `timestamptz` | |

---

## Relationships

```
patients ─────────────────────┬── patient_profiles   (1:1)
                               ├── consent_records    (1:many)
                               ├── appointments ──────┬── conversations (1:many)
                               │                      └── uploaded_documents (1:many)
                               ├── prescriptions      (1:many)
                               ├── referrals          (1:many, as sender)
                               ├── uploaded_documents (1:many)
                               ├── lab_results        (1:many)
                               ├── care_plans         (1:many)
                               ├── messages           (1:many)
                               └── caregivers         (1:many)

care_providers ────────────────┬── appointments       (1:many)
                               ├── referrals          (1:many, as referring and referred-to)
                               ├── lab_results        (1:many, as ordering provider)
                               ├── care_plans         (1:many)
                               └── messages           (1:many)
```

---

## Enum Reference

| Table | Column | Allowed Values |
|-------|--------|----------------|
| `patient_profiles` | `onboarding_status` | `pending` · `in_progress` · `complete` |
| `patient_profiles` | `privacy_level` | `standard` · `restricted` · `caregiver_shared` |
| `uploaded_documents` | `document_type` | `intake_form` · `prescription` · `referral` · `lifestyle` · `pharmacy` |
| `uploaded_documents` | `status` | `pending` · `processing` · `complete` · `failed` |
| `lab_results` | `status` | `pending` · `final` · `corrected` · `cancelled` |
| `care_plans` | `status` | `active` · `completed` · `cancelled` · `on_hold` |
| `messages` | `sender_type` | `patient` · `provider` |
| `caregivers` | `access_level` | `read` · `full` |
| `appointments` | `status` | `scheduled` · `completed` · `cancelled` |
| `prescriptions` | `status` | `active` · `expired` · `cancelled` |
| `referrals` | `status` | `pending` · `completed` |
| `referrals` | `urgency` | `routine` · `urgent` |

---

## Design Notes

**Language fields** — all `preferred_language`, `language`, `source_language`, and `target_language` columns store ISO 639-1 two-character codes (`en`, `es`, `zh`, `hi`). The supported set for the POC is English, Spanish, Mandarin Chinese, and Hindi.

**Privacy and storage** — per PRD §6.4, no session content is retained server-side after a session ends unless the user explicitly saves a transcript. `storage_url` in `uploaded_documents` points to on-device or temporary blob storage, not a persistent server path.

**Insurance** — `insurance_provider_id` from v1.0 has been replaced with plain text fields (`insurance_provider_name`, `insurance_member_id`, `insurance_group_number`) on the `patients` table. A normalized `insurance_providers` table is deferred to a future release.

**`updated_at` triggers** — all tables with an `updated_at` column use a shared `set_updated_at()` PostgreSQL trigger function to keep timestamps current automatically.

**Caregiver access** — `revoked_at` on the `caregivers` table uses a soft-delete pattern. A null value means the grant is active; a populated timestamp means access has been revoked without destroying the audit record.
