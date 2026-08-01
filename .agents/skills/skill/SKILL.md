# skill.md — AI Mock Interview Platform

> **Source of truth for this file:** the project `README.md` only. No `backend/src`, `frontend/src`, or config files were available at generation time. Every claim below is tagged `[VERIFIED]` (stated directly in README) or `[PLANNED]` (described as target/future state, not yet built). **Do not treat `[PLANNED]` items as existing code.** This file must be regenerated once real source files are readable — see "Regeneration Instructions" at the end.

---

## 1. PROJECT SUMMARY

AI Mock Interview Platform is a `[PLANNED]` production-grade SaaS application for technical, coding, HR, behavioral, and system-design interview preparation, designed to behave like a live interviewer rather than a static Q&A bank.

- **Problem solved (planned):** realistic, adaptive interview practice with AI-driven follow-ups, resume/JD-aware questioning, coding rounds, voice practice, and detailed post-interview reports.
- **Target users (planned):** students, fresh graduates, career switchers, experienced engineers.
- **Current stage `[VERIFIED]`:** product-definition stage. Docs, architecture, API spec, DB design, UI system, feature catalog, and backlog are all "Defined." Monorepo hygiene and backend scaffold (T-001, T-002) are "Completed." Frontend is only architecture-skeleton scaffolded. Database has **two models implemented**: `User` and `RefreshToken`. Test suite: not started. Deployment: not started.
- **Architecture style (planned):** modular MERN — React frontend, Express backend, MongoDB Atlas, isolated AI-provider layer, Socket.io for live interview flow.
- **Frontend stack (planned):** React + Vite, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Recharts, Monaco Editor, Axios, Socket.io Client.
- **Backend stack `[VERIFIED for scaffold / PLANNED for rest]`:** Node.js, Express.js, MongoDB Atlas + Mongoose, JWT + refresh tokens, bcrypt, Multer, Cloudinary, Socket.io, Zod/Express Validator, Pino, Helmet, CORS, express-rate-limit, dotenv.
- **Database (planned):** MongoDB Atlas via Mongoose. Only `User` and `RefreshToken` collections exist today.
- **Auth (planned):** JWT access + refresh tokens, bcrypt password hashing.
- **Deployment (planned):** Vercel (frontend), Render/Railway/Fly.io/AWS (backend), MongoDB Atlas (DB), Cloudinary (files). Nothing deployed yet.
- **State management (planned):** Zustand (client/UI state) + TanStack Query (server state).
- **API style `[VERIFIED]`:** REST, versioned under `/api/v1`, standard success/error JSON envelope (see §8). Currently only `/api/v1/health` and `/api/v1/ping` are runnable.

---

## 2. HIGH-LEVEL ARCHITECTURE (PLANNED)

```
Browser
  React + Tailwind UI
      |
      | HTTPS / WebSocket
      v
Express API
  Auth, validation, business services, sockets
      |
      +--> AI Services: Gemini (primary), Groq, OpenRouter (fallback)
      +--> Coding Service: Judge0 CE (sandboxed code execution)
      +--> File Service: Cloudinary
      |
      v
MongoDB Atlas
```

**Data flow rule `[VERIFIED — architectural rule, not yet enforced by real code]`:**
- Frontend: `pages -> features -> components -> hooks -> services -> API`
- Backend: `routes -> controllers -> services -> models -> database`
- Controllers must stay thin; all business logic lives in services.
- AI providers are abstracted behind a dedicated AI service layer — never called directly from controllers.
- Prompts live in backend `prompts/` modules, never inline in controllers.

**Current runnable reality `[VERIFIED]`:** only the Express app + `/api/v1/health` + `/api/v1/ping` endpoints and two Mongoose models exist. No frontend, no AI integration, no sockets, no coding sandbox, no file upload are running yet.

---

## 3. DIRECTORY MAP

### Planned target structure `[PLANNED]`
```
.
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/common/
│       ├── features/{auth,dashboard,interview,coding,report,history,analytics}/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/api/
│       ├── context/
│       ├── store/
│       ├── utils/
│       ├── constants/
│       └── styles/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── models/
│       ├── services/{ai,coding,resume,jd,report,voice}/
│       ├── socket/
│       ├── validators/
│       ├── prompts/
│       ├── utils/
│       ├── database/
│       └── logs/
├── README.md
├── PRD.md
├── ARCHITECTURE.md
├── API.md
├── DATABASE.md
├── UI.md
├── TECH_STACK.md
├── RULES.md
├── TASKS.md
├── CHANGELOG.md
└── FEATURES1.md … FEATURES4.md
```

