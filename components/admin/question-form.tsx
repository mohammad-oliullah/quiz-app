"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CEFR_LEVELS, TECH_LEVELS, TECHNOLOGIES } from "@/lib/constants";
import { questionFormSchema } from "@/lib/validators";
import type { z } from "zod";

type FormValues = z.infer<typeof questionFormSchema>;

const emptyOptions = [
  { id: "a", text: "" },
  { id: "b", text: "" },
  { id: "c", text: "" },
  { id: "d", text: "" },
];

export function QuestionForm({
  questionId,
  initial,
}: {
  questionId?: string;
  initial?: Partial<FormValues>;
}) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      quizType: initial?.quizType ?? "tech",
      technology: initial?.technology ?? "react",
      level: initial?.level ?? "fresher",
      cefrLevel: initial?.cefrLevel ?? "A1",
      questionText: initial?.questionText ?? "",
      options: initial?.options ?? emptyOptions,
      correctOptionId: initial?.correctOptionId ?? "a",
      explanation: initial?.explanation ?? "",
    },
  });

  const quizType = form.watch("quizType");
  const optionValues = form.watch("options");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
    keyName: "fieldKey",
  });

  useEffect(() => {
    if (initial?.questionText) {
      form.reset({
        quizType: initial.quizType ?? "tech",
        technology: initial.technology ?? "react",
        level: initial.level ?? "fresher",
        cefrLevel: initial.cefrLevel ?? "A1",
        questionText: initial.questionText ?? "",
        options: initial.options ?? emptyOptions,
        correctOptionId: initial.correctOptionId ?? "a",
        explanation: initial.explanation ?? "",
      });
    }
  }, [form, initial]);

  async function onSubmit(values: FormValues) {
    const url = questionId
      ? `/api/admin/questions/${questionId}`
      : "/api/admin/questions";
    const response = await fetch(url, {
      method: questionId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await response.json();
    if (!response.ok) {
      form.setError("questionText", { message: json.error ?? "Save failed" });
      return;
    }
    router.push("/admin/questions");
    router.refresh();
  }

  function addOption() {
    const usedIds = new Set(optionValues.map((option) => option.id));
    const nextId = "abcdefghijklmnopqrstuvwxyz".split("").find((id) => !usedIds.has(id));
    if (!nextId) return;

    append({ id: nextId, text: "" });
  }

  function removeOption(index: number) {
    const removedId = optionValues[index]?.id;
    if (removedId && form.getValues("correctOptionId") === removedId) {
      const replacement = optionValues.find((_, optionIndex) => optionIndex !== index);
      if (replacement) form.setValue("correctOptionId", replacement.id);
    }
    remove(index);
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="quizType">Quiz type</Label>
        <select
          id="quizType"
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
          {...form.register("quizType")}
        >
          <option value="tech">Tech</option>
          <option value="cefr">CEFR</option>
        </select>
      </div>

      {quizType === "tech" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="technology">Technology</Label>
            <select
              id="technology"
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              {...form.register("technology")}
            >
              {TECHNOLOGIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <select
              id="level"
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
              {...form.register("level")}
            >
              {TECH_LEVELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="cefrLevel">CEFR level</Label>
          <select
            id="cefrLevel"
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            {...form.register("cefrLevel")}
          >
            {CEFR_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="questionText">Question</Label>
        <Textarea id="questionText" {...form.register("questionText")} />
        {form.formState.errors.questionText ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.questionText.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <Label>Options</Label>
        {fields.map((field, index) => (
          <div key={field.fieldKey} className="flex items-end gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor={`option-${field.id}`}>
                Option {field.id.toUpperCase()}
              </Label>
              <Input
                id={`option-${field.id}`}
                {...form.register(`options.${index}.text`)}
              />
              <input type="hidden" {...form.register(`options.${index}.id`)} />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={fields.length <= 2}
              onClick={() => removeOption(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        {form.formState.errors.options?.message ? (
          <p className="text-sm text-red-600">{form.formState.errors.options.message}</p>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          disabled={fields.length >= 26}
          onClick={addOption}
        >
          Add option
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="correctOptionId">Correct option</Label>
        <select
          id="correctOptionId"
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
          {...form.register("correctOptionId")}
        >
          {optionValues.map((option) => (
            <option key={option.id} value={option.id}>
              {option.id.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (optional)</Label>
        <Textarea id="explanation" {...form.register("explanation")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : "Save question"}
      </Button>
    </form>
  );
}
