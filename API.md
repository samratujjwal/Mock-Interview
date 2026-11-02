# API.md

# AI Mock Interview Platform

## API Design Specification

**Version:** 1.0  
**Architecture:** REST API + WebSocket  
**Authentication:** JWT + Refresh Token  
**Content Type:** application/json

---

# 1. Purpose

This document defines every API endpoint required by the AI Mock Interview Platform.

The API is designed to be:

- RESTful
- Stateless
- Secure
- Versioned
- Scalable
- Consistent
- Easy to consume
- Future-proof

All endpoints follow the same response format.

---

# 2. Base URL

Development

```
http://localhost:5000/api/v1
```

Production

```
https://api.mockinterview.ai/api/v1
```

---

# 3. API Versioning

All APIs must be versioned.

Example

```
/api/v1/auth/login
/api/v1/auth/signup
/api/v1/interviews
```

Future

```
/api/v2/
```

---

# 4. Authentication

Authentication Method

JWT Access Token

Authorization Header

```
Authorization: Bearer <access_token>
```

Refresh Token

HTTP Only Cookie

---

# 5. Standard Response Format

Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is required."
    }
  ]
}
```

---

# 6. Authentication APIs

---

## Register User

POST

```
/auth/signup
```

Request

```json
{
  "name": "",
  "email": "",
  "password": ""
}
```

Response

```json
{
  "user": {},
  "accessToken": ""
}
```

---

## Login

POST

```
/auth/login
```

---

## Logout

POST

```
/auth/logout
```

---

## Refresh Token

POST

```
/auth/refresh
```

---

## Forgot Password

POST

```
/auth/forgot-password
```

---

## Reset Password

POST

```
/auth/reset-password
```

---

## Verify Email

POST

```
/auth/verify-email
```

---

## Change Password

PUT

```
/auth/change-password
```

---

# 7. User APIs

---

## Get Current User

GET

```
/users/me
```

---

## Update Profile

PUT

```
/users/profile
```

---

## Upload Avatar

POST

```
/users/avatar
```

Multipart Form Data

---

## Delete Account

DELETE

```
/users/account
```

---

# 8. Resume APIs

---

## Upload Resume

POST

```
/resumes/upload
```

Multipart

PDF

DOCX

---

## Parse Resume

POST

```
/resumes/:id/parse
```

---

## Get Resume

GET

```
/resumes/:id
```

---

## Delete Resume

DELETE

```
/resumes/:id
```

---

## List User Resumes

GET

```
/resumes
```

---

# 9. Job Description APIs

---

## Upload JD

POST

```
/job-descriptions/upload
```

---

## Parse JD

POST

```
/job-descriptions/:id/parse
```

---

## Compare Resume with JD

POST

```
/job-descriptions/:id/match
```

Response

```
Matching Score

Missing Skills

Strong Skills

Weak Areas

Recommendations
```

---

## Get JD

GET

```
/job-descriptions/:id
```

---

## Delete JD

DELETE

```
/job-descriptions/:id
```

---

# 10. Interview APIs

---

## Start Interview

POST

```
/interviews
```

Request

```
Role

Difficulty

Company

Duration

Interview Type

Resume

