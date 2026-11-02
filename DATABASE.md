# DATABASE.md

# AI Mock Interview Platform

## Database Design Document

**Version:** 1.0

---

# 1. Purpose

This document defines the complete database architecture for the AI Mock Interview Platform.

The database is designed to support:

- Millions of users
- Millions of interview sessions
- Fast analytics
- AI conversation memory
- Resume parsing
- Job Description analysis
- Coding interviews
- Company-specific interview modes
- Future subscription support
- Future recruiter dashboard
- Future enterprise organizations

The database follows MongoDB best practices while maintaining normalization where appropriate and embedding data only when it improves performance.

---

# 2. Database Technology

Database

- MongoDB Atlas

ODM

- Mongoose

Deployment

- MongoDB Atlas Cluster

---

# 3. Design Principles

The database should be:

- Highly scalable
- Modular
- Easy to maintain
- Secure
- Optimized for read performance
- Optimized for write performance
- Indexed properly
- Future-proof

---

# 4. Collections Overview

```

Users

Profiles

Resumes

JobDescriptions

InterviewSessions

InterviewQuestions

InterviewAnswers

CodingQuestions

CodingSubmissions

Reports

Notifications

Achievements

Progress

LearningRoadmaps

SavedResources

Certificates

Settings

InterviewTemplates

PromptVersions

Analytics

AuditLogs

RefreshTokens

```

---

# 5. Entity Relationship Overview

```

User
│
├── Profile
├── Resume
├── Settings
├── Progress
├── Notifications
├── Certificates
├── Interview Sessions
│       │
│       ├── Questions
│       ├── Answers
│       ├── Coding
│       └── Report
│
└── Learning Roadmap

```

---

# 6. User Collection

Stores authentication information.

Fields

```
_id

name

email

password

role

avatar

provider

emailVerified

lastLogin

isActive

isDeleted

refreshTokenVersion

createdAt

updatedAt

```

Indexes

- email
- provider
- role

---

# 7. Profile Collection

Stores user profile.

Fields

```
userId

headline

bio

location

linkedin

github

portfolio

experienceLevel

preferredRoles

preferredCompanies

education

skills

languages

careerGoal

profileCompleted

createdAt

updatedAt

```

---

# 8. Resume Collection

Stores uploaded resume.

Fields

```
userId

originalFileName

cloudinaryUrl

fileSize

mimeType

uploadDate

parsed

skills

projects

experience

education

certifications

achievements

summary

createdAt

updatedAt

```

---

# 9. Job Description Collection

Stores uploaded Job Descriptions.

Fields

```
userId

title

company

cloudinaryUrl

requiredSkills

preferredSkills

responsibilities

experienceRequired

educationRequired

softSkills

keywords

summary

createdAt

updatedAt

```

---

# 10. Interview Session Collection

Stores one interview instance.

Fields

```
userId

resumeId

jobDescriptionId

companyMode

jobRole

experienceLevel

interviewType

difficulty

duration

status

currentQuestion

totalQuestions

questionsAsked

startTime

endTime

completed

score

passProbability

overallFeedback

sessionMetadata

createdAt

updatedAt

```

Status

- Pending
- Active
- Paused
- Completed
- Cancelled

---

# 11. Interview Question Collection

Stores generated interview questions.

Fields

```
sessionId

questionNumber

topic

difficulty

questionType

question

expectedConcepts

source

generatedBy

estimatedDifficulty

estimatedDuration

followUpParent

createdAt

```

Question Types

- Technical
- HR
- Behavioral
- Coding
- System Design

---

# 12. Interview Answer Collection

Stores candidate responses.

Fields

```
sessionId

questionId

answerText

audioUrl

transcript

thinkingTime

responseTime

answerDuration

confidenceScore

technicalScore

communicationScore

behavioralScore

grammarScore

fluencyScore

fillerWords

clarityScore

evaluation

followUpGenerated

createdAt

```

---

# 13. Coding Question Collection

Fields

```
title

difficulty

description

constraints

examples

starterCode

hiddenTestCases

sampleTestCases

expectedComplexity

supportedLanguages

companyTags

topicTags

createdAt

updatedAt

```

---

# 14. Coding Submission Collection

Fields

```
userId

sessionId

questionId

language

sourceCode

executionTime

memoryUsed

passedTests

totalTests

judgeResult

aiReview

optimizationSuggestions

submittedAt

```

---

# 15. Report Collection

Stores generated reports.

Fields

```
userId

sessionId

overallScore

technicalScore

communicationScore

behaviorScore

codingScore

confidenceScore

leadershipScore

problemSolvingScore

strengths

weaknesses

improvementAreas

recommendedTopics

learningRoadmap

summary

passProbability

generatedByAI

generatedAt

```

---

# 16. Progress Collection

Stores long-term learning progress.

Fields

```
userId

totalInterviews

practiceHours

weeklyHours

monthlyHours

averageScore

technicalAverage

codingAverage

communicationAverage

behaviorAverage

weakTopics

strongTopics

streak

xp

level

updatedAt

```

---

# 17. Achievement Collection

Fields

```
userId

title

description

icon

earnedDate

xpReward

category

```

Categories

- DSA
- Coding
- Communication
- Consistency
- Milestones

---

# 18. Notification Collection

Fields

```
userId

title

message

type

read

scheduledFor

sentAt

createdAt

```

---

