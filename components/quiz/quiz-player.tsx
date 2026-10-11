"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PublicQuestion } from "@/lib/quiz";
import type { GradedResult } from "@/lib/quiz-session";
import { ResultSummary } from "@/components/quiz/result-summary";

type SubmitResponse = {
  attemptId?: string;
  saved: boolean;
  score: number;
  totalQuestions: number;
  cefrResult?: string;
  results: GradedResult[];
  error?: string;
};

export function QuizPlayer({
  questions,
  submitUrl,
  extraBody,
}: {
  questions: PublicQuestion[];
  submitUrl: string;
  extraBody?: Record<string, unknown>;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResponse | null>(null);

  const question = questions[index];
  const progress = useMemo(
    () => ((index + (result ? 1 : 0)) / questions.length) * 100,
    [index, questions.length, result]
  );

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...extraBody,
        answers: questions.map((item) => ({
          questionId: item.id,
          selectedOptionId: answers[item.id],
        })),
      };
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as SubmitResponse;
      if (!response.ok) {
        setError(json.error ?? "Could not submit quiz");
        return;
      }
      setResult(json);
    } catch {
      setError("Network error while submitting");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <ResultSummary
        score={result.score}
        totalQuestions={result.totalQuestions}
        cefrResult={result.cefrResult}
        saved={result.saved}
        results={result.results}
      />
    );
  }

  if (!question) {
    return <p>No questions available.</p>;
  }

  const selected = answers[question.id];
  const isLast = index === questions.length - 1;

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-slate-500">
          Question {index + 1} of {questions.length}
        </p>
        <Progress value={((index + 1) / questions.length) * 100} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium leading-snug">
            {question.questionText}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                selected === option.id
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                className="mt-1"
                name={question.id}
                value={option.id}
                checked={selected === option.id}
                onChange={() =>
                  setAnswers((current) => ({ ...current, [question.id]: option.id }))
                }
              />
              <span>{option.text}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Previous
        </Button>
        {isLast ? (
          <Button disabled={!selected || submitting} onClick={submit}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        ) : (
          <Button disabled={!selected} onClick={() => setIndex((value) => value + 1)}>
            Next
          </Button>
        )}
      </div>
      <span className="sr-only">{progress}</span>
    </div>
  );
}
