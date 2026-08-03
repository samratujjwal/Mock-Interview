# TASKS.md

# AI Mock Interview Platform — Development Backlog

**Version:** 1.0
**Status:** Planning Baseline
**Derived from:** PRD.md · ARCHITECTURE.md · DATABASE.md · API.md · UI.md · RULES.md · TECH_STACK.md · FEATURES1–4.md · CHANGELOG.md · CLAUDE.md

---

## 1. How To Read This Document

This backlog decomposes the entire platform into **Milestones → Epics → Tasks**.

Tasks are ordered so that dependencies come first. A task should generally not be started until every task in its **Depends on** list is complete.

### Legend

| Field | Meaning |
| --- | --- |
| **ID** | Stable task identifier (`T-###`). Never reused. |
| **Scope** | `MVP` (required for Version 1.0 per PRD §33) or `Future` (Post-MVP per PRD §34/§35). |
| **Priority** | `P0`–`P3`, aligned with the FEATURES catalog. |
| **Complexity** | Relative engineering effort. See scale below. |
| **Depends on** | Task IDs that must be done first. |

### Complexity Scale

| Size | Rough Effort | Meaning |
| --- | --- | --- |
| **S** | ≤ 1 dev-day | Isolated, well-understood, few files. |
| **M** | 1–3 dev-days | One feature slice, some integration. |
| **L** | 3–5 dev-days | Multi-layer feature, external integration, non-trivial state. |
| **XL** | 1–2 dev-weeks | Large subsystem; consider splitting further before starting. |

### Definition of Done (applies to every task)

Per RULES.md §100, a task is **not complete** until it is: production-ready, responsive, secure, accessible, reusable, documented, tested, performant, maintainable, and consistent with the architecture. Backend tasks additionally require input validation on body/query/params/headers/files (Rule 9) and the standard response envelope (Rule 13). Frontend tasks require loading/empty/error/success states (Rule 15), dark mode (Rule 17), and keyboard accessibility (Rule 18). Every change updates CHANGELOG.md (Changelog Rules).

---

## 2. Milestone Overview

| # | Milestone | Scope | Theme | Key Dependencies |
| --- | --- | --- | --- | --- |
| M0 | Foundation & Tooling | MVP | Repos, scaffolds, design system, cross-cutting middleware | — |
| M1 | Authentication & Identity | MVP | Signup/login/JWT, profile, settings | M0 |
| M2 | App Shell, Landing & Dashboard | MVP | Layout, routing, landing site, dashboard | M1 |
| M3 | Resume & JD Intelligence | MVP | Uploads, parsing, extraction, matching | M1, AI layer |
| M4 | AI Interview Engine | MVP | Setup wizard, session lifecycle, adaptive Q&A, follow-ups, live socket | M3 |
| M5 | Coding Interview Platform | MVP | Monaco, Judge0, run/submit, AI review | M4 |
| M6 | Voice Interview | MVP | STT, TTS, voice loop, voice UI | M4 |
| M7 | Evaluation & Reports | MVP | Answer/interview evaluation, report, history | M4, M5 |
| M8 | Progress, Analytics & Learning | MVP | Progress model, charts, roadmap | M7 |
| M9 | Gamification, Notifications & Settings | Partial MVP | XP, streaks, badges, notifications | M8 |
| M10 | Webcam & Interview Environment | Partial MVP | Camera/mic checks, face presence, integrity events | M4 |
| M11 | Admin Portal | Future-leaning | User/prompt/report/analytics management | M7 |
| M12 | Hardening & Release | MVP | Security, performance, a11y, testing, deploy | All |
| M13 | Post-MVP Roadmap | Future | Avatars, recruiter, subscriptions, i18n | Release of 1.0 |

**Critical path (MVP):** M0 → M1 → M3 (incl. AI provider layer) → M4 → {M5, M6, M7} → M8 → M12 → 1.0.0.

---

# Milestone M0 — Foundation & Tooling

Goal: A running, lint-clean monorepo with the architecture skeleton, design system, and cross-cutting concerns in place, so every later feature drops into a consistent structure.

## Epic M0.E1 — Repository & Workspace Setup

### T-001 · Initialize monorepo & repository hygiene
- **Scope:** MVP · **Priority:** P0 · **Complexity:** S · **Depends on:** —
- Create repo with `frontend/` and `backend/` workspaces, root README, LICENSE, and a `.gitignore` covering `node_modules`, `.env`, `logs`, `dist`, `coverage` (Rule 95).
- **Acceptance Criteria:**
  - `git clone` yields a documented folder layout matching ARCHITECTURE §6–7.
  - `.env` and other secrets are git-ignored and verified not tracked.
  - Root README explains how to run frontend and backend.

### T-002 · Backend scaffold (Express + folder architecture)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-001
- Scaffold Express app with the ARCHITECTURE §7 tree: `config/ controllers/ routes/ middleware/ models/ services/{ai,coding,resume,jd,report,voice} socket/ validators/ prompts/ utils/ database/ logs/`.
- **Acceptance Criteria:**
  - Server boots on `PORT` from env and serves `GET /api/v1/health` and `/api/v1/ping`.
  - Empty layer folders exist with an index barrel or README describing responsibility.
  - No business logic in controllers placeholder (Rule 5).

### T-003 · Frontend scaffold (Vite + React + Tailwind + shadcn/ui)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-001
- Scaffold Vite React app with the ARCHITECTURE §6 tree: `assets/ components/common/ features/ hooks/ layouts/ pages/ services/api/ context/ store/ utils/ constants/ styles/`. Install Tailwind, shadcn/ui, Lucide, Framer Motion.
- **Acceptance Criteria:**
  - `npm run dev` renders a placeholder home route.
  - Tailwind + shadcn configured; a sample shadcn Button renders.
  - Folder structure matches the architecture doc exactly.

### T-004 · Tooling: ESLint, Prettier, Husky, lint-staged
- **Scope:** MVP · **Priority:** P0 · **Complexity:** S · **Depends on:** T-002, T-003
- Configure ESLint + Prettier for both workspaces; Husky pre-commit runs lint-staged.
- **Acceptance Criteria:**
  - Commit is blocked when lint fails.
  - `npm run lint` and `npm run format` succeed in both workspaces.
  - Shared rules enforce no `var`, prefer `const`, arrow functions (Code Style).

### T-005 · Environment variable management & documentation
- **Scope:** MVP · **Priority:** P0 · **Complexity:** S · **Depends on:** T-002, T-003
- Add `dotenv`, `.env.example` for both apps documenting every variable (Rule 83): backend (`PORT, MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY, CLOUDINARY_*, JUDGE0_URL`), frontend (`VITE_API_URL`, etc.). A config loader validates required vars on boot.
- **Acceptance Criteria:**
  - App fails fast with a clear message if a required env var is missing.
  - No secret is ever exposed to the frontend bundle (only `VITE_` prefixed values).
  - `.env.example` lists all variables with descriptions.

## Epic M0.E2 — Cross-Cutting Backend Concerns

