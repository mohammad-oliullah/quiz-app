# AGENTS.md — Quiz Platform

## 1. Project Overview

A quiz web app with two independent quiz systems:

1. **Job Interview Quiz** — user picks an experience level (Fresher 0–1yr / Junior 1–4yr / Senior 4+yr) and one or more technologies (e.g. React, Node.js, MongoDB). App serves a quiz built from questions matching that level + tech.
2. **CEFR English Level Test** — a separate, fixed quiz (not tech-related) that scores the user's English level as A1–C2.

Users take a quiz, submit answers, get a score + result screen. Results are saved to their account if logged in.

Build the **bare minimum working version** first. Don't add extra features not listed here (no admin panel, no leaderboard, no payments, no real-time multiplayer) unless asked.

---

## 2. Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript, both frontend + backend (API routes / Route Handlers — no separate backend server)
- **Database:** MongoDB with Mongoose
- **Auth:** NextAuth.js (Credentials provider + Google provider)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Validation:** Zod (for API input + forms)
- **State/forms:** React Hook Form + Zod resolver
- **Deployment target:** Vercel (keep this in mind for env var handling and serverless constraints — no long-running background jobs)

---

## 3. Data Models (MongoDB / Mongoose)

### User

```ts
{
  _id, name, email, passwordHash?, image?,
  provider: "credentials" | "google",
  role: "user" | "admin",   // default "user"
  createdAt
}
```

### Question

```ts
{
  _id,
  quizType: "tech" | "cefr",
  technology?: string,       // e.g. "react", "nodejs", "mongodb" — only for quizType "tech"
  level?: "fresher" | "junior" | "senior", // only for quizType "tech"
  cefrLevel?: "A1"|"A2"|"B1"|"B2"|"C1"|"C2", // only for quizType "cefr"
  questionText: string,
  options: [{ id: string, text: string }],  // 4 options
  correctOptionId: string,
  explanation?: string
}
```

### QuizAttempt

```ts
{
  _id, userId,
  quizType: "tech" | "cefr",
  technologies?: string[],   // for tech quiz
  level?: string,            // for tech quiz
  score: number,
  totalQuestions: number,
  cefrResult?: string,       // computed CEFR band, for cefr quiz
  answers: [{ questionId, selectedOptionId, correct: boolean }],
  createdAt
}
```

Seed the database with a starter question set (~15–20 questions per technology per level, ~30–40 CEFR questions spread across levels) via a seed script. Use placeholder/realistic questions — don't leave the DB empty.

---

## 4. Core Features (MVP scope)

### Auth

- Sign up / log in with email+password (Credentials) and Google OAuth
- Session via NextAuth (JWT strategy is fine, no need for DB sessions)
- Quiz results only save to history if the user is logged in. Let guests take a quiz without logging in, but prompt them to sign in to save the result.

### Tech Quiz Flow

1. User selects level (Fresher / Junior / Senior)
2. User selects one or more technologies from a list (checkbox multi-select)
3. App fetches a randomized set of questions matching level + selected tech(s) (e.g. 15 questions total, mixed proportionally if multiple techs selected)
4. Quiz UI: one question at a time, 4 options, next button, progress indicator
5. On submit: calculate score, show results page (score, correct/wrong breakdown, explanations)
6. If logged in, save the attempt to `QuizAttempt`

### CEFR Quiz Flow

1. Single "Start English Level Test" entry point (no level/tech selection)
2. Fixed set of ~30 questions spanning difficulty
3. On submit: calculate a CEFR band (simple scoring: map score range → A1–C2) and show result
4. Save to `QuizAttempt` if logged in

### Dashboard (logged-in users)

- Simple page listing past quiz attempts (date, type, score/result)

### Admin Dashboard

- Accessible only to users with `role: "admin"` (check via session in a layout/middleware guard)
- Seed script adds the first batch of questions initially
- Admin can add new questions after that from the dashboard: form with quizType, technology/level (or cefrLevel), question text, 4 options, correct option, optional explanation
- Admin can view a list of existing questions (filterable by quizType/level/technology) and edit or delete them
- No need for rich text editing, bulk import, or question versioning — plain form + list is enough for MVP

