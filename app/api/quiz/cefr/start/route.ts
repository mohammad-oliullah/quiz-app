import { NextResponse } from "next/server";
import { CEFR_LEVELS } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { pickProportional, toPublicQuestion } from "@/lib/quiz";
import { cefrStartSchema } from "@/lib/validators";
import { Question } from "@/models/Question";

export async function POST(request: Request) {
  try {
    const parsed = cefrStartSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const groups = await Promise.all(
      CEFR_LEVELS.map((cefrLevel) =>
        Question.find({ quizType: "cefr", cefrLevel }).exec()
      )
    );

    const availableCount = groups.reduce((count, group) => count + group.length, 0);
    if (availableCount < parsed.data.questionCount) {
      return NextResponse.json(
        { error: `Only ${availableCount} CEFR questions are available.` },
        { status: 404 }
      );
    }

    const selected = pickProportional(groups, parsed.data.questionCount);
    return NextResponse.json({
      questions: selected.map(toPublicQuestion),
    });
  } catch {
    return NextResponse.json({ error: "Could not start quiz" }, { status: 500 });
  }
}
