import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isCefrLevel, scoreCefr, type CefrQuestion } from "@/lib/quiz";
import { cefrSubmitSchema } from "@/lib/validators";
import { Question } from "@/models/Question";
import { QuizAttempt } from "@/models/QuizAttempt";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = cefrSubmitSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const { answers } = parsed.data;
    const ids = answers
      .map((answer) => answer.questionId)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (ids.length !== answers.length || new Set(ids).size !== answers.length) {
      return NextResponse.json({ error: "Invalid or duplicate question IDs" }, { status: 400 });
    }

    const questions = await Question.find({
      _id: { $in: ids },
      quizType: "cefr",
    }).exec();
    if (questions.length !== answers.length) {
      return NextResponse.json({ error: "One or more questions are invalid" }, { status: 400 });
    }

    const byId = new Map(questions.map((question) => [question._id.toString(), question]));
    const hasInvalidOption = answers.some((answer) => {
      const question = byId.get(answer.questionId);
      return (
        !question ||
        (Boolean(answer.selectedOptionId) &&
          !question.options.some((option) => option.id === answer.selectedOptionId))
      );
    });
    if (hasInvalidOption) {
      return NextResponse.json({ error: "Selected option does not belong to the question" }, { status: 400 });
    }

    const graded = answers.map((answer) => {
      const question = byId.get(answer.questionId);
      const correct = Boolean(
        question &&
          answer.selectedOptionId &&
          question.correctOptionId === answer.selectedOptionId
      );
      return {
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId ?? "",
        correct,
        questionText: question?.questionText ?? "Unknown question",
        options: question?.options ?? [],
        correctOptionId: question?.correctOptionId ?? "",
        explanation: question?.explanation,
      };
    });

    const score = graded.filter((item) => item.correct).length;
    const totalQuestions = graded.length;
    const cefrQuestions: CefrQuestion[] = questions.map((question) => {
      if (!isCefrLevel(question.cefrLevel)) {
        throw new Error(`CEFR question ${question._id.toString()} has no valid level`);
      }
      return {
        _id: question._id,
        cefrLevel: question.cefrLevel,
        correctOptionId: question.correctOptionId,
      };
    });
    const cefrScore = scoreCefr(cefrQuestions, answers);
    const cefrResult = cefrScore.level;

    const session = await getSession();
    let attemptId: string | undefined;
    if (session?.user?.id) {
      const attempt = await QuizAttempt.create({
        userId: session.user.id,
        quizType: "cefr",
        score,
        totalQuestions,
        cefrResult,
        answers: graded.map((item) => ({
          questionId: item.questionId,
          selectedOptionId: item.selectedOptionId || undefined,
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
      cefrResult,
      cefrBreakdown: cefrScore.breakdown,
      results: graded,
    });
  } catch (error) {
    console.error("Could not submit CEFR quiz", error);
    return NextResponse.json({ error: "Could not submit quiz" }, { status: 500 });
  }
}
