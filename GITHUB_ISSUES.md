# GitHub Issue Backlog

This file converts every task from `TASKS.md` into GitHub-style issue drafts. All issues are planned unless explicitly moved into active development.

Total issues: 112

## Suggested Repository Milestones

- M0: Foundation & Tooling
- M1: Authentication & Identity
- M2: App Shell, Landing & Dashboard
- M3: Resume & JD Intelligence
- M4: AI Interview Engine (Core)
- M5: Coding Interview Platform
- M6: Voice Interview
- M7: Evaluation & Reports
- M8: Progress, Analytics & Learning
- M9: Gamification, Notifications & Settings Polish
- M10: Webcam & Interview Environment
- M11: Admin Portal
- M12: Hardening & Release (Version 1.0.0)
- M13: Post-MVP Roadmap (Future)

## Labels

Suggested label families: `status:planned`, `type:task`, `scope:*`, `priority:*`, `complexity:*`, `milestone:*`, and `area:*`.

---

## T-001: Initialize monorepo & repository hygiene

**GitHub Issue Title:** [T-001] Initialize monorepo & repository hygiene

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:s, milestone:m0, area:platform

### Description

- Create repo with `frontend/` and `backend/` workspaces, root README, LICENSE, and a `.gitignore` covering `node_modules`, `.env`, `logs`, `dist`, `coverage` (Rule 95).

### Dependencies

- None

### Acceptance Criteria

- [ ] `git clone` yields a documented folder layout matching ARCHITECTURE §6-7.
- [ ] `.env` and other secrets are git-ignored and verified not tracked.
- [ ] Root README explains how to run frontend and backend.

### Metadata

- Task ID: T-001
- Scope: MVP
- Priority: P0
- Complexity: S
- Epic: M0.E1 - Repository & Workspace Setup
- Source: TASKS.md (section)
---

## T-002: Backend scaffold (Express + folder architecture)

**GitHub Issue Title:** [T-002] Backend scaffold (Express + folder architecture)

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:backend

### Description

- Scaffold Express app with the ARCHITECTURE §7 tree: `config/ controllers/ routes/ middleware/ models/ services/{ai,coding,resume,jd,report,voice} socket/ validators/ prompts/ utils/ database/ logs/`.

### Dependencies

- T-001

### Acceptance Criteria

- [ ] Server boots on `PORT` from env and serves `GET /api/v1/health` and `/api/v1/ping`.
- [ ] Empty layer folders exist with an index barrel or README describing responsibility.
- [ ] No business logic in controllers placeholder (Rule 5).

### Metadata

- Task ID: T-002
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E1 - Repository & Workspace Setup
- Source: TASKS.md (section)
---

## T-003: Frontend scaffold (Vite + React + Tailwind + shadcn/ui)

**GitHub Issue Title:** [T-003] Frontend scaffold (Vite + React + Tailwind + shadcn/ui)

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:frontend

### Description

- Scaffold Vite React app with the ARCHITECTURE §6 tree: `assets/ components/common/ features/ hooks/ layouts/ pages/ services/api/ context/ store/ utils/ constants/ styles/`. Install Tailwind, shadcn/ui, Lucide, Framer Motion.

### Dependencies

- T-001

### Acceptance Criteria

- [ ] `npm run dev` renders a placeholder home route.
- [ ] Tailwind + shadcn configured; a sample shadcn Button renders.
- [ ] Folder structure matches the architecture doc exactly.

### Metadata

- Task ID: T-003
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E1 - Repository & Workspace Setup
- Source: TASKS.md (section)
---

## T-004: Tooling: ESLint, Prettier, Husky, lint-staged

**GitHub Issue Title:** [T-004] Tooling: ESLint, Prettier, Husky, lint-staged

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:s, milestone:m0, area:platform

### Description

- Configure ESLint + Prettier for both workspaces; Husky pre-commit runs lint-staged.

### Dependencies

- T-002
- T-003

### Acceptance Criteria

- [ ] Commit is blocked when lint fails.
- [ ] `npm run lint` and `npm run format` succeed in both workspaces.
- [ ] Shared rules enforce no `var`, prefer `const`, arrow functions (Code Style).

### Metadata

- Task ID: T-004
- Scope: MVP
- Priority: P0
- Complexity: S
- Epic: M0.E1 - Repository & Workspace Setup
- Source: TASKS.md (section)
---

## T-005: Environment variable management & documentation

**GitHub Issue Title:** [T-005] Environment variable management & documentation

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:s, milestone:m0, area:platform

### Description

- Add `dotenv`, `.env.example` for both apps documenting every variable (Rule 83): backend (`PORT, MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY, CLOUDINARY_*, JUDGE0_URL`), frontend (`VITE_API_URL`, etc.). A config loader validates required vars on boot.

### Dependencies

- T-002
- T-003

### Acceptance Criteria

- [ ] App fails fast with a clear message if a required env var is missing.
- [ ] No secret is ever exposed to the frontend bundle (only `VITE_` prefixed values).
- [ ] `.env.example` lists all variables with descriptions.

### Metadata

- Task ID: T-005
- Scope: MVP
- Priority: P0
- Complexity: S
- Epic: M0.E1 - Repository & Workspace Setup
- Source: TASKS.md (section)
---

## T-006: Standard response envelope & error middleware

**GitHub Issue Title:** [T-006] Standard response envelope & error middleware

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:backend

### Description

- Implement `{ success, message, data, meta }` success helper and `{ success, message, errors[], requestId }` error format (API §5, §29). Global error middleware never leaks stack traces (Rules 14, 69).

### Dependencies

- T-002

### Acceptance Criteria

- [ ] All responses use the shared helpers; a thrown `AppError` maps to correct HTTP status (API §25).
- [ ] Internal errors return a friendly message while full detail is logged.
- [ ] Each request carries a `requestId` surfaced in error responses.

### Metadata

- Task ID: T-006
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E2 - Cross-Cutting Backend Concerns
- Source: TASKS.md (section)
---

## T-007: Structured logging (Pino) with log separation

**GitHub Issue Title:** [T-007] Structured logging (Pino) with log separation

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:s, milestone:m0, area:backend

### Description

- Integrate Pino with Info/Warning/Error/Audit separation (Rule 91). Redact passwords, tokens, PII (Rule 90).

### Dependencies

- T-002

### Acceptance Criteria

- [ ] Request logs include method, path, status, latency, requestId.
- [ ] Sensitive fields are never logged (verified by test).
- [ ] Log level configurable via env.

### Metadata

- Task ID: T-007
- Scope: MVP
- Priority: P0
- Complexity: S
- Epic: M0.E2 - Cross-Cutting Backend Concerns
- Source: TASKS.md (section)
---

## T-008: Security middleware baseline (Helmet, CORS, rate limit, sanitize)

**GitHub Issue Title:** [T-008] Security middleware baseline (Helmet, CORS, rate limit, sanitize)

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:backend

### Description

- Add Helmet (Rule 84), CORS whitelist (Rule 85), `express-rate-limit` scaffolding (Rule 86), and input sanitization against NoSQL injection/XSS (Rules 87-88).

### Dependencies

- T-006

### Acceptance Criteria

- [ ] Requests from non-whitelisted origins are rejected.
- [ ] Security headers present on all responses.
- [ ] A reusable rate-limiter factory exists for per-route limits (API §30).

### Metadata

- Task ID: T-008
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E2 - Cross-Cutting Backend Concerns
- Source: TASKS.md (section)
---

## T-009: MongoDB Atlas connection & Mongoose base conventions

**GitHub Issue Title:** [T-009] MongoDB Atlas connection & Mongoose base conventions

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:backend

### Description

- Connect to Atlas with pooling; define a base schema convention enabling `timestamps` (Rule 50), soft-delete plugin (`isDeleted/deletedAt/deletedBy`, DB §30), and `lean()`/pagination helpers (Rules 54-55).

### Dependencies

- T-002
- T-005

### Acceptance Criteria

- [ ] App connects to Atlas and handles disconnect/reconnect gracefully.
- [ ] A reusable pagination utility returns `meta {page,limit,total,pages}` (API §26).
- [ ] Soft-delete plugin excludes deleted docs from default queries.

### Metadata

- Task ID: T-009
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E2 - Cross-Cutting Backend Concerns
- Source: TASKS.md (section)
---

## T-010: Validation framework & request validator middleware

**GitHub Issue Title:** [T-010] Validation framework & request validator middleware

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:backend

### Description

- Wire Zod (or express-validator) as a `validate(schema)` middleware covering body/query/params/headers/files (Rule 9). Validation errors return the standard `errors[]` shape.

### Dependencies

- T-006

### Acceptance Criteria

- [ ] A sample validated route returns 422 with field-level errors on bad input.
- [ ] Validators live in `validators/` and are reusable.
- [ ] Never trusts client data (Rule 89).

### Metadata

- Task ID: T-010
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E2 - Cross-Cutting Backend Concerns
- Source: TASKS.md (section)
---

## T-011: Design tokens & theme system (light/dark/system)

**GitHub Issue Title:** [T-011] Design tokens & theme system (light/dark/system)

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:frontend

### Description

- Encode UI.md color palette, typography (Inter), 8-pt spacing, radius, and shadow tokens into Tailwind config. Implement instant theme switch with persistence, no refresh (UI §5).

### Dependencies

- T-003

### Acceptance Criteria

- [ ] Toggling theme updates the whole app instantly and persists across reloads.
- [ ] All tokens (colors/spacing/radius/typography) come from config, none hardcoded (Rule 35, 81).
- [ ] `prefers-color-scheme` respected for "system".

### Metadata

- Task ID: T-011
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E3 - Cross-Cutting Frontend Concerns
- Source: TASKS.md (section)
---

## T-012: Core reusable component library (shadcn-based)

**GitHub Issue Title:** [T-012] Core reusable component library (shadcn-based)

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m0, area:frontend

