# FEATURES.md

# AI Mock Interview Platform

## Feature Catalog

**Version:** 1.0

---

# About This Document

This document contains every feature of the AI Mock Interview Platform.

Each feature includes:

- Purpose
- Description
- User Value
- Priority
- MVP Status
- Dependencies
- APIs/Libraries
- Complexity
- Future Improvements

Priority Levels

```
P0 = Critical
P1 = High
P2 = Medium
P3 = Low
```

Status

```
Planned
In Development
Completed
Future
```

---

# MODULE 1 — Authentication

---

## 1.1 User Registration

### Priority

P0

### Status

Planned

### Description

Allow users to create an account using email and password.

### User Flow

```
Landing Page

↓

Sign Up

↓

Enter Details

↓

Validate

↓

Create Account

↓

Dashboard
```

### Features

- Email
- Password
- Confirm Password
- Name
- Terms Acceptance
- Email Validation
- Password Strength Meter

### Validation

- Valid email
- Minimum password length
- Strong password
- Duplicate email prevention

### APIs

Backend Authentication API

### Libraries

- bcrypt
- JWT
- Zod

### Complexity

Medium

---

## 1.2 User Login

### Priority

P0

### Description

Authenticate existing users.

### Features

- Email Login
- Password Login
- Remember Me
- Refresh Token
- Session Restore

### APIs

Login API

### Complexity

Low

---

## 1.3 Logout

### Priority

P0

### Features

- Clear JWT
- Clear Refresh Token
- Redirect to Landing Page

---

## 1.4 Forgot Password

### Priority

P1

### Description

Reset forgotten passwords through email.

Future

Email service integration.

---

## 1.5 Protected Routes

### Priority

P0

### Description

Prevent unauthorized users from accessing private pages.

Pages

- Dashboard
- Interview
- Reports
- History
- Settings

---

## 1.6 Session Management

### Priority

P0

Features

- Auto Login
- Refresh Token
- Auto Logout
- Session Timeout

---

# MODULE 2 — User Profile

---

## 2.1 Profile Dashboard

### Priority

P0

Displays

- Avatar
- Name
- Experience
- Skills
- Preferred Role
- Interview Count
- Average Score

---

## 2.2 Avatar Upload

### Priority

P1

Storage

Cloudinary

Validation

- PNG
- JPG
- JPEG
- Max Size

---

## 2.3 Resume Management

### Priority

P0

Features

- Upload Resume
- Replace Resume
- Delete Resume
- Preview Resume
- Download Resume

Supported Formats

- PDF
- DOCX

Storage

Cloudinary

---

## 2.4 Resume Parsing

### Priority

P0

Description

Automatically extract information from uploaded resumes.

Extract

- Name
- Skills
- Education
- Projects
- Experience
- Certifications
- Languages

Libraries

- PyMuPDF
- pdfplumber

Complexity

Medium

---

## 2.5 Saved Job Descriptions

### Priority

P1

Description

Store multiple Job Descriptions.

Features

- Upload
- Edit
- Delete
- Favorite
- Reuse

---

## 2.6 Skill Profile

### Priority

P1

Displays

- Languages
- Frameworks
- Databases
- Tools
- Cloud
- AI
- Soft Skills

Purpose

Used by Interview Generator.

---

# MODULE 3 — Landing Website

---

## 3.1 Landing Page

### Priority

P0

Sections

- Hero
- Features
- Demo
- Testimonials
- Pricing (Future)
- FAQ
- Footer

CTA

Start Free Interview

---

## 3.2 Hero Section

Contains

Headline

Description

CTA Button

Illustration

Animation

---

## 3.3 Feature Showcase

Displays

- AI Interview
- Coding Round
- Reports
- Dashboard
- Voice Interview
- Resume Analysis

---

## 3.4 Testimonials

Future

---

## 3.5 FAQ

Questions

- Is it free?
- Which companies?
- AI models?
- Languages?
- Privacy?

---

## 3.6 Contact Section

Future

---

# MODULE 4 — Dashboard

---

## 4.1 Dashboard Home

### Priority

P0

Purpose

Central hub after login.

Widgets

- Total Interviews
- Practice Hours
- Average Score
- Last Interview
- Upcoming Goal
- Continue Practice

---

## 4.2 Quick Actions

Buttons

Start Interview

Resume Upload

Coding Practice

Learning Roadmap

---

## 4.3 Statistics Cards

Displays

Total Interviews

Completed

Average Score

Current Streak

Practice Hours

---

## 4.4 Weekly Progress

Chart

Line Chart

Shows

Practice Frequency

---

