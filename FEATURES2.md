# FEATURES.md (Part 2)

# MODULE 8 — AI Interview Engine

The AI Interview Engine is the core of the platform.

Its responsibility is to conduct interviews naturally, adapt to candidate performance, maintain conversation context, and evaluate answers in real time.

Primary AI Model

- Google Gemini (Free Tier)

Fallback Models

- Groq
- OpenRouter Free Models

---

## 8.1 AI Interview Session

### Priority

P0

### Description

Creates a new AI interview session.

Stores

- User Profile
- Resume
- Job Description
- Role
- Company
- Difficulty
- Previous Questions
- Previous Answers
- AI Memory

Purpose

Ensures every interview is personalized.

---

## 8.2 AI Interviewer Personality

### Priority

P0

The interviewer should behave differently depending on the selected mode.

Supported Modes

- Friendly
- Professional
- Strict
- Startup
- FAANG
- HR Specialist
- Behavioral Coach

Example

Friendly

> Gives encouragement and calmer follow-up questions.

Strict

> Challenges assumptions and asks deeper technical questions.

FAANG

> Focuses heavily on fundamentals, scalability, and trade-offs.

---

## 8.3 Natural Conversation

### Priority

P0

Instead of asking disconnected questions,

AI should maintain a flowing conversation.

Example

Bad

```
What is React?

Next:

Explain JavaScript.
```

Good

```
You mentioned React.

How does React internally decide
when to re-render a component?

What problems have you faced because of unnecessary re-renders?

How did you optimize them?
```

---

## 8.4 Context Memory

### Priority

P0

The AI remembers

- Previous answers
- Technologies mentioned
- Mistakes
- Strengths
- Weaknesses
- Candidate confidence (estimated from interaction, not biometric certainty)

Purpose

Avoid repetitive questioning.

---

## 8.5 Dynamic Follow-up Questions

### Priority

P0

Generate follow-up questions dynamically.

Example

Candidate

"I used Redis."

AI

Why Redis?

↓

Why not Memcached?

↓

What eviction policy?

↓

How would you scale it?

---

## 8.6 Clarification Questions

### Priority

P0

If an answer is vague,

AI asks for clarification.

Example

"You said the application was optimized.

What exactly did you optimize?

Database?

Frontend?

Backend?"

---

## 8.7 Why Questions

Priority

P0

Example

Why MongoDB?

Why JWT?

Why Express?

Why Socket.IO?

Purpose

Measure reasoning instead of memorization.

---

## 8.8 How Questions

Priority

P0

Example

How did authentication work?

How did deployment happen?

How did caching improve performance?

---

## 8.9 Edge Case Questions

Priority

P1

Example

What happens if

MongoDB crashes?

API timeout?

Internet disconnects?

Duplicate requests?

Server restart?

---

## 8.10 Real World Scenario Questions

Priority

P0

Example

Your production server suddenly becomes slow.

Where do you start debugging?

---

## 8.11 Adaptive Difficulty

Priority

P0

Difficulty automatically changes.

Example

Easy

↓

Medium

↓

Hard

↓

Expert

Strong candidates skip easier questions more quickly, while others receive additional foundational questions.

---

## 8.12 Skip Easy Questions

Priority

P1

If candidate consistently answers correctly,

AI skips beginner questions.

---

## 8.13 Hint Engine

Priority

P1

If candidate struggles,

AI provides gentle hints instead of immediately moving on.

Example

Think about the Virtual DOM.

Does React update the entire DOM?

---

## 8.14 Topic Switching

Priority

P1

Avoid asking 20 React questions consecutively.

Example

React

↓

JavaScript

↓

Node

↓

Database

↓

System Design

↓

React

---

## 8.15 Personalized Interview Path

Priority

P0

Interview adapts according to

- Resume
- Job Description
- Previous Answers
- Difficulty
- Company Type

Every interview should feel unique.

---

# MODULE 9 — Technical Interview

---

## 9.1 JavaScript Interview

Priority

P0

Topics

- Scope
- Closures
- Hoisting
- Event Loop
- Promise
- Async Await
- DOM
- Memory
- Prototype
- Execution Context
- This Keyword
- Modules
- Event Delegation
- Debouncing
- Throttling

---

## 9.2 React Interview

Priority

P0

Topics

- Hooks
- Virtual DOM
- Fiber
- Reconciliation
- State
- Context
- Performance
- Memoization
- Lazy Loading
- Suspense
- React Query
- Custom Hooks

---

## 9.3 Node.js Interview

Priority

P0

Topics

- Event Loop
- Streams
- Cluster
- Worker Threads
- File System
- Buffer
- Process
- Middleware
- Authentication

---

## 9.4 Express Interview

Priority

P0

Topics

