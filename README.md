# AI Mock Interview Platform

AI Mock Interview Platform is a planned production-grade SaaS application for realistic technical, coding, HR, behavioral, and system design interview preparation. The platform is intended to behave like a professional interviewer rather than a static chatbot or question bank.

The project is currently in the product-definition stage with the first backend model implementation started. User-facing product features are still marked as **Planned** until runnable application flows exist.

## Vision

The platform will help students, fresh graduates, career switchers, and experienced engineers practice interviews that feel close to real hiring conversations at product companies, startups, service companies, and FAANG-style organizations.

The long-term vision is to provide:

- Adaptive AI interviews that ask follow-up questions based on candidate answers.
- Resume-aware and job-description-aware interview preparation.
- Coding rounds with sandboxed execution and AI review.
- Voice-based interview practice with transcripts and communication feedback.
- Detailed reports, analytics, progress tracking, and personalized learning roadmaps.
- A scalable architecture that can later support organizations, recruiters, subscriptions, multi-language interviews, and real-time collaboration.

## Development Status

| Area | Status |
| --- | --- |
| Product requirements | Defined |
| Architecture | Defined |
| API specification | Defined |
| Database design | Defined |
| UI/UX system | Defined |
| Feature catalog | Defined |
| Development backlog | Defined |
| Monorepo & repository hygiene | Completed (T-001) |
| Backend scaffold (Express API) | Completed (T-002) |
| Frontend architecture skeleton | Scaffolded (ARCHITECTURE §6) |
| Database models | In progress: User and RefreshToken implemented |
| Test suite | Not started |
| Deployment | Not started |

Current repository contents include complete product documentation, repository hygiene, folder architecture skeletons matching ARCHITECTURE §6–7, runnable Express backend serving `/api/v1/health` and `/api/v1/ping`, plus initial authentication database models.

## Planned Features

| Feature | Status |
| --- | --- |
| Email registration, login, logout, JWT auth, refresh tokens, protected routes | Planned |
| User profile, settings, avatar upload, privacy preferences | Planned |
| Landing website and authenticated app shell | Planned |
| Dashboard with interview stats, practice hours, weak topics, and quick actions | Planned |
| Interview setup wizard for role, experience, company mode, type, difficulty, and duration | Planned |
| Resume upload, parsing, skill extraction, project detection, and resume-based questions | Planned |
| Job description upload, parsing, resume matching, missing-skill analysis, and focused questions | Planned |
| AI interview engine with context memory, adaptive difficulty, clarification, and follow-ups | Planned |
| Technical, HR, behavioral, mixed, and system design interviews | Planned |
| Company-style interview modes inspired by Google, Amazon, Microsoft, Meta, Adobe, Uber, Atlassian, and others | Planned |
| Coding interview platform with Monaco Editor, Judge0 CE, sample tests, hidden tests, and submissions | Planned |
| AI code review, complexity analysis, optimization suggestions, and debugging hints | Planned |
| Voice interview with speech-to-text, text-to-speech, silence detection, filler-word analysis, and transcript history | Planned |
| Optional webcam and interview-environment guidance | Planned |
| Anti-cheating and integrity event tracking for reports | Planned |
| AI evaluation engine with technical, communication, behavior, coding, problem-solving, and confidence scoring | Planned |
| Final interview reports with strengths, weaknesses, missed concepts, recommendations, and roadmap | Planned |
| Interview history, report archive, transcripts, retake flow, search, and filters | Planned |
| Progress dashboard, analytics, trends, streaks, and topic mastery | Planned |
| Learning recommendations, AI roadmaps, DSA practice, system design topics, and study plans | Planned |
| Gamification with XP, badges, achievements, weekly challenges, and optional leaderboard | Planned |
| Notifications, reminders, weekly progress reports, and achievement alerts | Planned |
| Admin portal for users, prompts, reports, analytics, system health, and feature flags | Planned |

## Architecture Summary

The system is planned as a clean, modular MERN-style application with a React frontend, Express backend, MongoDB Atlas database, isolated AI provider layer, and WebSocket support for live interview flows.

```text
Browser
  React + Tailwind UI
      |
      | HTTPS / WebSocket
      v
Express API
  Auth, validation, business services, sockets
      |
      +--> AI Services: Gemini, Groq, OpenRouter
      +--> Coding Service: Judge0 CE
      +--> File Service: Cloudinary
      |
      v
MongoDB Atlas
```