JD
```

---

## Get Interview

GET

```
/interviews/:id
```

---

## Get Current Question

GET

```
/interviews/:id/question
```

---

## Submit Answer

POST

```
/interviews/:id/answer
```

Request

```json
{
  "answer": "..."
}
```

---

## Generate Next Question

POST

```
/interviews/:id/next
```

---

## Pause Interview

PATCH

```
/interviews/:id/pause
```

---

## Resume Interview

PATCH

```
/interviews/:id/resume
```

---

## Finish Interview

PATCH

```
/interviews/:id/finish
```

---

## Cancel Interview

DELETE

```
/interviews/:id
```

---

## Interview History

GET

```
/interviews/history
```

---

# 11. AI APIs

---

## Generate Technical Question

POST

```
/ai/questions/technical
```

---

## Generate HR Question

POST

```
/ai/questions/hr
```

---

## Generate Behavioral Question

POST

```
/ai/questions/behavioral
```

---

## Generate Coding Question

POST

```
/ai/questions/coding
```

---

## Generate Follow-up Question

POST

```
/ai/questions/follow-up
```

---

## Evaluate Answer

POST

```
/ai/evaluate
```

---

## Generate Interview Report

POST

```
/ai/report
```

---

# 12. Coding APIs

---

## Get Coding Question

GET

```
/coding/questions/:id
```

---

## List Coding Questions

GET

```
/coding/questions
```

Filters

Difficulty

Topic

Company

---

## Run Code

POST

```
/coding/run
```

---

## Submit Code

POST

```
/coding/submit
```

---

## Get Submission

GET

```
/coding/submissions/:id
```

---

## AI Code Review

POST

```
/coding/review
```

---

## Optimization Suggestions

POST

```
/coding/optimize
```

---

# 13. Voice APIs

---

## Speech To Text

POST

```
/voice/stt
```

---

## Text To Speech

POST

```
/voice/tts
```

---

## Analyze Audio

POST

```
/voice/analyze
```

Returns

Speaking Speed

Confidence

Pronunciation

Fluency

Filler Words

---

# 14. Report APIs

---

## Get Report

GET

```
/reports/:id
```

---

## Download Report

GET

```
/reports/:id/download
```

---

## Share Report

POST

```
/reports/:id/share
```

---

## Compare Reports

POST

```
/reports/compare
```

---

# 15. Dashboard APIs

---

## Dashboard Summary

GET

```
/dashboard
```

---

## Weekly Progress

GET

```
/dashboard/weekly
```

---

## Monthly Progress

GET

```
/dashboard/monthly
```

---

## Strong Topics

GET

```
/dashboard/topics/strong
```

---

## Weak Topics

GET

```
/dashboard/topics/weak
```

---

## Practice Statistics

GET

```
/dashboard/statistics
```

---

# 16. Learning APIs

---

## Generate Roadmap

POST

```
/learning/roadmap
```

---

## Get Current Roadmap

GET

```
/learning/roadmap
```

---

## Recommended Problems

GET

```
/learning/problems
```

---

## Recommended Topics

GET

```
/learning/topics
```

---

# 17. Notification APIs

---

## Get Notifications

GET

```
/notifications
```

---

## Mark Read

PATCH

```
/notifications/:id/read
```

---

## Mark All Read

PATCH

```
/notifications/read-all
```

---

## Delete Notification

DELETE

```
/notifications/:id
```

---

# 18. Achievement APIs

---

## Get Achievements

GET

```
/achievements
```

---

## XP

GET

```
/achievements/xp
```

---

## Leaderboard

GET

```
/leaderboard
```

Future Feature

---

# 19. Settings APIs

---

## Get Settings

GET

```
/settings
```

---

## Update Settings

PUT

```
/settings
```

---

# 20. Analytics APIs

---

## Interview Analytics

GET

```
/analytics/interviews
```

---

## Communication Analytics

GET

```
/analytics/communication
```

---

## Coding Analytics

GET

```
/analytics/coding
```

---

## Skill Analytics

GET

```
/analytics/skills
```

---

# 21. Company Mode APIs

---

## Supported Companies

GET

```
/companies
```

---

## Company Configuration

GET

```
/companies/:company
```

---

## Generate Company Interview

POST

```
/companies/:company/interview
```

---

# 22. Admin APIs

---

## Dashboard

GET

```
/admin/dashboard
```

---

## Users

GET

```
/admin/users
```

---

## Delete User

DELETE

```
/admin/users/:id
```

---

## Reports

GET

```
/admin/reports
```

---

## Analytics

GET

```
/admin/analytics
```

---

## Prompt Management

GET

```
/admin/prompts
```

PUT

```
/admin/prompts/:id
```

---

# 23. Health APIs

---

## Health Check

GET

```
/health
```

---

## Ping

GET

```
/ping
```

---

# 24. WebSocket Events

Namespace

```
/interview
```

Events

Client

```
joinInterview

leaveInterview

submitAnswer

typing

voiceChunk

cameraStatus

heartbeat
```

Server

```
questionGenerated

followUpQuestion

answerEvaluated

timerUpdated

interviewCompleted

voiceResponse

warning

error
```

---

# 25. HTTP Status Codes

Success

```
200 OK

201 Created

202 Accepted

204 No Content
```

Client Errors

```
400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests
```

Server Errors

```
500 Internal Server Error

502 Bad Gateway

503 Service Unavailable
```

---

# 26. Pagination

Supported Query Parameters

```
?page=1

?limit=10

?sort=-createdAt

?search=react
```

Example Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

# 27. Filtering

Examples

```
?difficulty=Advanced

?company=Google

?topic=React

?status=Completed
```

---

# 28. Security

Every protected API should:

- Require JWT
- Validate request body
- Validate query parameters
- Validate URL parameters
- Rate limit requests
- Sanitize inputs
- Log important events

---

# 29. Error Handling

Standard Error Object

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email is invalid."
    }
  ],
  "requestId": "req_123456789"
}
```

---

# 30. Rate Limiting

Recommended Limits

Authentication

```
5 requests/minute
```

AI Endpoints

```
30 requests/minute
```

Interview Endpoints

```
60 requests/minute
```

Coding Execution

```
20 submissions/minute
```

---

# 31. API Naming Rules

Always use:

- Plural resource names
- Nouns instead of verbs
- HTTP methods for actions
- Consistent URL patterns
- Kebab-case for multi-word resources if needed
- Meaningful route names

Examples

```
GET /reports

POST /reports

GET /reports/:id

DELETE /reports/:id
```

---

# 32. Future APIs

Reserved for future releases:

- Video Interviews
- AI Avatar Sessions
- Recruiter Portal
- Organization Management
- Subscription & Billing
- Payment Processing
- AI Career Coach
- Resume Builder
- Cover Letter Generator
- Placement Drives
- Group Discussions
- Mobile Device Sync

---

# 33. Definition of Done

An API endpoint is considered production-ready when it:

- Follows REST conventions
- Is versioned
- Is documented
- Validates all inputs
- Returns standardized responses
- Implements authentication and authorization where required
- Handles errors consistently
- Is rate-limited where appropriate
- Is logged and monitored
- Is tested
- Supports future extensibility