### Description

- Build the UI §47 shared components: Button, Input, Card, Modal, Drawer, Tabs, Accordion, Tooltip, Popover, Avatar, Badge, Chip, Progress, Skeleton, Spinner, Table, Dropdown, Breadcrumb, Pagination, Toast. Each with all interaction states (UI §16, Rule 60) and a11y.

### Dependencies

- T-011

### Acceptance Criteria

- [ ] Every component supports hover/focus/disabled/loading where relevant and dark mode.
- [ ] Components are documented with usage examples (Storybook or MDX/README).
- [ ] No file exceeds 300 lines (Rule 21); no duplication (Rule 3).

### Metadata

- Task ID: T-012
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M0.E3 - Cross-Cutting Frontend Concerns
- Source: TASKS.md (section)
---

## T-013: API client, interceptors & TanStack Query provider

**GitHub Issue Title:** [T-013] API client, interceptors & TanStack Query provider

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:frontend

### Description

- Configure Axios instance in `services/api` with base URL, auth header injection, refresh-on-401 interceptor, and request cancellation. Wrap app in TanStack Query provider. All API calls live in the service layer (Rule 34).

### Dependencies

- T-003
- T-006

### Acceptance Criteria

- [ ] A sample query hook fetches `/health` and caches it.
- [ ] 401 triggers a single refresh attempt then ret/logout.
- [ ] No component calls Axios directly.

### Metadata

- Task ID: T-013
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E3 - Cross-Cutting Frontend Concerns
- Source: TASKS.md (section)
---

## T-014: Global state stores (Zustand) & state boundaries

**GitHub Issue Title:** [T-014] Global state stores (Zustand) & state boundaries

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:s, milestone:m0, area:frontend

### Description

- Create Zustand stores for User, Theme, UI, Interview Session (Architecture §24). Enforce: no server data in Zustand (Rule 33).

### Dependencies

- T-013

### Acceptance Criteria

- [ ] Stores are typed, minimal, and free of server-cache data.
- [ ] Theme store integrates with T-011.
- [ ] Devtools middleware available in dev only.

### Metadata

- Task ID: T-014
- Scope: MVP
- Priority: P0
- Complexity: S
- Epic: M0.E3 - Cross-Cutting Frontend Concerns
- Source: TASKS.md (section)
---

## T-015: Global UX primitives: loading/empty/error/toast/error-boundary

**GitHub Issue Title:** [T-015] Global UX primitives: loading/empty/error/toast/error-boundary

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m0, area:frontend

### Description

- Implement reusable Skeleton screens, EmptyState (illustration+message+CTA, UI §23), ErrorState with retry (UI §25), toast system (UI §22), and a React error boundary. Never show blank screens (Rule 63).

### Dependencies

- T-012

### Acceptance Criteria

- [ ] A page can declare loading/empty/error states with one shared component each.
- [ ] Toasts support success/error/warning/info with auto-dismiss + manual close.
- [ ] Error boundary catches render errors and offers recovery.

### Metadata

- Task ID: T-015
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M0.E3 - Cross-Cutting Frontend Concerns
- Source: TASKS.md (section)
---

## T-016: GitHub Actions pipeline (install → lint → test → build)

**GitHub Issue Title:** [T-016] GitHub Actions pipeline (install → lint → test → build)

**Suggested Milestone:** M0: Foundation & Tooling

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m0, area:frontend

### Description

- Pipeline runs install, lint, tests, build for both workspaces on PR (TECH_STACK §21).

### Dependencies

- T-004

### Acceptance Criteria

- [ ] PRs are blocked on lint/test/build failure.
- [ ] Pipeline caches dependencies for speed.
- [ ] Status checks visible on the PR.
- [ ] --

### Metadata

- Task ID: T-016
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M0.E4 - CI/CD Skeleton
- Source: TASKS.md (section)
---

## T-017: User & RefreshToken models

**GitHub Issue Title:** [T-017] User & RefreshToken models

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m1, area:backend

### Description

- Implement `User` (DB §6) and `RefreshToken` (DB §26) schemas with indexes (email unique, provider, role) and soft-delete on User. Password never returned in queries by default (DB §31).

### Dependencies

- T-009

### Acceptance Criteria

- [ ] `email` unique index enforced; password field has `select:false`.
- [ ] `refreshTokenVersion` supports token invalidation.
- [ ] Timestamps present on both.

### Metadata

- Task ID: T-017
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M1.E1 - Data Models
- Source: TASKS.md (section)
---

## T-018: Profile & Settings models

**GitHub Issue Title:** [T-018] Profile & Settings models

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:s, milestone:m1, area:auth-identity

### Description

- Implement `Profile` (DB §7) and `Settings` (DB §21) with 1-1 relation to User.

### Dependencies

- T-017

### Acceptance Criteria

- [ ] Defaults created on user registration (theme=system, notifications on).
- [ ] `userId` indexed on both.
- [ ] Validation for enum fields (experienceLevel, theme).

### Metadata

- Task ID: T-018
- Scope: MVP
- Priority: P0
- Complexity: S
- Epic: M1.E1 - Data Models
- Source: TASKS.md (section)
---

## T-019: Password hashing & JWT service

**GitHub Issue Title:** [T-019] Password hashing & JWT service

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m1, area:auth-identity

### Description

- bcrypt hashing (Rule 11); JWT access + refresh token service with refresh stored as HTTP-only cookie (API §4, TECH_STACK Auth). Refresh token rotation + version check.

### Dependencies

- T-017

### Acceptance Criteria

- [ ] Passwords are hashed, never stored/logged in plaintext.
- [ ] Access token short-lived; refresh long-lived and rotated on use.
- [ ] Compromised/old refresh tokens are rejected via version.

### Metadata

- Task ID: T-019
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M1.E2 - Auth Services & Endpoints
- Source: TASKS.md (section)
---

## T-020: Signup / Login / Logout / Refresh endpoints

**GitHub Issue Title:** [T-020] Signup / Login / Logout / Refresh endpoints

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m1, area:auth-identity

### Description

- Implement `POST /auth/signup`, `/auth/login`, `/auth/logout`, `/auth/refresh` (API §6) with validation, rate limit 5/min on auth (API §30), and standard envelope.

### Dependencies

- T-019
- T-010
- T-018

### Acceptance Criteria

- [ ] Duplicate email returns 409; invalid credentials return 401 with generic message.
- [ ] Signup provisions Profile + Settings + Progress rows.
- [ ] Logout invalidates refresh token (bumps version).

### Metadata

- Task ID: T-020
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M1.E2 - Auth Services & Endpoints
- Source: TASKS.md (section)
---

## T-021: Auth middleware & role-based authorization

**GitHub Issue Title:** [T-021] Auth middleware & role-based authorization

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m1, area:auth-identity

### Description

- `requireAuth` verifies JWT on every protected endpoint (Rule 10); `requireRole` for admin routes (Architecture §27).

### Dependencies

- T-019

### Acceptance Criteria

- [ ] Missing/invalid token returns 401; wrong role returns 403.
- [ ] Middleware attaches sanitized user to request.
- [ ] Applied to all protected routes by default.

### Metadata

- Task ID: T-021
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M1.E2 - Auth Services & Endpoints
- Source: TASKS.md (section)
---

## T-022: Change password, forgot & reset password

**GitHub Issue Title:** [T-022] Change password, forgot & reset password

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m1, area:auth-identity

### Description

- `PUT /auth/change-password`, `POST /auth/forgot-password`, `POST /auth/reset-password` (API §6). Email delivery may be stubbed initially (FEATURES 1.4 marks email integration Future).

### Dependencies

- T-020

### Acceptance Criteria

- [ ] Reset tokens are single-use and time-limited.
- [ ] Changing password invalidates existing refresh tokens.
- [ ] Forgot-password does not reveal whether an email exists.

### Metadata

- Task ID: T-022
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M1.E2 - Auth Services & Endpoints
- Source: TASKS.md (section)
---

## T-023: Email verification (scaffold)

**GitHub Issue Title:** [T-023] Email verification (scaffold)

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:future, priority:p2, complexity:m, milestone:m1, area:auth-identity

### Description

- `POST /auth/verify-email` and `emailVerified` handling (Architecture §22 marks Future).

### Dependencies

- T-020

### Acceptance Criteria

- [ ] Verification token flow implemented; email send behind a provider interface.
- [ ] Unverified state does not block MVP login (configurable).

### Metadata

- Task ID: T-023
- Scope: Future
- Priority: P2
- Complexity: M
- Epic: M1.E2 - Auth Services & Endpoints
- Source: TASKS.md (section)
---

## T-024: Auth pages (signup/login/forgot/reset)

**GitHub Issue Title:** [T-024] Auth pages (signup/login/forgot/reset)

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m1, area:auth-identity

### Description

- Build forms with React Hook Form + Zod, password strength meter, real-time validation, submit disabled while loading (Rule 37), input preserved on failure (UI §19).

### Dependencies

- T-012
- T-013
- T-020

### Acceptance Criteria

- [ ] Client validation mirrors server rules; server errors render inline.
- [ ] Fully responsive, dark-mode, keyboard-accessible.
- [ ] Password strength meter reflects policy.

### Metadata

- Task ID: T-024
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M1.E3 - Frontend Auth
- Source: TASKS.md (section)
---

## T-025: Auth store, session restore & protected routes

**GitHub Issue Title:** [T-025] Auth store, session restore & protected routes

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m1, area:auth-identity

### Description

- Zustand auth state, auto-login via refresh on app load, auto-logout on session timeout, and route guards for Dashboard/Interview/Reports/History/Settings (FEATURES 1.5-1.6).

### Dependencies

- T-024
- T-014
- T-021

### Acceptance Criteria

