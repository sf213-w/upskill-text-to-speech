
# Care Clarity MVP — Replit Prompt (MVP Focus)

## Author: Kim Nguyen

## What We're Building

"Care Clarity" is a bilingual (Spanish ↔ English) medical translation web app (PWA) that helps
Spanish-speaking patients communicate with English-speaking doctors in real time. This is a
prototype/demo MVP — focused on proving the core idea works, not on production compliance.

---

## Tech Stack (MVP Only)

- **Frontend**: React (Vite) + Tailwind CSS — mobile-first PWA
- **i18n**: i18next — full Spanish/English UI switching
- **Speech-to-Text**: Web Speech API (browser-native, free, no API key needed)
- **Translation**: MyMemory API (free, keyless — https://api.mymemory.translated.net/get)
- **Text-to-Speech**: Browser SpeechSynthesis API (free, built-in)
- **Storage**: localStorage only — no database, no user accounts
- **Backend**: Node.js + Express — single translation route only

## Environment Variables (Replit Secrets)

- NONE required for MVP
  (MyMemory translation is keyless — no setup needed)

---

## MVP Features (Build ONLY These)

### 1. English-First UI with Language Toggle

- App defaults to English
- Language toggle (EN | ES) visible on every screen — top right — switches entire UI instantly
- ALL strings wired through i18next (en.json / es.json) — no hardcoded UI text
- Large tap targets (min 48px), voice input as primary interaction

### 2. Simple Onboarding (3 Screens)

- Screen 1: Welcome in English — "Welcome to Care Clarity" + "Get Started" button
- Screen 2: Microphone permission request — explain why
- Screen 3: One-line privacy notice — "🔒 This app does not save audio recordings."
- Skip button available; re-accessible from Settings

### 3. Live Consultation Translator (THE Core Feature)

Two-panel screen — one side for patient, one for provider:

#### Patient Panel (Spanish)

- Big 🎙️ mic button — patient taps and speaks in Spanish
- Web Speech API transcribes speech (`lang: 'es-MX'`)
- Spanish transcription shown on screen
- MyMemory API translates to English
- English translation displayed clearly for provider to read

#### Provider Panel (English)

- 🎙️ mic button — provider speaks in English (`lang: 'en-US'`)
- English transcription shown
- MyMemory API translates to Spanish
- Spanish translation displayed for patient to read
- 🔊 "Repetir" button reads the Spanish aloud using SpeechSynthesis API

#### Both Panels

- Running bilingual transcript scrolls in real time
- "End Session / Terminar sesión" button at the bottom

### 4. Session Transcript (Saved Locally)

- After session ends: show full bilingual transcript (Spanish + English, side by side)
- Auto-named with date + time
- "Save / Guardar" → saves to localStorage
- "Share / Compartir" → uses Web Share API
- "History / Historial" tab shows all saved sessions
- Sessions deletable from History screen

### 5. Provider Search (Hardcoded Placeholder)

- Search bar: "What is your health concern? / ¿Cuál es tu preocupación de salud?"
- Accepts voice or text input
- Query a hardcoded `providers.json` file of 8–10 sample Spanish-speaking providers
- Display result cards: name, specialty, location, languages spoken
- "Call / Llamar" button (tel: link)
- "Book Appointment / Reservar cita" button (disabled placeholder — "Coming Soon / Próximamente")

---

## UI Design Rules

- Color palette: calming blues and greens, white background
- Font: Inter, 16px minimum, large-text toggle in Settings
- Bottom navigation — 4 tabs:
  - 🏠 Home / Inicio
  - 🎙️ Consultation / Consulta
  - 📋 History / Historial
  - ⚙️ Settings / Ajustes
- Privacy badge visible on Home: "🔒 No audio stored / Sin almacenamiento de audio"
- All text uses i18next — no hardcoded UI strings

---

## Backend (Minimal)

One Express route only:

- `POST /api/translate`

  - Body: `{ text: string, from: "es"|"en", to: "es"|"en" }`
  - Calls MyMemory API: `https://api.mymemory.translated.net/get?q=TEXT&langpair=FROM|TO`
  - Returns: `{ translatedText: string }`
  - No input/output logging

### Translation — Upgrade Path

- **MVP**: MyMemory API (free, no key required)
- **Pilot**: Upgrade to Azure AI Translator

---

## File Structure

```
/care-clarity
  /client (React Vite PWA)
    /src
      /components
        BottomNav.jsx
        LanguageToggle.jsx
        ConsultationScreen.jsx
        TranscriptViewer.jsx
        ProviderSearch.jsx
        OnboardingFlow.jsx
      /hooks
        useSpeechRecognition.js
        useTranslation.js
        useTranscript.js
      /utils
        translateText.js    ← POST /api/translate helper
        tts.js              ← SpeechSynthesis wrapper
        storage.js          ← localStorage helpers
      /data
        providers.json      ← hardcoded sample providers
      /i18n
        es.json             ← ALL Spanish UI strings
        en.json             ← ALL English UI strings
      App.jsx
      main.jsx
  /server
    index.js              ← Express app + /api/translate route
  package.json
``` bash

---

## Build Order
1. Vite + React PWA + Tailwind setup
2. i18next setup — wire `en.json` / `es.json` + language toggle (default: English)
3. Express server + `/api/translate` route (MyMemory API)
4. Consultation screen — Web Speech API (both panels) + translation + TTS
5. Transcript save/view (localStorage)
6. Bottom navigation + screen routing
7. Onboarding flow (3 screens)
8. Provider search (hardcoded JSON)
9. PWA manifest + service worker

---

## Do NOT Build in MVP (Save for Pilot)
- User login / authentication
- Supabase or any database
- Azure Speech SDK or Azure Translator
- Medical terminology glossary override
- Confidence scoring / fallback warnings
- AI post-visit summary (GPT-4o mini)
- HIPAA BAA compliance
- Prescription photo OCR
- EHR / Epic integration
- Mandarin support
