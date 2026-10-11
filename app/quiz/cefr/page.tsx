"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { saveQuizPayload } from "@/lib/quiz-session";
import type { PublicQuestion } from "@/lib/quiz";

export default function CefrStartPage() {
  const router = useRouter();
  const [questionCount, setQuestionCount] = useState(30);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/quiz/cefr/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionCount, durationMinutes }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Could not start test");
        return;
      }
      const attemptId = crypto.randomUUID();
      saveQuizPayload(attemptId, {
        kind: "cefr",
        questions: json.questions as PublicQuestion[],
        durationMinutes,
        startedAt: Date.now(),
      });
      router.push(`/quiz/cefr/${attemptId}`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>CEFR English level test</CardTitle>
        <CardDescription>
          Questions span A1 to C2. Set the question count and time limit; your band is
          estimated from your score.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            Number of questions
            <input
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3"
              type="number"
              min={1}
              max={30}
              step={1}
              value={questionCount}
              onChange={(event) => setQuestionCount(Number(event.target.value))}
            />
            <span className="block font-normal text-slate-500">Choose 1–30 questions.</span>
          </label>
          <label className="space-y-2 text-sm font-medium">
            Time limit (minutes)
            <input
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3"
              type="number"
              min={1}
              max={180}
              step={1}
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
            />
            <span className="block font-normal text-slate-500">Choose 1–180 minutes.</span>
          </label>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button
          onClick={start}
          disabled={
            loading ||
            !Number.isInteger(questionCount) ||
            questionCount < 1 ||
            questionCount > 30 ||
            !Number.isInteger(durationMinutes) ||
            durationMinutes < 1 ||
            durationMinutes > 180
          }
        >
          {loading ? "Starting…" : "Start English level test"}
        </Button>
      </CardContent>
    </Card>
  );
}