- [ ] Refreshing the browser keeps the user logged in when refresh token valid.
- [ ] Unauthenticated access to protected routes redirects to login.
- [ ] Expiry triggers graceful logout with a toast.

### Metadata

- Task ID: T-025
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M1.E3 - Frontend Auth
- Source: TASKS.md (section)
---

## T-026: Profile endpoints & page

**GitHub Issue Title:** [T-026] Profile endpoints & page

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m1, area:auth-identity

### Description

- `GET /users/me`, `PUT /users/profile`, `DELETE /users/account` (API §7) + Profile page (UI §34): avatar, skills, preferred role, counts.

### Dependencies

- T-021
- T-018
- T-024

### Acceptance Criteria

- [ ] Profile edits validated and persisted; delete does soft-delete (DB §30).
- [ ] Page shows loading/empty/error states.
- [ ] Account deletion requires confirmation modal (Rule 64).

### Metadata

- Task ID: T-026
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M1.E4 - Profile & Settings
- Source: TASKS.md (section)
---

## T-027: Avatar upload

**GitHub Issue Title:** [T-027] Avatar upload

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m1, area:auth-identity

### Description

- `POST /users/avatar` (multipart) storing to Cloudinary; validate PNG/JPG/JPEG + max size (FEATURES 2.2, Rule 38).

### Dependencies

- T-026
- T-034 (upload service)

### Acceptance Criteria

- [ ] MIME + extension + size validated server-side.
- [ ] Old avatar replaced; only metadata/URL stored in Mongo (Rule 39).
- [ ] Preview updates immediately after upload.

### Metadata

- Task ID: T-027
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M1.E4 - Profile & Settings
- Source: TASKS.md (section)
---

## T-028: Settings endpoints & page

**GitHub Issue Title:** [T-028] Settings endpoints & page

**Suggested Milestone:** M1: Authentication & Identity

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m1, area:auth-identity

### Description

- `GET/PUT /settings` (API §19) + Settings page (UI §35): theme, audio, camera, privacy (audio recording, camera usage, transcript storage), account management.

### Dependencies

- T-021
- T-018

### Acceptance Criteria

- [ ] Settings persist and drive runtime behavior (e.g., voice/camera toggles).
- [ ] Privacy toggles honored by interview modules.
- [ ] Destructive actions confirmed.
- [ ] --

### Metadata

- Task ID: T-028
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M1.E4 - Profile & Settings
- Source: TASKS.md (section)
---

## T-029: App layout, routing & lazy loading

**GitHub Issue Title:** [T-029] App layout, routing & lazy loading

**Suggested Milestone:** M2: App Shell, Landing & Dashboard

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m2, area:frontend

### Description

- React Router structure with layouts (auth/app), lazy-loaded route bundles, code splitting (Architecture §28, UI §46).

### Dependencies

- T-025

### Acceptance Criteria

- [ ] Routes are lazy-loaded with skeleton fallbacks.
- [ ] Layout composition avoids duplication across pages.
- [ ] Deep links work and respect auth guards.

### Metadata

- Task ID: T-029
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M2.E1 - Layout & Navigation
- Source: TASKS.md (section)
---

## T-030: Sidebar, Navbar & responsive navigation

**GitHub Issue Title:** [T-030] Sidebar, Navbar & responsive navigation

**Suggested Milestone:** M2: App Shell, Landing & Dashboard

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m2, area:frontend

### Description

- Sidebar (Dashboard/Interviews/Coding/Reports/History/Learning/Achievements/Settings/Logout, UI §14), Navbar (logo/search/notifications/theme/avatar, UI §15), mobile bottom nav + drawer (UI §11, §45).

### Dependencies

- T-029
- T-012

### Acceptance Criteria

- [ ] Fully responsive across xs-2xl breakpoints.
- [ ] Active route highlighted; smooth collapse animation.
- [ ] Keyboard navigable with visible focus.

### Metadata

- Task ID: T-030
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M2.E1 - Layout & Navigation
- Source: TASKS.md (section)
---

## T-031: Landing page & sections

**GitHub Issue Title:** [T-031] Landing page & sections

**Suggested Milestone:** M2: App Shell, Landing & Dashboard

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m2, area:frontend

### Description

- Hero, feature showcase (AI interview/coding/reports/dashboard/voice/resume), FAQ, footer with "Start Free Interview" CTA (FEATURES 3.1-3.6). Testimonials/contact are Future placeholders.

### Dependencies

- T-012
- T-011

### Acceptance Criteria

- [ ] Responsive, accessible, dark-mode landing with subtle Framer Motion.
- [ ] CTA routes to signup/interview setup.
- [ ] Lighthouse performance budget respected (lazy media).

### Metadata

- Task ID: T-031
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M2.E2 - Landing Website
- Source: TASKS.md (section)
---

## T-032: Dashboard aggregation endpoints

**GitHub Issue Title:** [T-032] Dashboard aggregation endpoints

**Suggested Milestone:** M2: App Shell, Landing & Dashboard

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m2, area:frontend

### Description

- `GET /dashboard`, `/dashboard/weekly`, `/dashboard/monthly`, `/dashboard/topics/strong|weak`, `/dashboard/statistics` (API §15). Reads from Progress/Analytics (may return zero-state before data exists).

### Dependencies

- T-021
- T-018

### Acceptance Criteria

- [ ] Aggregations are paginated/lean where relevant and indexed.
- [ ] Endpoints return graceful empty data for new users.
- [ ] Response times acceptable with proper indexes.

### Metadata

- Task ID: T-032
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M2.E3 - Dashboard
- Source: TASKS.md (section)
---

## T-033: Dashboard home UI (widgets, charts, quick actions)

**GitHub Issue Title:** [T-033] Dashboard home UI (widgets, charts, quick actions)

**Suggested Milestone:** M2: App Shell, Landing & Dashboard

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m2, area:frontend

### Description

- Widgets: total interviews, practice hours, average score, last interview, streak, quick actions (start interview/resume upload/coding/roadmap), weekly line + monthly bar charts, recent activity, skill snapshot (FEATURES 4.x, UI §26).

### Dependencies

- T-032
- T-030
- T-039 (charts)

### Acceptance Criteria

- [ ] Empty state for zero interviews with a Start CTA.
- [ ] Charts render in light/dark and are responsive.
- [ ] Data fetched via TanStack Query with caching.
- [ ] --

### Metadata

- Task ID: T-033
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M2.E3 - Dashboard
- Source: TASKS.md (section)
---

## T-034: Cloudinary upload service & Multer pipeline

**GitHub Issue Title:** [T-034] Cloudinary upload service & Multer pipeline

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m3, area:resume-jd

### Description

- Multer memory storage + Cloudinary upload service; validate type/size/extension/MIME (Rule 38, Architecture §23). Store only metadata (`publicId,url,secureUrl,mimeType,size`) in Mongo (DB §32, Rule 40).

### Dependencies

- T-008

### Acceptance Criteria

- [ ] Rejects disallowed MIME types and oversized files with clear errors.
- [ ] Returns a stable metadata object for persistence.
- [ ] Temporary artifacts cleaned up after processing (DB §35).

### Metadata

- Task ID: T-034
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M3.E1 - Uploads & Storage
- Source: TASKS.md (section)
---

## T-035: AI provider abstraction (Gemini/Groq/OpenRouter)

**GitHub Issue Title:** [T-035] AI provider abstraction (Gemini/Groq/OpenRouter)

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m3, area:ai-interview

### Description

- `AIService` interface with `GeminiProvider` (primary), `GroqProvider`, `OpenRouterProvider` (fallbacks). Provider switch requires minimal change (Architecture §14). Controllers never call LLMs directly (Rule 7). Includes retry/fallback + timeout + token/usage logging.

### Dependencies

- T-005
- T-007

### Acceptance Criteria

- [ ] Switching primary provider is a config change, not code rewrite.
- [ ] On primary failure, fallback provider is used transparently with logging.
- [ ] AI request/latency/token metrics logged (for §24.7 analytics).

### Metadata

- Task ID: T-035
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M3.E2 - AI Provider Layer (shared foundation)
- Source: TASKS.md (section)
---

## T-036: Prompt system & versioning

**GitHub Issue Title:** [T-036] Prompt system & versioning

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m3, area:ai-interview

### Description

- Modular prompt files under `backend/prompts/{technical,hr,behavior,coding,report,systemDesign,resume,jd}` (Rules 41-43, Architecture §15). `PromptVersion` collection (DB §22) tracks history and active version.

### Dependencies

- T-035
- T-009

### Acceptance Criteria

- [ ] No prompt strings live in services/controllers.
- [ ] Prompt builder composes context (resume/JD/history/difficulty) into provider input.
- [ ] Active prompt version resolvable at runtime.

### Metadata

- Task ID: T-036
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M3.E2 - AI Provider Layer (shared foundation)
- Source: TASKS.md (section)
---

## T-037: Response formatter & safe JSON parsing

**GitHub Issue Title:** [T-037] Response formatter & safe JSON parsing

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m3, area:ai-interview

### Description

- Formatter layer that validates/repairs LLM output into typed structures (question, evaluation, report) before returning to controller (Architecture §13).

### Dependencies

- T-035

### Acceptance Criteria

- [ ] Malformed AI output is retried/repaired or fails gracefully with a friendly error.
- [ ] Output schemas validated (Zod) before persistence.
- [ ] Never leaks raw provider errors to client.

### Metadata

- Task ID: T-037
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M3.E2 - AI Provider Layer (shared foundation)
- Source: TASKS.md (section)
---

## T-038: Resume model & upload/list/get/delete endpoints

**GitHub Issue Title:** [T-038] Resume model & upload/list/get/delete endpoints

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m3, area:backend

### Description

- `Resume` schema (DB §8) + `POST /resumes/upload`, `GET /resumes`, `GET /resumes/:id`, `DELETE /resumes/:id` (API §8). PDF (MVP), DOCX (Future).

