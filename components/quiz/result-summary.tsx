"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GradedResult } from "@/lib/quiz-session";

export function ResultSummary({
  score,
  totalQuestions,
  cefrResult,
  saved,
  results,
  timedOut = false,
}: {
  score: number;
  totalQuestions: number;
  cefrResult?: string;
  saved: boolean;
  results: GradedResult[];
  timedOut?: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-2xl font-semibold">
            {score} / {totalQuestions}
          </p>
          {timedOut ? (
            <p className="text-sm text-red-700">
              Time expired. Unanswered questions were counted as incorrect.
            </p>
          ) : null}
          {cefrResult ? (
            <p>
              Estimated CEFR band: <span className="font-semibold">{cefrResult}</span>
            </p>
          ) : null}
          {saved ? (
            <p className="text-sm text-slate-600">This attempt was saved to your account.</p>
          ) : (
            <p className="text-sm text-slate-600">
              You are not signed in, so this result was not saved.{" "}
              <Link className="underline" href="/login">
                Log in
              </Link>{" "}
              or{" "}
              <Link className="underline" href="/signup">
                create an account
              </Link>{" "}
              to keep a history next time.
            </p>
          )}
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary">Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {results.map((item, index) => (
          <Card key={item.questionId}>
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Q{index + 1}</span>
                <Badge className={item.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                  {item.correct ? "Correct" : "Incorrect"}
                </Badge>
              </div>
              <CardTitle className="text-base font-medium leading-snug">
                {item.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="space-y-1">
                {item.options.map((option) => {
                  const isCorrect = option.id === item.correctOptionId;
                  const isSelected = option.id === item.selectedOptionId;
                  return (
                    <li
                      key={option.id}
                      className={
                        isCorrect
                          ? "rounded-md bg-emerald-50 px-2 py-1"
                          : isSelected
                            ? "rounded-md bg-red-50 px-2 py-1"
                            : "px-2 py-1"
                      }
                    >
                      {option.text}
                      {isCorrect ? " — correct answer" : isSelected ? " — your answer" : ""}
                    </li>
                  );
                })}
              </ul>
              {item.explanation ? (
                <p className="text-slate-600">{item.explanation}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
