# CHANGELOG.md

# AI Mock Interview Platform

This document records all significant changes made to the project.

The project follows **Semantic Versioning (SemVer)**.

Version Format

```
MAJOR.MINOR.PATCH

Example

1.4.2
```

Where

- **MAJOR** → Breaking changes or major architecture updates
- **MINOR** → New features that are backward compatible
- **PATCH** → Bug fixes, performance improvements, documentation updates

---

# Changelog Rules

Whenever any code is added, modified, removed, or refactored, this file **must** be updated.

Every entry should include:

- Version
- Release Date
- Status
- Summary
- Added
- Changed
- Fixed
- Removed
- Deprecated
- Security
- Performance
- Documentation
- Breaking Changes (if any)

---

# Release Status

Possible statuses:

- Planned
- In Progress
- Released
- Hotfix

---

# Unreleased

## Status

In Progress

### Added

- Backend resume weakness detection endpoints (`POST /resumes/:id/weaknesses`, `GET /resumes/:id/weaknesses`) with structured weakness suggestions and AI-backed analysis.
- Job Description model and endpoints: `POST /job-descriptions/upload`, `POST /job-descriptions/:id/parse`, `GET /job-descriptions`, `GET /job-descriptions/:id`, `DELETE /job-descriptions/:id` (T-042).
- Added Job Description matching endpoint `POST /job-descriptions/:id/match` for resume to JD gap analysis, producing match percentage, required/preferred skill coverage, responsibility alignment, and recommendations (T-043).
- Added InterviewSession model with embedded interview question and answer schemas, plus basic interview session CRUD and question/answer endpoints under `/api/v1/interviews` (T-044).
- Added `InterviewTemplate` model plus reusable fallback question-bank support with duplicate-prevention keys, tag filtering, and template CRUD/fallback lookup endpoints under `/api/v1/interviews/templates` (T-045).
- Added a protected multi-step interview setup wizard UI with role/experience/company/type/difficulty/resume/JD screening and summary review on `/interview` (T-046).
- Implemented `POST /api/v1/interviews` session bootstrap with request validation, role/company/difficulty persistence, first-question handle, and interview request rate limiting (T-047).
- Added answer submission support for interview sessions with timing metrics, response payload storage, and hidden answer-evaluation generation via `POST /api/v1/ai/evaluate` plus a new `POST /api/v1/interviews/:id/answer` alias for the interview flow (T-049).
- Added Judge0 integration service: `backend/src/services/coding/judge0.service.js` implementing language mapping, base64 payload handling, polling, result normalization and an in-memory per-instance rate limiter (T-060).
- Added coding Run & Submit endpoints: `POST /api/v1/coding/run`, `POST /api/v1/coding/submit` with controllers at `backend/src/controllers/coding.controller.js` and routes at `backend/src/routes/coding.routes.js` (T-061).
- Added a coding question generator endpoint `POST /api/v1/ai/questions/coding` with AI-assisted and curated-library fallback generation, plus prompt/template support and `CodingQuestion` persistence (T-062).
- Added a Monaco-powered coding interview workspace at `frontend/src/pages/CodingInterview.jsx` with autosave, full-screen mode, language switching, run/submit actions, and console-style execution feedback, wired to the new coding backend endpoints (T-063).
- Added authenticated coding review and optimization endpoints at `POST /api/v1/coding/review` and `POST /api/v1/coding/optimize`, plus a review/optimization experience in the coding studio UI that surfaces feedback and estimated complexity without revealing a full solution (T-064).

#### Repository & Workspace Setup (Task T-001)