### Dependencies

- T-034
- T-021

### Acceptance Criteria

- [ ] Upload stores metadata + Cloudinary URL; soft-delete supported.
- [ ] Ownership enforced (user can only access own resumes).
- [ ] List paginated.

### Metadata

- Task ID: T-038
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M3.E3 - Resume Intelligence
- Source: TASKS.md (section)
---

## T-039: Resume parsing service (PyMuPDF/pdfplumber)

**GitHub Issue Title:** [T-039] Resume parsing service (PyMuPDF/pdfplumber)

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m3, area:resume-jd

### Description

- `POST /resumes/:id/parse` extracting text via PyMuPDF (fallback pdfplumber). Runs as an isolated parsing service/worker; populates `parsed` + raw text (FEATURES 2.4).

### Dependencies

- T-038

### Acceptance Criteria

- [ ] Handles common PDF layouts; returns partial results gracefully on hard PDFs.
- [ ] Parsing is idempotent and re-runnable.
- [ ] Long parses do not block the request thread (async/job-friendly).

### Metadata

- Task ID: T-039
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M3.E3 - Resume Intelligence
- Source: TASKS.md (section)
---

## T-040: AI extraction: skills, projects, experience, education, certs

**GitHub Issue Title:** [T-040] AI extraction: skills, projects, experience, education, certs

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m3, area:resume-jd

### Description

- Use AI + heuristics to extract structured skills/projects/experience/education/certifications/summary (FEATURES 6.1-6.5). Populate Resume + Skill Profile.

### Dependencies

- T-039
- T-036

### Acceptance Criteria

- [ ] Extracted entities stored in normalized fields on Resume.
- [ ] Projects include name/tech stack/description for later question generation.
- [ ] Certifications recognized (AWS/Azure/GCP/Coursera/etc.).

### Metadata

- Task ID: T-040
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M3.E3 - Resume Intelligence
- Source: TASKS.md (section)
---

## T-041: Resume weakness detection

**GitHub Issue Title:** [T-041] Resume weakness detection

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m3, area:resume-jd

### Description

- Detect missing GitHub, weak project descriptions, missing metrics/achievements (FEATURES 6.6). Surfaced only after interview.

### Dependencies

- T-040

### Acceptance Criteria

- [ ] Produces a structured list of weaknesses with suggestions.
- [ ] Not shown during an active interview (Rule 45 spirit).
- [ ] Deterministic enough to be testable on sample resumes.

### Metadata

- Task ID: T-041
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M3.E3 - Resume Intelligence
- Source: TASKS.md (section)
---

## T-042: JD model & upload/parse/get/delete endpoints

**GitHub Issue Title:** [T-042] JD model & upload/parse/get/delete endpoints

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m3, area:backend

### Description

- `JobDescription` schema (DB §9) + `POST /job-descriptions/upload`, `POST /job-descriptions/:id/parse`, `GET`, `DELETE` (API §9). Extract required/preferred skills, responsibilities, experience, education, keywords (FEATURES 7.1).

### Dependencies

- T-034
- T-021
- T-036

### Acceptance Criteria

- [ ] JD parse populates structured skill/responsibility fields.
- [ ] Supports paste-text and file upload paths.
- [ ] Ownership + pagination enforced.

### Metadata

- Task ID: T-042
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M3.E4 - Job Description Intelligence
- Source: TASKS.md (section)
---

## T-043: Resume ↔ JD matching & gap analysis

**GitHub Issue Title:** [T-043] Resume ↔ JD matching & gap analysis

**Suggested Milestone:** M3: Resume & JD Intelligence

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m3, area:resume-jd

### Description

- `POST /job-descriptions/:id/match` returning match %, missing skills, matching skills, recommendations (API §9, FEATURES 5.11 / 7.2-7.4).

### Dependencies

- T-040
- T-042

### Acceptance Criteria

- [ ] Match score is explainable (lists matched vs missing skills).
- [ ] Recommendations feed the learning module post-interview.
- [ ] Handles missing resume or JD gracefully.
- [ ] --

### Metadata

- Task ID: T-043
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M3.E4 - Job Description Intelligence
- Source: TASKS.md (section)
---

## T-044: Interview session, question & answer models

**GitHub Issue Title:** [T-044] Interview session, question & answer models

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m4, area:backend

### Description

- `InterviewSession` (DB §10), `InterviewQuestion` (DB §11), `InterviewAnswer` (DB §12) with indexes (userId, status, createdAt, difficulty, companyMode) and status enum (Pending/Active/Paused/Completed/Cancelled).

### Dependencies

- T-009

### Acceptance Criteria

- [ ] Relations and indexes match DB §28-29.
- [ ] Validation for difficulty/type/duration enums (DB §31).
- [ ] AI memory field present on session.

### Metadata

- Task ID: T-044
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M4.E1 - Interview Data Models
- Source: TASKS.md (section)
---

## T-045: Interview template & question-bank models

**GitHub Issue Title:** [T-045] Interview template & question-bank models

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:s, milestone:m4, area:backend

### Description

- `InterviewTemplate` (DB §23) and static question bank support for fallback (FEATURES 13.2).

### Dependencies

- T-044

### Acceptance Criteria

- [ ] Templates reusable across sessions.
- [ ] Static bank tagged by topic/difficulty/company (FEATURES 13.4-13.6).
- [ ] Duplicate-prevention keys available per session (FEATURES 13.3).

### Metadata

- Task ID: T-045
- Scope: MVP
- Priority: P1
- Complexity: S
- Epic: M4.E1 - Interview Data Models
- Source: TASKS.md (section)
---

## T-046: Interview setup wizard (multi-step) UI

**GitHub Issue Title:** [T-046] Interview setup wizard (multi-step) UI

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m4, area:frontend

### Description

- 7-step wizard: role → experience → company → type → difficulty → resume → JD, plus summary screen (FEATURES 5.1-5.12, UI §27).

### Dependencies

- T-029
- T-012
- T-038
- T-042

### Acceptance Criteria

- [ ] Steps validate before advancing; back/forward preserves choices.
- [ ] Optional resume/JD steps skippable.
- [ ] Summary shows role/difficulty/company/estimated questions & time before start.

### Metadata

- Task ID: T-046
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M4.E2 - Interview Setup
- Source: TASKS.md (section)
---

## T-047: Start interview endpoint & session bootstrap

**GitHub Issue Title:** [T-047] Start interview endpoint & session bootstrap

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m4, area:ai-interview

### Description

- `POST /interviews` creating a personalized session storing profile/resume/JD/role/company/difficulty and initializing AI memory (API §10, FEATURES 8.1).

### Dependencies

- T-044
- T-046
- T-036

### Acceptance Criteria

- [ ] Session persists all configuration and returns session id + first-question handle.
- [ ] Rate-limited per API §30 (interview 60/min).
- [ ] Invalid config rejected with field errors.

### Metadata

- Task ID: T-047
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M4.E2 - Interview Setup
- Source: TASKS.md (section)
---

## T-048: Question generation service (per type) + duplicate prevention

**GitHub Issue Title:** [T-048] Question generation service (per type) + duplicate prevention

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m4, area:ai-interview

### Description

- Generate technical/HR/behavioral/coding/follow-up questions (`/ai/questions/*`, API §11) with topic/difficulty tagging and no in-session duplicates (FEATURES 8.x, 13.1-13.5).

### Dependencies

- T-047
- T-037

### Acceptance Criteria

- [ ] Questions are personalized from resume/JD/history.
- [ ] No duplicate questions within a session.
- [ ] Falls back to static bank on AI failure.

### Metadata

- Task ID: T-048
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M4.E3 - Question & Answer Flow
- Source: TASKS.md (section)
---

## T-049: Submit answer & per-answer evaluation capture

**GitHub Issue Title:** [T-049] Submit answer & per-answer evaluation capture

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m4, area:ai-interview

### Description

- `POST /interviews/:id/answer` and `/ai/evaluate` storing answer + hidden evaluation (technical/communication/etc.), thinking/response times (API §10-11, DB §12).

### Dependencies

- T-048

### Acceptance Criteria

- [ ] Evaluation stored but never revealed during the interview (Rule 45, FEATURES 17.8).
- [ ] Timing metrics captured for analytics.
- [ ] Answer persisted even if evaluation is deferred.

### Metadata

- Task ID: T-049
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M4.E3 - Question & Answer Flow
- Source: TASKS.md (section)
---

## T-050: Context memory service

**GitHub Issue Title:** [T-050] Context memory service

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m4, area:ai-interview

### Description

- Maintain conversation memory (previous Q/A, technologies mentioned, strengths/weaknesses) inside the Interview Service (Rule 44, FEATURES 8.4).

### Dependencies

- T-049

### Acceptance Criteria

- [ ] Memory prevents repeated questions and enables references to prior answers.
- [ ] Memory size bounded/summarized to fit context windows.
- [ ] Persisted so sessions can resume.

### Metadata

- Task ID: T-050
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M4.E3 - Question & Answer Flow
- Source: TASKS.md (section)
---

## T-051: Adaptive difficulty engine

**GitHub Issue Title:** [T-051] Adaptive difficulty engine

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m4, area:ai-interview

### Description

- Adjust difficulty from accuracy/confidence/communication/topic mastery; skip easy questions for strong candidates; add foundational ones for weak (FEATURES 8.11-8.12, Architecture §19).

### Dependencies

- T-050

### Acceptance Criteria

- [ ] Difficulty transitions are gradual and logged.
- [ ] Strong performers escalate; struggling candidates get easier questions/hints.
- [ ] Never random - decisions tied to measured signals.

### Metadata

- Task ID: T-051
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M4.E3 - Question & Answer Flow
- Source: TASKS.md (section)
---

## T-052: AI follow-up & topic-switching engine

**GitHub Issue Title:** [T-052] AI follow-up & topic-switching engine

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m4, area:ai-interview

