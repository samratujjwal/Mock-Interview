# ARCHITECTURE.md

# AI Mock Interview Platform

## System Architecture Document

Version: 1.0

---

# 1. Purpose

This document defines the complete software architecture for the AI Mock Interview Platform.

The architecture is designed for:

- Scalability
- Maintainability
- Performance
- Security
- Modularity
- Extensibility
- Production Deployment

Every component should have a single responsibility and communicate through well-defined interfaces.

---

# 2. High Level Architecture

```

                    +----------------------+
                    |      Browser         |
                    | React + Tailwind UI  |
                    +----------+-----------+
                               |
                               |
                     HTTPS / WebSocket
                               |
                               |
                    +----------v-----------+
                    |    Express API       |
                    | Authentication       |
                    | Business Logic       |
                    +----------+-----------+
                               |
         +---------------------+---------------------+
         |                     |                     |
         |                     |                     |
+--------v------+    +---------v---------+   +-------v-------+
| AI Services   |    | Coding Service    |   | File Service  |
| Gemini/Groq   |    | Judge0 API        |   | Cloudinary    |
+---------------+    +-------------------+   +---------------+

                               |
                               |
                    +----------v-----------+
                    |    MongoDB Atlas     |
                    +----------------------+

```

---

# 3. Architecture Principles

The project follows:

- Clean Architecture
- MVC
- Feature-Based Organization
- SOLID Principles
- Separation of Concerns
- Stateless REST APIs
- Event Driven Communication where appropriate

---

# 4. Technology Stack

## Frontend

- React (Vite)
- JavaScript ES2023
- TailwindCSS
- React Router
- Zustand
- TanStack Query
- Framer Motion
- Monaco Editor
- Socket.io Client
- Shadcn UI

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.io
- Multer
- Cloudinary

---

## AI

- Google Gemini
- Groq
- OpenRouter

---

## Voice

- Whisper
- Edge TTS
- Kokoro TTS

---

## Coding

- Judge0 CE

---

# 5. Client Architecture

```

App

│

├── Router

│

├── Layouts

│

├── Pages

│

├── Features

│

├── Shared Components

│

├── Hooks

│

├── Context

│

├── Services

│

├── API Layer

│

└── Utilities

```

---

# 6. Frontend Folder Structure

```

src/

assets/

components/

common/

Button/

Modal/

Loader/

Card/

Navbar/

Sidebar/

features/

auth/

dashboard/

interview/

coding/

report/

history/

analytics/

hooks/

layouts/

pages/

services/

api/

context/

store/

utils/

constants/

styles/

```

---

# 7. Backend Folder Structure

```

src/

config/

controllers/

routes/

middleware/

models/

services/

ai/

coding/

resume/

jd/

report/

voice/

socket/

validators/

prompts/

utils/

database/

logs/

```

---

# 8. MVC Pattern

```

Client

↓

Routes

↓

Controllers

↓

Services

↓

Models

↓

MongoDB

```

### Controllers

Responsible for:

- Request validation
- Calling services
- Returning response

No business logic.

---

### Services

Responsible for:

- Business rules
- AI
- Interview flow
- Scoring
- Reports

---

### Models

Responsible only for

Database schema.

---

# 9. Feature Modules

## Authentication

Responsible for

- Login
- Signup
- JWT
- Refresh Token
- Logout

---

## User Module

Responsible for

- Profile
- Resume
- Settings
- Preferences

---

## Interview Module

Responsible for

- Session creation
- Questions
- Answers
- AI conversation
- Difficulty adjustment

---

## Resume Module

Responsible for

- Upload
- Parsing
- Skill Extraction
- Project Extraction

---

## JD Module

Responsible for

- Upload
- Parsing
- Skill Matching

---

## Coding Module

Responsible for

- Judge0
- Compilation
- Hidden Tests
- AI Review

---

## Voice Module

Responsible for

- STT
- TTS
- Audio Processing

---

## Report Module

Responsible for

- AI Evaluation
- Analytics
- PDF Generation (future)

---

# 10. Database Architecture

```

User

│

├── Resume

├── Settings

├── Preferences

├── Interviews

├── Reports

└── Statistics

```

---

```

Interview

│

├── Questions

├── Answers

├── AI Memory

├── Score

├── Report

└── Coding Submission

```

---

# 11. API Architecture

RESTful APIs

```

Client

↓

API Layer

↓

Express Router

↓

Controller

↓

Service

↓

Database

↓

Response

```

---

# 12. WebSocket Architecture

Used for

- Live Interview
- AI Responses
- Voice Streaming
- Timer Updates
- Coding Collaboration (future)

```

Browser

↓

Socket.io Client

↓

Socket Server

↓

Interview Service

↓

AI

```

---

# 13. AI Layer

The AI Layer is isolated.

```

Controller

↓

Interview Service

↓

Prompt Builder

↓

LLM Provider

↓

Response Formatter

↓

Controller

```

Never call Gemini directly inside controllers.

---

# 14. AI Provider Layer

Abstract provider implementation.

```

AIService

↓

GeminiProvider

GroqProvider

OpenRouterProvider

```

