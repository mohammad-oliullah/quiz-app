"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { loadQuizPayload, type QuizPayload } from "@/lib/quiz-session";

export default function TechAttemptPage() {
  const params = useParams<{ attemptId: string }>();
  const [payload, setPayload] = useState<QuizPayload | null | undefined>(undefined);

  useEffect(() => {
    setPayload(loadQuizPayload(params.attemptId));
  }, [params.attemptId]);

  if (payload === undefined) {
    return <p>Loading quiz…</p>;
  }

  if (!payload || payload.kind !== "tech") {
    return (
      <p>
        This quiz session expired.{" "}
        <Link className="underline" href="/quiz/tech">
          Start again
        </Link>
        .
      </p>
    );
  }

  return (
    <QuizPlayer
      questions={payload.questions}
      submitUrl="/api/quiz/tech/submit"
      extraBody={{
        level: payload.level,
        technologies: payload.technologies,
      }}
    />
  );
}
