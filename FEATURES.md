# Features

## Already implemented

- **Two quiz types:** job-interview quizzes for Fresher, Junior, and Senior levels, covering React, Node.js, MongoDB, TypeScript, NestJS, System Design, Docker, Next.js, and DevOps; and an English test covering CEFR levels A1–C2.
- **Quiz setup:** choose technologies and question count for tech quizzes, and question count for CEFR tests. Both flows let the user choose a time limit.
- **Quiz experience:** randomized questions, one question at a time, progress indicator, countdown timer, automatic submission when time runs out, and unanswered questions counted as incorrect.
- **Grading and results:** answers are graded on the server. Results show the score, selected and correct answers, explanations when available, and a level-by-level breakdown for CEFR.
- **Accounts:** email/password registration and sign-in, plus Google sign-in when its OAuth credentials are configured. Passwords are hashed, and sessions use JWTs.
- **Guest access and saved history:** guests can take quizzes and see results. Signed-in users' attempts are saved and listed on their dashboard.
- **Question management:** admins can create, edit, delete, filter, and paginate questions. Admin pages and question APIs check the user's admin role.
- **Starter question bank:** `npm run seed` loads sample tech and CEFR questions and creates or updates an admin account.
- **Input validation and database access:** Zod validates API inputs, and MongoDB connections are reused through a cached Mongoose connection.

## Recommended next additions

### Prioritize before a public launch

1. **Make quiz attempts server-owned.** The active quiz and its start time currently live in browser session storage, and the countdown is enforced by the browser. Store issued attempts on the server and validate their question set, ownership where applicable, and deadline during submission. This also enables reliable resume after closing or changing devices.
2. **Secure initial admin setup and seeding.** The seed script currently has fallback admin credentials and deletes the existing question collection before loading its data. Require explicit deployment credentials, avoid printing passwords, and make routine seeding non-destructive.
3. **Add automated tests.** Cover quiz selection and grading, input validation, guest versus signed-in behavior, and admin authorization. Add a production build check to the project workflow.
4. **Improve account recovery and protection.** Add password reset and, if accounts need verified ownership, email verification. Add rate limiting to registration and sign-in endpoints.

### Improve the core experience

5. **Expand and review the question bank.** Add more questions across every technology and experience level, review answer accuracy and explanations, and show admins coverage counts so sparse categories are easy to find.
6. **Make history more useful.** Add filters and pagination, and let users open a past result to review its answers and explanations.
7. **Polish accessibility and feedback.** Check keyboard navigation and screen-reader announcements, and add clearer loading, empty, and retry states throughout quiz and account flows.
## Current limitations to keep in mind

- Quiz history is available only to signed-in users; guest results are not retained after leaving the results page.
- The current dashboard lists scores and attempt details, but does not provide a saved-result review page.
- Google sign-in is only available when both Google OAuth environment variables are set.
- The seed script replaces the question bank and uses fallback admin credentials when the corresponding environment variables are absent; secure these before using the script against a deployed database.
