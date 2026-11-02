# UI.md

# AI Mock Interview Platform

## UI / UX Design System Documentation

**Version:** 1.0

**Design Philosophy:** Modern • Professional • Minimal • AI First

---

# 1. Purpose

This document defines the complete UI and UX guidelines for the AI Mock Interview Platform.

Every screen should feel like a premium SaaS product similar to:

- Linear
- Stripe Dashboard
- Vercel
- Notion
- GitHub
- Raycast
- Framer
- Cursor

The UI should prioritize clarity over decoration.

The interface should never overwhelm the user.

The interview experience should feel immersive, focused, and distraction-free.

---

# 2. Design Principles

The UI should be:

- Clean
- Modern
- Professional
- Fast
- Accessible
- Minimal
- Responsive
- Consistent
- Human-centered

Every design decision should answer one question:

> "Does this help the user focus on the interview?"

---

# 3. Design Language

Overall Style

- Minimalistic
- Soft shadows
- Rounded corners
- Spacious layouts
- High readability
- Consistent spacing
- Smooth transitions

Avoid

- Heavy gradients
- Glassmorphism
- Skeuomorphism
- Neon effects
- Excessive animations
- Flashy dashboards

---

# 4. Color Palette

## Primary

Blue

```
Primary 50
Primary 100
Primary 200
Primary 300
Primary 400
Primary 500
Primary 600
Primary 700
Primary 800
Primary 900
```

---

## Neutral

```
White

Gray 50

Gray 100

Gray 200

Gray 300

Gray 400

Gray 500

Gray 600

Gray 700

Gray 800

Gray 900

Black
```

---

## Success

Green

---

## Error

Red

---

## Warning

Amber

---

## Information

Sky Blue

---

# 5. Theme Support

Support

- Light Theme
- Dark Theme
- System Theme

Theme switching should happen instantly.

No page refresh.

Persist preference.

---

# 6. Typography

Primary Font

```
Inter
```

Fallback

```
system-ui
```

Font Weights

```
400

500

600

700

800
```

Never use decorative fonts.

---

# 7. Font Scale

Hero

```
48px
```

Page Heading

```
36px
```

Section Title

```
30px
```

Card Title

```
24px
```

Subtitle

```
20px
```

Body

```
16px
```

Small

```
14px
```

Caption

```
12px
```

---

# 8. Spacing System

Use an 8-point grid.

```
4

8

12

16

24

32

40

48

64

80

96
```

Never use random spacing.

---

# 9. Border Radius

Small

```
8px
```

Medium

```
12px
```

Large

```
16px
```

Extra Large

```
24px
```

Cards

```
20px
```

Buttons

```
12px
```

---

# 10. Shadows

Light

```
Small Shadow
```

Cards

```
Medium Shadow
```

Modal

```
Large Shadow
```

Hover

```
Elevated Shadow
```

Never use strong shadows.

---

# 11. Layout

Desktop

```
Sidebar

Navbar

Content

Right Panel (optional)
```

Tablet

```
Collapsible Sidebar
```

Mobile

```
Bottom Navigation

Drawer Menu
```

---

# 12. Responsive Breakpoints

```
xs

sm

md

lg

xl

2xl
```

All pages must be responsive.

---

# 13. Navigation

Desktop

Left Sidebar

Top Navigation

Breadcrumb

Mobile

Bottom Navigation

Drawer

---

# 14. Sidebar

Contains

Dashboard

Interviews

Coding

Reports

History

Learning

Achievements

Settings

Logout

---

# 15. Navbar

Contains

Logo

Search

Notifications

Theme Toggle

User Avatar

---

# 16. Buttons

Variants

Primary

Secondary

Outline

Ghost

Danger

Success

Loading

Disabled

Sizes

Small

Medium

Large

Icon

Buttons should have:

Hover

Focus

Loading

Disabled

Pressed

States

---

# 17. Cards

Use cards extensively.

Cards should have

Rounded Corners

Padding

Header

Body

Footer (optional)

Hover Effect

---

# 18. Inputs

Support

Text

Email

Password

Search

Textarea

Select

Combobox

Date

Time

File Upload

Code Editor

Voice Input

Camera Input

Every input should have

Label

Placeholder

Helper Text

Validation

Error Message

---

# 19. Form Design

Validation should be

Real-time

Helpful

Accessible

Never clear user input after validation failure.

---

# 20. Tables

Support

Sorting

Filtering

Pagination

Search

Row Selection

Responsive Layout

---

# 21. Modal

Use for

Delete

Confirmation

Upload

Settings

Preview

Modal should

Trap Focus

Close on ESC

Prevent Background Scroll

---

# 22. Toast Notifications

Success

Error

Warning

Info

Auto-dismiss

Manual Close

---

# 23. Empty States

Every page must include

Illustration

Message

Action Button

Example

"No interviews found."

Start Interview

---

# 24. Loading States

Never leave blank screens.

Use

Skeleton

Spinner

Progress Indicator

Loading Message

---

# 25. Error States

Provide

Clear Message

Retry Button

Support Link

---