---

## 5. API Routes (Route Handlers)

```
POST   /api/auth/[...nextauth]        # NextAuth handler
POST   /api/quiz/tech/start           # body: { level, technologies[] } → returns randomized questions (no correct answers sent!)
POST   /api/quiz/tech/submit          # body: { level, technologies[], answers[] } → grades server-side, returns score + saves attempt
POST   /api/quiz/cefr/start           # returns randomized CEFR question set (no correct answers sent!)
POST   /api/quiz/cefr/submit          # body: { answers[] } → grades server-side, computes CEFR band, saves attempt
GET    /api/quiz/history              # logged-in user's past attempts

GET    /api/admin/questions           # list questions (filter by quizType/level/technology), admin-only
POST   /api/admin/questions           # create a question, admin-only
PUT    /api/admin/questions/:id       # edit a question, admin-only
DELETE /api/admin/questions/:id       # delete a question, admin-only
```

Every `/api/admin/*` route must check `session.user.role === "admin"` server-side before touching the DB — don't rely on hiding the UI link alone.

**Important:** never send `correctOptionId` to the client when starting a quiz. Grade on the server in the `submit` route by looking up questions by ID.

---

## 6. Folder Structure

```
/app
  /(auth)/login/page.tsx
  /(auth)/signup/page.tsx
  /quiz/tech/page.tsx           # level + tech selection
  /quiz/tech/[attemptId]/page.tsx   # active quiz / results
  /quiz/cefr/page.tsx
  /quiz/cefr/[attemptId]/page.tsx
  /dashboard/page.tsx
  /admin/questions/page.tsx           # list + filter questions
  /admin/questions/new/page.tsx       # add question form
  /admin/questions/[id]/edit/page.tsx # edit question form
  /api/auth/[...nextauth]/route.ts
  /api/quiz/tech/start/route.ts
  /api/quiz/tech/submit/route.ts
  /api/quiz/cefr/start/route.ts
  /api/quiz/cefr/submit/route.ts
  /api/quiz/history/route.ts
  /api/admin/questions/route.ts       # GET, POST
  /api/admin/questions/[id]/route.ts  # PUT, DELETE
/components
  /ui                # shadcn components
  /quiz               # QuizCard, ProgressBar, ResultSummary, etc.
/lib
  db.ts               # mongoose connection singleton
  auth.ts             # NextAuth config
  validators.ts       # zod schemas
/models
  User.ts
  Question.ts
  QuizAttempt.ts
/scripts
  seed.ts             # seeds Question collection
```

---

## 7. Coding Conventions

- TypeScript strict mode on.
- Use Zod to validate every API route's request body before touching the DB.
- Use a single cached Mongoose connection (`lib/db.ts`) — standard Next.js + Mongoose singleton pattern to avoid reconnecting on every serverless invocation.
- Keep components small; put quiz-taking logic (timer, current question index, answer tracking) in a single client component with local state — no need for global state management (no Redux/Zustand) for MVP.
- Server-side grading only. Client never receives correct answers until after submit.

---

## 8. Out of Scope for MVP (don't build unless asked)

- Timed quizzes / countdown enforcement
- Leaderboards or social sharing
- Payment/subscription
- Question difficulty adaptive logic
- Email verification flow
- Password reset flow (can stub it, don't fully build)

---

## 9. Environment Variables

```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 10. Build Order (suggested)

1. Next.js + TS + Tailwind + shadcn setup, MongoDB connection
2. Mongoose models + seed script with sample questions
3. NextAuth setup (credentials + Google)
4. Tech quiz: selection page → start API → quiz-taking UI → submit API → results page
5. CEFR quiz: same pattern, simpler (no selection step)
6. Dashboard/history page
7. Admin dashboard: role check guard, question list + filters, add/edit/delete forms and API routes
8. Polish: loading states, error handling, mobile responsiveness