### Description

- Concept/project/cross-topic/optimization/scalability/edge-case/real-world follow-ups (Module 18); topic switching to avoid monotony (FEATURES 8.14).

### Dependencies

- T-050

### Acceptance Criteria

- [ ] Follow-ups reference candidate's own answers/projects.
- [ ] Topic rotation prevents long single-topic streaks.
- [ ] Clarification and "why/how" probing supported (FEATURES 8.6-8.8).

### Metadata

- Task ID: T-052
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M4.E3 - Question & Answer Flow
- Source: TASKS.md (section)
---

## T-053: Interviewer personality & company modes

**GitHub Issue Title:** [T-053] Interviewer personality & company modes

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m4, area:ai-interview

### Description

- Personality modes (Friendly/Professional/Strict/Startup/FAANG/HR/Behavioral) and company-style modes via prompt engineering only - no proprietary data (FEATURES 8.2, 5.5; API §21 `/companies`).

### Dependencies

- T-048
- T-036

### Acceptance Criteria

- [ ] Selected personality visibly changes tone and follow-up depth.
- [ ] `GET /companies`, `/companies/:company`, and generation endpoint implemented.
- [ ] Company modes documented as stylistic, not proprietary.

### Metadata

- Task ID: T-053
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M4.E3 - Question & Answer Flow
- Source: TASKS.md (section)
---

## T-054: Hint engine (practice mode)

**GitHub Issue Title:** [T-054] Hint engine (practice mode)

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m4, area:ai-interview

### Description

- Gentle hints when a candidate struggles, without revealing full answers (FEATURES 8.13).

### Dependencies

- T-051

### Acceptance Criteria

- [ ] Hints escalate progressively and never give the solution outright.
- [ ] Available only in practice mode / configurable.
- [ ] Logged for report ("needed hints").

### Metadata

- Task ID: T-054
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M4.E3 - Question & Answer Flow
- Source: TASKS.md (section)
---

## T-055: Interview lifecycle endpoints (get/question/next/pause/resume/finish/cancel/history)

**GitHub Issue Title:** [T-055] Interview lifecycle endpoints (get/question/next/pause/resume/finish/cancel/history)

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m4, area:resume-jd

### Description

- Implement `GET /interviews/:id`, `/question`, `POST /next`, `PATCH /pause|resume|finish`, `DELETE /:id`, `GET /interviews/history` (API §10).

### Dependencies

- T-049

### Acceptance Criteria