- Initialized root repository hygiene with a comprehensive `.gitignore` covering `node_modules`, `.env`, `logs`, `dist`, `coverage`, and OS/IDE files (Rule 95).
- Added an official MIT `LICENSE` file for the project repository.
- Scaffolded `frontend/src/` workspace folder structure matching ARCHITECTURE §6 (`assets`, `components/common`, `features/*`, `hooks`, `layouts`, `pages`, `services/api`, `context`, `store`, `utils`, `constants`, `styles`).
- Completed `backend/src/` workspace folder structure matching ARCHITECTURE §7 (`config`, `controllers`, `routes`, `middleware`, `models`, `services/*`, `socket`, `validators`, `prompts`, `utils`, `database`, `logs`).
- Documented monorepo structure and repository hygiene completion in `README.md`.

#### Backend Scaffold (Task T-002)

- Scaffolded Express backend application (`backend/src/app.js` and `backend/src/server.js`) listening on `PORT` from environment (`5000` default).
- Implemented thin health controller (`backend/src/controllers/health.controller.js`) and routes (`backend/src/routes/health.routes.js`) for `GET /api/v1/health` and `GET /api/v1/ping` adhering to standard response envelope (API §5, Rule 13, Rule 5).
- Configured Express JSON body parsing, URL-encoded body parsing, CORS middleware, and 404 route handling.

#### Dashboard aggregation endpoints (Task T-032)

- Added authenticated dashboard aggregation endpoints under `/api/v1/dashboard` including summary, weekly progress, monthly progress, strong/weak topic performance, and statistics.
- Implemented `Progress` model and dashboard service to return zero-state responses when progress data does not yet exist.
- Added route definitions and controllers for dashboard aggregation with standardized success envelope.

#### Dashboard home UI (Task T-033)

- Built the dashboard home page with summary widgets, weekly and monthly progress visualizations, strong/weak topic panels, and quick action buttons.
- Added React Query provider and dashboard data fetching from `/dashboard` endpoints.
- Added loading, empty, and error states for dashboard widgets and charts.
- Added Express, Dotenv, and CORS dependencies to `backend/package.json` along with `"start"` and `"dev"` scripts.

#### Backend Models

- Added the initial backend package metadata for model-layer validation.
- Added shared authentication constants for roles, auth providers, and token/hash validation lengths.
- Added a reusable Mongoose soft-delete plugin.
- Added the `User` model with email/provider/role indexes, `select:false` password protection, `refreshTokenVersion`, timestamps, JSON sanitization, and soft-delete support.
- Added the `RefreshToken` model with user reference, protected token storage, revocation state, TTL expiry index, timestamps, and JSON sanitization.
- Added `backend/src/models/index.js` model exports.

### Planned

#### Core Platform

- User Authentication
- Dashboard
- Interview Setup Wizard
- Resume Upload
- Job Description Upload

### Documentation

- Created a complete project README that reflects the current documentation-only planning baseline.
- Documented planned features, architecture, technology stack, setup expectations, environment variables, workflow, roadmap, contribution rules, and current development status.
- Converted every `TASKS.md` backlog item into GitHub-style issue drafts in `GITHUB_ISSUES.md`.

#### AI Interview

- Gemini Integration
- Adaptive Question Engine
- Resume-Based Questions
- Technical Interview Flow

#### Coding Platform

- Monaco Editor
- Judge0 Integration
- Hidden Test Cases
- AI Code Review

#### Voice

- Speech-to-Text
- Text-to-Speech
- Voice Conversation

#### Reports

- AI Evaluation
- PDF Report
- Interview History

---

# Version 1.0.0

## Status

Planned

## Target

Initial Public MVP

---

## Added

### Authentication

- Email Registration
- Login
- JWT Authentication
- Protected Routes

---

### Dashboard

- User Statistics
- Recent Interviews
- Practice Summary
- Skill Overview

---

### Interview Setup

- Job Role Selection
- Company Type
- Experience Level
- Interview Type
- Difficulty Selection
- Resume Upload
- JD Upload

---

### AI Interview

- Gemini Powered Questions
- Context Memory
- Dynamic Follow-ups
- Resume Intelligence

---

### Technical Interview

- JavaScript
- React
- Node.js
- MongoDB
- DBMS
- SQL
- OOP
- OS
- CN

---

### Coding Interview