Core architecture rules:

- Frontend follows pages -> features -> components -> hooks -> services -> API.
- Backend follows routes -> controllers -> services -> models -> database.
- Controllers stay thin and call services.
- Business logic belongs in services.
- AI providers are abstracted behind an AI service layer.
- Prompts live in backend prompt modules, not controllers.
- APIs are versioned under `/api/v1`.
- All responses use a standard success/error envelope.
- Large lists are paginated and indexed.
- All protected APIs require JWT authentication.

## Technology Stack

### Frontend

- React with Vite
- JavaScript ES2023
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- React Router DOM
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Monaco Editor
- Axios
- Socket.io Client

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication with refresh tokens
- bcrypt
- Multer
- Cloudinary
- Socket.io
- Zod or Express Validator
- Pino
- Helmet
- CORS
- Express Rate Limit
- dotenv

### AI, Speech, and Coding

- Google Gemini as the primary AI provider
- Groq and OpenRouter as fallback AI providers
- Groq Whisper or Whisper for speech-to-text
- Microsoft Edge TTS and Kokoro TTS for text-to-speech
- Judge0 CE for sandboxed code execution
- PyMuPDF or pdfplumber for resume parsing
- MediaPipe Face Mesh for optional webcam guidance

### Quality, Testing, and Deployment

- ESLint
- Prettier
- Husky
- lint-staged
- Vitest or Jest
- React Testing Library
- Supertest
- Playwright
- GitHub Actions
- Vercel for frontend hosting
- Render, Railway, Fly.io, or AWS for backend hosting
- MongoDB Atlas for database hosting
- Cloudinary for file storage

## Planned Folder Structure

The target implementation structure is shown below. The current repository only contains the initial backend package and authentication model files.

```text
.
+-- frontend/
|   +-- src/
|       +-- assets/
|       +-- components/
|       |   +-- common/
|       +-- features/
|       |   +-- auth/
|       |   +-- dashboard/
|       |   +-- interview/
|       |   +-- coding/
|       |   +-- report/
|       |   +-- history/
|       |   +-- analytics/
|       +-- hooks/
|       +-- layouts/
|       +-- pages/
|       +-- services/
|       |   +-- api/
|       +-- context/
|       +-- store/
|       +-- utils/
|       +-- constants/
|       +-- styles/
+-- backend/
|   +-- src/
|       +-- config/
|       +-- controllers/
|       +-- routes/
|       +-- middleware/
|       +-- models/
|       +-- services/
|       |   +-- ai/
|       |   +-- coding/
|       |   +-- resume/
|       |   +-- jd/
|       |   +-- report/
|       |   +-- voice/
|       +-- socket/
|       +-- validators/
|       +-- prompts/
|       +-- utils/
|       +-- database/
|       +-- logs/
+-- README.md
+-- PRD.md
+-- ARCHITECTURE.md
+-- API.md
+-- DATABASE.md
+-- UI.md
+-- TECH_STACK.md
+-- RULES.md
+-- TASKS.md
+-- CHANGELOG.md
+-- FEATURES1.md
+-- FEATURES2.md
+-- FEATURES3.md
+-- FEATURES4.md
```

## API Summary

The planned API base URL is:

```text
http://localhost:5000/api/v1
```

Planned endpoint groups:

- `/auth` for signup, login, logout, refresh, password reset, verification, and password changes.
- `/users` for current user, profile updates, avatar upload, and account deletion.
- `/resumes` for upload, parsing, retrieval, listing, and deletion.
- `/job-descriptions` for upload, parsing, resume matching, retrieval, and deletion.
- `/interviews` for session creation, questions, answers, pause/resume, finish, cancel, and history.
- `/ai` for question generation, follow-ups, answer evaluation, and report generation.
- `/coding` for questions, run, submit, submissions, AI review, and optimization.
- `/voice` for speech-to-text, text-to-speech, and audio analysis.
- `/reports` for report retrieval, download, sharing, and comparison.
- `/dashboard`, `/analytics`, `/learning`, `/notifications`, `/achievements`, `/settings`, `/companies`, and `/admin` for the wider product ecosystem.

Standard success response:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