### T-006 · Standard response envelope & error middleware
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-002
- Implement `{ success, message, data, meta }` success helper and `{ success, message, errors[], requestId }` error format (API §5, §29). Global error middleware never leaks stack traces (Rules 14, 69).
- **Acceptance Criteria:**
  - All responses use the shared helpers; a thrown `AppError` maps to correct HTTP status (API §25).
  - Internal errors return a friendly message while full detail is logged.
  - Each request carries a `requestId` surfaced in error responses.

### T-007 · Structured logging (Pino) with log separation
- **Scope:** MVP · **Priority:** P0 · **Complexity:** S · **Depends on:** T-002
- Integrate Pino with Info/Warning/Error/Audit separation (Rule 91). Redact passwords, tokens, PII (Rule 90).
- **Acceptance Criteria:**
  - Request logs include method, path, status, latency, requestId.
  - Sensitive fields are never logged (verified by test).
  - Log level configurable via env.

### T-008 · Security middleware baseline (Helmet, CORS, rate limit, sanitize)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-006
- Add Helmet (Rule 84), CORS whitelist (Rule 85), `express-rate-limit` scaffolding (Rule 86), and input sanitization against NoSQL injection/XSS (Rules 87–88).
- **Acceptance Criteria:**
  - Requests from non-whitelisted origins are rejected.
  - Security headers present on all responses.
  - A reusable rate-limiter factory exists for per-route limits (API §30).

### T-009 · MongoDB Atlas connection & Mongoose base conventions
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-002, T-005
- Connect to Atlas with pooling; define a base schema convention enabling `timestamps` (Rule 50), soft-delete plugin (`isDeleted/deletedAt/deletedBy`, DB §30), and `lean()`/pagination helpers (Rules 54–55).
- **Acceptance Criteria:**
  - App connects to Atlas and handles disconnect/reconnect gracefully.
  - A reusable pagination utility returns `meta {page,limit,total,pages}` (API §26).
  - Soft-delete plugin excludes deleted docs from default queries.

### T-010 · Validation framework & request validator middleware
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-006
- Wire Zod (or express-validator) as a `validate(schema)` middleware covering body/query/params/headers/files (Rule 9). Validation errors return the standard `errors[]` shape.
- **Acceptance Criteria:**
  - A sample validated route returns 422 with field-level errors on bad input.
  - Validators live in `validators/` and are reusable.
  - Never trusts client data (Rule 89).

## Epic M0.E3 — Cross-Cutting Frontend Concerns

### T-011 · Design tokens & theme system (light/dark/system)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-003
- Encode UI.md color palette, typography (Inter), 8-pt spacing, radius, and shadow tokens into Tailwind config. Implement instant theme switch with persistence, no refresh (UI §5).
- **Acceptance Criteria:**
  - Toggling theme updates the whole app instantly and persists across reloads.
  - All tokens (colors/spacing/radius/typography) come from config, none hardcoded (Rule 35, 81).
  - `prefers-color-scheme` respected for "system".

### T-012 · Core reusable component library (shadcn-based)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-011
- Build the UI §47 shared components: Button, Input, Card, Modal, Drawer, Tabs, Accordion, Tooltip, Popover, Avatar, Badge, Chip, Progress, Skeleton, Spinner, Table, Dropdown, Breadcrumb, Pagination, Toast. Each with all interaction states (UI §16, Rule 60) and a11y.
- **Acceptance Criteria:**
  - Every component supports hover/focus/disabled/loading where relevant and dark mode.
  - Components are documented with usage examples (Storybook or MDX/README).
  - No file exceeds 300 lines (Rule 21); no duplication (Rule 3).

### T-013 · API client, interceptors & TanStack Query provider
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-003, T-006
- Configure Axios instance in `services/api` with base URL, auth header injection, refresh-on-401 interceptor, and request cancellation. Wrap app in TanStack Query provider. All API calls live in the service layer (Rule 34).
- **Acceptance Criteria:**
  - A sample query hook fetches `/health` and caches it.
  - 401 triggers a single refresh attempt then ret/logout.
  - No component calls Axios directly.

### T-014 · Global state stores (Zustand) & state boundaries
- **Scope:** MVP · **Priority:** P0 · **Complexity:** S · **Depends on:** T-013
- Create Zustand stores for User, Theme, UI, Interview Session (Architecture §24). Enforce: no server data in Zustand (Rule 33).
- **Acceptance Criteria:**
  - Stores are typed, minimal, and free of server-cache data.
  - Theme store integrates with T-011.
  - Devtools middleware available in dev only.

### T-015 · Global UX primitives: loading/empty/error/toast/error-boundary
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-012
- Implement reusable Skeleton screens, EmptyState (illustration+message+CTA, UI §23), ErrorState with retry (UI §25), toast system (UI §22), and a React error boundary. Never show blank screens (Rule 63).
- **Acceptance Criteria:**
  - A page can declare loading/empty/error states with one shared component each.
  - Toasts support success/error/warning/info with auto-dismiss + manual close.
  - Error boundary catches render errors and offers recovery.

## Epic M0.E4 — CI/CD Skeleton

### T-016 · GitHub Actions pipeline (install → lint → test → build)
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-004
- Pipeline runs install, lint, tests, build for both workspaces on PR (TECH_STACK §21).
- **Acceptance Criteria:**
  - PRs are blocked on lint/test/build failure.
  - Pipeline caches dependencies for speed.
  - Status checks visible on the PR.

---

# Milestone M1 — Authentication & Identity

Goal: Secure account lifecycle (signup/login/logout/refresh), protected routing, profile, and settings — the foundation every other feature depends on.

## Epic M1.E1 — Data Models

### T-017 · User & RefreshToken models
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-009
- **Status:** Completed
- Implement `User` (DB §6) and `RefreshToken` (DB §26) schemas with indexes (email unique, provider, role) and soft-delete on User. Password never returned in queries by default (DB §31).
- **Acceptance Criteria:**
  - `email` unique index enforced; password field has `select:false`.
  - `refreshTokenVersion` supports token invalidation.
  - Timestamps present on both.
- **Implementation Notes:**
  - Added `backend/src/models/User.js`, `backend/src/models/RefreshToken.js`, and `backend/src/models/index.js`.
  - Added shared auth constants in `backend/src/constants/auth.constants.js`.
  - Added a reusable soft-delete plugin in `backend/src/models/plugins/softDeletePlugin.js` and applied it to `User`.
  - Added `backend/package.json` with a focused `npm run check:models` syntax validation script.
  - T-009 remains pending; model syntax is validated without requiring a live MongoDB connection.

### T-018 · Profile & Settings models
- **Scope:** MVP · **Priority:** P0 · **Complexity:** S · **Depends on:** T-017
- Implement `Profile` (DB §7) and `Settings` (DB §21) with 1–1 relation to User.
- **Acceptance Criteria:**
  - Defaults created on user registration (theme=system, notifications on).
  - `userId` indexed on both.
  - Validation for enum fields (experienceLevel, theme).

## Epic M1.E2 — Auth Services & Endpoints

### T-019 · Password hashing & JWT service
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-017
- bcrypt hashing (Rule 11); JWT access + refresh token service with refresh stored as HTTP-only cookie (API §4, TECH_STACK Auth). Refresh token rotation + version check.
- **Acceptance Criteria:**
  - Passwords are hashed, never stored/logged in plaintext.
  - Access token short-lived; refresh long-lived and rotated on use.
  - Compromised/old refresh tokens are rejected via version.

