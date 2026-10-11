"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TECH_LEVELS, TECHNOLOGIES } from "@/lib/constants";
import { saveQuizPayload } from "@/lib/quiz-session";
import type { PublicQuestion } from "@/lib/quiz";

export default function TechQuizSelectPage() {
  const router = useRouter();
  const [level, setLevel] = useState<(typeof TECH_LEVELS)[number]["id"]>("fresher");
  const [technologies, setTechnologies] = useState<string[]>(["react"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleTech(id: string) {
    setTechnologies((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function start() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/quiz/tech/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, technologies }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Could not start quiz");
        return;
      }
      const attemptId = crypto.randomUUID();
      saveQuizPayload(attemptId, {
        kind: "tech",
        questions: json.questions as PublicQuestion[],
        level,
        technologies,
      });
      router.push(`/quiz/tech/${attemptId}`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Job interview quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Experience level</legend>
          {TECH_LEVELS.map((item) => (
            <label key={item.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="level"
                checked={level === item.id}
                onChange={() => setLevel(item.id)}
              />
              {item.label}
            </label>
          ))}
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Technologies</legend>
          {TECHNOLOGIES.map((item) => (
            <label key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={technologies.includes(item.id)}
                onChange={() => toggleTech(item.id)}
              />
              {item.label}
            </label>
          ))}
        </fieldset>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button onClick={start} disabled={loading || technologies.length === 0}>
          {loading ? "Starting…" : "Start quiz"}
        </Button>
      </CardContent>
    </Card>
  );
}
