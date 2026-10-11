import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { pickProportional, toPublicQuestion } from "@/lib/quiz";
import { techStartSchema } from "@/lib/validators";
import { Question } from "@/models/Question";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = techStartSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const { level, technologies } = parsed.data;

    const groups = await Promise.all(
      technologies.map((technology) =>
        Question.find({ quizType: "tech", level, technology }).exec()
      )
    );

    const availableCount = groups.reduce((count, group) => count + group.length, 0);
    if (availableCount < parsed.data.questionCount) {
      return NextResponse.json(
        { error: `Only ${availableCount} questions are available for that selection.` },
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
