# TECH_STACK.md

# AI Mock Interview Platform

## Technology Stack & Engineering Decisions

**Version:** 1.0

---

# 1. Purpose

This document defines every technology, framework, library, API, service, and development tool used throughout the AI Mock Interview Platform.

The objective is to maintain consistency across the project and ensure every contributor understands:

- Why a technology was selected
- Where it should be used
- How it integrates with the system
- Alternatives (if applicable)

This document serves as the single source of truth for all technology decisions.

---

# 2. Technology Philosophy

The project follows these principles when selecting technologies:

- Mature and stable ecosystem
- Large community support
- Excellent documentation
- Production proven
- Scalable
- Open Source where possible
- Free tier friendly
- Easy deployment
- Modern JavaScript ecosystem

---

# 3. High Level Stack

Frontend

↓

React + Vite

↓

Express API

↓

MongoDB Atlas

↓

AI Providers

↓

Cloud Services

↓

Third Party APIs

---

# 4. Frontend

## Framework

React

Reason

- Component Based
- Huge Ecosystem
- Excellent Performance
- Industry Standard
- Large Community

---

## Build Tool

Vite

Reason

- Extremely Fast
- Hot Module Reloading
- Modern Build System
- Lightweight
- Excellent Developer Experience

---

## Language

JavaScript (ES2023)

Reason

- Primary project language
- Aligns with MERN stack
- Simplifies full-stack development

Future

TypeScript migration is supported.

---

## Styling

Tailwind CSS

Reason

- Utility First
- Fast Development
- Responsive Design
- Small Bundle Size
- Excellent Dark Mode Support

---

## UI Components

shadcn/ui

Reason

- Accessible Components
- Customizable
- Tailwind Native
- No Vendor Lock-in

---

## Icons

Lucide React

Reason

- Lightweight
- Consistent
- Tree Shakeable
- Modern Design

---

## Animations

Framer Motion

Reason

- Smooth Animations
- Easy Integration
- Production Ready
- Accessible Motion

---

## Routing

React Router DOM

Reason

- Standard Routing Library
- Nested Routes
- Protected Routes
- Lazy Loading Support

---

## Global State

Zustand

Reason

- Minimal Boilerplate
- Lightweight
- Fast
- Easy Learning Curve

Use For

- User
- Theme
- Interview Session
- UI State

---

## Server State

TanStack Query

Reason

- API Caching
- Automatic Refetching
- Retry Logic
- Background Updates
- Optimistic Updates

Use For

- Dashboard
- Reports
- Interviews
- Profile
- History

---

## Forms

React Hook Form

Reason

- High Performance
- Minimal Re-renders
- Easy Validation
- Scalable Forms

---

## Validation

Zod

Reason

- Schema Validation
- Reusable Validation Rules
- Shared Client/Server Schemas (future)

---

## Charts

Recharts

Reason

- Responsive
- Easy API
- React Native
- Excellent Dashboard Support

Used For

- Progress
- Analytics
- Radar Charts
- Timeline
- Weekly Statistics

---

## Code Editor

Monaco Editor

Reason

- VS Code Engine
- Syntax Highlighting
- IntelliSense
- Multiple Languages

---

## HTTP Client

Axios

Reason

- Interceptors
- Request Cancellation
- Better Error Handling
- Cleaner API

---

## Real-time Communication

Socket.io Client

Reason

- Interview Streaming
- Voice Events
- Live Updates
- Timer Synchronization

---

## PDF Viewer

React PDF

Future Use

- Resume Preview
- Report Preview

---

## Drag & Drop

React Dropzone

Reason

- Resume Upload
- JD Upload
- Better UX

---

# 5. Backend

## Runtime

Node.js

Reason

- Same Language Across Stack
- High Performance
- Event Driven
- Huge Ecosystem

---

## Framework

Express.js

Reason

- Minimal
- Flexible
- Mature
- Large Community

---

## Database ODM

Mongoose

Reason

- MongoDB Schema Management
- Validation
- Middleware
- Population
- Index Management

