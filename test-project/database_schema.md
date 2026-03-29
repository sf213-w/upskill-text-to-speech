# Care Clarity — Database Schema

> **Legend:** `PK` = Primary Key · `FK` = Foreign Key

---

## care_providers

Stores the directory of healthcare providers, including contact info, location, and availability.

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `uuid` | PK |
| `name` | `text` | |
| `provider_type` | `text` | e.g. physician, specialist |
| `specialty` | `text` | |
| `languages_spoken` | `text[]` | ISO language codes, e.g. `["en","es"]` |
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
| ------ | ---- | ----- |
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
| `insurance_provider_id` | `uuid` | FK |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

## appointments

Links a patient to a care provider for a scheduled visit.

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `care_provider_id` | `uuid` | FK → care_providers |
| `scheduled_datetime` | `timestamptz` | |
| `status` | `text` | e.g. scheduled, completed, cancelled |
| `appointment_type` | `text` | |
| `appointment_notes` | `text` | |
| `duration_minutes` | `integer` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

## prescriptions

Records medications prescribed to a patient.

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `medication_name` | `text` | |
| `dosage` | `text` | |
| `frequency` | `text` | |
| `instructions` | `text` | |
| `refills_remaining` | `integer` | |
| `status` | `text` | e.g. active, expired, cancelled |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

---

## referrals

Tracks when a patient is referred from one provider to another.

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → patients |
| `referring_provider_id` | `uuid` | FK → care_providers |
| `referred_to_provider_id` | `uuid` | FK → care_providers |
| `reason` | `text` | |
| `status` | `text` | e.g. pending, completed |
| `urgency` | `text` | e.g. routine, urgent |
| `notes` | `text` | |
| `created_at` | `timestamptz` | |

---

## conversations

Stores individual translated utterances linked to an appointment.

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `uuid` | PK |
| `appointment_id` | `uuid` | FK → appointments |
| `target_language` | `text` | ISO language code |
| `original_text` | `text` | |
| `translated_text` | `text` | |
| `speaker_name` | `text` | |
| `confidence_score` | `float8` | Translation confidence 0–1 |
| `created_at` | `timestamptz` | |

---

## sessions *(app-local)*

Stores full real-time translation sessions created by the Care Clarity app. Independent of the `conversations` table.

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `text` | PK |
| `exchanges` | `jsonb` | Array of `{ speaker, original, translated, timestamp }` |
| `created_at` | `timestamptz` | |

---

## Relationships

```bash
patients ──────────────────┬── appointments ── conversations
                            ├── prescriptions
                            └── referrals (as sender and receiver)

care_providers ─────────────┬── appointments
                             └── referrals (as referring and referred-to)
```