- Routing
- Middleware
- Error Handling
- Validation
- JWT
- Sessions
- REST APIs

---

## 9.5 MongoDB Interview

Priority

P0

Topics

- Aggregation
- Indexes
- Sharding
- Replication
- Transactions
- Schema Design
- Performance

---

## 9.6 SQL Interview

Priority

P1

Topics

- Joins
- Group By
- Window Functions
- Normalization
- Transactions
- Indexes

---

## 9.7 DBMS

Priority

P0

Topics

- ACID
- CAP
- Locks
- Transactions
- Isolation Levels

---

## 9.8 Operating System

Priority

P1

Topics

- Threads
- Process
- Scheduling
- Deadlock
- Virtual Memory

---

## 9.9 Computer Networks

Priority

P1

Topics

- HTTP
- HTTPS
- DNS
- TCP
- UDP
- SSL
- REST

---

## 9.10 OOP

Priority

P1

Topics

- Inheritance
- Encapsulation
- Polymorphism
- Abstraction
- SOLID

---

## 9.11 Cloud

Priority

P2

Topics

- AWS
- EC2
- S3
- Load Balancer
- Docker Basics

---

## 9.12 DevOps

Priority

P2

Topics

- CI/CD
- Docker
- GitHub Actions
- Nginx

---

# MODULE 10 — HR Interview

---

## 10.1 HR Question Generator

Priority

P0

Questions include

- Tell me about yourself
- Why should we hire you?
- Why this company?
- Career goals
- Salary expectations
- Leadership
- Failure
- Success
- Conflict
- Teamwork

---

## 10.2 Adaptive HR Questions

Priority

P1

Questions change based on previous answers.

---

## 10.3 Communication Evaluation

Priority

P1

Evaluates

- Clarity
- Structure
- Confidence (estimated from response characteristics)
- Grammar
- Vocabulary

---

# MODULE 11 — Behavioral Interview

---

## 11.1 STAR Evaluation

Priority

P0

Evaluate

Situation

Task

Action

Result

Each answer receives structured feedback after the interview.

---

## 11.2 Leadership Assessment

Priority

P1

Checks

Ownership

Responsibility

Initiative

Decision Making

---

## 11.3 Teamwork Assessment

Priority

P1

Evaluates

Communication

Collaboration

Conflict Resolution

Empathy

---

## 11.4 Adaptability

Priority

P1

Scenario Based Questions

Changing Requirements

Production Issues

Learning New Technology

Deadline Pressure

---

# MODULE 12 — System Design Interview

---

## 12.1 High Level Design

Priority

P1

Topics

- URL Shortener
- Chat Application
- Notification System
- Food Delivery
- Ride Sharing

---

## 12.2 API Design

Priority

P1

Questions

- REST
- Versioning
- Authentication
- Pagination
- Rate Limiting

---

## 12.3 Database Design

Priority

P1

Questions

- Schema Design
- Relationships
- Indexes
- Scaling

---

## 12.4 Cache Strategy

Priority

P2

Topics

Redis

Cache Aside

Write Through

TTL

Eviction Policies

---

## 12.5 Scalability

Priority

P2

Questions

- Horizontal Scaling
- Vertical Scaling
- Load Balancer
- CDN
- Queue
- Microservices

---

## 12.6 Trade-off Analysis

Priority

P1

Example

Why MongoDB instead of PostgreSQL?

Why WebSockets instead of Polling?

Why Redis?

---

# MODULE 13 — AI Question Bank

---

## 13.1 Dynamic Question Generation

Priority

P0

Questions are generated at runtime instead of relying solely on a static database.

---

## 13.2 Static Question Bank

Priority

P1

Maintain curated fallback questions.

Purpose

- Offline fallback
- Reduced API usage
- Faster response

---

## 13.3 Duplicate Prevention

Priority

P0

Prevent asking the same question repeatedly in one interview.

---

## 13.4 Difficulty Classification

Priority

P0

Each question is tagged

- Beginner
- Intermediate
- Advanced
- Expert

---

## 13.5 Topic Classification

Priority

P0

Examples

JavaScript

React

Node

MongoDB

DSA

System Design

HR

Behavioral

---

## 13.6 Company Tags

Priority

P1

Questions can be associated with interview styles inspired by companies such as Google, Amazon, Microsoft, Meta, and TCS. These are stylistic tags, not proprietary interview content.

---

# Part 2 Summary

This section defines the core intelligence layer of the platform:

- AI Interview Engine
- Context-Aware Conversations
- Adaptive Questioning
- Technical Interview Modules
- HR & Behavioral Interviews
- System Design Interviews
- Dynamic AI Question Generation

These modules transform the platform from a static questionnaire into an adaptive interview simulator powered by Gemini (with Groq/OpenRouter fallbacks) while remaining compatible with free-tier AI services.