### What actually exists today `[VERIFIED]`
- `backend/` — has a package.json-driven scaffold (`npm run check:models` is a real, runnable command).
- `backend/src/models/` (inferred location per planned structure, **not confirmed by direct file read**) — contains `User` and `RefreshToken` model implementations.
- Runnable Express app exposing `/api/v1/health` and `/api/v1/ping`.
- `frontend/` — architecture skeleton only (folders scaffolded per §6 of ARCHITECTURE.md), **no working app**, no `npm run dev` target confirmed working yet.
- Root-level documentation files referenced by README: `PRD.md`, `ARCHITECTURE.md`, `API.md`, `DATABASE.md`, `UI.md`, `TECH_STACK.md`, `RULES.md`, `TASKS.md`, `CHANGELOG.md`, `FEATURES1.md`–`FEATURES4.md`, `AGENTS.md`, `claude.md` — **existence stated in README but content not read into this skill.md.** An agent needing details from these must open them directly; this file cannot summarize content it hasn't seen.

**⚠️ Agent action required:** Before writing any backend code, open `backend/src/models/User.js` (or `.ts`) and `RefreshToken.js` directly — this is the only real implementation surface right now.

---

## 4. FEATURE MAP

All features below are `[PLANNED]` per the README's "Planned Features" table — **none are implemented** except the auth data models (User, RefreshToken) which back the future auth feature. Full list, verbatim status = Planned:

| Feature | Notes |
|---|---|
| Auth (register/login/logout/JWT/refresh/protected routes) | Only DB models exist; no controllers/routes/services yet |
| User profile, settings, avatar upload | Not started |
| Landing site + authenticated app shell | Not started |
| Dashboard (stats, weak topics, quick actions) | Not started |
| Interview setup wizard | Not started |
| Resume upload/parsing/skill extraction | Not started |
| JD upload/parsing/resume matching | Not started |
| AI interview engine (adaptive, memory, follow-ups) | Not started |
| Technical/HR/behavioral/mixed/system-design interviews | Not started |
| Company-style modes (Google, Amazon, Microsoft, Meta, Adobe, Uber, Atlassian, etc.) | Not started |
| Coding platform (Monaco + Judge0 CE) | Not started |
| AI code review / optimization hints | Not started |
| Voice interview (STT/TTS, filler analysis) | Not started |
| Webcam / interview-environment guidance | Not started |
| Anti-cheating / integrity tracking | Not started |
| AI evaluation engine (scoring) | Not started |
| Final reports (strengths/weaknesses/roadmap) | Not started |
| History, archive, retake flow | Not started |
| Progress dashboard / analytics | Not started |
| Learning recommendations / roadmaps | Not started |
| Gamification (XP, badges, leaderboard) | Not started |
| Notifications / reminders | Not started |
| Admin portal | Not started |

Do not invent files, endpoints, or components for any of these until they appear in real source. Consult `TASKS.md` for the authoritative build order (milestone-based backlog); this skill.md does not replace it.

---

## 5. REQUEST FLOW (PLANNED PATTERN — only `/health` and `/ping` are real today)

```
User Click
   |
Frontend (React) — [PLANNED, not built]
   |
Client-side validation (Zod / RHF) — [PLANNED]
   |
Axios → /api/v1/<resource> — [only /health, /ping exist]
   |
Express route → controller (thin) — [PLANNED for business routes]
   |
Service (business logic) — [PLANNED]
   |
Mongoose model → MongoDB Atlas — [only User, RefreshToken exist]
   |
Standard response envelope (§8) → JSON
   |
React state update via TanStack Query / Zustand — [PLANNED]
```

---

## 6. COMPONENT MAP

No frontend components exist yet `[VERIFIED]`. Do not fabricate a component list. When frontend work begins, this section must be populated from real files under `frontend/src/components/` and `frontend/src/features/*/components/`.

---

## 7. CUSTOM HOOKS

None exist yet `[VERIFIED]`. Populate from `frontend/src/hooks/` once real hook files exist.

---

## 8. API DOCUMENTATION

