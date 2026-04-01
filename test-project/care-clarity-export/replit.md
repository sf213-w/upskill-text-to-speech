# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains Care Clarity, a bilingual medical translation PWA.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (provisioned but not used in MVP — localStorage only)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, wouter, i18next, zustand, framer-motion

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (translate route + health)
│   └── care-clarity/       # Care Clarity React PWA (preview at /)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Care Clarity — MVP Features

- **Bilingual UI**: English/Spanish toggle (i18next) stored in localStorage
- **Onboarding**: 3-screen flow (welcome, mic permission, privacy notice)
- **Consultation**: Two-panel real-time translator — patient (Spanish, es-MX) + provider (English, en-US)
  - Web Speech API for speech recognition
  - `/api/translate` backend route → MyMemory API (free, no key required)
  - SpeechSynthesis API for TTS ("Repetir" button)
- **History**: Session transcripts saved to localStorage, viewable and deletable
- **Providers**: Hardcoded list of 8–10 sample Spanish-speaking providers with call buttons
- **Settings**: Language toggle, large text mode, repeat onboarding, clear data

## API Routes

- `GET /api/healthz` — health check
- `POST /api/translate` — translates text via MyMemory API
  - Body: `{ text: string, from: "es"|"en", to: "es"|"en" }`
  - Returns: `{ translatedText: string }`

## localStorage Keys

- `careClarity_lang` — "en" | "es"
- `careClarity_onboardingDone` — "true"
- `careClarity_largeText` — "true" | "false"
- `careClarity_sessions` — array of session objects

## TypeScript & Composite Projects

Every lib extends `tsconfig.base.json` with `composite: true`. Artifacts are leaf packages.

- Run full typecheck: `pnpm run typecheck`
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`
- Dev API server: `pnpm --filter @workspace/api-server run dev`
- Dev frontend: `pnpm --filter @workspace/care-clarity run dev`
