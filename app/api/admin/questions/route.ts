import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { adminQuestionQuerySchema, questionFormSchema } from "@/lib/validators";
import { Question } from "@/models/Question";

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = adminQuestionQuerySchema.safeParse({
    quizType: searchParams.get("quizType") || undefined,
    level: searchParams.get("level") || undefined,
    technology: searchParams.get("technology") || undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }

  await connectDB();
  const { page, pageSize, ...filters } = parsed.data;
  const filter = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined)
  );
  const totalQuestions = await Question.countDocuments(filter).exec();
  const totalPages = Math.ceil(totalQuestions / pageSize);
  const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const questions = await Question.find(filter)
    .sort({ _id: -1 })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
    .lean()
    .exec();
  return NextResponse.json({
    page: currentPage,
    pageSize,
    totalQuestions,
    totalPages,
    questions: questions.map((question) => ({
      id: question._id.toString(),
      quizType: question.quizType,
      technology: question.technology,
      level: question.level,
      cefrLevel: question.cefrLevel,
      questionText: question.questionText,
      options: question.options,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
    })),
  });
}

export async function POST(request: Request) {
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
    const created = await Question.create({
      ...parsed.data,
      technology: parsed.data.quizType === "tech" ? parsed.data.technology : undefined,
      level: parsed.data.quizType === "tech" ? parsed.data.level : undefined,
      cefrLevel: parsed.data.quizType === "cefr" ? parsed.data.cefrLevel : undefined,
    });

    return NextResponse.json({ id: created._id.toString() }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create question" }, { status: 500 });
  }
}