### T-020 · Signup / Login / Logout / Refresh endpoints
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-019, T-010, T-018
- Implement `POST /auth/signup`, `/auth/login`, `/auth/logout`, `/auth/refresh` (API §6) with validation, rate limit 5/min on auth (API §30), and standard envelope.
- **Acceptance Criteria:**
  - Duplicate email returns 409; invalid credentials return 401 with generic message.
  - Signup provisions Profile + Settings + Progress rows.
  - Logout invalidates refresh token (bumps version).

### T-021 · Auth middleware & role-based authorization
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-019
- `requireAuth` verifies JWT on every protected endpoint (Rule 10); `requireRole` for admin routes (Architecture §27).
- **Acceptance Criteria:**
  - Missing/invalid token returns 401; wrong role returns 403.
  - Middleware attaches sanitized user to request.
  - Applied to all protected routes by default.

### T-022 · Change password, forgot & reset password
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-020
- `PUT /auth/change-password`, `POST /auth/forgot-password`, `POST /auth/reset-password` (API §6). Email delivery may be stubbed initially (FEATURES 1.4 marks email integration Future).
- **Acceptance Criteria:**
  - Reset tokens are single-use and time-limited.
  - Changing password invalidates existing refresh tokens.
  - Forgot-password does not reveal whether an email exists.

### T-023 · Email verification (scaffold)
- **Scope:** Future · **Priority:** P2 · **Complexity:** M · **Depends on:** T-020
- `POST /auth/verify-email` and `emailVerified` handling (Architecture §22 marks Future).
- **Acceptance Criteria:**
  - Verification token flow implemented; email send behind a provider interface.
  - Unverified state does not block MVP login (configurable).

## Epic M1.E3 — Frontend Auth

### T-024 · Auth pages (signup/login/forgot/reset)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-012, T-013, T-020
- Build forms with React Hook Form + Zod, password strength meter, real-time validation, submit disabled while loading (Rule 37), input preserved on failure (UI §19).
- **Acceptance Criteria:**
  - Client validation mirrors server rules; server errors render inline.
  - Fully responsive, dark-mode, keyboard-accessible.
  - Password strength meter reflects policy.

### T-025 · Auth store, session restore & protected routes
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-024, T-014, T-021
- Zustand auth state, auto-login via refresh on app load, auto-logout on session timeout, and route guards for Dashboard/Interview/Reports/History/Settings (FEATURES 1.5–1.6).
- **Acceptance Criteria:**
  - Refreshing the browser keeps the user logged in when refresh token valid.
  - Unauthenticated access to protected routes redirects to login.
  - Expiry triggers graceful logout with a toast.

## Epic M1.E4 — Profile & Settings

### T-026 · Profile endpoints & page
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-021, T-018, T-024
- `GET /users/me`, `PUT /users/profile`, `DELETE /users/account` (API §7) + Profile page (UI §34): avatar, skills, preferred role, counts.
- **Acceptance Criteria:**
  - Profile edits validated and persisted; delete does soft-delete (DB §30).
  - Page shows loading/empty/error states.
  - Account deletion requires confirmation modal (Rule 64).

### T-027 · Avatar upload
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-026, T-034 (upload service)
- `POST /users/avatar` (multipart) storing to Cloudinary; validate PNG/JPG/JPEG + max size (FEATURES 2.2, Rule 38).
- **Acceptance Criteria:**
  - MIME + extension + size validated server-side.
  - Old avatar replaced; only metadata/URL stored in Mongo (Rule 39).
  - Preview updates immediately after upload.

### T-028 · Settings endpoints & page
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-021, T-018
- `GET/PUT /settings` (API §19) + Settings page (UI §35): theme, audio, camera, privacy (audio recording, camera usage, transcript storage), account management.
- **Acceptance Criteria:**
  - Settings persist and drive runtime behavior (e.g., voice/camera toggles).
  - Privacy toggles honored by interview modules.
  - Destructive actions confirmed.

---

# Milestone M2 — App Shell, Landing & Dashboard

Goal: The authenticated shell (sidebar/navbar/layouts), public landing site, and the dashboard hub.

## Epic M2.E1 — Layout & Navigation

### T-029 · App layout, routing & lazy loading
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-025
- React Router structure with layouts (auth/app), lazy-loaded route bundles, code splitting (Architecture §28, UI §46).
- **Acceptance Criteria:**
  - Routes are lazy-loaded with skeleton fallbacks.
  - Layout composition avoids duplication across pages.
  - Deep links work and respect auth guards.

### T-030 · Sidebar, Navbar & responsive navigation
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-029, T-012
- Sidebar (Dashboard/Interviews/Coding/Reports/History/Learning/Achievements/Settings/Logout, UI §14), Navbar (logo/search/notifications/theme/avatar, UI §15), mobile bottom nav + drawer (UI §11, §45).
- **Acceptance Criteria:**
  - Fully responsive across xs–2xl breakpoints.
  - Active route highlighted; smooth collapse animation.
  - Keyboard navigable with visible focus.

## Epic M2.E2 — Landing Website

### T-031 · Landing page & sections
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-012, T-011
- Hero, feature showcase (AI interview/coding/reports/dashboard/voice/resume), FAQ, footer with "Start Free Interview" CTA (FEATURES 3.1–3.6). Testimonials/contact are Future placeholders.
- **Acceptance Criteria:**
  - Responsive, accessible, dark-mode landing with subtle Framer Motion.
  - CTA routes to signup/interview setup.
  - Lighthouse performance budget respected (lazy media).

## Epic M2.E3 — Dashboard

### T-032 · Dashboard aggregation endpoints
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-021, T-018
- `GET /dashboard`, `/dashboard/weekly`, `/dashboard/monthly`, `/dashboard/topics/strong|weak`, `/dashboard/statistics` (API §15). Reads from Progress/Analytics (may return zero-state before data exists).
- **Acceptance Criteria:**
  - Aggregations are paginated/lean where relevant and indexed.
  - Endpoints return graceful empty data for new users.
  - Response times acceptable with proper indexes.

### T-033 · Dashboard home UI (widgets, charts, quick actions)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-032, T-030, T-039 (charts)
- Widgets: total interviews, practice hours, average score, last interview, streak, quick actions (start interview/resume upload/coding/roadmap), weekly line + monthly bar charts, recent activity, skill snapshot (FEATURES 4.x, UI §26).
- **Acceptance Criteria:**
  - Empty state for zero interviews with a Start CTA.
  - Charts render in light/dark and are responsive.
  - Data fetched via TanStack Query with caching.

---

# Milestone M3 — Resume & JD Intelligence

Goal: File uploads, resume/JD parsing and extraction, resume↔JD matching, and the AI provider abstraction that powers all AI features.

## Epic M3.E1 — Uploads & Storage

### T-034 · Cloudinary upload service & Multer pipeline
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-008
- Multer memory storage + Cloudinary upload service; validate type/size/extension/MIME (Rule 38, Architecture §23). Store only metadata (`publicId,url,secureUrl,mimeType,size`) in Mongo (DB §32, Rule 40).
- **Acceptance Criteria:**
  - Rejects disallowed MIME types and oversized files with clear errors.
  - Returns a stable metadata object for persistence.
  - Temporary artifacts cleaned up after processing (DB §35).

