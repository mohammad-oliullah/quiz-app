"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QuestionForm } from "@/components/admin/question-form";

export default function EditQuestionPage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/questions/${params.id}`)
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) {
          setError(json.error ?? "Could not load question");
          return;
        }
        setInitial(json.question);
      })
      .catch(() => setError("Network error"));
  }, [params.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!initial) return <p>Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit question</h1>
      <QuestionForm questionId={params.id} initial={initial} />
    </div>
  );
}
