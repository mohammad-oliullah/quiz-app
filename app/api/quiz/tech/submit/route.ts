import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { techSubmitSchema } from "@/lib/validators";
import { Question } from "@/models/Question";
import { QuizAttempt } from "@/models/QuizAttempt";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = techSubmitSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const { level, technologies, answers } = parsed.data;
    const ids = answers
      .map((answer) => answer.questionId)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const questions = await Question.find({
      _id: { $in: ids },
      quizType: "tech",
      level,
      technology: { $in: technologies },
    }).exec();

    const byId = new Map(questions.map((question) => [question._id.toString(), question]));
    const graded = answers.map((answer) => {
      const question = byId.get(answer.questionId);
      const correct = Boolean(
        question && question.correctOptionId === answer.selectedOptionId
      );
      return {
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        correct,
        questionText: question?.questionText ?? "Unknown question",
        options: question?.options ?? [],
        correctOptionId: question?.correctOptionId ?? "",
        explanation: question?.explanation,
      };
    });

    const score = graded.filter((item) => item.correct).length;
    const totalQuestions = graded.length;

    const session = await getSession();
    let attemptId: string | undefined;
    if (session?.user?.id) {
      const attempt = await QuizAttempt.create({
        userId: session.user.id,
        quizType: "tech",
        technologies,
        level,
        score,
        totalQuestions,
        answers: graded.map((item) => ({
          questionId: item.questionId,
          selectedOptionId: item.selectedOptionId,
          correct: item.correct,
        })),
      });
      attemptId = attempt._id.toString();
    }

    return NextResponse.json({
      attemptId,
      saved: Boolean(attemptId),
      score,
      totalQuestions,
      results: graded,
    });
  } catch {
    return NextResponse.json({ error: "Could not submit quiz" }, { status: 500 });
  }
}
