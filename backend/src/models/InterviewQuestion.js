import mongoose from "mongoose";
import interviewAnswerSchema from "./InterviewAnswer.js";

const { Schema } = mongoose;

const interviewHintSchema = new Schema(
  {
    level: { type: Number, min: 1, max: 3, required: true },
    text: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

export const interviewQuestionSchema = new Schema(
  {
    questionId: { type: String, required: true },
    duplicateKey: { type: String, default: null, index: true },
    type: {
      type: String,
      enum: [
        "technical",
        "behavioral",
        "hr",
        "coding",
        "follow-up",
        "system_design",
        "mixed",
      ],
      required: true,
    },
    topic: { type: String, default: "general" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    prompt: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    hints: { type: [interviewHintSchema], default: () => [] },
    answer: {
      type: interviewAnswerSchema,
      default: () => ({}),
    },
  },
  { timestamps: true, _id: false },
);

export default interviewQuestionSchema;