- Monaco Editor
- Judge0 Execution
- Multiple Languages
- Hidden Test Cases
- AI Code Review

---

### Voice Interview

- Whisper STT
- Edge TTS
- Voice Conversation

---

### Reports

- Technical Score
- Communication Score
- Coding Score
- Personalized Feedback

---

### Analytics

- Weekly Progress
- Monthly Progress
- Topic Performance

---

### Learning

- AI Roadmap
- Recommended Topics
- Coding Suggestions

---

### Deployment

- Frontend on Vercel
- Backend on Render
- MongoDB Atlas
- Cloudinary

---

## Changed

Initial release.

---

## Fixed

N/A

---

## Removed

None

---

## Deprecated

None

---

## Security

- Password Hashing
- JWT Authentication
- Helmet
- Rate Limiting
- Input Validation

---

## Performance

- Lazy Loading
- API Caching
- Optimized Queries

---

## Documentation

Created

- README.md
- CLAUDE.md
- PRD.md
- ARCHITECTURE.md
- DATABASE.md
- API.md
- UI.md
- TASKS.md
- RULES.md
- TECH_STACK.md
- FEATURES.md
- CHANGELOG.md

---

## Breaking Changes

None

---

# Future Release Template

> Copy this template whenever a new version is created.

---

# Version X.Y.Z

## Release Date

YYYY-MM-DD

## Status

Released

---

## Summary

Short summary of the release.

---

## Added

- Feature 1
- Feature 2
- Feature 3

---

## Changed

- Improvement 1
- Improvement 2

---

## Fixed

- Bug 1
- Bug 2

---

## Removed

- Removed Feature

---

## Deprecated

- Deprecated API
- Deprecated Component

---

## Security

- Security Improvements

---

## Performance

- Query Optimization
- Faster Rendering
- Reduced API Calls

---

## Documentation

- Updated README
- Updated API Documentation
- Updated Architecture

---

## Breaking Changes

List any breaking changes here.

---

# Versioning Guidelines

## Patch Release (0.0.X)

Use for:

- Bug fixes
- Typo fixes
- Documentation updates
- Small UI improvements
- Performance tuning

Example

```
1.0.0 → 1.0.1
```

---

## Minor Release (0.X.0)

Use for:

- New features
- New APIs
- New pages
- New interview modes
- New reports
- New AI capabilities

Example

```
1.0.0 → 1.1.0
```

---

## Major Release (X.0.0)

Use for:

- Architecture redesign
- Database migration
- Authentication redesign
- Major UI overhaul
- Breaking API changes

Example

```
1.0.0 → 2.0.0
```

---

# Commit Message Convention

Use the following prefixes to keep Git history organized.

```
feat:      New feature

fix:       Bug fix

docs:      Documentation update

style:     Formatting/UI changes

refactor:  Code refactoring

perf:      Performance improvement

test:      Tests

build:     Build configuration

ci:        CI/CD updates

chore:     Maintenance tasks

revert:    Revert previous change
```

Examples

```
feat: add resume parser

feat: implement AI follow-up engine

fix: resolve JWT refresh token issue

docs: update API documentation

refactor: split interview service into modules

perf: optimize MongoDB aggregation queries

test: add authentication unit tests

chore: upgrade dependencies
```

---

# Release Checklist

Before creating a new release, verify that:

- All planned features for the release are complete.
- Documentation is up to date.
- Tests pass successfully.
- Environment variables are documented.
- Database migrations (if any) have been applied.
- API changes are documented.
- Breaking changes are listed.
- Performance regressions have been reviewed.
- Security checks have been completed.
- Version number has been updated.
- README reflects the current state of the project.
- CHANGELOG has been updated.

---

# Maintenance Rules

- Never delete previous release notes.
- Append new versions to the top (after **Unreleased**) once released.
- Keep entries concise but descriptive.
- Record only meaningful project changes.
- Synchronize release versions with Git tags whenever possible.
- Every merged feature or bug fix should eventually appear in a released version.