Switching providers should require minimal code changes.

---

# 15. Prompt System

```

prompts/

technical/

frontend/

backend/

react/

node/

dsa/

behavior/

hr/

coding/

report/

systemDesign/

```

Prompts are version-controlled and modular.

---

# 16. Resume Processing Flow

```

PDF Upload

↓

Storage

↓

Parser

↓

Skill Extractor

↓

Project Extractor

↓

Experience Extractor

↓

Database

↓

Interview Generator

```

---

# 17. JD Processing Flow

```

Upload JD

↓

Parser

↓

Required Skills

↓

Preferred Skills

↓

Responsibilities

↓

Gap Analysis

↓

Interview Questions

```

---

# 18. Interview Engine

```

Start Interview

↓

Generate Question

↓

User Answers

↓

AI Evaluation

↓

Follow-up?

↓

Next Question

↓

Interview End

↓

Generate Report

```

---

# 19. Adaptive Difficulty Engine

```

Correct Answer

↓

Increase Difficulty

↓

Advanced Questions

```

```

Weak Answer

↓

Decrease Difficulty

↓

Hint

↓

Continue

```

Difficulty factors include:

- Accuracy
- Confidence
- Communication
- Experience
- Topic mastery

---

# 20. Coding Engine

```

Question

↓

Monaco Editor

↓

Judge0

↓

Execution

↓

Results

↓

AI Review

↓

Database

```

---

# 21. Report Generation

```

Interview Data

↓

AI Evaluation

↓

Communication Score

↓

Technical Score

↓

Behavior Score

↓

Recommendations

↓

Store Report

```

---

# 22. Authentication Flow

```

Signup

↓

Email Verification (future)

↓

Login

↓

JWT

↓

Protected APIs

↓

Refresh Token

↓

Logout

```

---

# 23. File Upload Flow

```

Client

↓

Multer

↓

Validation

↓

Cloudinary

↓

MongoDB URL

```

Supported

- PDF
- DOCX (future)
- Images

---

# 24. State Management

## Client

### Zustand

Stores

- User
- Theme
- Settings
- Interview Session

---

### TanStack Query

Caches

- Reports
- Dashboard
- Interviews
- Profile

---

### Local State

Component-specific data.

---

# 25. Error Handling

Global Error Middleware.

```

Request

↓

Validation

↓

Controller

↓

Service

↓

Throw Error

↓

Global Handler

↓

JSON Response

```

---

# 26. Logging

Logs

- API
- Errors
- AI Requests
- Interview Sessions
- Coding Executions

Future

- Winston
- Pino
- OpenTelemetry

---

# 27. Security Architecture

Authentication

JWT

Authorization

Role-Based

Validation

Server Side

Password

bcrypt

Secrets

Environment Variables

Uploads

MIME Validation

Rate Limiting

Per User

Helmet

Security Headers

CORS

Whitelisted Origins

---

# 28. Performance Strategy

Lazy Loading

Route Splitting

Image Optimization

Memoization

Database Indexes

Pagination

Caching

Connection Pooling

Debounced Requests

---

# 29. Scalability Strategy

Backend is stateless.

Multiple API instances should work.

Future

Redis

Queue Workers

Kafka

Microservices

CDN

Load Balancer

Horizontal Scaling

---

# 30. Deployment Architecture

```

React

↓

Vercel

↓

API

↓

Render / Railway / AWS

↓

MongoDB Atlas

↓

Cloudinary

↓

Judge0

↓

Gemini

```

---

# 31. Monitoring

Future integrations

- Sentry
- Grafana
- Prometheus
- OpenTelemetry
- UptimeRobot

---

# 32. Future Architecture Expansion

The architecture should support:

- AI Avatar Interviewers
- Video Interviews
- Live Recruiters
- Multi-language Interviews
- Recruiter Dashboard
- Subscription System
- Organization Accounts
- Team Management
- AI Career Coach
- Mobile Applications
- Desktop Applications

without requiring major architectural changes.

---

# 33. Architecture Rules

Always:

- Keep controllers thin.
- Keep services reusable.
- Separate business logic.
- Never duplicate code.
- Never couple AI providers directly.
- Never hardcode prompts.
- Never expose secrets.
- Use environment variables.
- Validate every request.
- Keep modules independent.
- Prefer composition over inheritance.
- Follow feature-based architecture.

---

# 34. Definition of Good Architecture

A feature is architecturally complete when:

- It is modular.
- It has a clear responsibility.
- It is independently testable.
- It can be replaced without affecting unrelated modules.
- It follows the project's folder structure.
- It exposes clean interfaces.
- It handles errors gracefully.
- It supports future scalability.
- It does not introduce unnecessary coupling.
- It aligns with the overall system architecture.

---

# 35. Architectural Philosophy

This platform should be engineered as if it will eventually serve:

- Millions of interview sessions
- Thousands of concurrent users
- Multiple AI providers
- Multiple deployment environments
- Enterprise customers
- Recruiters
- Universities
- Placement cells

Every architectural decision should favor long-term maintainability, extensibility, and production readiness over short-term convenience.
