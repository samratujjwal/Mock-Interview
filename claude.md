# CLAUDE.md

# AI Mock Interview Platform – Engineering Guidelines

## Project Overview

You are helping build a production-quality AI-powered Mock Interview Platform.

The goal is NOT to build a demo or hackathon project.

The goal is to build a scalable SaaS application that simulates real technical interviews conducted by companies like Google, Amazon, Microsoft, Meta, Atlassian, Adobe, Uber and Product-based startups.

The application should feel like a real interviewer instead of a chatbot.

Every feature should prioritize:

- Clean Architecture
- Scalability
- Reusability
- Maintainability
- Performance
- Security
- Accessibility
- Excellent User Experience

The project should always be written as if it will eventually support millions of users.

---

# Tech Stack

## Frontend

- React (Vite)
- JavaScript (ES2023)
- Tailwind CSS
- React Router DOM
- TanStack Query
- Zustand
- Framer Motion
- Shadcn UI
- Socket.io Client
- Monaco Editor

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Socket.io
- Multer
- Cloudinary

## AI

- Google Gemini
- Groq API
- OpenRouter

## Speech

- Whisper API
- Edge TTS
- Kokoro TTS

## Code Execution

- Judge0 CE

---

# Primary Objective

Build a professional interview platform that includes

- AI Interviews
- Coding Interviews
- Resume Parsing
- Job Description Analysis
- AI Evaluation
- Reports
- Analytics
- Progress Tracking

Every feature should work together as one unified system.

---

# Coding Philosophy

Always write production-quality code.

Never write tutorial code.

Never write temporary code unless explicitly requested.

Never create unnecessary abstractions.

Always optimize for readability first.

Code should be understandable by a new developer joining the project.

---

# Code Style

Use modern JavaScript.

Prefer

const

instead of

let

unless mutation is required.

Never use var.

Use async/await.

Never use Promise.then() chains unless absolutely necessary.

Prefer arrow functions.

Always destructure objects where appropriate.

Avoid deeply nested logic.

Keep functions focused on one responsibility.

---

# SOLID Principles

Always follow SOLID.

Single Responsibility Principle

Each module should do one thing.

Open Closed Principle

Code should be extendable without modifying existing implementations.

Liskov Substitution

Avoid tightly coupled logic.

Interface Segregation

Separate responsibilities into services.

Dependency Inversion

Controllers should depend on services.

---

# Clean Architecture

Always separate layers.

Frontend

Pages

↓

Features

↓

Components

↓

Hooks

↓

Services

↓

API

Backend

Routes

↓

Controllers

↓

Services

↓

Models

↓

Database

Never mix responsibilities.

---

# Folder Structure

Frontend

src/

components/

features/

hooks/

layouts/

pages/

context/

services/

utils/

constants/

assets/

Backend

src/

config/

controllers/

routes/

middleware/

models/

services/

utils/

validators/

prompts/

socket/

database/

Never place unrelated files together.

---

# Naming Conventions

Components

PascalCase

InterviewCard.jsx

Hooks

useInterview.js

Functions

camelCase

Variables

camelCase

Constants

UPPER_CASE

Database Collections

Singular Model

Plural Collection

---

# File Size

Ideal

150-250 lines

Maximum

300 lines

If a file exceeds 300 lines,

refactor it.

---

# Components

Components should be reusable.

Never duplicate UI.

Never copy-paste components.

If two pages use similar UI,

create a shared component.

---

# State Management

Global State

Use Zustand.

Server State

Use TanStack Query.

Local State

Use useState.

Derived State

Use useMemo.

Expensive callbacks

Use useCallback only when necessary.

---

# API Design

REST API.

Meaningful endpoints.

Examples

POST /auth/login

POST /auth/signup

GET /user/profile

POST /interview/start

POST /interview/answer

POST /coding/run

POST /coding/submit

GET /report/:id

Never create inconsistent endpoints.

---

# Error Handling

Every API should return

success

message

data

errors

Example

{
    "success": true,
    "message": "Interview created successfully",
    "data": {}
}

Never expose internal server errors.

Always log them.

---

# Validation

Validate everything.

Backend

Request body

Params

Headers

Files

Frontend

Forms

Uploads

Inputs

Never trust client-side data.

---

# Authentication

JWT Authentication.

Secure Routes.

Refresh Token support.

Protected Middleware.

Password hashing using bcrypt.

Logout should invalidate refresh tokens.

Never store passwords.

---

# Security

Always consider security.

Sanitize inputs.

Prevent NoSQL injection.

Prevent XSS.

Prevent CSRF where applicable.

Rate limit APIs.

Limit uploads.

Validate MIME types.

Store secrets in environment variables.

Never hardcode API keys.

---

# Database

MongoDB Atlas

Use Mongoose.

Keep schemas normalized.

Reference when necessary.

Embed when beneficial.

Always add timestamps.

Always create indexes for searchable fields.

Avoid unnecessary population.

---

# AI Architecture

AI should never simply answer questions.

AI behaves like a professional interviewer.

Rules

Ask one question.

Wait.

Evaluate.

Ask follow-up.

Remember previous answers.

Never reveal correct answers immediately.

Never become a tutor during interview mode.

