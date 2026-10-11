import { CEFR_LEVELS, type CefrLevel } from "@/lib/constants";
import type { QuestionDocument } from "@/models/Question";

export type PublicQuestion = {
  id: string;
  questionText: string;
  options: { id: string; text: string }[];
};

export function toPublicQuestion(question: QuestionDocument): PublicQuestion {
  return {
    id: question._id.toString(),
    questionText: question.questionText,
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
    })),
  };
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickProportional<T>(groups: T[][], total: number): T[] {
  if (groups.length === 0) return [];

  const available = groups.map((group) => [...group]);
  const picks: T[] = [];
  const base = Math.floor(total / available.length);
  let remainder = total % available.length;

  available.forEach((group) => {
    const take = Math.min(group.length, base + (remainder > 0 ? 1 : 0));
    if (remainder > 0) remainder -= 1;
    picks.push(...shuffle(group).slice(0, take));
  });

  if (picks.length < total) {
    const remaining = available
      .flat()
      .filter((item) => !picks.includes(item));
    picks.push(...shuffle(remaining).slice(0, total - picks.length));
  }

  return shuffle(picks).slice(0, total);
}

export interface CefrQuestion {
  _id: { toString(): string };
  cefrLevel: CefrLevel;
  correctOptionId: string;
}

export interface CefrAnswer {
  questionId: string;
  selectedOptionId?: string | null;
}

export interface CefrLevelResult {
  level: CefrLevel;
  total: number;
  correct: number;
  percent: number;
  passed: boolean;
}

export interface CefrResult {
  level: CefrLevel | "Below A1";
  breakdown: CefrLevelResult[];
}

export function isCefrLevel(
  value: string | null | undefined
): value is CefrLevel {
  return CEFR_LEVELS.some((level) => level === value);
}

export function scoreCefr(
  questions: CefrQuestion[],
  answers: CefrAnswer[],
  passMark = 0.7
): CefrResult {
  const answerMap = new Map(
    answers.map((answer) => [
      answer.questionId,
      answer.selectedOptionId ?? null,
    ])
  );

  const breakdown: CefrLevelResult[] = CEFR_LEVELS.map((level) => {
    const levelQuestions = questions.filter(
      (question) => question.cefrLevel === level
    );
    const correct = levelQuestions.filter(
      (question) => answerMap.get(question._id.toString()) === question.correctOptionId
    ).length;
    const total = levelQuestions.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;

    return {
      level,
      total,
      correct,
      percent,
      passed: total > 0 && correct / total >= passMark,
    };
  });

  let placed: CefrResult["level"] = "Below A1";
  for (const result of breakdown) {
    if (!result.passed) break;
    placed = result.level;
  }

  return { level: placed, breakdown };
}
