# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains Care Clarity — a bilingual Spanish/English medical translation PWA.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (not used in MVP)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS
- **Translation**: MyMemory API (free, no key required)
- **i18n**: i18next + react-i18next
- **Speech**: Web Speech API (browser native)
- **TTS**: SpeechSynthesis API (browser native)
- **Storage**: localStorage only

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server with /api/translate route
│   └── care-clarity/       # React Vite PWA (served at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Care Clarity App

### Navigation
5-tab bottom nav: Home · Search · Book · Translate · Settings

### Screens (14 — matching wireframe)
1. **Onboarding** — 3-screen English-first intro with mic permission and privacy notice
2. **Dashboard (/)** — Greeting, 4 action cards, "More Services" list, user profile card
3. **Provider Search (/search)** — Filter chips, voice input, 8 hardcoded providers with distance + in-network badges
4. **Booking Methods (/book)** — 3 booking options (Phone, Form, Email) + provider card
5. **Phone Booking (/book/call)** — Live call timer, bilingual panels (ES↔EN), call controls
6. **Form Booking (/book/form)** — Translated appointment form, English preview, submit
7. **Email Booking (/book/email)** — Spanish compose, live-translated English preview (debounced 800ms)
8. **Intake Forms (/intake)** — Digital intake (auto-filled), paper OCR capture button, HIPAA notice
9. **Camera/OCR (/intake/camera)** — Placeholder: photo capture + Spanish field overlay
10. **Live Consultation (/consultation)** — Recording consent gate, two-panel live translation (ES↔EN), TTS
11. **History (/history)** — Browse/delete saved sessions from localStorage
12. **Post-Visit Summary (/transcript/:id)** — Bilingual transcript as post-visit summary
13. **Pharmacy (/pharmacy)** — Label scan+translation, pharmacist dialog, medication reminders
14. **Referrals (/referrals)** — Active referrals with status chips, referral flow diagram
15. **Settings (/settings)** — User profile, language toggle, security, offline features

### Translation
- Backend: `POST /api/translate` — proxies to MyMemory API (free, no key needed)
- Frontend can also call MyMemory directly

### Environment Variables
- **None required** for MVP — MyMemory translation is keyless

### API Routes
- `GET /api/healthz` — health check
- `POST /api/translate` — `{ text, from: "es"|"en", to: "es"|"en" }` → `{ translatedText }`
