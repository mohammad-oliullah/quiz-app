"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-base font-semibold text-slate-900">
          Quiz Platform
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link className="rounded-md px-2 py-1 hover:bg-slate-100" href="/quiz/tech">
            Tech quiz
          </Link>
          <Link className="rounded-md px-2 py-1 hover:bg-slate-100" href="/quiz/cefr">
            English test
          </Link>
          <label className="sr-only" htmlFor="theme">
            Color theme
          </label>
          <select
            id="theme"
            aria-label="Color theme"
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            value={mounted ? theme ?? "system" : "system"}
            onChange={(event) => setTheme(event.target.value)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          {session?.user ? (
            <>
              <Link className="rounded-md px-2 py-1 hover:bg-slate-100" href="/dashboard">
                Dashboard
              </Link>
              {session.user.role === "admin" ? (
                <Link
                  className="rounded-md px-2 py-1 hover:bg-slate-100"
                  href="/admin/questions"
                >
                  Admin
                </Link>
              ) : null}
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign out
              </Button>
            </>
          ) : status === "loading" ? null : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
