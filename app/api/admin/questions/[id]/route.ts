import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { questionFormSchema } from "@/lib/validators";
import { Question } from "@/models/Question";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  await connectDB();
  const question = await Question.findById(params.id).lean().exec();
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({
    question: {
      id: question._id.toString(),
      quizType: question.quizType,
      technology: question.technology,
      level: question.level,
      cefrLevel: question.cefrLevel,
      questionText: question.questionText,
      options: question.options,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
    },
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  try {
    const json = await request.json();
    const parsed = questionFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await Question.findByIdAndUpdate(
      params.id,
      {
        ...parsed.data,
        technology: parsed.data.quizType === "tech" ? parsed.data.technology : undefined,
        level: parsed.data.quizType === "tech" ? parsed.data.level : undefined,
        cefrLevel: parsed.data.quizType === "cefr" ? parsed.data.cefrLevel : undefined,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update question" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  await connectDB();
  const deleted = await Question.findByIdAndDelete(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
