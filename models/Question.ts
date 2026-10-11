import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const optionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const questionSchema = new Schema({
  quizType: { type: String, enum: ["tech", "cefr"], required: true },
  technology: { type: String },
  level: { type: String, enum: ["fresher", "junior", "senior"] },
  cefrLevel: {
    type: String,
    enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  questionText: { type: String, required: true },
  options: { type: [optionSchema], required: true },
  correctOptionId: { type: String, required: true },
  explanation: { type: String },
});

export type QuestionDocument = InferSchemaType<typeof questionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Question: Model<QuestionDocument> =
  mongoose.models.Question ??
  mongoose.model<QuestionDocument>("Question", questionSchema);
