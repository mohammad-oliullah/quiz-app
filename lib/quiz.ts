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

export function scoreToCefr(score: number, total: number): CefrLevel {
  if (total <= 0) return "A1";
  const ratio = score / total;
  const index = Math.min(
    CEFR_LEVELS.length - 1,
    Math.floor(ratio * CEFR_LEVELS.length)
  );
  return CEFR_LEVELS[index];
}