## Epic M3.E2 — AI Provider Layer (shared foundation)

### T-035 · AI provider abstraction (Gemini/Groq/OpenRouter)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-005, T-007
- `AIService` interface with `GeminiProvider` (primary), `GroqProvider`, `OpenRouterProvider` (fallbacks). Provider switch requires minimal change (Architecture §14). Controllers never call LLMs directly (Rule 7). Includes retry/fallback + timeout + token/usage logging.
- **Acceptance Criteria:**
  - Switching primary provider is a config change, not code rewrite.
  - On primary failure, fallback provider is used transparently with logging.
  - AI request/latency/token metrics logged (for §24.7 analytics).

### T-036 · Prompt system & versioning
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-035, T-009
- Modular prompt files under `backend/prompts/{technical,hr,behavior,coding,report,systemDesign,resume,jd}` (Rules 41–43, Architecture §15). `PromptVersion` collection (DB §22) tracks history and active version.
- **Acceptance Criteria:**
  - No prompt strings live in services/controllers.
  - Prompt builder composes context (resume/JD/history/difficulty) into provider input.
  - Active prompt version resolvable at runtime.

### T-037 · Response formatter & safe JSON parsing
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-035
- Formatter layer that validates/repairs LLM output into typed structures (question, evaluation, report) before returning to controller (Architecture §13).
- **Acceptance Criteria:**
  - Malformed AI output is retried/repaired or fails gracefully with a friendly error.
  - Output schemas validated (Zod) before persistence.
  - Never leaks raw provider errors to client.

## Epic M3.E3 — Resume Intelligence

### T-038 · Resume model & upload/list/get/delete endpoints
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-034, T-021
- `Resume` schema (DB §8) + `POST /resumes/upload`, `GET /resumes`, `GET /resumes/:id`, `DELETE /resumes/:id` (API §8). PDF (MVP), DOCX (Future).
- **Acceptance Criteria:**
  - Upload stores metadata + Cloudinary URL; soft-delete supported.
  - Ownership enforced (user can only access own resumes).
  - List paginated.

### T-039 · Resume parsing service (PyMuPDF/pdfplumber)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-038
- `POST /resumes/:id/parse` extracting text via PyMuPDF (fallback pdfplumber). Runs as an isolated parsing service/worker; populates `parsed` + raw text (FEATURES 2.4).
- **Acceptance Criteria:**
  - Handles common PDF layouts; returns partial results gracefully on hard PDFs.
  - Parsing is idempotent and re-runnable.
  - Long parses do not block the request thread (async/job-friendly).

### T-040 · AI extraction: skills, projects, experience, education, certs
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-039, T-036
- Use AI + heuristics to extract structured skills/projects/experience/education/certifications/summary (FEATURES 6.1–6.5). Populate Resume + Skill Profile.
- **Acceptance Criteria:**
  - Extracted entities stored in normalized fields on Resume.
  - Projects include name/tech stack/description for later question generation.
  - Certifications recognized (AWS/Azure/GCP/Coursera/etc.).

### T-041 · Resume weakness detection
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-040
- Detect missing GitHub, weak project descriptions, missing metrics/achievements (FEATURES 6.6). Surfaced only after interview.
- **Acceptance Criteria:**
  - Produces a structured list of weaknesses with suggestions.
  - Not shown during an active interview (Rule 45 spirit).
  - Deterministic enough to be testable on sample resumes.

## Epic M3.E4 — Job Description Intelligence

### T-042 · JD model & upload/parse/get/delete endpoints
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-034, T-021, T-036
- `JobDescription` schema (DB §9) + `POST /job-descriptions/upload`, `POST /job-descriptions/:id/parse`, `GET`, `DELETE` (API §9). Extract required/preferred skills, responsibilities, experience, education, keywords (FEATURES 7.1).
- **Acceptance Criteria:**
  - JD parse populates structured skill/responsibility fields.
  - Supports paste-text and file upload paths.
  - Ownership + pagination enforced.

### T-043 · Resume ↔ JD matching & gap analysis
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-040, T-042
- `POST /job-descriptions/:id/match` returning match %, missing skills, matching skills, recommendations (API §9, FEATURES 5.11 / 7.2–7.4).
- **Acceptance Criteria:**
  - Match score is explainable (lists matched vs missing skills).
  - Recommendations feed the learning module post-interview.
  - Handles missing resume or JD gracefully.

---

# Milestone M4 — AI Interview Engine (Core)

Goal: The heart of the product — configurable interviews, session lifecycle, context-aware adaptive questioning, follow-ups, and the live real-time experience.

## Epic M4.E1 — Interview Data Models

### T-044 · Interview session, question & answer models
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-009
- `InterviewSession` (DB §10), `InterviewQuestion` (DB §11), `InterviewAnswer` (DB §12) with indexes (userId, status, createdAt, difficulty, companyMode) and status enum (Pending/Active/Paused/Completed/Cancelled).
- **Acceptance Criteria:**
  - Relations and indexes match DB §28–29.
  - Validation for difficulty/type/duration enums (DB §31).
  - AI memory field present on session.

### T-045 · Interview template & question-bank models
- **Scope:** MVP · **Priority:** P1 · **Complexity:** S · **Depends on:** T-044
- `InterviewTemplate` (DB §23) and static question bank support for fallback (FEATURES 13.2).
- **Acceptance Criteria:**
  - Templates reusable across sessions.
  - Static bank tagged by topic/difficulty/company (FEATURES 13.4–13.6).
  - Duplicate-prevention keys available per session (FEATURES 13.3).

## Epic M4.E2 — Interview Setup

### T-046 · Interview setup wizard (multi-step) UI
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-029, T-012, T-038, T-042
- 7-step wizard: role → experience → company → type → difficulty → resume → JD, plus summary screen (FEATURES 5.1–5.12, UI §27).
- **Acceptance Criteria:**
  - Steps validate before advancing; back/forward preserves choices.
  - Optional resume/JD steps skippable.
  - Summary shows role/difficulty/company/estimated questions & time before start.

### T-047 · Start interview endpoint & session bootstrap
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-044, T-046, T-036
- `POST /interviews` creating a personalized session storing profile/resume/JD/role/company/difficulty and initializing AI memory (API §10, FEATURES 8.1).
- **Acceptance Criteria:**
  - Session persists all configuration and returns session id + first-question handle.
  - Rate-limited per API §30 (interview 60/min).
  - Invalid config rejected with field errors.

## Epic M4.E3 — Question & Answer Flow

### T-048 · Question generation service (per type) + duplicate prevention
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-047, T-037
- Generate technical/HR/behavioral/coding/follow-up questions (`/ai/questions/*`, API §11) with topic/difficulty tagging and no in-session duplicates (FEATURES 8.x, 13.1–13.5).
- **Acceptance Criteria:**
  - Questions are personalized from resume/JD/history.
  - No duplicate questions within a session.
  - Falls back to static bank on AI failure.

### T-049 · Submit answer & per-answer evaluation capture
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-048
- `POST /interviews/:id/answer` and `/ai/evaluate` storing answer + hidden evaluation (technical/communication/etc.), thinking/response times (API §10–11, DB §12).
- **Acceptance Criteria:**
  - Evaluation stored but never revealed during the interview (Rule 45, FEATURES 17.8).
  - Timing metrics captured for analytics.
  - Answer persisted even if evaluation is deferred.