---

## Authentication

JWT

Reason

- Stateless
- Scalable
- Industry Standard

Refresh Tokens

HTTP Only Cookies

---

## Password Hashing

bcrypt

Reason

- Secure Password Storage
- Industry Standard

---

## File Upload

Multer

Reason

- Multipart Parsing
- Secure Upload Pipeline

---

## Cloud Storage

Cloudinary

Reason

- Free Tier
- CDN
- Image Optimization
- PDF Storage

Used For

- Resume
- Avatar
- Certificates
- Reports

---

## WebSocket

Socket.io

Reason

- Live Interview
- Voice Communication
- Progress Updates

---

## Validation

Zod or Express Validator

Reason

- Server-side Validation
- Prevent Invalid Requests

---

## Logging

Pino

Reason

- Extremely Fast
- Structured Logs
- Production Ready

Future

OpenTelemetry

---

# 6. Database

MongoDB Atlas

Reason

- Managed Database
- Automatic Backup
- Scaling
- Excellent Integration

---

# 7. AI Providers

## Primary

Google Gemini

Reason

- Excellent Free Tier
- High Quality Responses
- Fast
- Large Context Window

Primary Uses

- Interview Questions
- Follow-ups
- Report Generation
- Evaluation
- Resume Analysis
- JD Analysis

---

## Secondary

Groq

Reason

- Extremely Fast
- Free Tier
- Open Models

Fallback Provider

---

## Third

OpenRouter

Reason

- Access Multiple Models
- Easy Switching
- Future Flexibility

---

# 8. Speech Technologies

## Speech-to-Text

Groq Whisper API

Reason

- Fast
- Accurate
- Low Cost

Fallback

OpenAI Whisper

---

## Text-to-Speech

Microsoft Edge TTS

Reason

- Free
- Natural Voice
- Multiple Languages

Alternative

Kokoro TTS

---

# 9. Coding Platform

Judge0 CE

Reason

- Open Source
- Secure Sandboxing
- Multiple Languages
- REST API

Supports

- Java
- JavaScript
- Python
- C++
- Go
- Rust
- C#
- Kotlin
- Swift
- PHP

---

# 10. Resume Parsing

PyMuPDF

Reason

- Fast
- Accurate
- Good PDF Extraction

Alternative

pdfplumber

---

# 11. Face Detection

MediaPipe Face Mesh

Reason

- Real-time
- Browser Based
- High Accuracy

Future

TensorFlow.js

---

# 12. Camera

Browser MediaDevices API

Used For

- Camera
- Microphone
- Device Detection

---

# 13. Browser APIs

Clipboard API

Fullscreen API

MediaRecorder API

Web Speech API (optional)

Web Audio API

File API

Drag and Drop API

Notification API

Intersection Observer

Resize Observer

---

# 14. Security

Helmet

Reason

- Security Headers

---

CORS

Reason

- Origin Protection

---

Express Rate Limit

Reason

- Prevent Abuse

---

XSS Protection

Sanitize User Input

---

# 15. Environment Management

dotenv

Reason

- Environment Variables
- Secure Configuration

---

# 16. Development Tools

VS Code

Primary IDE

---

Git

Version Control

---

GitHub

Repository Hosting

Issue Tracking

Pull Requests

---

Postman

API Testing

---

Bruno (Optional)

API Collection

---

MongoDB Compass

Database Visualization

---

# 17. Code Quality

ESLint

Reason

- Code Quality
- Best Practices

---

Prettier

Reason

- Consistent Formatting

---

Husky

Reason

- Git Hooks

---

lint-staged

Reason

- Run Checks Before Commit

---

# 18. Testing

## Unit Testing

Vitest

Frontend

Node Test Runner / Jest

Backend

---

## Component Testing

React Testing Library

---

## API Testing

Supertest

---

## End-to-End Testing

Playwright

Reason

- Cross Browser
- Fast
- Reliable

---

# 19. Monitoring

Future

Sentry

Error Tracking

---

UptimeRobot

Health Monitoring

