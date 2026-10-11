import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const answerSchema = new Schema(
  {
    questionId: { type: Schema.Types.ObjectId, required: true },
    selectedOptionId: { type: String, required: true },
    correct: { type: Boolean, required: true },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizType: { type: String, enum: ["tech", "cefr"], required: true },
    technologies: { type: [String] },
    level: { type: String },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    cefrResult: { type: String },
    answers: { type: [answerSchema], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type QuizAttemptDocument = InferSchemaType<typeof quizAttemptSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const QuizAttempt: Model<QuizAttemptDocument> =
  mongoose.models.QuizAttempt ??
  mongoose.model<QuizAttemptDocument>("QuizAttempt", quizAttemptSchema);