# 19. Learning Roadmap Collection

Stores AI-generated learning plans.

Fields

```
userId

generatedFromReport

weakTopics

dailyPlan

weeklyPlan

recommendedProblems

recommendedResources

estimatedCompletion

status

createdAt

```

---

# 20. Certificate Collection

Fields

```
userId

title

issuer

issueDate

certificateUrl

verificationUrl

skills

createdAt

```

---

# 21. Settings Collection

Fields

```
userId

theme

language

notifications

voiceEnabled

cameraEnabled

microphoneEnabled

preferredDifficulty

preferredDuration

preferredCompanies

privacySettings

createdAt

updatedAt

```

---

# 22. Prompt Version Collection

Stores prompt history.

Fields

```
name

version

category

prompt

isActive

createdBy

createdAt

```

---

# 23. Interview Template Collection

Reusable interview templates.

Fields

```
title

jobRole

difficulty

topics

questionCount

estimatedDuration

companyMode

createdAt

```

---

# 24. Analytics Collection

Stores aggregated analytics.

Fields

```
userId

date

responseTimeAverage

thinkingTimeAverage

averageConfidence

averageCommunication

averageTechnical

topicCoverage

accuracyTrend

practiceTime

createdAt

```

---

# 25. Audit Log Collection

Tracks important actions.

Fields

```
userId

action

resource

resourceId

ipAddress

device

browser

timestamp

```

---

# 26. Refresh Token Collection

Stores refresh tokens.

Fields

```
userId

token

expiresAt

revoked

device

ipAddress

createdAt

```

---

# 27. Common Schema Standards

Every collection should include:

```
createdAt

updatedAt

```

using Mongoose timestamps.

---

# 28. Index Strategy

## User

```
email (unique)

```

## Interview

```
userId

status

createdAt

difficulty

companyMode

```

## Reports

```
userId

sessionId

generatedAt

```

## Progress

```
userId

```

## Notifications

```
userId

read

```

---

# 29. Relationships

```
User

1 ---- 1 Profile

User

1 ---- N Resume

User

1 ---- N JobDescription

User

1 ---- N InterviewSession

InterviewSession

1 ---- N InterviewQuestion

InterviewSession

1 ---- N InterviewAnswer

InterviewSession

1 ---- N CodingSubmission

InterviewSession

1 ---- 1 Report

User

1 ---- 1 Progress

User

1 ---- N Achievement

User

1 ---- N Notification

```

---

# 30. Soft Delete Strategy

Collections supporting soft delete should include:

```
isDeleted

deletedAt

deletedBy

```

Applicable to:

- Users
- Resumes
- Reports
- Templates

---

# 31. Validation Rules

Examples

Email

- Unique
- Required
- Lowercase

Password

- Hashed
- Minimum length
- Never returned in API responses

Interview Duration

Allowed values

- 15
- 30
- 45
- 60

Difficulty

Allowed values

- Beginner
- Intermediate
- Advanced
- Expert
- FAANG

Interview Type

Allowed values

- Technical
- Coding
- HR
- Behavioral
- Mixed
- System Design

---

# 32. File Storage Strategy

Database stores only metadata.

Actual files are stored in Cloudinary.

Database fields include:

```
publicId

url

secureUrl

mimeType

size

```

---

# 33. Future Collections

The following collections are reserved for future releases:

```
Organizations

Recruiters

RecruiterFeedback

Subscriptions

Payments

Invoices

Coupons

ReferralPrograms

Leaderboards

CompanyQuestionBanks

DiscussionRooms

VideoRecordings

AvatarModels

AIConversationMemory

PlacementDrives

```

---

# 34. Performance Considerations

- Use pagination for all large collections.
- Avoid unnecessary population.
- Use lean() for read-heavy queries.
- Project only required fields.
- Index frequently queried fields.
- Archive old interview sessions if needed.
- Store aggregated analytics separately from transactional data.

---

# 35. Data Retention

- Interview reports are retained unless deleted by the user.
- Audit logs may be archived after a configurable period.
- Refresh tokens should expire automatically.
- Temporary parsing artifacts should be cleaned up after processing.

---

# 36. Backup & Recovery

- Enable MongoDB Atlas automated backups.
- Support point-in-time recovery where available.
- Regularly test restore procedures.
- Maintain separate environments for development, staging, and production.

---

# 37. Security

- Encrypt passwords using bcrypt.
- Never store API keys in the database.
- Encrypt sensitive tokens where appropriate.
- Enforce least-privilege database access.
- Validate all inputs before persistence.
- Sanitize user-generated content.

---

# 38. Database Versioning

Database schema changes should be:

- Backward compatible whenever possible.
- Documented with migration notes.
- Applied through controlled migration scripts.

---

# 39. Future Scalability

The database should be capable of supporting:

- 10M+ users
- 100M+ interview sessions
- Multiple AI providers
- Multi-region deployments
- Enterprise organizations
- Recruiter workspaces
- AI-generated content at scale
- Advanced analytics and reporting

Schema evolution should prioritize compatibility and minimal disruption.

---

# 40. Definition of Done

A database design is considered complete when:

- Collections have clear responsibilities.
- Relationships are well-defined.
- Validation rules are documented.
- Required indexes are identified.
- Security considerations are addressed.
- Performance implications are considered.
- Future scalability is supported.
- The design aligns with the overall system architecture.
