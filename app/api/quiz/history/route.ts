import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { QuizAttempt } from "@/models/QuizAttempt";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  await connectDB();
  const attempts = await QuizAttempt.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return NextResponse.json({
    attempts: attempts.map((attempt) => ({
      id: attempt._id.toString(),
      quizType: attempt.quizType,
      technologies: attempt.technologies,
      level: attempt.level,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      cefrResult: attempt.cefrResult,
      createdAt: attempt.createdAt,
    })),
  });
}
