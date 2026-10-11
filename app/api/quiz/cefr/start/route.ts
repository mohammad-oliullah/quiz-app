import { NextResponse } from "next/server";
import { CEFR_LEVELS, CEFR_QUIZ_SIZE } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { pickProportional, toPublicQuestion } from "@/lib/quiz";
import { Question } from "@/models/Question";

export async function POST() {
  try {
    await connectDB();
    const groups = await Promise.all(
      CEFR_LEVELS.map((cefrLevel) =>
        Question.find({ quizType: "cefr", cefrLevel }).exec()
      )
    );

    if (groups.every((group) => group.length === 0)) {
      return NextResponse.json(
        { error: "No CEFR questions found. Seed the database." },
        { status: 404 }
      );
    }

    const selected = pickProportional(groups, CEFR_QUIZ_SIZE);
    return NextResponse.json({
      questions: selected.map(toPublicQuestion),
    });
  } catch {
    return NextResponse.json({ error: "Could not start quiz" }, { status: 500 });
  }
}