### Confirmed runnable endpoints `[VERIFIED]`
| Method | URL | Body | Response | Notes |
|---|---|---|---|---|
| GET | `/api/v1/health` | — | envelope (see below) | Liveness check |
| GET | `/api/v1/ping` | — | envelope (see below) | Basic reachability check |

Base URL (local, planned): `http://localhost:5000/api/v1`

### Standard response envelope `[VERIFIED — architectural rule]`
Success:
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```
Error:
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Email is required." }
  ],
  "requestId": "req_123456789"
}
```
**Rule for agents:** every new endpoint must return this exact envelope shape. Do not deviate.

### Planned endpoint groups `[PLANNED — not implemented]`
`/auth`, `/users`, `/resumes`, `/job-descriptions`, `/interviews`, `/ai`, `/coding`, `/voice`, `/reports`, `/dashboard`, `/analytics`, `/learning`, `/notifications`, `/achievements`, `/settings`, `/companies`, `/admin`.

Full request/response contracts for these are defined in `API.md`, not in this file — open `API.md` directly for exact payload shapes before implementing any of them.

---

## 9. DATABASE

### Implemented `[VERIFIED]`
- `User` — Mongoose model, exists in codebase.
- `RefreshToken` — Mongoose model, exists in codebase.
- Exact field lists, indexes, and validation rules were **not visible in the README** and must be read directly from the model source files before modification.

### Planned collections `[PLANNED]`
Profiles, Resumes, JobDescriptions, InterviewSessions, InterviewQuestions, InterviewAnswers, CodingQuestions, CodingSubmissions, Reports, Notifications, Achievements, Progress, LearningRoadmaps, SavedResources, Certificates, Settings, InterviewTemplates, PromptVersions, Analytics, AuditLogs.

### Future/post-MVP collections `[PLANNED, M13]`
Organizations, Recruiters, Subscriptions, Payments, Invoices, Leaderboards, VideoRecordings, AvatarModels, AIConversationMemory, PlacementDrives.

### General DB conventions `[VERIFIED — architectural rule]`
Use timestamps, indexes on searchable fields, pagination for large collections, soft deletes where appropriate. Full schema/relationship/index detail lives in `DATABASE.md` — read it directly, do not infer schemas from this file.

---

## 10. STATE MANAGEMENT (PLANNED)

- **Zustand** — client/UI state.
- **TanStack Query** — server state, caching, refetching.
- No Redux, no Context-based global state planned.
- No implementation exists yet; nothing to summarize from real code.

---

## 11. CODING PATTERNS / CONVENTIONS `[VERIFIED — stated engineering rules]`

- Modern JS, `const` only, never `var`.
- `async/await` preferred over `.then()` chains.
- Files kept under ~300 lines where practical.
- Controllers thin; services hold logic.
- No business logic inside React components.
- No direct AI-provider calls from controllers — always go through the AI service layer.
- Prompts live in backend prompt modules only.
- Tailwind + design tokens, no inline styles.
- All UI states required: loading, empty, error, success.
- Accessibility required: responsive layout, dark mode, keyboard access, focus states, screen reader support.
- Passwords hashed with bcrypt; refresh tokens stored securely.
- Rate-limit public/expensive endpoints.
- Sanitize inputs; never leak stack traces to clients.
- Never execute user-submitted code locally — always route through Judge0 CE.

---

## 12. DEPENDENCY GRAPH

Not derivable — no real source tree was available. Once `backend/src` and `frontend/src` exist with real imports, populate this section from actual `import`/`require` statements, not from the planned folder structure.

---

## 13. KNOWN LIMITATIONS `[VERIFIED from README status table]`

- No test suite exists (Vitest/Jest/Supertest/Playwright/RTL are chosen but unused).
- No deployment pipeline exists.
- No frontend app is runnable (`npm run dev` for frontend not confirmed working).
- Only 2 of ~20+ planned DB models exist.
- No AI provider integration exists yet (Gemini/Groq/OpenRouter are chosen, not wired up).
- No CI/CD confirmed running (GitHub Actions is planned, not verified active).
- `.env.example` files are called out as "add during scaffold milestone" — may not exist yet; check before assuming env var names are final.

---

## 14. HOW TO ADD A NEW FEATURE `[VERIFIED — process rule from README]`