- [ ] State transitions validated (can't answer a completed session).
- [ ] History paginated + filterable.
- [ ] Finish triggers report generation pipeline (M7).

### Metadata

- Task ID: T-055
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M4.E4 - Session Lifecycle & Live Experience
- Source: TASKS.md (section)
---

## T-056: WebSocket interview namespace & events

**GitHub Issue Title:** [T-056] WebSocket interview namespace & events

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m4, area:ai-interview

### Description

- Socket.io `/interview` namespace; client events (joinInterview/leaveInterview/submitAnswer/typing/voiceChunk/cameraStatus/heartbeat) and server events (questionGenerated/followUpQuestion/answerEvaluated/timerUpdated/interviewCompleted/voiceResponse/warning/error) (API §24, Rules 48-49).

### Dependencies

- T-047

### Acceptance Criteria

- [ ] Events namespaced and camelCase; auth enforced on socket handshake.
- [ ] Timer updates and question delivery flow over sockets.
- [ ] Reconnect handling preserves session.

### Metadata

- Task ID: T-056
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M4.E4 - Session Lifecycle & Live Experience
- Source: TASKS.md (section)
---

## T-057: Live interview screen UI

**GitHub Issue Title:** [T-057] Live interview screen UI

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m4, area:frontend

### Description

- Interview lobby, 3-2-1 countdown, AI card, question display, answer area, timer (elapsed/remaining), question number, progress bar, "AI is thinking" indicator, natural pauses, end-interview flow (Module 17, UI §28).

### Dependencies

- T-056
- T-030

### Acceptance Criteria

- [ ] No correctness/score feedback shown mid-interview (FEATURES 17.8).
- [ ] Immersive, distraction-free, responsive layout.
- [ ] Progress + timers update live via sockets.

### Metadata

- Task ID: T-057
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M4.E4 - Session Lifecycle & Live Experience
- Source: TASKS.md (section)
---

## T-058: Session recovery / auto-save

**GitHub Issue Title:** [T-058] Session recovery / auto-save

**Suggested Milestone:** M4: AI Interview Engine (Core)

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m4, area:platform

### Description

- Auto-save session progress; restore on browser refresh (Rules 65-66, FEATURES 17.9).

### Dependencies

- T-055
- T-050

### Acceptance Criteria

- [ ] Refresh restores current question, timer, and answered state.
- [ ] No user input lost unexpectedly.
- [ ] Recovery works after transient disconnects.
- [ ] --

### Metadata

- Task ID: T-058
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M4.E4 - Session Lifecycle & Live Experience
- Source: TASKS.md (section)
---

## T-059: Coding question & submission models

**GitHub Issue Title:** [T-059] Coding question & submission models

**Suggested Milestone:** M5: Coding Interview Platform

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m5, area:backend

### Description

- `CodingQuestion` (DB §13) and `CodingSubmission` (DB §14) with topic/company tags, sample + hidden tests, expected complexity.

### Dependencies

- T-009

### Acceptance Criteria

- [ ] Hidden tests never serialized to the client.
- [ ] Submissions store language/source/time/memory/passed counts/judgeResult.
- [ ] Indexed by user/session/question.

### Metadata

- Task ID: T-059
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M5.E1 - Coding Data & Execution
- Source: TASKS.md (section)
---

## T-060: Judge0 integration service

**GitHub Issue Title:** [T-060] Judge0 integration service

**Suggested Milestone:** M5: Coding Interview Platform

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m5, area:coding

### Description

- Judge0 CE client with language mapping, time/memory limits, base64 encoding, polling/callback (FEATURES 14.8-14.12, TECH_STACK §9). Rate limit 20 submissions/min (API §30).

### Dependencies

- T-059
- T-008

### Acceptance Criteria

- [ ] Run against sample tests; submit against hidden tests.
- [ ] Handles compile errors, runtime errors, TLE, MLE, wrong answer distinctly.
- [ ] No user code executes locally.

### Metadata

- Task ID: T-060
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M5.E1 - Coding Data & Execution
- Source: TASKS.md (section)
---

## T-061: Run & Submit endpoints

**GitHub Issue Title:** [T-061] Run & Submit endpoints

**Suggested Milestone:** M5: Coding Interview Platform

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m5, area:coding

### Description

- `POST /coding/run`, `POST /coding/submit`, `GET /coding/questions`, `GET /coding/questions/:id`, `GET /coding/submissions/:id` (API §12).

### Dependencies

- T-060

### Acceptance Criteria

- [ ] Run returns per-sample output; submit returns pass/fail counts + metrics.
- [ ] Filtering by difficulty/topic/company on list.
- [ ] Ownership + rate limits enforced.

### Metadata

- Task ID: T-061
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M5.E1 - Coding Data & Execution
- Source: TASKS.md (section)
---

## T-062: Coding question generator

**GitHub Issue Title:** [T-062] Coding question generator

**Suggested Milestone:** M5: Coding Interview Platform

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m5, area:ai-interview

### Description

- `POST /ai/questions/coding` generating role/difficulty/company-appropriate problems and mapping to the coding library categories (FEATURES 14.4-14.5).

### Dependencies

- T-048
- T-059

### Acceptance Criteria

- [ ] Generated problems include description, constraints, examples, starter code, tests.
- [ ] Difficulty selectable (Easy/Medium/Hard/company/topic).
- [ ] Falls back to curated library on AI failure.

### Metadata

- Task ID: T-062
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M5.E1 - Coding Data & Execution
- Source: TASKS.md (section)
---

## T-063: Monaco editor integration & coding screen

**GitHub Issue Title:** [T-063] Monaco editor integration & coding screen

**Suggested Milestone:** M5: Coding Interview Platform

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m5, area:frontend

### Description

- Monaco with syntax highlighting, language select, autosave (local + periodic sync), full-screen, themes; question panel/console/output/run/submit/timer layout (FEATURES 14.2-14.3, 14.13, UI §29).

### Dependencies

- T-061
- T-030

### Acceptance Criteria

- [ ] Language switch updates starter code + highlighting.
- [ ] Autosave prevents loss on refresh; syncs during active interview.
- [ ] Console shows sample/hidden (masked) results, errors, timers, progress.

### Metadata

- Task ID: T-063
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M5.E2 - Coding UI & AI Review
- Source: TASKS.md (section)
---

## T-064: AI code review, complexity & optimization

**GitHub Issue Title:** [T-064] AI code review, complexity & optimization

**Suggested Milestone:** M5: Coding Interview Platform

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m5, area:frontend

### Description

- `POST /coding/review`, `/coding/optimize` for readability/naming/logic/edge cases, estimated time/space complexity, and optimization + debugging hints (FEATURES 14.14-14.17).

### Dependencies

- T-061
- T-036

### Acceptance Criteria

- [ ] Review suggests improvements without rewriting the whole solution.
- [ ] Complexity clearly labeled as an estimate.
- [ ] Debugging hints never reveal the full solution.
- [ ] --

### Metadata

- Task ID: T-064
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M5.E2 - Coding UI & AI Review
- Source: TASKS.md (section)
---

## T-065: Speech-to-Text endpoint (Groq Whisper)

**GitHub Issue Title:** [T-065] Speech-to-Text endpoint (Groq Whisper)

**Suggested Milestone:** M6: Voice Interview

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m6, area:voice

### Description

- `POST /voice/stt` using Groq Whisper (fallback OpenAI Whisper), streaming audio chunks from the socket (FEATURES 15.1, API §13).

### Dependencies

- T-035
- T-008

### Acceptance Criteria

- [ ] Accepts standard browser audio formats; returns transcript.
- [ ] Handles silence/empty audio gracefully.
- [ ] Respects privacy settings (transcript storage opt-in).

### Metadata

- Task ID: T-065
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M6.E1 - Speech Services
- Source: TASKS.md (section)
---

## T-066: Text-to-Speech endpoint (Edge TTS)

**GitHub Issue Title:** [T-066] Text-to-Speech endpoint (Edge TTS)

**Suggested Milestone:** M6: Voice Interview

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m6, area:voice

### Description

- `POST /voice/tts` via Microsoft Edge TTS (fallback Kokoro), voice/speed configurable from settings (FEATURES 15.2, API §13).

### Dependencies

- T-035

### Acceptance Criteria

- [ ] Returns playable audio for AI questions.
- [ ] Voice/speed/volume configurable per user settings.
- [ ] Cached where the same text recurs.

### Metadata

- Task ID: T-066
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M6.E1 - Speech Services
- Source: TASKS.md (section)
---

## T-067: Voice conversation loop & controls

**GitHub Issue Title:** [T-067] Voice conversation loop & controls

**Suggested Milestone:** M6: Voice Interview

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m6, area:voice

### Description

- Full AI-speaks → candidate-speaks → STT → AI-response → TTS loop over sockets, with mute/unmute/volume/replay controls and mic detection (FEATURES 15.3-15.6).

### Dependencies

- T-065
- T-066
- T-056

### Acceptance Criteria

- [ ] Smooth turn-taking; replay last question works.
- [ ] Mic permission/availability detected with clear prompts.
- [ ] Degrades gracefully to text mode if audio unavailable.

### Metadata

- Task ID: T-067
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M6.E1 - Speech Services
- Source: TASKS.md (section)
---

## T-068: Speech analytics (silence, speed, fillers, quality) & transcript

**GitHub Issue Title:** [T-068] Speech analytics (silence, speed, fillers, quality) & transcript

**Suggested Milestone:** M6: Voice Interview

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m6, area:voice

### Description

- `POST /voice/analyze` returning speaking speed, fluency, filler counts, clarity; silence + audio-quality detection; full transcript generation (FEATURES 15.5, 15.7-15.10).

### Dependencies

- T-067

### Acceptance Criteria

- [ ] Filler words (um/uh/like/basically/actually) counted approximately.
- [ ] Silence beyond threshold prompts a repeat offer.
- [ ] Transcript available for post-interview review.

### Metadata

- Task ID: T-068
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M6.E1 - Speech Services
- Source: TASKS.md (section)
---

## T-069: Voice UI states & waveform

**GitHub Issue Title:** [T-069] Voice UI states & waveform

**Suggested Milestone:** M6: Voice Interview

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m6, area:frontend

### Description

- Listening/Thinking/Speaking/Muted/Disconnected indicators + reactive waveform (UI §42).

### Dependencies

- T-067
- T-012

### Acceptance Criteria

- [ ] Waveform reacts to real audio input.
- [ ] State transitions are obvious and accessible (not color-only).
- [ ] Works in dark mode and on mobile.
- [ ] --

### Metadata

- Task ID: T-069
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M6.E2 - Voice UI
- Source: TASKS.md (section)
---

## T-070: Answer & multi-dimensional scoring

**GitHub Issue Title:** [T-070] Answer & multi-dimensional scoring

**Suggested Milestone:** M7: Evaluation & Reports

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m7, area:ai-interview

### Description

- Score technical/communication/problem-solving/coding/behavioral per answer and aggregate (Module 19, DB §12/§15).

### Dependencies

- T-049
- T-037

### Acceptance Criteria

- [ ] Each score 0-100 with justification tied to actual answers (not generic).
- [ ] Coding score integrates test results + AI review.
- [ ] Behavioral uses STAR where applicable (FEATURES 11.1).

### Metadata

- Task ID: T-070
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M7.E1 - Evaluation Engine
- Source: TASKS.md (section)

### Notes

- All confidence/behavior signals are estimates, per FEATURES wording - never presented as certainties.
---

## T-071: Report model & generation

**GitHub Issue Title:** [T-071] Report model & generation

**Suggested Milestone:** M7: Evaluation & Reports

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m7, area:backend

### Description

- `Report` schema (DB §15) + `POST /ai/report` producing overall score, pass probability (advisory), strengths, weaknesses, missed concepts, recommendations, roadmap, summary (Module 19-20).

### Dependencies

- T-070
- T-055

### Acceptance Criteria

- [ ] Report generated only after interview completion (AI Architecture rule).
- [ ] Feedback references specific interview answers (no generic filler).
- [ ] 1-1 with session; stored durably.

### Metadata

- Task ID: T-071
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M7.E1 - Evaluation Engine
- Source: TASKS.md (section)
---

## T-072: Report screen

**GitHub Issue Title:** [T-072] Report screen

**Suggested Milestone:** M7: Evaluation & Reports

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m7, area:frontend

### Description

- Overall score, pass probability, per-dimension breakdown, radar chart, timeline, recommendations (UI §30, Module 20).

### Dependencies

- T-071
- T-039 (charts)

### Acceptance Criteria

- [ ] Radar + timeline responsive and dark-mode aware.
- [ ] Missed concepts and action plan clearly presented.
- [ ] Empty/error states for missing/failed reports.

### Metadata

- Task ID: T-072
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M7.E2 - Report & History UI
- Source: TASKS.md (section)
---

## T-073: Report retrieval, PDF download & share

**GitHub Issue Title:** [T-073] Report retrieval, PDF download & share

**Suggested Milestone:** M7: Evaluation & Reports

**Labels:** status:planned, type:task, scope:mvp-get-p1-p2-pdf-share-, priority:p0/p1/p2, complexity:m, milestone:m7, area:frontend

### Description

- `GET /reports/:id`, `GET /reports/:id/download` (PDF), `POST /reports/:id/share`, `POST /reports/compare` (API §14).

### Dependencies

- T-071

### Acceptance Criteria

- [ ] PDF renders full report; download works cross-browser.
- [ ] Share generates a secure, revocable link.
- [ ] Compare returns deltas across two reports.

### Metadata

- Task ID: T-073
- Scope: MVP (get) / P1-P2 (pdf/share)
- Priority: P0/P1/P2
- Complexity: M
- Epic: M7.E2 - Report & History UI
- Source: TASKS.md (section)
---

## T-074: Interview history & archive

**GitHub Issue Title:** [T-074] Interview history & archive

**Suggested Milestone:** M7: Evaluation & Reports

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m7, area:frontend

### Description

- History page: date/role/company/score/duration cards, view report, retake; search + filter by company/topic/date/score/role/type; transcript & coding submission history (Module 21, UI §31).

### Dependencies

- T-055
- T-072

### Acceptance Criteria

- [ ] Paginated, searchable, filterable list.
- [ ] Retake reuses previous configuration.
- [ ] Transcript/coding history accessible per session.
- [ ] --

### Metadata

- Task ID: T-074
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M7.E2 - Report & History UI
- Source: TASKS.md (section)
---

## T-075: Progress & Analytics models + aggregation jobs

**GitHub Issue Title:** [T-075] Progress & Analytics models + aggregation jobs

**Suggested Milestone:** M8: Progress, Analytics & Learning

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m8, area:backend

### Description

- `Progress` (DB §16) and `Analytics` (DB §24) updated on interview completion (interview count, practice hours, averages, weak/strong topics, streak, XP, level; response/thinking time, topic coverage).

### Dependencies

- T-071

### Acceptance Criteria

- [ ] Aggregated analytics stored separately from transactional data (DB §34).
- [ ] Streak logic handles day boundaries/timezones.
- [ ] Idempotent updates (no double counting on retries).

### Metadata

- Task ID: T-075
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M8.E1 - Progress & Analytics
- Source: TASKS.md (section)
---

## T-076: Analytics endpoints & charts library

**GitHub Issue Title:** [T-076] Analytics endpoints & charts library

**Suggested Milestone:** M8: Progress, Analytics & Learning

**Labels:** status:planned, type:task, scope:mvp, priority:p1, complexity:m, milestone:m8, area:frontend

### Description

- `GET /analytics/interviews|communication|coding|skills` (API §20) + Recharts chart components (line/area/bar/radar/pie/progress ring) with dark mode, tooltips, responsive resize (UI §39).

### Dependencies

- T-075

### Acceptance Criteria

- [ ] Chart components reusable across dashboard/progress/report.
- [ ] All charts responsive + dark-mode + accessible.
- [ ] Endpoints paginated/aggregated efficiently.

### Metadata

- Task ID: T-076
- Scope: MVP
- Priority: P1
- Complexity: M
- Epic: M8.E1 - Progress & Analytics
- Source: TASKS.md (section)
---

## T-077: Progress dashboard page

**GitHub Issue Title:** [T-077] Progress dashboard page

**Suggested Milestone:** M8: Progress, Analytics & Learning

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m8, area:frontend

### Description

- Total interviews, practice hours, average score, weekly/monthly charts, topic performance, skill-improvement graph, streak, performance trends; practice calendar heatmap (P2) (Module 22, UI §32).

### Dependencies

- T-076
- T-033

### Acceptance Criteria

- [ ] Trends reflect real historical data.
- [ ] Empty state for new users.
- [ ] Heatmap (calendar) behind a P2 flag.

### Metadata

- Task ID: T-077
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M8.E1 - Progress & Analytics
- Source: TASKS.md (section)
---

## T-078: Learning roadmap model & generation

**GitHub Issue Title:** [T-078] Learning roadmap model & generation

**Suggested Milestone:** M8: Progress, Analytics & Learning

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m8, area:backend

### Description

- `LearningRoadmap` (DB §19) + `POST /learning/roadmap`, `GET /learning/roadmap` generating personalized daily/weekly/monthly plans from report weaknesses + JD gaps (Module 23).

### Dependencies

- T-071
- T-043

### Acceptance Criteria

- [ ] Roadmap tied to specific weak topics/missed concepts.
- [ ] Plans have estimated completion + status.
- [ ] Regeneratable as performance changes.

### Metadata

- Task ID: T-078
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-079: Recommendations (topics, DSA, problems, resources)

**GitHub Issue Title:** [T-079] Recommendations (topics, DSA, problems, resources)

**Suggested Milestone:** M8: Progress, Analytics & Learning

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m8, area:analytics-learning

### Description

- `GET /learning/problems`, `GET /learning/topics` + system-design/coding recommendations, revision list, interview-readiness estimate (FEATURES 23.2-23.8).

### Dependencies

- T-078

### Acceptance Criteria

- [ ] Recommendations prioritized by weakness severity.
- [ ] Readiness estimate is advisory and explainable.
- [ ] Learning page (UI §33) renders roadmap/problems/topics/plan.

### Metadata

- Task ID: T-079
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-080: SavedResources & Certificates

**GitHub Issue Title:** [T-080] SavedResources & Certificates

**Suggested Milestone:** M8: Progress, Analytics & Learning

**Labels:** status:planned, type:task, scope:mvp, priority:p2, complexity:s, milestone:m8, area:analytics-learning

### Description

- `SavedResources` and `Certificate` (DB §20) models + profile UI sections.

### Dependencies

- T-026

### Acceptance Criteria

- [ ] Users can save/remove resources and add certificates.
- [ ] Certificate metadata + optional verification URL stored.
- [ ] Shown on profile page.
- [ ] --

### Metadata

- Task ID: T-080
- Scope: MVP
- Priority: P2
- Complexity: S
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-081: Gamification: XP, levels, streaks, badges

**GitHub Issue Title:** [T-081] Gamification: XP, levels, streaks, badges

**Suggested Milestone:** M9: Gamification, Notifications & Settings Polish

**Labels:** status:planned, type:task, scope:partial-mvp, priority:p1/p2, complexity:m, milestone:m9, area:analytics-learning

### Description

- `Achievement` (DB §17) + XP/levels, daily streak (P1), badges/skill-levels/weekly challenges (P2); `GET /achievements`, `/achievements/xp` (API §18) (Module 25).

### Dependencies

- T-075

### Acceptance Criteria

- [ ] Streak (P1) is reliable; XP awarded for interviews/coding/goals.
- [ ] Badges awarded on defined triggers (first interview, 7-day streak, etc.).
- [ ] Achievements page renders earned + locked states.

### Metadata

- Task ID: T-081
- Scope: Partial MVP
- Priority: P1/P2
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-082: Notifications system

**GitHub Issue Title:** [T-082] Notifications system

**Suggested Milestone:** M9: Gamification, Notifications & Settings Polish

**Labels:** status:planned, type:task, scope:partial-mvp, priority:p1/p2, complexity:m, milestone:m9, area:analytics-learning

### Description

- `Notification` (DB §18) + `GET /notifications`, `PATCH /:id/read`, `/read-all`, `DELETE /:id` (API §17); interview/practice reminders (P1), achievement/weekly/feature notices (P2). Notification center grouped by Today/Yesterday/This Week/Older (UI §44).

### Dependencies

- T-021

### Acceptance Criteria

- [ ] Read/unread state and bulk actions work.
- [ ] Reminders scheduled via `scheduledFor`.
- [ ] Center is accessible and paginated.

### Metadata

- Task ID: T-082
- Scope: Partial MVP
- Priority: P1/P2
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-083: Leaderboard (opt-in)

**GitHub Issue Title:** [T-083] Leaderboard (opt-in)

**Suggested Milestone:** M9: Gamification, Notifications & Settings Polish

**Labels:** status:planned, type:task, scope:future, priority:p3, complexity:m, milestone:m9, area:analytics-learning

### Description

- `GET /leaderboard` with privacy opt-out (FEATURES 25.6, API §18).

### Dependencies

- T-081

### Acceptance Criteria

- [ ] Users can opt out; excluded users never appear.
- [ ] Ranking derived from XP/score.
- [ ] Clearly labeled Future feature.
- [ ] --

### Metadata

- Task ID: T-083
- Scope: Future
- Priority: P3
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-084: Camera/mic detection & live preview

**GitHub Issue Title:** [T-084] Camera/mic detection & live preview

**Suggested Milestone:** M10: Webcam & Interview Environment

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m10, area:webcam-integrity

### Description

- MediaDevices checks (available/permission/resolution), live preview before interview, mic indicator states (FEATURES 16.1-16.2, 16.8, UI §43).

### Dependencies

- T-057

### Acceptance Criteria

- [ ] Clear permission prompts + fallback if denied.
- [ ] Preview shown in lobby; device selectable in settings.
- [ ] Mic states (connected/muted/active/disconnected) accurate.

### Metadata

- Task ID: T-084
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-085: Face presence & environment checks (MediaPipe)

**GitHub Issue Title:** [T-085] Face presence & environment checks (MediaPipe)

**Suggested Milestone:** M10: Webcam & Interview Environment

**Labels:** status:planned, type:task, scope:partial-mvp, priority:p1/p2/p3, complexity:l, milestone:m10, area:backend

### Description

- MediaPipe face presence (P1), multiple-face warning (P2), lighting/camera-quality checks (P2), eye-contact reminder (P3) - all framed as guidance (Module 16).

### Dependencies

- T-084

### Acceptance Criteria

- [ ] Detection runs in-browser without blocking the interview.
- [ ] Presented as approximate guidance, not scores.
- [ ] Respects camera privacy setting.

### Metadata

- Task ID: T-085
- Scope: Partial MVP
- Priority: P1/P2/P3
- Complexity: L
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-086: Anti-cheating integrity events

**GitHub Issue Title:** [T-086] Anti-cheating integrity events

**Suggested Milestone:** M10: Webcam & Interview Environment

**Labels:** status:planned, type:task, scope:partial-mvp, priority:p1/p2, complexity:m, milestone:m10, area:webcam-integrity

### Description

- Monitor tab switching, window blur, long inactivity, copy/paste, browser focus, multiple faces; emit integrity events into the report (PRD §18).

### Dependencies

- T-057

### Acceptance Criteria

- [ ] Events recorded with timestamps and surfaced in report timeline.
- [ ] Non-punitive framing; configurable per session.
- [ ] No false-blocking of legitimate users.
- [ ] --

### Metadata

- Task ID: T-086
- Scope: Partial MVP
- Priority: P1/P2
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-087: Admin auth & dashboard

**GitHub Issue Title:** [T-087] Admin auth & dashboard

**Suggested Milestone:** M11: Admin Portal

**Labels:** status:planned, type:task, scope:future, priority:p2, complexity:m, milestone:m11, area:auth-identity

### Description

- Role-gated `GET /admin/dashboard`, `/admin/analytics` (API §22) with system health/feedback overview (PRD §31).

### Dependencies

- T-021

### Acceptance Criteria

- [ ] Only `role=admin` can access; audited (DB §25).
- [ ] Aggregate metrics for users/interviews/AI usage.
- [ ] Feature-flag surface stubbed.

### Metadata

- Task ID: T-087
- Scope: Future
- Priority: P2
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-088: Admin user & report management

**GitHub Issue Title:** [T-088] Admin user & report management

**Suggested Milestone:** M11: Admin Portal

**Labels:** status:planned, type:task, scope:future, priority:p2, complexity:m, milestone:m11, area:ai-interview

### Description

- `GET /admin/users`, `DELETE /admin/users/:id`, `GET /admin/reports` (API §22).

### Dependencies

- T-087

### Acceptance Criteria

- [ ] User list paginated/searchable; delete is soft-delete + audited.
- [ ] Report browsing respects privacy.
- [ ] All actions logged to AuditLog.

### Metadata

- Task ID: T-088
- Scope: Future
- Priority: P2
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-089: Prompt management & feature flags

**GitHub Issue Title:** [T-089] Prompt management & feature flags

**Suggested Milestone:** M11: Admin Portal

**Labels:** status:planned, type:task, scope:future, priority:p2, complexity:m, milestone:m11, area:ai-interview

### Description

- `GET /admin/prompts`, `PUT /admin/prompts/:id` editing prompt versions (API §22, DB §22).

### Dependencies

- T-036
- T-087

### Acceptance Criteria

- [ ] Editing creates a new version; active version switchable.
- [ ] Changes audited with author + timestamp.
- [ ] No prompt text hardcoded elsewhere.

### Metadata

- Task ID: T-089
- Scope: Future
- Priority: P2
- Complexity: M
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-090: Audit log service

**GitHub Issue Title:** [T-090] Audit log service

**Suggested Milestone:** M11: Admin Portal

**Labels:** status:planned, type:task, scope:future-infra-usable-earlier-, priority:p2, complexity:s, milestone:m11, area:analytics-learning

### Description

- `AuditLog` (DB §25) capturing important actions (user/action/resource/ip/device/browser/timestamp).

### Dependencies

- T-009

### Acceptance Criteria

- [ ] Reusable `audit()` helper callable from services.
- [ ] Sensitive data excluded (Rule 90).
- [ ] Queryable by admin.
- [ ] --

### Metadata

- Task ID: T-090
- Scope: Future (infra usable earlier)
- Priority: P2
- Complexity: S
- Epic: M8.E2 - Learning
- Source: TASKS.md (section)
---

## T-091: Security pass & per-route rate limiting

**GitHub Issue Title:** [T-091] Security pass & per-route rate limiting

**Suggested Milestone:** M12: Hardening & Release (Version 1.0.0)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m12, area:backend

### Description

- Apply API §30 limits (auth 5/min, AI 30/min, interview 60/min, coding 20/min); verify JWT on every protected route; sanitize + escape; secrets audit (Rules 84-90).

### Dependencies

- T-008
- all API tasks

### Acceptance Criteria

- [ ] Automated checks confirm every protected route requires JWT.
- [ ] Rate limits enforced and tested per category.
- [ ] No secrets in bundle/logs/repo.

### Metadata

- Task ID: T-091
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M12.E1 - Security & Performance
- Source: TASKS.md (section)
---

## T-092: Performance pass (indexes, pagination, lazy load, memoization)

**GitHub Issue Title:** [T-092] Performance pass (indexes, pagination, lazy load, memoization)

**Suggested Milestone:** M12: Hardening & Release (Version 1.0.0)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m12, area:backend

### Description

- Verify DB indexes (DB §28), pagination everywhere, `lean()` reads, connection pooling, debounced requests; frontend lazy loading, code splitting, memoization, minimized layout shift (Architecture §28, UI §46).

### Dependencies

- T-009
- frontend features

### Acceptance Criteria

- [ ] Key list endpoints paginated + indexed (measured).
- [ ] Route bundles code-split; charts/editor lazy-loaded.
- [ ] No premature optimization; changes measured (Rule 97).

### Metadata

- Task ID: T-092
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M12.E1 - Security & Performance
- Source: TASKS.md (section)
---

## T-093: Accessibility audit

**GitHub Issue Title:** [T-093] Accessibility audit

**Suggested Milestone:** M12: Hardening & Release (Version 1.0.0)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m12, area:backend

### Description

- Keyboard nav, ARIA, focus states, contrast, reduced motion, semantic HTML, screen-reader labels, focus-trapping modals (UI §40, Rules 18/59/61).

### Dependencies

- frontend features

### Acceptance Criteria

- [ ] Automated a11y checks pass on core flows.
- [ ] All interactive elements keyboard-reachable with visible focus.
- [ ] Reduced-motion honored.

### Metadata

- Task ID: T-093
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M12.E1 - Security & Performance
- Source: TASKS.md (section)
---

## T-094: Backend unit & API tests

**GitHub Issue Title:** [T-094] Backend unit & API tests

**Suggested Milestone:** M12: Hardening & Release (Version 1.0.0)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m12, area:backend

### Description

- Vitest/Jest unit tests for services (business logic first, Rule 92) + Supertest for endpoints (auth, interview lifecycle, coding, reports).

### Dependencies

- backend features

### Acceptance Criteria

- [ ] Critical services + endpoints covered incl. error paths.
- [ ] Auth, evaluation, and Judge0 flows tested with mocks.
- [ ] Tests run in CI.

### Metadata

- Task ID: T-094
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M12.E2 - Testing
- Source: TASKS.md (section)
---

## T-095: Frontend component & E2E tests

**GitHub Issue Title:** [T-095] Frontend component & E2E tests

**Suggested Milestone:** M12: Hardening & Release (Version 1.0.0)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:l, milestone:m12, area:frontend

### Description

- React Testing Library for components; Playwright E2E for signup→setup→interview→report (TECH_STACK §18).

### Dependencies

- frontend features

### Acceptance Criteria

- [ ] Core components tested for states + a11y.
- [ ] E2E covers the primary happy path end-to-end.
- [ ] Runs in CI (headless).

### Metadata

- Task ID: T-095
- Scope: MVP
- Priority: P0
- Complexity: L
- Epic: M12.E2 - Testing
- Source: TASKS.md (section)
---

## T-096: Deployment (Vercel + Render + Atlas + Cloudinary + Judge0)

**GitHub Issue Title:** [T-096] Deployment (Vercel + Render + Atlas + Cloudinary + Judge0)

**Suggested Milestone:** M12: Hardening & Release (Version 1.0.0)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:m, milestone:m12, area:resume-jd

### Description

- Frontend→Vercel, backend→Render, DB→Atlas, storage→Cloudinary, Judge0 endpoint configured; env vars set per environment (Architecture §30, TECH_STACK §20).

### Dependencies

- T-016
- T-091
- T-092

### Acceptance Criteria

- [ ] Staging + production environments separated.
- [ ] Health checks green; smoke test of core flow passes in staging.
- [ ] Rollback path documented.

### Metadata

- Task ID: T-096
- Scope: MVP
- Priority: P0
- Complexity: M
- Epic: M12.E3 - Deploy & Release
- Source: TASKS.md (section)
---

## T-097: Release checklist & CHANGELOG 1.0.0

**GitHub Issue Title:** [T-097] Release checklist & CHANGELOG 1.0.0

**Suggested Milestone:** M12: Hardening & Release (Version 1.0.0)

**Labels:** status:planned, type:task, scope:mvp, priority:p0, complexity:s, milestone:m12, area:release-hardening

### Description

- Complete CHANGELOG Release Checklist; tag `1.0.0`; sync docs (CHANGELOG Maintenance Rules).

### Dependencies

- T-094
- T-095
- T-096

### Acceptance Criteria

- [ ] All MVP tasks complete; tests pass; env vars documented.
- [ ] CHANGELOG updated and Git tag created.
- [ ] README reflects current state.
- [ ] --

### Metadata

- Task ID: T-097
- Scope: MVP
- Priority: P0
- Complexity: S
- Epic: M12.E3 - Deploy & Release
- Source: TASKS.md (section)
---

## T-098: DOCX resume support

**GitHub Issue Title:** [T-098] DOCX resume support

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:m, milestone:m13, area:resume-jd

### Description

- Extend parser + upload validation.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-098
- Scope: Future
- Complexity: M
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-099: Static question-bank expansion & offline fallback

**GitHub Issue Title:** [T-099] Static question-bank expansion & offline fallback

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:m, milestone:m13, area:ai-interview

### Description

- Reduce AI usage (FEATURES 13.2).

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-099
- Scope: Future
- Complexity: M
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-100: Redis caching & session store

**GitHub Issue Title:** [T-100] Redis caching & session store

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:l, milestone:m13, area:analytics-learning

### Description

- TECH_STACK §26; sessions/rate-limit.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-100
- Scope: Future
- Complexity: L
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-101: BullMQ background jobs

**GitHub Issue Title:** [T-101] BullMQ background jobs

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:l, milestone:m13, area:analytics-learning

### Description

- Async parsing/report/analytics.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-101
- Scope: Future
- Complexity: L
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-102: AI Avatar interviewer

**GitHub Issue Title:** [T-102] AI Avatar interviewer

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:xl, milestone:m13, area:ai-interview

### Description

- Video/avatar layer (Architecture §32).

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-102
- Scope: Future
- Complexity: XL
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-103: Multi-language interviews (i18n)

**GitHub Issue Title:** [T-103] Multi-language interviews (i18n)

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:xl, milestone:m13, area:ai-interview

### Description

- Settings language + prompts + TTS/STT.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-103
- Scope: Future
- Complexity: XL
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-104: Recruiter dashboard & Organizations

**GitHub Issue Title:** [T-104] Recruiter dashboard & Organizations

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:xl, milestone:m13, area:frontend

### Description

- New collections (DB §33).

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-104
- Scope: Future
- Complexity: XL
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-105: Subscriptions, payments, invoices (Stripe)

**GitHub Issue Title:** [T-105] Subscriptions, payments, invoices (Stripe)

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:xl, milestone:m13, area:voice

### Description

- Billing domain (DB §33).

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-105
- Scope: Future
- Complexity: XL
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-106: Group discussions & mock assessment centers

**GitHub Issue Title:** [T-106] Group discussions & mock assessment centers

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:xl, milestone:m13, area:analytics-learning

### Description

- Multi-user real-time.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-106
- Scope: Future
- Complexity: XL
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-107: AI Resume Builder & Cover Letter Generator

**GitHub Issue Title:** [T-107] AI Resume Builder & Cover Letter Generator

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:l, milestone:m13, area:frontend

### Description

- New AI flows.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-107
- Scope: Future
- Complexity: L
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-108: Career coach & salary negotiation simulator

**GitHub Issue Title:** [T-108] Career coach & salary negotiation simulator

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:l, milestone:m13, area:analytics-learning

### Description

- New AI flows.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-108
- Scope: Future
- Complexity: L
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-109: Placement drive simulation

**GitHub Issue Title:** [T-109] Placement drive simulation

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:l, milestone:m13, area:analytics-learning

### Description

- Cohort features.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-109
- Scope: Future
- Complexity: L
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-110: Mobile apps (React Native)

**GitHub Issue Title:** [T-110] Mobile apps (React Native)

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:xl, milestone:m13, area:frontend

### Description

- Post-web (TECH_STACK §24).

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-110
- Scope: Future
- Complexity: XL
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-111: Observability: Sentry/Grafana/Prometheus/OpenTelemetry

**GitHub Issue Title:** [T-111] Observability: Sentry/Grafana/Prometheus/OpenTelemetry

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:l, milestone:m13, area:analytics-learning

### Description

- Monitoring (Architecture §31).

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-111
- Scope: Future
- Complexity: L
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
---

## T-112: Search: Meilisearch/Elasticsearch

**GitHub Issue Title:** [T-112] Search: Meilisearch/Elasticsearch

**Suggested Milestone:** M13: Post-MVP Roadmap (Future)

**Labels:** status:planned, type:task, scope:future, priority:future, complexity:l, milestone:m13, area:analytics-learning

### Description

- Advanced history/question search.

### Dependencies

- Release of 1.0.0

### Acceptance Criteria

- [ ] Slots into the existing architecture without major rework.
- [ ] Follows all project engineering rules and documentation standards.
- [ ] Ships with tests, implementation documentation, and a changelog entry.

### Metadata

- Task ID: T-112
- Scope: Future
- Complexity: L
- Epic: M13 Post-MVP Roadmap
- Source: TASKS.md (table)
