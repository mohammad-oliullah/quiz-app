import { TECHNOLOGIES } from "@/lib/constants";
import type { TechnologyId } from "@/lib/constants";
import { z } from "zod";

const technologySchema = z.enum(
  TECHNOLOGIES.map((technology) => technology.id) as [TechnologyId, ...TechnologyId[]]
);

export const signupSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const techStartSchema = z.object({
  level: z.enum(["fresher", "junior", "senior"]),
  technologies: z
    .array(technologySchema)
    .min(1, "Select at least one technology"),
  questionCount: z.number().int().min(1).max(15),
  durationMinutes: z.number().int().min(1).max(180),
});

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOptionId: z.string().optional(),
});

export const techSubmitSchema = techStartSchema.extend({
  answers: z.array(quizAnswerSchema).min(1),
}).superRefine((value, ctx) => {
  if (value.answers.length !== value.questionCount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Answer count must match the selected question count",
      path: ["answers"],
    });
  }
});

export const cefrStartSchema = z.object({
  questionCount: z.number().int().min(1).max(30),
  durationMinutes: z.number().int().min(1).max(180),
});

export const cefrSubmitSchema = cefrStartSchema.extend({
  answers: z.array(quizAnswerSchema).min(1),
}).superRefine((value, ctx) => {
  if (value.answers.length !== value.questionCount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Answer count must match the selected question count",
      path: ["answers"],
    });
  }
});

const optionSchema = z.object({
  id: z.string().regex(/^[a-z]$/, "Option ids must be lowercase letters"),
  text: z.string().min(1),
});

export const questionFormSchema = z
  .object({
    quizType: z.enum(["tech", "cefr"]),
    technology: technologySchema.optional(),
    level: z.enum(["fresher", "junior", "senior"]).optional(),
    cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
    questionText: z.string().min(8, "Question text is required"),
    options: z
      .array(optionSchema)
      .min(2, "Provide at least 2 options")
      .max(26, "Provide no more than 26 options"),
    correctOptionId: z.string().min(1),
    explanation: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const optionIds = value.options.map((option) => option.id);
    if (new Set(optionIds).size !== optionIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Option ids must be unique",
        path: ["options"],
      });
    }
    if (!optionIds.includes(value.correctOptionId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Correct option must match one of the option ids",
        path: ["correctOptionId"],
      });
    }

    if (value.quizType === "tech") {
      if (!value.technology) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Technology is required for tech questions",
          path: ["technology"],
        });
      }
      if (!value.level) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Level is required for tech questions",
          path: ["level"],
        });
      }
    }

    if (value.quizType === "cefr" && !value.cefrLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CEFR level is required for English questions",
        path: ["cefrLevel"],
      });
    }
  });

export const adminQuestionQuerySchema = z.object({
  quizType: z.enum(["tech", "cefr"]).optional(),
  level: z.enum(["fresher", "junior", "senior"]).optional(),
  technology: technologySchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});