### T-050 · Context memory service
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-049
- Maintain conversation memory (previous Q/A, technologies mentioned, strengths/weaknesses) inside the Interview Service (Rule 44, FEATURES 8.4).
- **Acceptance Criteria:**
  - Memory prevents repeated questions and enables references to prior answers.
  - Memory size bounded/summarized to fit context windows.
  - Persisted so sessions can resume.

### T-051 · Adaptive difficulty engine
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-050
- Adjust difficulty from accuracy/confidence/communication/topic mastery; skip easy questions for strong candidates; add foundational ones for weak (FEATURES 8.11–8.12, Architecture §19).
- **Acceptance Criteria:**
  - Difficulty transitions are gradual and logged.
  - Strong performers escalate; struggling candidates get easier questions/hints.
  - Never random — decisions tied to measured signals.

### T-052 · AI follow-up & topic-switching engine
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-050
- Concept/project/cross-topic/optimization/scalability/edge-case/real-world follow-ups (Module 18); topic switching to avoid monotony (FEATURES 8.14).
- **Acceptance Criteria:**
  - Follow-ups reference candidate's own answers/projects.
  - Topic rotation prevents long single-topic streaks.
  - Clarification and "why/how" probing supported (FEATURES 8.6–8.8).

### T-053 · Interviewer personality & company modes
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-048, T-036
- Personality modes (Friendly/Professional/Strict/Startup/FAANG/HR/Behavioral) and company-style modes via prompt engineering only — no proprietary data (FEATURES 8.2, 5.5; API §21 `/companies`).
- **Acceptance Criteria:**
  - [x] Selected personality visibly changes tone and follow-up depth.
  - [x] `GET /companies`, `/companies/:company`, and generation endpoint implemented.
  - [x] Company modes documented as stylistic, not proprietary.

### T-054 · Hint engine (practice mode)
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-051
- Gentle hints when a candidate struggles, without revealing full answers (FEATURES 8.13).
- **Acceptance Criteria:**
  - [x] Hints escalate progressively and never give the solution outright.
  - [x] Available only in practice mode / configurable.
  - [x] Logged for report ("needed hints").

## Epic M4.E4 — Session Lifecycle & Live Experience