1. Check `TASKS.md` for the current milestone; do not jump ahead of unfinished dependencies.
2. Read `ARCHITECTURE.md`, `API.md`, `DATABASE.md`, `UI.md`, `RULES.md` sections relevant to the feature before writing code.
3. Backend: add route → controller (thin) → service (logic) → model, following `routes -> controllers -> services -> models -> database`.
4. Frontend: add under the matching `features/<name>/` folder, following `pages -> features -> components -> hooks -> services -> API`.
5. Use the standard response envelope (§8) for every new endpoint.
6. Add tests for the new logic (no test infra confirmed yet — set it up if missing rather than skipping).
7. Update `CHANGELOG.md`.
8. Commit using the conventional prefixes in §17.

---

## 15. HOW TO MODIFY EXISTING FEATURES

Currently only two things are safe to touch with confidence:
- `User` and `RefreshToken` Mongoose models (`backend/src/models/`, unverified exact path — locate via directory listing first).
- The Express scaffold serving `/api/v1/health` and `/api/v1/ping`.

**Do not modify:** anything under the planned `frontend/`, AI service layer, coding/Judge0 integration, or any collection beyond `User`/`RefreshToken` — none of it exists yet, so "modifying" it means creating it from scratch against `ARCHITECTURE.md`/`API.md`/`DATABASE.md`, not patching existing code.

---

## 16. COMMON PITFALLS FOR AGENTS

- **Do not assume the frontend runs.** `npm run dev` in `frontend/` is not confirmed working — check `frontend/package.json` first.
- **Do not assume any endpoint beyond `/health` and `/ping` exists.** The `API.md` groups (`/auth`, `/users`, etc.) are specs, not code.
- **Do not assume AI provider keys are wired up.** `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` are declared as required env vars but no service code calling them is confirmed to exist.
- **Never expose `VITE_`-prefixed env vars for secrets** — anything prefixed `VITE_` ships to the browser bundle.
- **Never execute untrusted code directly** — always route through Judge0 CE once that integration exists; don't build a local `eval`/`child_process` shortcut.
- **Validate with `npm run check:models`** in `backend/` before assuming a model change is syntactically correct — this is the only confirmed local validation command today.

---

## 17. PROJECT RULES `[VERIFIED]`

