import type { PublicQuestion } from "@/lib/quiz";

export type GradedResult = {
  questionId: string;
  selectedOptionId: string;
  correct: boolean;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
};

export type QuizPayload = {
  kind: "tech" | "cefr";
  questions: PublicQuestion[];
  level?: string;
  technologies?: string[];
};

const PREFIX = "quiz-session:";

export function saveQuizPayload(attemptId: string, payload: QuizPayload) {
  sessionStorage.setItem(PREFIX + attemptId, JSON.stringify(payload));
}

export function loadQuizPayload(attemptId: string): QuizPayload | null {
  const raw = sessionStorage.getItem(PREFIX + attemptId);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizPayload;
  } catch {
    return null;
  }
}