---

Grafana

Dashboards

---

Prometheus

Metrics

---

OpenTelemetry

Tracing

---

# 20. Deployment

Frontend

Vercel

Reason

- Fast Deployment
- Free Tier
- React Optimized

---

Backend

Render

Reason

- Easy Deployment
- Node Support
- Free Tier

Alternatives

Railway

Fly.io

AWS EC2

---

Database

MongoDB Atlas

---

Storage

Cloudinary

---

# 21. CI/CD

GitHub Actions

Future Pipeline

- Install Dependencies
- Run Lint
- Run Tests
- Build Project
- Deploy

---

# 22. Package Management

npm

Reason

- Official Node Package Manager

Alternative

pnpm (future)

---

# 23. Recommended Browser Support

Chrome

Edge

Firefox

Safari

Latest Two Versions

---

# 24. Mobile Support

Responsive Web Application

No Native App in Version 1.0

Future

React Native

---

# 25. Folder Structure Alignment

Frontend

- Feature-based architecture
- Shared components
- Reusable hooks
- Service layer
- API layer

Backend

- MVC architecture
- Services
- Controllers
- Middleware
- Prompts
- Validators

---

# 26. Future Technology Roadmap

Potential additions include:

- Redis (Caching & Session Management)
- BullMQ (Background Jobs)
- Docker (Containerization)
- Nginx (Reverse Proxy)
- Kubernetes (Container Orchestration)
- Kafka (Event Streaming)
- Elasticsearch (Advanced Search)
- Meilisearch (Lightweight Search)
- PostgreSQL (Reporting & Analytics)
- Stripe (Subscriptions)
- AWS S3 (Object Storage)
- AWS CloudFront (CDN)
- Terraform (Infrastructure as Code)

---

# 27. Technology Decision Matrix

| Category       | Selected Technology                   | Purpose                |
| -------------- | ------------------------------------- | ---------------------- |
| Frontend       | React + Vite                          | User Interface         |
| Styling        | Tailwind CSS                          | UI Styling             |
| Components     | shadcn/ui                             | Reusable UI            |
| Icons          | Lucide React                          | Icons                  |
| Animation      | Framer Motion                         | Motion                 |
| Routing        | React Router                          | Navigation             |
| Global State   | Zustand                               | Client State           |
| Server State   | TanStack Query                        | API Cache              |
| Forms          | React Hook Form                       | Forms                  |
| Validation     | Zod                                   | Validation             |
| Charts         | Recharts                              | Analytics              |
| Editor         | Monaco                                | Coding                 |
| Backend        | Node + Express                        | API                    |
| Database       | MongoDB Atlas                         | Persistence            |
| ODM            | Mongoose                              | Database Models        |
| Auth           | JWT                                   | Authentication         |
| File Upload    | Multer                                | Upload Handling        |
| Storage        | Cloudinary                            | File Storage           |
| AI             | Gemini                                | Interview Intelligence |
| AI Fallback    | Groq                                  | Backup LLM             |
| AI Router      | OpenRouter                            | Multi-model Support    |
| Speech-to-Text | Groq Whisper                          | Voice Recognition      |
| Text-to-Speech | Edge TTS                              | AI Voice               |
| Code Execution | Judge0 CE                             | Coding Round           |
| Face Detection | MediaPipe                             | Webcam Analysis        |
| Logging        | Pino                                  | Structured Logs        |
| Testing        | Vitest + RTL + Supertest + Playwright | Testing                |
| Deployment     | Vercel + Render                       | Hosting                |
| CI/CD          | GitHub Actions                        | Automation             |

---

# 28. Guiding Principles

Every technology introduced into the project must satisfy at least one of the following:

- Solves a real engineering problem.
- Improves maintainability.
- Improves developer experience.
- Improves scalability.
- Improves security.
- Improves performance.
- Aligns with the existing architecture.
- Can be maintained by the development team.

Avoid introducing libraries solely because they are popular. Every dependency should have a clear purpose, documented rationale, and a defined place within the architecture.
