"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-slate-200 bg-white">
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