Standard error response:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
  ],
  "requestId": "req_123456789"
}
```

## Database Summary

MongoDB Atlas with Mongoose is planned for persistence. Database documents should use timestamps, indexes for searchable fields, pagination for large collections, and soft deletes where appropriate.

Planned collections include:

- Users
- Profiles
- Resumes
- JobDescriptions
- InterviewSessions
- InterviewQuestions
- InterviewAnswers
- CodingQuestions
- CodingSubmissions
- Reports
- Notifications
- Achievements
- Progress
- LearningRoadmaps
- SavedResources
- Certificates
- Settings
- InterviewTemplates
- PromptVersions
- Analytics
- AuditLogs
- RefreshTokens

Future collections may include Organizations, Recruiters, Subscriptions, Payments, Invoices, Leaderboards, VideoRecordings, AvatarModels, AIConversationMemory, and PlacementDrives.

## Setup Instructions

There is no runnable frontend or API server yet. The current backend slice supports model syntax validation only.

### Prerequisites

- Node.js LTS
- npm
- Git
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key
- Groq API key
- OpenRouter API key
- Judge0 CE endpoint
- Optional: MongoDB Compass, Postman, Bruno

### Current Local Validation

```bash
cd backend
npm run check:models
```

### Planned Local Setup

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

After the monorepo is created:

```bash
cd frontend
npm install
npm run dev
```

```bash
cd backend
npm install
npm run dev
```

Expected local URLs after implementation:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`
- Health check: `http://localhost:5000/api/v1/health`

## Environment Variables

Environment files must never be committed. Add `.env.example` files during the scaffold milestone.

### Frontend

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Do not expose private AI provider keys in the frontend bundle. Any variable prefixed with `VITE_` is public to the browser.