## 4.5 Monthly Progress

Bar Chart

Displays

Monthly Interview Count

---

## 4.6 Recent Activity

Shows

Completed Interviews

Recent Reports

Uploads

Achievements

---

## 4.7 Skill Snapshot

Displays

Strong Topics

Weak Topics

Needs Improvement

---

# MODULE 5 — Interview Setup

---

## 5.1 Start Interview Wizard

### Priority

P0

Multi-step form

Step 1

Role

↓

Step 2

Experience

↓

Step 3

Company

↓

Step 4

Interview Type

↓

Step 5

Difficulty

↓

Step 6

Resume

↓

Step 7

JD

↓

Start Interview

---

## 5.2 Job Role Selection

Supported Roles

- Frontend
- Backend
- Full Stack
- DevOps
- Data Scientist
- AI Engineer
- Android
- iOS
- QA
- HR
- UI/UX
- Cyber Security

Future

Custom Roles

---

## 5.3 Experience Selection

Options

- Fresher
- 1–3 Years
- 3–5 Years
- 5+ Years
- Senior

---

## 5.4 Company Type

Options

- Startup
- Product Based
- Service Based
- FAANG

Purpose

Changes interview style.

---

## 5.5 Company Specific Mode

Supported

- Google
- Amazon
- Microsoft
- Meta
- Netflix
- Apple
- Adobe
- Uber
- Atlassian
- TCS
- Infosys
- Wipro
- Cognizant
- Accenture

Implementation

Prompt Engineering

No proprietary company data is used.

---

## 5.6 Interview Type

Options

- Technical
- Coding
- HR
- Behavioral
- System Design
- Mixed

---

## 5.7 Difficulty

Levels

- Beginner
- Intermediate
- Advanced
- Expert
- FAANG

---

## 5.8 Duration

Options

15 Minutes

30 Minutes

45 Minutes

60 Minutes

Custom (Future)

---

## 5.9 Resume Upload

Optional

Purpose

Generate personalized questions.

---

## 5.10 Job Description Upload

Optional

Purpose

Generate company-specific interview.

---

## 5.11 Resume + JD Matching

Description

Compare uploaded resume against the selected job description.

Outputs

- Match Percentage
- Missing Skills
- Matching Skills
- Recommended Topics

AI

Gemini

---

## 5.12 Interview Summary

Before interview starts

Displays

Role

Difficulty

Company

Resume

JD

Estimated Questions

Estimated Time

Start Button

---

# MODULE 6 — Resume Intelligence

---

## 6.1 Skill Extraction

Automatically extracts

Programming Languages

Libraries

Frameworks

Databases

Cloud

DevOps

Tools

Soft Skills

---

## 6.2 Project Detection

Extract

Project Name

Tech Stack

Description

Responsibilities

Duration

---

## 6.3 Project Question Generator

Generate

Implementation Questions

Architecture Questions

Optimization Questions

Scaling Questions

Security Questions

Example

Instead of asking:

"What is React?"

Ask:

"You built a real-time notification system using Socket.IO. Why did you choose WebSockets over polling, and how would you scale it to 100,000 concurrent users?"

---

## 6.4 Experience Extraction

Detect

Internships

Companies

Roles

Duration

Responsibilities

---

## 6.5 Certification Detection

Extract

AWS

Azure

Google Cloud

Coursera

Udemy

NPTEL

Others

---

## 6.6 Resume Weakness Detection

Identify

Missing GitHub

Weak Project Descriptions

No Metrics

No Achievements

Weak Tech Stack

Suggestions are shown after interview.

---

# MODULE 7 — Job Description Intelligence

---

## 7.1 JD Parser

Extract

Required Skills

Preferred Skills

Responsibilities

Experience

Education

Tools

Frameworks

---

## 7.2 Missing Skills Analysis

Compare

Resume

↓

JD

↓

Generate

Missing Skills List

---

## 7.3 Interview Focus Generator

Adjust interview based on

- Required Skills
- Company Type
- Experience
- Job Role

---

## 7.4 Learning Recommendations

If JD requires

Redis

and Resume doesn't include Redis,

recommend

Redis Learning Path

after interview completion.

---

# Part 1 Summary

This section defines the foundational modules required for the MVP:

- Authentication & Session Management
- User Profile & Resume Management
- Landing Website
- Dashboard
- Interview Setup Wizard
- Resume Intelligence
- Job Description Intelligence

These modules establish the user lifecycle from account creation through interview configuration and personalized interview preparation using free technologies such as MongoDB Atlas, Cloudinary, PyMuPDF, pdfplumber, and Gemini's free tier.
