"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TECH_LEVELS, TECHNOLOGIES } from "@/lib/constants";

type QuestionRow = {
  id: string;
  quizType: "tech" | "cefr";
  technology?: string;
  level?: string;
  cefrLevel?: string;
  questionText: string;
};

export default function AdminQuestionsPage() {
  const [quizType, setQuizType] = useState("");
  const [level, setLevel] = useState("");
  const [technology, setTechnology] = useState("");
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const params = new URLSearchParams();
    if (quizType) params.set("quizType", quizType);
    if (level) params.set("level", level);
    if (technology) params.set("technology", technology);
    const response = await fetch(`/api/admin/questions?${params.toString()}`);
    const json = await response.json();
    if (!response.ok) {
      setError(json.error ?? "Could not load questions");
      return;
    }
    setQuestions(json.questions);
    setError(null);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this question?")) return;
    const response = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const json = await response.json();
      setError(json.error ?? "Delete failed");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Questions</h1>
        <Link href="/admin/questions/new">
          <Button>Add question</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-6 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <select
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              value={quizType}
              onChange={(event) => setQuizType(event.target.value)}
            >
              <option value="">All</option>
              <option value="tech">Tech</option>
              <option value="cefr">CEFR</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <select
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="">All</option>
              {TECH_LEVELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Technology</Label>
            <select
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              value={technology}
              onChange={(event) => setTechnology(event.target.value)}
            >
              <option value="">All</option>
              {TECHNOLOGIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="button" variant="secondary" onClick={() => void load()}>
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {questions.map((question) => (
          <li key={question.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-medium">{question.questionText}</p>
            <p className="mt-1 text-sm text-slate-500">
              {question.quizType}
              {question.technology ? ` · ${question.technology}` : ""}
              {question.level ? ` · ${question.level}` : ""}
              {question.cefrLevel ? ` · ${question.cefrLevel}` : ""}
            </p>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/questions/${question.id}/edit`}>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </Link>
              <Button size="sm" variant="destructive" onClick={() => void remove(question.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
