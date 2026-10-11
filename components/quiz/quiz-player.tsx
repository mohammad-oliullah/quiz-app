"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CefrLevelResult, PublicQuestion } from "@/lib/quiz";
import type { GradedResult } from "@/lib/quiz-session";
import { ResultSummary } from "@/components/quiz/result-summary";

type SubmitResponse = {
  attemptId?: string;
  saved: boolean;
  score: number;
  totalQuestions: number;
  cefrResult?: string;
  cefrBreakdown?: CefrLevelResult[];
  results: GradedResult[];
  error?: string;
};

export function QuizPlayer({
  questions,
  submitUrl,
  extraBody,
  durationMinutes,
  startedAt,
}: {
  questions: PublicQuestion[];
  submitUrl: string;
  extraBody?: Record<string, unknown>;
  durationMinutes: number;
  startedAt: number;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    Math.max(0, Math.ceil((startedAt + durationMinutes * 60_000 - Date.now()) / 1000))
  );
  const autoSubmitStarted = useRef(false);

  const question = questions[index];
  const progress = useMemo(
    () => ((index + (result ? 1 : 0)) / questions.length) * 100,
    [index, questions.length, result]
  );

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...extraBody,
        answers: questions.map((item) => ({
          questionId: item.id,
          selectedOptionId: answers[item.id] ?? "",
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
  }, [answers, extraBody, questions, submitting, submitUrl]);

  useEffect(() => {
    const updateRemaining = () => {
      setSecondsRemaining(
        Math.max(0, Math.ceil((startedAt + durationMinutes * 60_000 - Date.now()) / 1000))
      );
    };

    updateRemaining();
    const interval = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(interval);
  }, [durationMinutes, startedAt]);

  useEffect(() => {
    if (secondsRemaining !== 0 || result) return;

    setTimeExpired(true);
    if (!autoSubmitStarted.current) {
      autoSubmitStarted.current = true;
      void submit();
    }
  }, [result, secondsRemaining, submit]);

  if (result) {
    return (
      <ResultSummary
        score={result.score}
        totalQuestions={result.totalQuestions}
        cefrResult={result.cefrResult}
        cefrBreakdown={result.cefrBreakdown}
        saved={result.saved}
        results={result.results}
        timedOut={timeExpired}
      />
    );
  }

  if (!question) {
    return <p>No questions available.</p>;
  }

  const selected = answers[question.id];
  const isLast = index === questions.length - 1;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="space-y-4">
      <div
        className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
          secondsRemaining <= 60
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-slate-200 bg-white text-slate-700"
        }`}
        role="timer"
        aria-label="Time remaining"
      >
        <span className="font-medium">Time remaining</span>
        <span className="font-mono text-lg font-semibold tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
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
                disabled={submitting || timeExpired}
                onChange={() =>
                  setAnswers((current) => ({ ...current, [question.id]: option.id }))
                }
              />
              <span>{option.text}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {timeExpired && !result ? (
        <p className="text-sm font-medium text-red-600">
          Time is up. Submitting your answers{!submitting && error ? " failed." : "…"}
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={index === 0 || submitting || timeExpired}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Previous
        </Button>
        {isLast || timeExpired ? (
          <Button disabled={submitting || (!selected && !timeExpired)} onClick={submit}>
            {submitting ? "Submitting…" : timeExpired ? "Retry submit" : "Submit"}
          </Button>
        ) : (
          <Button
            disabled={!selected || submitting || timeExpired}
            onClick={() => setIndex((value) => value + 1)}
          >
            Next
          </Button>
        )}
      </div>
      <span className="sr-only">{progress}</span>
    </div>
  );
}