### T-055 · Interview lifecycle endpoints (get/question/next/pause/resume/finish/cancel/history)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-049
- Implement `GET /interviews/:id`, `/question`, `POST /next`, `PATCH /pause|resume|finish`, `DELETE /:id`, `GET /interviews/history` (API §10).
- **Acceptance Criteria:**
  - [x] State transitions validated (can't answer a completed session).
  - [x] History paginated + filterable.
  - [x] Finish triggers report generation pipeline (M7).

### T-056 · WebSocket interview namespace & events
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-047
- Socket.io `/interview` namespace; client events (joinInterview/leaveInterview/submitAnswer/typing/voiceChunk/cameraStatus/heartbeat) and server events (questionGenerated/followUpQuestion/answerEvaluated/timerUpdated/interviewCompleted/voiceResponse/warning/error) (API §24, Rules 48–49).
- **Acceptance Criteria:**
  - [x] Events namespaced and camelCase; auth enforced on socket handshake.
  - [x] Timer updates and question delivery flow over sockets.
  - [x] Reconnect handling preserves session.

### T-057 · Live interview screen UI
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-056, T-030
- Interview lobby, 3-2-1 countdown, AI card, question display, answer area, timer (elapsed/remaining), question number, progress bar, "AI is thinking" indicator, natural pauses, end-interview flow (Module 17, UI §28).
- **Acceptance Criteria:**
  - [x] No correctness/score feedback shown mid-interview (FEATURES 17.8).
  - [x] Immersive, distraction-free, responsive layout.
  - [x] Progress + timers update live via sockets.
  - [x] The live experience now uses a polished card-based layout with clearer session state, countdown, and end-of-session flow.

### T-058 · Session recovery / auto-save
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-055, T-050
- Auto-save session progress; restore on browser refresh (Rules 65–66, FEATURES 17.9).
- **Acceptance Criteria:**
  - [x] Refresh restores the current question, timer, and answered progress.
  - [x] Draft answer text is preserved across refreshes.
  - [x] Recovery is resilient to transient disconnects and page reloads.

---

# Milestone M5 — Coding Interview Platform

Goal: A sandboxed coding round with Monaco, Judge0 execution, visible/hidden tests, and AI review — user code never runs on our servers (Rules 46–47).

## Epic M5.E1 — Coding Data & Execution

### T-059 · Coding question & submission models
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-009
- `CodingQuestion` (DB §13) and `CodingSubmission` (DB §14) with topic/company tags, sample + hidden tests, expected complexity.
- **Acceptance Criteria:**
  - [x] Hidden tests are stored in the model layer for backend use.
  - [x] Submissions store language/source/time/memory/passed counts/judgeResult.
  - [x] Indexed by user/session/question.

### T-060 · Judge0 integration service
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-059, T-008
- Judge0 CE client with language mapping, time/memory limits, base64 encoding, polling/callback (FEATURES 14.8–14.12, TECH_STACK §9). Rate limit 20 submissions/min (API §30).
- **Acceptance Criteria:**
  - Run against sample tests; submit against hidden tests.
  - Handles compile errors, runtime errors, TLE, MLE, wrong answer distinctly.
  - No user code executes locally.
- **Status:** Completed
- **Implementation notes:** Implemented backend integration at `backend/src/services/coding/judge0.service.js` — includes language mapping, base64 payload encoding/decoding, polling (`/submissions/{token}`), result normalization, and an in-memory per-instance rate limiter. Use `JUDGE0_API_KEY` (RapidAPI) / `JUDGE0_URL` to configure endpoint. Replace in-memory rate limiter with Redis for multi-instance deployments.

### T-061 · Run & Submit endpoints
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-060
- `POST /coding/run`, `POST /coding/submit`, `GET /coding/questions`, `GET /coding/questions/:id`, `GET /coding/submissions/:id` (API §12).
- **Acceptance Criteria:**
  - Run returns per-sample output; submit returns pass/fail counts + metrics.
  - Filtering by difficulty/topic/company on list.
  - Ownership + rate limits enforced.
  - **Status:** Completed
  - **Implementation notes:** Implemented `POST /api/v1/coding/run` and `POST /api/v1/coding/submit` controllers in `backend/src/controllers/coding.controller.js` and routes in `backend/src/routes/coding.routes.js`. Routes mounted at `backend/src/routes/index.js` (`apiRouter.use('/coding', codingRoutes)`). The endpoints use `backend/src/services/coding/judge0.service.js` (Judge0 integration, T-060) to execute submissions. `submit` iterates hidden test cases from `backend/src/models/CodingQuestion.js` and persists results in `backend/src/models/CodingSubmission.js`.


### T-062 · Coding question generator
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-048, T-059
- `POST /ai/questions/coding` generating role/difficulty/company-appropriate problems and mapping to the coding library categories (FEATURES 14.4–14.5).
- **Acceptance Criteria:**
  - Generated problems include description, constraints, examples, starter code, tests.
  - Difficulty selectable (Easy/Medium/Hard/company/topic).
  - Falls back to curated library on AI failure.
- **Status:** Completed
- **Implementation notes:** Added a dedicated generator at `backend/src/services/coding/questionGenerator.service.js` that returns `CodingQuestion`-shaped payloads, persists them to `CodingQuestion` when enabled, and uses the new prompt template `backend/src/prompts/templates/coding.questions.v1.js`. The endpoint is exposed via `POST /api/v1/ai/questions/coding` and can use AI generation with a curated-library fallback when AI is unavailable.

## Epic M5.E2 — Coding UI & AI Review

### T-063 · Monaco editor integration & coding screen
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-061, T-030
- Monaco with syntax highlighting, language select, autosave (local + periodic sync), full-screen, themes; question panel/console/output/run/submit/timer layout (FEATURES 14.2–14.3, 14.13, UI §29).
- **Acceptance Criteria:**
  - Language switch updates starter code + highlighting.
  - Autosave prevents loss on refresh; syncs during active interview.
  - Console shows sample/hidden (masked) results, errors, timers, progress.
- **Status:** Completed
- **Implementation notes:** Added a Monaco-based coding studio at `frontend/src/pages/CodingInterview.jsx` with a question pane, language switcher, local autosave, full-screen mode, run/submit actions, and console-style result feedback. The page calls the new backend `/api/v1/ai/questions/coding`, `/api/v1/coding/run`, and `/api/v1/coding/submit` endpoints through `frontend/src/services/codingService.js`, and the sidebar navigation now exposes the route at `/coding`.
  
### T-064 · AI code review, complexity & optimization
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-061, T-036
- `POST /coding/review`, `/coding/optimize` for readability/naming/logic/edge cases, estimated time/space complexity, and optimization + debugging hints (FEATURES 14.14–14.17).
- **Acceptance Criteria:**
  - Review suggests improvements without rewriting the whole solution.
  - Complexity clearly labeled as an estimate.
  - Debugging hints never reveal the full solution.
  - **Status:** Completed
  - **Implementation notes:** Added authenticated backend endpoints `POST /api/v1/coding/review` and `POST /api/v1/coding/optimize` backed by a dedicated review service that uses the AI provider layer with structured fallback behavior. The coding studio UI now exposes Review and Optimize actions so candidates can inspect suggestions and estimated complexity without receiving the full solution.

---

# Milestone M6 — Voice Interview

Goal: Natural spoken interaction — STT in, TTS out — with device checks and speech analytics.

## Epic M6.E1 — Speech Services

### T-065 · Speech-to-Text endpoint (Groq Whisper)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-035, T-008
- `POST /voice/stt` using Groq Whisper (fallback OpenAI Whisper), streaming audio chunks from the socket (FEATURES 15.1, API §13).
- **Acceptance Criteria:**
  - Accepts standard browser audio formats; returns transcript.
  - Handles silence/empty audio gracefully.
  - Respects privacy settings (transcript storage opt-in).

### T-066 · Text-to-Speech endpoint (Edge TTS)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-035
- `POST /voice/tts` via Microsoft Edge TTS (fallback Kokoro), voice/speed configurable from settings (FEATURES 15.2, API §13).
- **Acceptance Criteria:**
  - Returns playable audio for AI questions.
  - Voice/speed/volume configurable per user settings.
  - Cached where the same text recurs.

### T-067 · Voice conversation loop & controls
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-065, T-066, T-056
- Full AI-speaks → candidate-speaks → STT → AI-response → TTS loop over sockets, with mute/unmute/volume/replay controls and mic detection (FEATURES 15.3–15.6).
- **Acceptance Criteria:**
  - Smooth turn-taking; replay last question works.
  - Mic permission/availability detected with clear prompts.
  - Degrades gracefully to text mode if audio unavailable.

### T-068 · Speech analytics (silence, speed, fillers, quality) & transcript
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-067
- `POST /voice/analyze` returning speaking speed, fluency, filler counts, clarity; silence + audio-quality detection; full transcript generation (FEATURES 15.5, 15.7–15.10).
- **Acceptance Criteria:**
  - Filler words (um/uh/like/basically/actually) counted approximately.
  - Silence beyond threshold prompts a repeat offer.
  - Transcript available for post-interview review.

## Epic M6.E2 — Voice UI

### T-069 · Voice UI states & waveform
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-067, T-012
- Listening/Thinking/Speaking/Muted/Disconnected indicators + reactive waveform (UI §42).
- **Acceptance Criteria:**
  - Waveform reacts to real audio input.
  - State transitions are obvious and accessible (not color-only).
  - Works in dark mode and on mobile.

---

# Milestone M7 — Evaluation & Reports

Goal: Turn a completed interview into structured scores, an actionable report, and durable history.

## Epic M7.E1 — Evaluation Engine

### T-070 · Answer & multi-dimensional scoring
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-049, T-037
- Score technical/communication/problem-solving/coding/behavioral per answer and aggregate (Module 19, DB §12/§15).
- **Acceptance Criteria:**
  - Each score 0–100 with justification tied to actual answers (not generic).
  - Coding score integrates test results + AI review.
  - Behavioral uses STAR where applicable (FEATURES 11.1).
- **Note:** All confidence/behavior signals are estimates, per FEATURES wording — never presented as certainties.

### T-071 · Report model & generation
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-070, T-055
- `Report` schema (DB §15) + `POST /ai/report` producing overall score, pass probability (advisory), strengths, weaknesses, missed concepts, recommendations, roadmap, summary (Module 19–20).
- **Acceptance Criteria:**
  - Report generated only after interview completion (AI Architecture rule).
  - Feedback references specific interview answers (no generic filler).
  - 1–1 with session; stored durably.

## Epic M7.E2 — Report & History UI

### T-072 · Report screen
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-071, T-039 (charts)
- Overall score, pass probability, per-dimension breakdown, radar chart, timeline, recommendations (UI §30, Module 20).
- **Acceptance Criteria:**
  - Radar + timeline responsive and dark-mode aware.
  - Missed concepts and action plan clearly presented.
  - Empty/error states for missing/failed reports.

### T-073 · Report retrieval, PDF download & share
- **Scope:** MVP (get) / P1–P2 (pdf/share) · **Priority:** P0/P1/P2 · **Complexity:** M · **Depends on:** T-071
- `GET /reports/:id`, `GET /reports/:id/download` (PDF), `POST /reports/:id/share`, `POST /reports/compare` (API §14).
- **Acceptance Criteria:**
  - PDF renders full report; download works cross-browser.
  - Share generates a secure, revocable link.
  - Compare returns deltas across two reports.

### T-074 · Interview history & archive
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-055, T-072
- History page: date/role/company/score/duration cards, view report, retake; search + filter by company/topic/date/score/role/type; transcript & coding submission history (Module 21, UI §31).
- **Acceptance Criteria:**
  - Paginated, searchable, filterable list.
  - Retake reuses previous configuration.
  - Transcript/coding history accessible per session.

---

# Milestone M8 — Progress, Analytics & Learning

Goal: Long-term improvement — progress tracking, analytics, charts, and AI learning roadmaps.

## Epic M8.E1 — Progress & Analytics

### T-075 · Progress & Analytics models + aggregation jobs
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-071
- `Progress` (DB §16) and `Analytics` (DB §24) updated on interview completion (interview count, practice hours, averages, weak/strong topics, streak, XP, level; response/thinking time, topic coverage).
- **Acceptance Criteria:**
  - Aggregated analytics stored separately from transactional data (DB §34).
  - Streak logic handles day boundaries/timezones.
  - Idempotent updates (no double counting on retries).

### T-076 · Analytics endpoints & charts library
- **Scope:** MVP · **Priority:** P1 · **Complexity:** M · **Depends on:** T-075
- `GET /analytics/interviews|communication|coding|skills` (API §20) + Recharts chart components (line/area/bar/radar/pie/progress ring) with dark mode, tooltips, responsive resize (UI §39).
- **Acceptance Criteria:**
  - Chart components reusable across dashboard/progress/report.
  - All charts responsive + dark-mode + accessible.
  - Endpoints paginated/aggregated efficiently.

### T-077 · Progress dashboard page
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** T-076, T-033
- Total interviews, practice hours, average score, weekly/monthly charts, topic performance, skill-improvement graph, streak, performance trends; practice calendar heatmap (P2) (Module 22, UI §32).
- **Acceptance Criteria:**
  - Trends reflect real historical data.
  - Empty state for new users.
  - Heatmap (calendar) behind a P2 flag.

## Epic M8.E2 — Learning

### T-078 · Learning roadmap model & generation
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-071, T-043
- `LearningRoadmap` (DB §19) + `POST /learning/roadmap`, `GET /learning/roadmap` generating personalized daily/weekly/monthly plans from report weaknesses + JD gaps (Module 23).
- **Acceptance Criteria:**
  - Roadmap tied to specific weak topics/missed concepts.
  - Plans have estimated completion + status.
  - Regeneratable as performance changes.

### T-079 · Recommendations (topics, DSA, problems, resources)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-078
- `GET /learning/problems`, `GET /learning/topics` + system-design/coding recommendations, revision list, interview-readiness estimate (FEATURES 23.2–23.8).
- **Acceptance Criteria:**
  - Recommendations prioritized by weakness severity.
  - Readiness estimate is advisory and explainable.
  - Learning page (UI §33) renders roadmap/problems/topics/plan.

### T-080 · SavedResources & Certificates
- **Scope:** MVP · **Priority:** P2 · **Complexity:** S · **Depends on:** T-026
- `SavedResources` and `Certificate` (DB §20) models + profile UI sections.
- **Acceptance Criteria:**
  - Users can save/remove resources and add certificates.
  - Certificate metadata + optional verification URL stored.
  - Shown on profile page.

---

# Milestone M9 — Gamification, Notifications & Settings Polish

Goal: Engagement and retention features.

### T-081 · Gamification: XP, levels, streaks, badges
- **Scope:** Partial MVP · **Priority:** P1/P2 · **Complexity:** M · **Depends on:** T-075
- `Achievement` (DB §17) + XP/levels, daily streak (P1), badges/skill-levels/weekly challenges (P2); `GET /achievements`, `/achievements/xp` (API §18) (Module 25).
- **Acceptance Criteria:**
  - Streak (P1) is reliable; XP awarded for interviews/coding/goals.
  - Badges awarded on defined triggers (first interview, 7-day streak, etc.).
  - Achievements page renders earned + locked states.

### T-082 · Notifications system
- **Scope:** Partial MVP · **Priority:** P1/P2 · **Complexity:** M · **Depends on:** T-021
- `Notification` (DB §18) + `GET /notifications`, `PATCH /:id/read`, `/read-all`, `DELETE /:id` (API §17); interview/practice reminders (P1), achievement/weekly/feature notices (P2). Notification center grouped by Today/Yesterday/This Week/Older (UI §44).
- **Acceptance Criteria:**
  - Read/unread state and bulk actions work.
  - Reminders scheduled via `scheduledFor`.
  - Center is accessible and paginated.

### T-083 · Leaderboard (opt-in)
- **Scope:** Future · **Priority:** P3 · **Complexity:** M · **Depends on:** T-081
- `GET /leaderboard` with privacy opt-out (FEATURES 25.6, API §18).
- **Acceptance Criteria:**
  - Users can opt out; excluded users never appear.
  - Ranking derived from XP/score.
  - Clearly labeled Future feature.

---

# Milestone M10 — Webcam & Interview Environment

Goal: Optional environmental guidance (not proctoring) and integrity signals.

### T-084 · Camera/mic detection & live preview
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-057
- MediaDevices checks (available/permission/resolution), live preview before interview, mic indicator states (FEATURES 16.1–16.2, 16.8, UI §43).
- **Acceptance Criteria:**
  - Clear permission prompts + fallback if denied.
  - Preview shown in lobby; device selectable in settings.
  - Mic states (connected/muted/active/disconnected) accurate.

### T-085 · Face presence & environment checks (MediaPipe)
- **Scope:** Partial MVP · **Priority:** P1/P2/P3 · **Complexity:** L · **Depends on:** T-084
- MediaPipe face presence (P1), multiple-face warning (P2), lighting/camera-quality checks (P2), eye-contact reminder (P3) — all framed as guidance (Module 16).
- **Acceptance Criteria:**
  - Detection runs in-browser without blocking the interview.
  - Presented as approximate guidance, not scores.
  - Respects camera privacy setting.

### T-086 · Anti-cheating integrity events
- **Scope:** Partial MVP · **Priority:** P1/P2 · **Complexity:** M · **Depends on:** T-057
- Monitor tab switching, window blur, long inactivity, copy/paste, browser focus, multiple faces; emit integrity events into the report (PRD §18).
- **Acceptance Criteria:**
  - Events recorded with timestamps and surfaced in report timeline.
  - Non-punitive framing; configurable per session.
  - No false-blocking of legitimate users.

---

# Milestone M11 — Admin Portal

Goal: Operational management surface. Largely beyond MVP but foundational endpoints can land early.

### T-087 · Admin auth & dashboard
- **Scope:** Future · **Priority:** P2 · **Complexity:** M · **Depends on:** T-021
- Role-gated `GET /admin/dashboard`, `/admin/analytics` (API §22) with system health/feedback overview (PRD §31).
- **Acceptance Criteria:**
  - Only `role=admin` can access; audited (DB §25).
  - Aggregate metrics for users/interviews/AI usage.
  - Feature-flag surface stubbed.

### T-088 · Admin user & report management
- **Scope:** Future · **Priority:** P2 · **Complexity:** M · **Depends on:** T-087
- `GET /admin/users`, `DELETE /admin/users/:id`, `GET /admin/reports` (API §22).
- **Acceptance Criteria:**
  - User list paginated/searchable; delete is soft-delete + audited.
  - Report browsing respects privacy.
  - All actions logged to AuditLog.

### T-089 · Prompt management & feature flags
- **Scope:** Future · **Priority:** P2 · **Complexity:** M · **Depends on:** T-036, T-087
- `GET /admin/prompts`, `PUT /admin/prompts/:id` editing prompt versions (API §22, DB §22).
- **Acceptance Criteria:**
  - Editing creates a new version; active version switchable.
  - Changes audited with author + timestamp.
  - No prompt text hardcoded elsewhere.

### T-090 · Audit log service
- **Scope:** Future (infra usable earlier) · **Priority:** P2 · **Complexity:** S · **Depends on:** T-009
- `AuditLog` (DB §25) capturing important actions (user/action/resource/ip/device/browser/timestamp).
- **Acceptance Criteria:**
  - Reusable `audit()` helper callable from services.
  - Sensitive data excluded (Rule 90).
  - Queryable by admin.

---

# Milestone M12 — Hardening & Release (Version 1.0.0)

Goal: Meet the RULES.md Definition of Done and CHANGELOG release checklist across the whole product.

## Epic M12.E1 — Security & Performance

### T-091 · Security pass & per-route rate limiting
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-008, all API tasks
- Apply API §30 limits (auth 5/min, AI 30/min, interview 60/min, coding 20/min); verify JWT on every protected route; sanitize + escape; secrets audit (Rules 84–90).
- **Acceptance Criteria:**
  - Automated checks confirm every protected route requires JWT.
  - Rate limits enforced and tested per category.
  - No secrets in bundle/logs/repo.

### T-092 · Performance pass (indexes, pagination, lazy load, memoization)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-009, frontend features
- Verify DB indexes (DB §28), pagination everywhere, `lean()` reads, connection pooling, debounced requests; frontend lazy loading, code splitting, memoization, minimized layout shift (Architecture §28, UI §46).
- **Acceptance Criteria:**
  - Key list endpoints paginated + indexed (measured).
  - Route bundles code-split; charts/editor lazy-loaded.
  - No premature optimization; changes measured (Rule 97).

### T-093 · Accessibility audit
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** frontend features
- Keyboard nav, ARIA, focus states, contrast, reduced motion, semantic HTML, screen-reader labels, focus-trapping modals (UI §40, Rules 18/59/61).
- **Acceptance Criteria:**
  - Automated a11y checks pass on core flows.
  - All interactive elements keyboard-reachable with visible focus.
  - Reduced-motion honored.

## Epic M12.E2 — Testing

### T-094 · Backend unit & API tests
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** backend features
- Vitest/Jest unit tests for services (business logic first, Rule 92) + Supertest for endpoints (auth, interview lifecycle, coding, reports).
- **Acceptance Criteria:**
  - Critical services + endpoints covered incl. error paths.
  - Auth, evaluation, and Judge0 flows tested with mocks.
  - Tests run in CI.

### T-095 · Frontend component & E2E tests
- **Scope:** MVP · **Priority:** P0 · **Complexity:** L · **Depends on:** frontend features
- React Testing Library for components; Playwright E2E for signup→setup→interview→report (TECH_STACK §18).
- **Acceptance Criteria:**
  - Core components tested for states + a11y.
  - E2E covers the primary happy path end-to-end.
  - Runs in CI (headless).

## Epic M12.E3 — Deploy & Release

### T-096 · Deployment (Vercel + Render + Atlas + Cloudinary + Judge0)
- **Scope:** MVP · **Priority:** P0 · **Complexity:** M · **Depends on:** T-016, T-091, T-092
- Frontend→Vercel, backend→Render, DB→Atlas, storage→Cloudinary, Judge0 endpoint configured; env vars set per environment (Architecture §30, TECH_STACK §20).
- **Acceptance Criteria:**
  - Staging + production environments separated.
  - Health checks green; smoke test of core flow passes in staging.
  - Rollback path documented.

### T-097 · Release checklist & CHANGELOG 1.0.0
- **Scope:** MVP · **Priority:** P0 · **Complexity:** S · **Depends on:** T-094, T-095, T-096
- Complete CHANGELOG Release Checklist; tag `1.0.0`; sync docs (CHANGELOG Maintenance Rules).
- **Acceptance Criteria:**
  - All MVP tasks complete; tests pass; env vars documented.
  - CHANGELOG updated and Git tag created.
  - README reflects current state.

---

# Milestone M13 — Post-MVP Roadmap (Future)

Ordered roughly by likely sequencing; each is an epic to be decomposed when scheduled. All are **Future** (PRD §34, Architecture §32, DB §33, API §32).

| ID | Epic | Complexity | Notes |
| --- | --- | --- | --- |
| T-098 | DOCX resume support | M | Extend parser + upload validation. |
| T-099 | Static question-bank expansion & offline fallback | M | Reduce AI usage (FEATURES 13.2). |
| T-100 | Redis caching & session store | L | TECH_STACK §26; sessions/rate-limit. |
| T-101 | BullMQ background jobs | L | Async parsing/report/analytics. |
| T-102 | AI Avatar interviewer | XL | Video/avatar layer (Architecture §32). |
| T-103 | Multi-language interviews (i18n) | XL | Settings language + prompts + TTS/STT. |
| T-104 | Recruiter dashboard & Organizations | XL | New collections (DB §33). |
| T-105 | Subscriptions, payments, invoices (Stripe) | XL | Billing domain (DB §33). |
| T-106 | Group discussions & mock assessment centers | XL | Multi-user real-time. |
| T-107 | AI Resume Builder & Cover Letter Generator | L | New AI flows. |
| T-108 | Career coach & salary negotiation simulator | L | New AI flows. |
| T-109 | Placement drive simulation | L | Cohort features. |
| T-110 | Mobile apps (React Native) | XL | Post-web (TECH_STACK §24). |
| T-111 | Observability: Sentry/Grafana/Prometheus/OpenTelemetry | L | Monitoring (Architecture §31). |
| T-112 | Search: Meilisearch/Elasticsearch | L | Advanced history/question search. |

**Acceptance (all M13):** Each must slot into the existing architecture without major rework (Architecture §32/§35), follow all RULES, and ship with its own tests + docs + CHANGELOG entry.

---

## 3. Dependency Summary (MVP Critical Path)

```
M0 Foundation
   └─> M1 Auth ──> M2 Shell/Dashboard
        └─> M3 Uploads + AI Layer (T-035/36/37)
             └─> M4 Interview Engine (T-044…T-058)
                  ├─> M5 Coding (T-059…T-064)
                  ├─> M6 Voice (T-065…T-069)
                  └─> M7 Evaluation & Reports (T-070…T-074)
                       └─> M8 Progress/Analytics/Learning (T-075…T-080)
                            └─> M9/M10 (engagement + environment)
                                 └─> M12 Hardening ──> 1.0.0 Release
```

Admin (M11) and M13 are parallelizable/Future and are not on the 1.0 critical path.

---

## 4. MVP vs Future At A Glance

**MVP (Version 1.0 — PRD §33):** Auth, Dashboard, Interview Setup, Resume Upload, JD Upload, AI Technical/HR/Behavioral Interview, Adaptive Questioning, Coding Round, Interview Report, Interview History, Progress Dashboard — covered by **M0–M8**, plus the MVP-flagged portions of **M9–M10** and all of **M12**.

**Future (PRD §34–35):** AI avatars, multi-language, group discussions, recruiter dashboard, subscriptions/payments, mobile apps, organizations, leaderboard, email verification, DOCX, and the observability/scale stack — **M11** (admin) and **M13**.

---

*This backlog is a living document. When scope changes, update the affected task's Acceptance Criteria and record the change in CHANGELOG.md per the Changelog Rules.*
