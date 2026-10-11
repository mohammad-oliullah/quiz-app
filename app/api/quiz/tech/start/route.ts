import { NextResponse } from "next/server";
import { TECH_QUIZ_SIZE } from "@/lib/constants";
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

    if (groups.every((group) => group.length === 0)) {
      return NextResponse.json(
        { error: "No questions found for that level and technology mix. Seed the database." },
        { status: 404 }
      );
    }

    const selected = pickProportional(groups, TECH_QUIZ_SIZE);
    return NextResponse.json({
      questions: selected.map(toPublicQuestion),
    });
  } catch {
    return NextResponse.json({ error: "Could not start quiz" }, { status: 500 });
  }
}
