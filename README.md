# Quiz Platform

A Next.js quiz app with two independent quiz experiences:

- **Full-stack Development Quiz:** choose a Fresher, Junior, or Senior level and one or more technologies.
- **CEFR English test:** take a mixed-level English quiz and get an estimated A1–C2 result.

Guests can take quizzes. Signed-in users can save attempts to their dashboard. Admins can manage the question bank.

## Current development status

The core MVP flows are implemented: credentials and optional Google sign-in, tech and CEFR quizzes, server-side grading, timed quizzes, saved quiz history, admin question management, and a starter question bank. Active quiz state currently lives in browser session storage, so it cannot be resumed after that browser session is lost. See [FEATURES.md](./FEATURES.md) for the implemented feature inventory, limitations, and recommended next steps.

## Tech stack

- Next.js 14 App Router and TypeScript
- MongoDB with Mongoose
- NextAuth.js (JWT sessions)
- Tailwind CSS
- Zod validation
- React Hook Form

## Requirements

- Node.js and npm
- A MongoDB database (local or hosted)
- Google OAuth credentials only if Google sign-in is desired

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root:

   ```dotenv
   MONGODB_URI=mongodb://127.0.0.1:27017/quiz-app
   NEXTAUTH_SECRET=replace-with-a-long-random-secret
   NEXTAUTH_URL=http://localhost:3000

   # Optional: enables Google sign-in when both are configured.
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=

   # Set these before running the seed script to configure the admin account.
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=replace-with-a-strong-password
   ```

   Use your actual MongoDB connection string and generate a unique secret for `NEXTAUTH_SECRET`. For hosted MongoDB, configure the database network access rules to allow the application to connect.

3. Seed the question bank and admin account:

   ```bash
   npm run seed
   ```

   **Caution:** the current seed script deletes all existing questions before inserting its starter question bank. It also falls back to `admin@quiz.local` / `admin12345` if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are not set, and prints the admin credentials. Set strong values in `.env.local` and use this script only with a database where replacing all questions is acceptable. Do not use the default credentials for a deployed app.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run Next.js lint checks |
| `npm run seed` | Replace the question bank with starter questions and create/update an admin account |

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Choose a quiz |
| `/quiz/tech` | Configure a full-stack development quiz |
| `/quiz/cefr` | Configure a CEFR English test |
| `/login`, `/signup` | Sign in or create an account |
| `/dashboard` | View saved quiz attempts (sign-in required) |
| `/admin/questions` | Manage quiz questions (admin required) |

## Google sign-in

Google sign-in is enabled only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured. Add the appropriate callback URL to your Google OAuth client (for example, `http://localhost:3000/api/auth/callback/google` locally), then set those environment variables in the relevant environment.

## Deployment

This app is designed for Next.js deployment platforms such as Vercel. Before deploying:

- Configure `MONGODB_URI`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in the deployment environment.
- Configure a production MongoDB database and allow connections from the deployment environment.
- Set Google OAuth variables if Google sign-in is required.
- Create an admin account with secure credentials; do not rely on the seed script's fallback credentials.
- Do not run the current seed script against a database whose questions must be preserved, because it deletes the existing question bank.

Run `npm run build` before deployment to check the production build.
