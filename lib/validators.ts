import { z } from "zod";

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
    .array(z.enum(["react", "nodejs", "mongodb"]))
    .min(1, "Select at least one technology"),
});

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOptionId: z.string().min(1),
});

export const techSubmitSchema = techStartSchema.extend({
  answers: z.array(quizAnswerSchema).min(1),
});

export const cefrSubmitSchema = z.object({
  answers: z.array(quizAnswerSchema).min(1),
});

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const questionFormSchema = z
  .object({
    quizType: z.enum(["tech", "cefr"]),
    technology: z.enum(["react", "nodejs", "mongodb"]).optional(),
    level: z.enum(["fresher", "junior", "senior"]).optional(),
    cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
    questionText: z.string().min(8, "Question text is required"),
    options: z.array(optionSchema).length(4, "Provide exactly 4 options"),
    correctOptionId: z.string().min(1),
    explanation: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const optionIds = value.options.map((option) => option.id);
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
  technology: z.enum(["react", "nodejs", "mongodb"]).optional(),
});
