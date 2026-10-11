import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );

  return (
    <Suspense fallback={<p>Loading…</p>}>
      <LoginForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