- Never duplicate logic; reuse services/components/hooks once they exist.
- Keep architecture consistent with `ARCHITECTURE.md`.
- Maintain naming conventions once established by real code (none to infer yet beyond model names `User`, `RefreshToken`).
- Never commit secrets, `.env`, `node_modules`, logs, `dist`, `build`, `coverage`.
- Commit prefixes: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:`, `revert:`.
- Definition of Done: correct, responsive, handles loading/empty/error/success states, accessible, secure, reusable, documented, tested, performant enough for scope, follows architecture, updates docs + changelog.

---

## 18. AI QUICK START — "READ THIS FIRST"

- This is a **planning-stage MERN SaaS project**. Almost nothing described in the README is running code yet.
- **What's real right now:** an Express backend with `/api/v1/health` and `/api/v1/ping`, plus two Mongoose models (`User`, `RefreshToken`) validated via `cd backend && npm run check:models`.
- **What's not real yet:** the entire frontend, all AI integration, coding sandbox, voice, resume/JD parsing, reports, gamification, admin portal, tests, CI/CD, deployment.
- **Before writing code:** open the actual `backend/` directory tree (`ls`/`view`) — don't trust the "Planned Folder Structure" in §3 as literal fact for `backend/src/*` subfolders; only `models/` (containing `User`, `RefreshToken`) is confirmed to have real files.
- **Governing docs to consult per task**, in this order: `TASKS.md` (what to build next) → `ARCHITECTURE.md` → `API.md` / `DATABASE.md` / `UI.md` as relevant to the task → `RULES.md` for engineering standards.
- **Golden rules:** thin controllers, logic in services, prompts never in controllers, always use the standard response envelope, never call AI providers or execute user code directly, JWT + bcrypt for auth, versioned `/api/v1` routes.
- **Stack commitments (even though unbuilt):** React+Vite+Tailwind+shadcn/Zustand/TanStack Query frontend; Express+Mongoose+MongoDB Atlas backend; Gemini primary AI with Groq/OpenRouter fallback; Judge0 CE for code execution; Cloudinary for files; Socket.io for live interview events.

---

## 19. FILE INDEX

| File | Purpose | Dependencies | Importance | Status |
|---|---|---|---|---|
| `README.md` | Project overview, stack, roadmap, standards | — | High | Verified present |
| `backend/` (Express app) | Serves `/api/v1/health`, `/api/v1/ping` | Node.js, Express | High | Verified running |
| `backend/src/models/User.*` (path inferred) | User schema | Mongoose | High | Verified exists, fields unknown — inspect directly |
| `backend/src/models/RefreshToken.*` (path inferred) | Refresh token schema | Mongoose | High | Verified exists, fields unknown — inspect directly |
| `PRD.md` | Product requirements | — | High | Referenced, not read into this file |
| `ARCHITECTURE.md` | System architecture detail | — | High | Referenced, not read into this file |
| `API.md` | Full REST/WebSocket spec | — | High | Referenced, not read into this file |
| `DATABASE.md` | Schema/index/relationship detail | — | High | Referenced, not read into this file |
| `UI.md` | Design system, UX rules | — | Medium | Referenced, not read into this file |
| `TECH_STACK.md` | Stack rationale | — | Low | Referenced, not read into this file |
| `RULES.md` | Engineering standards | — | High | Referenced, not read into this file |
| `TASKS.md` | Milestone backlog | — | High | Referenced, not read into this file |
| `FEATURES1.md`–`FEATURES4.md` | Feature catalog detail | — | Medium | Referenced, not read into this file |
| `CHANGELOG.md` | Release history | — | Low | Referenced, not read into this file |
| `AGENTS.md`, `claude.md` | AI-agent guidance | — | High | Referenced, not read into this file — **check these too, they may overlap/override this skill.md** |
| `frontend/` | Architecture skeleton only | Vite, React (planned) | Low (currently) | Verified skeleton, no working app |

**Note:** rows marked "Referenced, not read into this file" mean the README mentions the file's existence and purpose, but its actual contents were never provided to generate this skill.md. Open them directly for authoritative detail.

---

## 20. CHEAT SHEET

**Confirmed working commands**
```bash
cd backend
npm run check:models      # only confirmed working local command today
```

**Planned commands (not confirmed working)**
```bash
npm install
cd frontend && npm install && npm run dev   # → http://localhost:5173
cd backend && npm install && npm run dev    # → http://localhost:5000/api/v1
npm run lint
npm run format
npm test
npm run build
```

**Confirmed endpoints**
- `GET /api/v1/health`
- `GET /api/v1/ping`

**Real DB models**
- `User`, `RefreshToken`

**Key env vars (names only — verify against real `.env.example` before use)**
```
PORT, NODE_ENV, CLIENT_URL, MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET,
GEMINI_API_KEY, OPENROUTER_API_KEY, GROQ_API_KEY,
CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, JUDGE0_URL
VITE_API_URL   (frontend, public)
```

**AI providers (planned order):** Gemini (primary) → Groq / OpenRouter (fallback).

**Governing docs, in read-order:** `TASKS.md` → `ARCHITECTURE.md` → `API.md`/`DATABASE.md`/`UI.md` → `RULES.md`.

---

## Regeneration Instructions

This `skill.md` was generated from **README.md text only** — no actual source files were read. It is a *scaffold*, not a finished agent knowledge base. To make it fully trustworthy:

1. Drop this file at the **repo root** as `skill.md`.
2. Point your coding agent (Claude Code, Cursor, etc.) at the real `backend/src/` tree and ask it to:
   - Confirm/replace every `[PLANNED]`-tagged item once real code lands.
   - Fill in §3 (Directory Map), §6 (Components), §7 (Hooks), §9 (exact schemas), §12 (Dependency Graph) from actual files, not inference.
   - Read `ARCHITECTURE.md`, `API.md`, `DATABASE.md`, `UI.md`, `RULES.md`, `TASKS.md`, `AGENTS.md`, `claude.md` directly and merge relevant specifics in — this version only references them by name.
3. Re-run regeneration after each milestone (M0–M13 per README) rather than only once at the end — the value of this file comes from staying in sync with real code, not from being exhaustive on day one.
4. Keep the `[VERIFIED]` / `[PLANNED]` tagging convention (or replace it with "Implemented" / "Planned" status per section) so future agents never confuse aspiration for fact.