# 26. Dashboard

Widgets

Practice Hours

Interview Count

Average Score

Progress

Upcoming Goals

Weak Topics

Strong Topics

Recent Activity

Quick Start

---

# 27. Interview Setup Page

Sections

Job Role

Experience

Company

Interview Type

Difficulty

Duration

Resume Upload

JD Upload

Start Interview Button

---

# 28. Live Interview Screen

Layout

AI Avatar / AI Card

↓

Question

↓

Answer Area

↓

Voice Waveform

↓

Timer

↓

Progress

↓

End Interview

Features

Current Question

Progress

Elapsed Time

Remaining Time

Microphone Status

Camera Status

AI Thinking

---

# 29. Coding Interview Screen

Layout

Question Panel

↓

Monaco Editor

↓

Console

↓

Output

↓

Run

↓

Submit

↓

Timer

---

# 30. Report Screen

Sections

Overall Score

Pass Probability

Technical

Communication

Behavior

Coding

Radar Chart

Timeline

Recommendations

Download PDF

Share Report

---

# 31. History Page

Cards

Date

Role

Company

Score

Duration

View Report

Retake Interview

---

# 32. Progress Dashboard

Charts

Weekly Progress

Monthly Progress

Skill Growth

Topic Mastery

XP

Streak

Achievements

---

# 33. Learning Page

Sections

Roadmap

Recommended Problems

Weak Topics

Videos

Articles

Practice Plan

---

# 34. Profile Page

Avatar

Resume

Certificates

Skills

Preferences

Account

Privacy

---

# 35. Settings

Theme

Language

Notifications

Microphone

Camera

Privacy

Delete Account

---

# 36. Animations

Use Framer Motion.

Animations

Page Transition

Card Hover

Fade

Slide

Scale

Collapse

Expand

Never animate excessively.

Animation should improve usability.

---

# 37. Icons

Use

Lucide React

Consistent size

Consistent stroke

Avoid mixing icon libraries.

---

# 38. Illustrations

Use modern illustrations for

Empty States

Errors

Success

Welcome Screens

---

# 39. Charts

Use

Recharts

Charts

Line

Area

Bar

Radar

Pie

Progress Ring

Charts should support

Dark Mode

Tooltips

Responsive Resize

---

# 40. Accessibility

Support

Keyboard Navigation

Screen Readers

ARIA Labels

Focus States

High Contrast

Reduced Motion

Tab Navigation

---

# 41. Micro Interactions

Buttons

Hover

Cards

Lift

Sidebar

Smooth Collapse

Inputs

Focus Ring

Toggle

Animated

Progress

Smooth Updates

---

# 42. Voice UI

Display

Listening

Thinking

Speaking

Muted

Disconnected

Visual waveform should react naturally.

---

# 43. Camera UI

Show

Camera Preview

Lighting Status

Eye Contact Indicator

Face Detection Status

Microphone Indicator

---

# 44. Notification Center

Grouped by

Today

Yesterday

This Week

Older

Actions

Mark Read

Delete

View

---

# 45. Mobile Experience

Optimize

Touch Targets

Bottom Navigation

Drawer

Swipe Gestures

Responsive Forms

Sticky Action Buttons

---

# 46. Performance Guidelines

Lazy Load

Pages

Charts

Editor

Heavy Components

Use Skeletons

Minimize Layout Shift

---

# 47. Component Library

Reusable Components

Button

Input

Card

Modal

Drawer

Tabs

Accordion

Tooltip

Popover

Avatar

Badge

Chip

Progress

Skeleton

Spinner

Table

Dropdown

Breadcrumb

Navbar

Sidebar

Footer

Pagination

Upload

Voice Recorder

Camera Preview

Interview Timer

Question Card

Answer Card

Code Editor

Chart Card

Report Card

---

# 48. UX Guidelines

Always

Show loading feedback

Confirm destructive actions

Save user progress

Prevent accidental navigation

Remember preferences

Display meaningful errors

Keep user informed

Reduce clicks

Guide first-time users

Never surprise the user.

---

# 49. Visual Consistency Rules

Every page should

Use the same spacing

Use the same button styles

Use the same typography

Use the same colors

Use the same icon size

Use the same animation duration

Use the same border radius

Never introduce one-off styles.

---

# 50. Definition of Good UI

A screen is considered complete when it:

✓ Is responsive

✓ Supports light and dark mode

✓ Is keyboard accessible

✓ Has loading states

✓ Has error states

✓ Has empty states

✓ Uses reusable components

✓ Follows the design system

✓ Maintains visual consistency

✓ Feels fast and polished

✓ Minimizes cognitive load

✓ Provides clear user feedback

---

# 51. UI Philosophy

The interface should never compete with the interview.

It should quietly support the user's journey by presenting information clearly, reducing distractions, and maintaining a professional atmosphere.

The user should feel like they are participating in a real interview conducted by a modern technology company, not interacting with a generic chatbot or a cluttered dashboard.

Every pixel should have a purpose.

Every interaction should feel intentional.

Every screen should reinforce confidence, focus, and professionalism.
