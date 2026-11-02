# RULES.md

# AI Mock Interview Platform

## Engineering Rules & Development Standards

Version: 1.0

---

# Philosophy

This project is built as a production-grade SaaS application.

Every decision should prioritize:

- Scalability
- Maintainability
- Security
- Performance
- Readability
- Reusability

Never optimize for writing less code.

Always optimize for writing better code.

---

# Rule 1

Never write demo code.

Every implementation must be production ready.

---

# Rule 2

Never hardcode values.

Move them to

- constants
- configuration
- environment variables

---

# Rule 3

Never duplicate code.

If code is repeated twice

Extract it.

---

# Rule 4

Never create God Components.

One component.

One responsibility.

---

# Rule 5

Never create God Controllers.

Controllers only

- validate request

- call services

- return response

Nothing else.

---

# Rule 6

Business logic belongs only inside Services.

Never inside

Controllers

Routes

Components

---

# Rule 7

Never directly call AI APIs from controllers.

Flow

Controller

↓

Service

↓

Prompt Builder

↓

AI Provider

↓

Formatter

↓

Controller

---

# Rule 8

Never directly access MongoDB from React.

React

↓

API

↓

Express

↓

MongoDB

---

# Rule 9

Every API must validate

Body

Query

Params

Headers

Files

---

# Rule 10

Every protected endpoint requires JWT.

No exceptions.

---

# Rule 11

Passwords must

Never be stored

Never be logged

Always be hashed.

---

# Rule 12

Secrets belong only in

.env

Never commit them.

---

# Rule 13

Every API returns

success

message

data

errors

Same format everywhere.

---

# Rule 14

Never expose internal errors.

Return friendly messages.

Log detailed errors.

---

# Rule 15

Every feature must support

Loading

Empty

Error

Success

States.

---

# Rule 16

Every page must be responsive.

Desktop

Tablet

Mobile

---

# Rule 17

Dark Mode support is mandatory.

---

# Rule 18

Accessibility is mandatory.

Keyboard

Screen Reader

Focus States

ARIA

---

# Rule 19

Animations should improve UX.

Never distract users.

---

# Rule 20

All components must be reusable.

Before creating a component ask

Can an existing component solve this?

---

# Rule 21

Never exceed

300 lines

per file.

Refactor instead.

---

# Rule 22

Prefer composition over inheritance.

---

# Rule 23

Use feature-based architecture.

Never organize by file type alone.

---

# Rule 24

Folder names

lowercase

Component names

PascalCase

Functions

camelCase

Constants

UPPER_CASE

---

# Rule 25

Use async/await.

Avoid Promise chains.

---

# Rule 26

Never ignore errors.

Handle every failure.

---

# Rule 27

Never swallow exceptions.

Either

Recover

or

Throw

---

# Rule 28

Use meaningful variable names.

Avoid

data

item

temp

obj

---

# Rule 29

Every function should have

One responsibility.

---

# Rule 30

Prefer early return.

Avoid nested conditions.

---

# Rule 31

Never mutate state directly.

---

# Rule 32

Global State

Zustand

Server State

TanStack Query

Local State

useState

---

# Rule 33

Never store server data in Zustand.

---

# Rule 34

Every API call belongs inside

/services/api

Never inside components.

---

# Rule 35

Never use inline styles.

Tailwind only.

---

# Rule 36

Never mix UI and business logic.

---

# Rule 37

Every form

Validates

Disables submit while loading

Shows helpful errors

---

# Rule 38

Uploads must validate

Type

Size

Extension

---

# Rule 39

Cloudinary stores files.

Mongo stores metadata.

---

# Rule 40

Never store binary files in MongoDB.

---

# Rule 41

All AI prompts belong inside

backend/prompts

Never inside services.

---

# Rule 42

Prompt names should describe purpose.

Example

technicalInterviewPrompt.js

---

# Rule 43

Prompt versions should be tracked.

---

# Rule 44

Conversation memory belongs to Interview Service.

---

# Rule 45

AI should never reveal interview answers during interviews.

---

# Rule 46

Judge0 is the only code execution service.

---

# Rule 47

Never execute user code locally.

---

# Rule 48

WebSocket events must be namespaced.

---

# Rule 49

Socket events use

camelCase

---

# Rule 50

Database schemas require timestamps.

---

# Rule 51

Every searchable field needs an index.

---

# Rule 52

Soft delete

where appropriate.

---

# Rule 53

Avoid unnecessary populate().

---

# Rule 54

Use lean() for read-heavy queries.

---

# Rule 55

Always paginate large datasets.

---

# Rule 56

API versioning is mandatory.

---

# Rule 57

Never break existing API contracts.

---

# Rule 58

Document every endpoint.

---

# Rule 59

Use semantic HTML.

---

# Rule 60

Every button has

Hover

Focus

Disabled

Loading

States.

---

# Rule 61

Every modal traps keyboard focus.

---

# Rule 62

Every page has breadcrumbs where appropriate.

---

# Rule 63

Never show blank screens.

Use skeleton loaders.

---

# Rule 64

Every destructive action requires confirmation.

---

# Rule 65

Every interview session auto-saves progress.

---

# Rule 66

Never lose user input unexpectedly.

---

# Rule 67

Retry recoverable requests.

---

# Rule 68

Show meaningful error messages.

---

# Rule 69

Never reveal stack traces.

---

# Rule 70

Every chart supports Dark Mode.

---

# Rule 71

Every chart is responsive.

---

# Rule 72

Use Lucide icons only.

---

# Rule 73

One icon library.

No mixing.

---

# Rule 74

Every reusable component belongs in

components/

---

# Rule 75

Feature-specific components stay inside

features/

---

# Rule 76

Never import across unrelated features.

---

# Rule 77

Avoid circular dependencies.

---

# Rule 78

Never create utility functions inside components.

---

# Rule 79

Utilities belong inside

utils/

---

# Rule 80

Constants belong inside

constants/

---

# Rule 81

Magic numbers are forbidden.

---

# Rule 82

Prefer enums/constants over strings.

---

# Rule 83

Every environment variable must be documented.

---

# Rule 84

Use Helmet.

---

# Rule 85

Enable CORS whitelist.

---

# Rule 86

Rate-limit public APIs.

---

# Rule 87

Sanitize all user input.

---

# Rule 88

Escape user-generated output where required.

---

# Rule 89

Never trust client-side validation.

---

# Rule 90

Log important server events.

Do not log passwords, tokens, or sensitive personal information.

---

# Rule 91

Separate logs by

Info

Warning

Error

Audit

---

# Rule 92

Testing

Business logic

First

UI

Second

---

# Rule 93

Every bug fix includes

Root Cause

Fix

Regression Check

---

# Rule 94

Small commits.

Meaningful commit messages.

---

# Rule 95

Never commit

node_modules

.env

logs

dist

coverage

---

# Rule 96

Code Reviews

Check

Architecture

Security

Performance

Accessibility

Responsiveness

Readability

---

# Rule 97

Performance first

Measure before optimizing.

Avoid premature optimization.

---

# Rule 98

Build for extension.

Not modification.

---

# Rule 99

If uncertain,

prefer the simpler architecture that satisfies current requirements while preserving a clear path for future expansion.

---

# Rule 100

Every completed feature must satisfy all of the following:

✓ Production Ready

✓ Responsive

✓ Secure

✓ Accessible

✓ Reusable

✓ Documented

✓ Tested

✓ Performant

✓ Maintainable

✓ Consistent with the project architecture

Only then is the feature considered complete.
