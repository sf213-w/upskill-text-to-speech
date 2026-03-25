# Care Clarity — Full Product Prompt (3-23-2026)
## Author: Kim Nguyen

## What We're Building
"Care Clarity" is a bilingual (Spanish ↔ English) medical translation web app (PWA) that helps
Spanish-speaking patients communicate with English-speaking doctors. This is a prototype/demo —
focused on proving the full product vision works end-to-end.

---

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS — mobile-first PWA (max-w-md, iPhone frame)
- **i18n**: i18next + react-i18next — full Spanish/English UI switching, default English
- **Speech-to-Text**: Web Speech API (browser-native, free, no API key)
- **Translation**: MyMemory API (free, keyless — https://api.mymemory.translated.net/get)
- **Text-to-Speech**: SpeechSynthesis API (browser-native)
- **Storage**: localStorage only — `careclarity_sessions` key
- **Backend**: Node.js + Express — single `/api/translate` route
- **Routing**: Wouter
- **Animation**: Framer Motion (page transitions)

## Environment Variables
- NONE required — MyMemory translation is keyless

---

## Navigation
5-tab bottom nav (active state: primary color + dot indicator):

| Tab | Route |
|---|---|
| 🏠 Home | `/` |
| 🔍 Search | `/search` |
| 📅 Book | `/book` |
| 🎤 Translate | `/consultation` |
| ⚙️ Settings | `/settings` |

- EN \| ES language toggle pill in top-right of every screen except `/consultation` (which uses `hideNav=true`)
- Active tab highlight: `location.startsWith(tab.href)` — so `/book/call` keeps Book tab active

---

## Screens (14 Total)

### 1. Onboarding (`/` — shown first visit only)
- Checks `hasCompletedOnboarding()` from localStorage on Home mount
- 3-screen flow with dot indicators:
  - **Screen 1**: Logo (stethoscope icon), "Welcome to Care Clarity", bilingual tagline, "Get Started →" button
  - **Screen 2**: Microphone permission — explain why it's needed
  - **Screen 3**: Privacy notice — "🔒 This app does not save audio recordings."
- Skip button on each screen
- `setOnboardingCompleted()` saved to localStorage on complete

---

### 2. Dashboard (`/`)
- Greeting: `t('home.greeting')` ("Hello, Maria" / "Hola, Maria")
- Subtitle: `t('home.greeting_sub')` ("What do you need today?" / "¿Qué necesita hoy?")
- Privacy badge: 🔒 "No audio stored / Sin almacenamiento de audio"
- 2×2 action card grid (each card: icon circle + title + desc):
  - 🔍 Find Provider → `/search` (blue)
  - 📅 Book Appointment → `/book` (purple)
  - 📄 Intake Forms → `/intake` (orange)
  - 🎤 Live Translation → `/consultation` (primary/teal)
- "More Services" list (full-width rows):
  - 📋 Post-Visit → `/history`
  - 💊 Pharmacy → `/pharmacy`
  - 🔄 Referrals → `/referrals`
- User profile card at bottom: avatar circle, "Maria Gonzalez", "Patient • Español"

---

### 3. Provider Search (`/search`)
- Header: "Find a Provider" with heart-pulse icon
- Search input + 🎤 voice button (`useSpeechRecognition`, `lang: es-MX`)
- Filter chips row: "Idioma: Español ✓" · "10 mi" · "En red ✓" · "Todas" (visual toggle only)
- 8 hardcoded providers:
  - Dra. Ana López — Medicina General — Centro Médico Salud — 2.3 mi — En red ✓
  - Dr. Carlos Mendoza — Cardiología — Hospital Corazón — 3.1 mi — En red ✓
  - Dra. Ana Silva — Pediatría — Clínica Infantil — 4.5 mi
  - Dr. Luis García — Ginecología — Salud Mujer — 5.2 mi
  - Dra. Isabel Torres — Medicina Familiar — Centro Familiar — 5.8 mi
  - Dr. Carlos Ruiz — Medicina Interna — Hospital General — 4.1 mi
  - Dra. Elena Rodríguez — Neurología — Centro Neurológico — 6.3 mi
  - Dr. Miguel Vargas — Ortopedia — Clínica Huesos — 7.1 mi
- Each card: name, specialty (colored), location, distance badge, language tags, "En red ✓" badge (some)
- Buttons: 📞 Call (tel: link) · 📅 Book (→ `/book`, disabled with "Coming Soon" tooltip)

---

### 4. Booking Methods (`/book`)
- Selected provider card: avatar, "Dra. Ana López · Medicina General · 2.3 mi · En red ✓"
- "Select a booking method" label
- 3 full-width option cards:
  - 📞 Phone Call → `/book/call` (blue) — "Real-time speech translation"
  - 📄 Online Form → `/book/form` (green) — "Translated form fields"
  - ✉️ Email → `/book/email` (orange) — "Auto-translated message"
- Cosmetic checkbox: "Add Spanish reminder to phone calendar"

---

### 5. Phone Booking (`/book/call`)
- Header: "Call to: Dra. Ana López" + live timer (counts up, `useEffect` + `setInterval`)
- 2×2 bilingual panel grid:
  - Top-left: ESPAÑOL (You) — patient's Spanish transcription
  - Top-right: ENGLISH (Office) — translated output
  - Bottom-left: ENGLISH (Office) — office response
  - Bottom-right: ESPAÑOL (Translated) — translated for patient
- "End Call" (destructive red) + "Mute" (outline) buttons
- "Transcript saved on device ✓" · "Latency: <2s · Bidirectional ES↔EN"
- "Continue to Intake Forms →" → `/intake`

---

### 6. Form Booking (`/book/form`)
- Header with back button → `/book`
- Translated form (all labels in Spanish):
  - Nombre completo (pre-filled: "Maria Gonzalez")
  - Fecha de nacimiento (pre-filled: "03/15/1981")
  - Número de seguro (pre-filled: "INS-4829-XXXX")
  - Motivo de la visita (editable)
  - Fecha preferida (editable)
- "Preview (English — sent to office)" box below
- "Enviar / Submit →" button → success toast + navigate back to `/book`
- "← Back" button

---

### 7. Email Booking (`/book/email`)
- "YOUR MESSAGE (Spanish)" — textarea (patient types in Spanish)
- "TRANSLATED (English — sent)" — live translation via `translate()`, debounced 800ms,
  shows `Languages` spinner while translating
- "Send Email →" button (disabled if empty) → success toast + navigate to `/book`
- Header with back button

---

### 8. Intake Forms (`/intake`)
- **Digital Intake Form** section:
  - Nombre completo — pre-filled "Maria Gonzalez" + "Auto ✓" badge
  - Fecha de nacimiento — pre-filled + "Auto ✓" badge
  - Alergias — editable "Enter / Ingresar..."
  - Medicamentos actuales — editable "Enter / Ingresar..."
- **Paper Form Translation** section:
  - "📷 Capture Paper Form" button → `/intake/camera`
- **HIPAA Notice** section:
  - Scrollable Spanish privacy text
  - Checkbox: "He leído y acepto"
- "Continue to Consultation →" → `/consultation`

---

### 9. Camera / OCR (`/intake/camera`)
- "Camera — Paper Form" header
- Grey placeholder image (160px height)
- Spanish overlay of translated form fields:
  - Nombre del paciente / Fecha de nacimiento / Alergias conocidas / Medicamentos / Cirugías previas
- "Processing: <5 seconds" note
- "Continue →" + "← Back" buttons

---

### 10. Live Consultation (`/consultation`) — `hideNav=true`
- **Recording Consent gate** (shown once per session, local state):
  - "Does the doctor consent to this session being transcribed for translation purposes?"
  - "Doctor Consents ✓" (primary) → dismisses gate, shows translator
  - "Declines" (outline) → navigates to `/`
- **Two-panel live translator** (after consent):
  - Patient panel (top): Spanish mic button (`lang: es-MX`), transcription, translated EN output, 🔊 TTS button
  - Provider panel (bottom): English mic button (`lang: en-US`), transcription, translated ES output
- Running bilingual transcript scroll (auto-scrolls)
- "End Session / Terminar sesión" → saves session to localStorage, navigates to `/transcript/:id`
- One speaker active at a time (mutual exclusion)
- Interim transcription shown while listening

---

### 11. History (`/history`)
- "Consultation History" header
- List of saved sessions from `getSessions()` (localStorage)
- Each item: session title (date + time), message count, "View" → `/transcript/:id`, "Delete" button
- Empty state: "No saved sessions yet."

---

### 12. Post-Visit Summary (`/transcript/:id`)
- Pulled from `getSession(id)` — localStorage
- Header: "Post-Visit Summary / Resumen de Visita" + date
- Full bilingual transcript — each message: speaker label, original text, translated text
- "Save / Guardar" button (if not already saved)
- "Share / Compartir" — Web Share API
- "← Back to Home" button
- "Go to Pharmacy →" → `/pharmacy`
- "View Referrals →" → `/referrals`

---

### 13. Pharmacy (`/pharmacy`)
- **Prescription Label Translation** card:
  - Left: stylized prescription label placeholder + "📷 Scan Label" button
  - Right: "TRANSLATED LABEL" — Sumatriptán 50mg, instructions, ⚠️ warning in red
- **Pharmacist Dialog** card:
  - Example: EN "Take this with food..." → ES translation shown
  - "🎤 Start Dialog Translation" → `/consultation`
- **Medication Reminders** card:
  - 🔔 Sumatriptán — Al inicio de dolor de cabeza
  - 💊 Ibuprofeno 400mg — Cada 8 horas (8:00, 16:00, 00:00)
- "Continue to Referrals →" → `/referrals`

---

### 14. Referrals (`/referrals`)
- **Active Referrals** section:
  - Dr. Fernández · Neurología · Referido por Dra. López — "Pending booking" badge (amber)
    - Buttons: "Search & Book" → `/search`, "📎 Share History", "Intake Forms" → `/intake`
  - Óptica Centro · Examen de vista · Referido por Dra. López — "Booked — 29 Abril" badge (green)
- **Referral Flow** diagram:
  - Post-Visit → Referral Saved → Search → Book → Intake → Consult (chips with chevrons)

---

### 15. Settings (`/settings`)
- **User Profile** section:
  - Avatar circle, editable fields: Nombre, Fecha de nacimiento, ID de seguro, Teléfono
- **Language** section:
  - EN \| ES toggle (updates entire app via `i18n.changeLanguage`)
  - "Auto-detected from device" note
- **Security & Privacy** section:
  - Biometric Lock toggle (cosmetic)
  - Data Encryption: "Active ✓"
  - Offline Mode toggle (cosmetic)
  - Offline Features list:
    - ✓ Transcripts & documents
    - ✓ Medication reminders
    - ✓ Saved translations
    - ✗ Live translation (requires connection)
    - ✗ Provider search (requires connection)
- Version + Privacy Policy link

---

## Backend (Minimal)
Single Express route:
- `POST /api/translate`
  - Body: `{ text: string, from: "es"|"en", to: "es"|"en" }`
  - Calls: `https://api.mymemory.translated.net/get?q=TEXT&langpair=FROM|TO`
  - Returns: `{ translatedText: string }`

---

## Key Files
```
artifacts/care-clarity/src/
  App.tsx                           ← all routes
  components/
    layout.tsx                      ← 5-tab nav, EN|ES toggle, framer-motion transitions
    onboarding.tsx                  ← 3-screen onboarding flow
  pages/
    home.tsx                        ← dashboard             /
    providers.tsx                   ← provider search       /search
    booking.tsx                     ← booking methods       /book
    booking-call.tsx                ← phone booking         /book/call
    booking-form.tsx                ← form booking          /book/form
    booking-email.tsx               ← email booking         /book/email
    intake.tsx                      ← intake forms          /intake
    intake-camera.tsx               ← camera / OCR          /intake/camera
    consultation.tsx                ← live consultation     /consultation (hideNav)
    transcript.tsx                  ← post-visit summary    /transcript/:id
    history.tsx                     ← history               /history
    pharmacy.tsx                    ← pharmacy              /pharmacy
    referrals.tsx                   ← referrals             /referrals
    settings.tsx                    ← settings              /settings
  lib/
    translate.ts                    ← calls POST /api/translate
    storage.ts                      ← localStorage helpers (sessions + onboarding)
  hooks/
    use-speech.ts                   ← useSpeechRecognition + useTTS
  i18n/index.ts                     ← all strings (en + es), default: "en"

artifacts/api-server/src/routes/translate.ts  ← MyMemory proxy
```

---

## i18n Keys (both `en` + `es` required)

```
nav.home / search / book / translate / settings
home.greeting / greeting_sub / more_services / action_* / action_*_desc
booking.title / select_method / provider_label / method_* / *_desc / calendar_reminder
intake.title / digital_form / paper_form / capture_btn / hipaa_title / hipaa_accept / continue_btn
pharmacy.title / scan_label / dialog_title / dialog_btn / reminders_title / continue_btn
referrals.title / active_title / flow_title / search_book / share_history / intake_forms
settings.profile_title / security_title / biometric / encryption / offline_mode / offline_features
consultation.consent_title / consent_desc / consent_yes / consent_no / privacy_badge /
  patient_title / provider_title / tap_to_speak / listening / processing / end_session / read_aloud
transcript.title / save / share / saved_success / back
history.title / empty / delete / view
providers.title / search_placeholder / call / book / coming_soon
onboarding.step1_* / step2_* / step3_* / btn_start / btn_understand / btn_skip
common.cancel / confirm / error / back
```

---

## Design Rules
- Color palette: calming blues, greens, teal primary — no harsh colors
- Cards: `rounded-3xl`, `shadow-sm`, `hover:shadow-md`
- Font: Inter, 16px minimum
- Mobile-first: `max-w-md mx-auto` container
- Large tap targets (min 48px)
- All text through i18next — zero hardcoded UI strings (provider names/data excepted)
- Bottom nav active: primary color + dot indicator below icon

---

## Do NOT Build (Save for Pilot)
- User login / authentication
- Real database (Supabase or otherwise)
- Azure Speech SDK or Azure Translator
- Medical terminology glossary or confidence scoring
- AI post-visit summary (GPT-4o)
- HIPAA BAA compliance
- Prescription photo OCR (real implementation)
- EHR / Epic integration
- Mandarin or other language support
- RevenueCat / payments
