"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { loadQuizPayload, type QuizPayload } from "@/lib/quiz-session";

export default function CefrAttemptPage() {
  const params = useParams<{ attemptId: string }>();
  const [payload, setPayload] = useState<QuizPayload | null | undefined>(undefined);

  useEffect(() => {
    setPayload(loadQuizPayload(params.attemptId));
  }, [params.attemptId]);

  if (payload === undefined) {
    return <p>Loading test…</p>;
  }

  if (!payload || payload.kind !== "cefr") {
    return (
      <p>
        This test session expired.{" "}
        <Link className="underline" href="/quiz/cefr">
          Start again
        </Link>
        .
      </p>
    );
  }

  return <QuizPlayer questions={payload.questions} submitUrl="/api/quiz/cefr/submit" />;
}
