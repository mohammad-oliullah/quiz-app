"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Attempt = {
  id: string;
  quizType: "tech" | "cefr";
  technologies?: string[];
  level?: string;
  score: number;
  totalQuestions: number;
  cefrResult?: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/quiz/history")
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) {
          setError(json.error ?? "Could not load history");
          return;
        }
        setAttempts(json.attempts);
      })
      .catch(() => setError("Network error"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your quiz history</h1>
        <p className="text-slate-600">Scores are saved when you are logged in.</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {attempts && attempts.length === 0 ? (
        <p>No attempts yet. Take a quiz to see it here.</p>
      ) : null}
      <div className="space-y-3">
        {attempts?.map((attempt) => (
          <Card key={attempt.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">
                {attempt.quizType === "tech" ? "Tech interview quiz" : "CEFR English test"}
              </CardTitle>
              <Badge>
                {attempt.score}/{attempt.totalQuestions}
                {attempt.cefrResult ? ` · ${attempt.cefrResult}` : ""}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              <p>{new Date(attempt.createdAt).toLocaleString()}</p>
              {attempt.quizType === "tech" ? (
                <p>
                  {attempt.level} · {(attempt.technologies ?? []).join(", ")}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
