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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/quiz/cefr/start", { method: "POST" });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Could not start test");
        return;
      }
      const attemptId = crypto.randomUUID();
      saveQuizPayload(attemptId, {
        kind: "cefr",
        questions: json.questions as PublicQuestion[],
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
          About 30 questions from A1 to C2. There is no time limit. Your band is
          estimated from overall score.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button onClick={start} disabled={loading}>
          {loading ? "Starting…" : "Start English level test"}
        </Button>
      </CardContent>
    </Card>
  );
}