Generate reports only after interview completion.

---

# AI Prompting

Prompts belong inside

backend/prompts/

Never hardcode prompts inside controllers.

Every prompt should be modular.

Examples

technicalPrompt.js

hrPrompt.js

behaviorPrompt.js

systemDesignPrompt.js

reportPrompt.js

---

# Conversation Memory

Maintain interview context.

AI should remember

Previous questions

Previous answers

Candidate experience

Projects

Resume

Job Description

Difficulty

Do not ask duplicate questions.

---

# Adaptive Difficulty

Difficulty should adjust dynamically.

Poor performance

↓

Easy

Average

↓

Medium

Excellent

↓

Hard

Never ask random questions.

Difficulty should feel natural.

---

# Resume Parsing

Extract

Skills

Projects

Experience

Education

Certifications

Generate interview questions using extracted information.

---

# Job Description Analysis

Extract

Required Skills

Preferred Skills

Responsibilities

Experience

Technologies

Generate questions based on JD.

---

# Voice System

Support

Speech-to-text

Text-to-speech

Natural pauses

Interruption detection

Silence detection

Speaking speed

Filler words

Voice should feel human.

---

# Coding Interview

Support Judge0.

Features

Run Code

Submit Code

Hidden Tests

Sample Tests

Execution Time

Memory Usage

Complexity Feedback

AI Review

---

# Report Generation

Generate detailed reports.

Include

Technical

Communication

Behavior

Confidence

Coding

Recommendations

Weak Areas

Improvement Plan

Avoid generic feedback.

Feedback must reference interview answers.

---

# Dashboard

Show

Interview History

Average Score

Practice Hours

Progress Graph

Weak Topics

Strong Topics

Recent Interviews

Upcoming Goals

---

# Performance

Lazy load pages.

Code splitting.

Memoization when needed.

Optimize images.

Avoid unnecessary renders.

Never prematurely optimize.

---

# Accessibility

Keyboard navigation.

Proper labels.

Semantic HTML.

ARIA where required.

Color contrast.

Focus states.

Responsive UI.

---

# UI Design

Modern.

Minimal.

Professional.

Dark Mode ready.

Rounded cards.

Smooth animations.

Avoid clutter.

Whitespace is important.

Consistency is mandatory.

---

# Tailwind Guidelines

Prefer utility classes.

Avoid inline styles.

Create reusable utility components.

Keep spacing consistent.

Use Tailwind design tokens.

---

# Animations

Use Framer Motion.

Animations should enhance UX.

Never distract.

Avoid excessive animation.

---

# Logging

Server logs

Errors

Warnings

AI Requests

API Requests

Coding Execution

Interview Sessions

Use structured logging.

---

# Testing Philosophy

Write code that is testable.

Separate business logic.

Avoid tightly coupled functions.

Keep side effects isolated.

---

# Git Practices

Small commits.

Meaningful commit messages.

Feature branches.

Never commit secrets.

Never commit .env.

---

# Environment Variables

Frontend

VITE_API_URL

VITE_GEMINI_KEY

Backend

PORT

MONGO_URI

JWT_SECRET

JWT_REFRESH_SECRET

GEMINI_API_KEY

OPENROUTER_API_KEY

GROQ_API_KEY

CLOUDINARY_NAME

CLOUDINARY_KEY

CLOUDINARY_SECRET

JUDGE0_URL

Never expose secrets to frontend.

---

# Documentation

Every major module should contain

Purpose

Inputs

Outputs

Dependencies

Keep documentation updated.

---

# Reusability

Before creating

Ask

Can this be reused?

If yes

Create shared module.

Avoid duplication.

---

# Scalability

Every feature should be designed assuming

Future support for

Organizations

Recruiters

Multiple interviewers

Subscriptions

Payments

Multi-language

Real-time collaboration

---

# User Experience

The user should always know

Current progress

Remaining time

Current section

Errors

Loading state

Success state

Never leave users wondering.

---

# AI Behavior

The AI interviewer must

Be professional

Be conversational

Challenge the candidate

Adapt to responses

Stay in character

Avoid robotic responses

Never reveal interview evaluation during the session.

---

# What To Avoid

Do NOT

Write duplicate code.

Generate massive files.

Ignore validation.

Hardcode values.

Use magic numbers.

Mix business logic with UI.

Ignore loading states.

Ignore error handling.

Ignore accessibility.

Ignore responsiveness.

Ignore security.

Ignore scalability.

---

# Development Rules

Before implementing a feature

Understand

Purpose

Dependencies

Data Flow

API

Database

User Flow

Then implement.

Never rush implementation.

Quality is always more important than speed.

---

# Definition of Done

A feature is complete only if it

✔ Works correctly

✔ Is responsive

✔ Handles loading state

✔ Handles empty state

✔ Handles error state

✔ Is accessible

✔ Is reusable

✔ Is documented

✔ Has clean architecture

✔ Is production ready

---

# Final Rule

Whenever implementing any feature, think like a Senior Staff Software Engineer at a top product company.

Do not choose the quickest solution.

Choose the most maintainable, scalable, secure, reusable, and production-ready solution that aligns with the existing architecture and engineering standards of this project.