### Backend

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
GROQ_API_KEY=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
JUDGE0_URL=
```

Additional variables should be documented as they are introduced, especially for logging, rate limits, CORS origins, token expiry, upload limits, AI model selection, and deployment environments.

## Development Workflow

1. Read the relevant docs before implementation: `PRD.md`, `ARCHITECTURE.md`, `API.md`, `DATABASE.md`, `UI.md`, `TECH_STACK.md`, `RULES.md`, and `TASKS.md`.
2. Start with the current milestone in `TASKS.md`; dependencies should be completed before dependent work begins.
3. Keep changes small, focused, and aligned with the planned folder structure.
4. Add or update tests for business logic, APIs, components, and end-to-end flows as features are implemented.
5. Validate all inputs on the backend and mirror helpful validation in frontend forms.
6. Keep API responses consistent with the standard response envelope.
7. Update documentation and `CHANGELOG.md` for meaningful changes.
8. Never commit secrets, `.env` files, `node_modules`, logs, builds, coverage, or generated artifacts that do not belong in source control.

Recommended commands after scaffolding:

```bash
npm run lint
npm run format
npm test
npm run build
```

## Engineering Standards

- Use modern JavaScript and prefer `const`.
- Never use `var`.
- Prefer `async/await`.
- Keep files under 300 lines where practical.
- Keep controllers thin and services focused.
- Do not put business logic inside React components.
- Do not call AI providers directly from controllers.
- Store prompts in backend prompt modules.
- Use Tailwind and design tokens instead of inline styles.
- Support loading, empty, error, and success states.
- Support responsive layouts, dark mode, keyboard access, focus states, and screen readers.
- Hash passwords with bcrypt.
- Store refresh tokens securely.
- Rate-limit public and expensive endpoints.
- Sanitize inputs and never expose stack traces to users.
- Never execute user-submitted code locally; use Judge0 CE.

## Roadmap

### Milestone M0: Foundation and Tooling

- Initialize monorepo and repository hygiene.
- Scaffold Express backend.
- Scaffold Vite React frontend.
- Configure ESLint, Prettier, Husky, lint-staged.
- Add environment variable validation and examples.
- Add standard response helpers, error middleware, logging, security middleware, MongoDB connection, validation middleware, theme system, shared components, API client, Zustand stores, and CI skeleton.

### Milestone M1: Authentication and Identity

- Add user, profile, settings, and refresh-token models.
- Implement password hashing, JWT, signup, login, logout, refresh, auth middleware, protected routes, profile page, avatar upload, and settings.

### Milestone M2: App Shell, Landing, and Dashboard

- Build layouts, routing, sidebar, navbar, landing page, dashboard widgets, charts, recent activity, and skill snapshots.

### Milestone M3: Resume and Job Description Intelligence

- Add secure uploads, Cloudinary storage, resume parsing, JD parsing, skill extraction, gap analysis, AI provider abstraction, prompt builder, and AI response formatting.

### Milestone M4: AI Interview Engine

- Implement interview setup, sessions, questions, answers, memory, adaptive difficulty, follow-ups, WebSocket events, live interview UI, timers, recovery, and completion.

### Milestone M5: Coding Interview Platform

- Add Monaco Editor, coding questions, Judge0 execution, run and submit APIs, test cases, auto-save, code review, and optimization suggestions.

### Milestone M6: Voice Interview

- Add speech-to-text, text-to-speech, voice loop, controls, microphone detection, waveform states, silence detection, filler analysis, and transcripts.

### Milestone M7: Evaluation and Reports

- Add answer scoring, report generation, report screen, PDF download, secure sharing, report comparison, history, search, filters, transcripts, and retake flow.

### Milestone M8: Progress, Analytics, and Learning

- Add progress aggregation, analytics endpoints, charts, progress dashboard, AI learning roadmaps, topic recommendations, DSA recommendations, study plans, saved resources, and certificates.

### Milestone M9: Gamification, Notifications, and Settings Polish

- Add XP, levels, streaks, badges, achievements, reminders, notifications, weekly reports, and optional leaderboard.

### Milestone M10: Webcam and Interview Environment

- Add camera and microphone checks, live preview, face presence, environment guidance, and integrity events.

### Milestone M11: Admin Portal

- Add admin dashboard, user management, report management, prompt management, feature flags, and audit logs.

### Milestone M12: Hardening and Release

- Complete security, performance, accessibility, testing, deployment, release checklist, and `CHANGELOG.md` updates for version `1.0.0`.

### Milestone M13: Post-MVP

- Explore AI avatar interviewers, multi-language interviews, recruiter dashboard, organizations, subscriptions, payments, group discussions, AI resume builder, cover letter generator, career coach, salary negotiation simulator, placement-drive simulation, mobile apps, observability, and advanced search.

## Contributing Guide

This project should be treated as a production SaaS codebase from the first commit.

### Contribution Rules

- Work from the backlog in `TASKS.md`.
- Keep pull requests small and focused.
- Follow the architecture and folder structure in `ARCHITECTURE.md`.
- Follow the API contract in `API.md`.
- Follow database rules in `DATABASE.md`.
- Follow UI rules in `UI.md`.
- Follow engineering standards in `RULES.md`.
- Update `CHANGELOG.md` for meaningful changes.
- Add tests for every implemented feature.
- Do not commit secrets, `.env`, `node_modules`, logs, `dist`, or `coverage`.

### Commit Convention

Use these prefixes:

```text
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

### Definition of Done

A feature is complete only when it:

- Works correctly.
- Is responsive.
- Handles loading, empty, error, and success states.
- Is accessible.
- Is secure.
- Is reusable.
- Is documented.
- Is tested.
- Is performant enough for its current scope.
- Follows the project architecture.
- Updates relevant documentation and changelog entries.

## Documentation Index

- `PRD.md`: product vision, target users, product goals, MVP scope, and post-MVP roadmap.
- `ARCHITECTURE.md`: system architecture, frontend/backend structure, AI layer, WebSocket design, security, deployment, and scalability.
- `API.md`: REST API and WebSocket specifications.
- `DATABASE.md`: MongoDB collections, relationships, indexes, validation, retention, and future collections.
- `UI.md`: design system, UX rules, components, layouts, accessibility, and screen guidelines.
- `TECH_STACK.md`: selected technologies, rationale, testing, deployment, and future stack roadmap.
- `RULES.md`: engineering rules and development standards.
- `TASKS.md`: milestone-based development backlog.
- `FEATURES1.md` through `FEATURES4.md`: detailed feature catalog.
- `CHANGELOG.md`: release planning, changelog rules, and version history.
- `AGENTS.md` and `claude.md`: engineering guidance for AI coding assistants.

## License

This project is licensed under the [MIT License](file:///d:/Samrat%20Ujjwal/Mock%20Interview/LICENSE). See the `LICENSE` file for details.
