import mongoose from "mongoose";
import interviewAnswerSchema from "./InterviewAnswer.js";

const { Schema } = mongoose;

export const interviewQuestionSchema = new Schema(
  {
    questionId: { type: String, required: true },
    duplicateKey: { type: String, default: null, index: true },
    type: { type: String, enum: ["technical", "behavioral", "hr", "coding", "follow-up", "system_design", "mixed"], required: true },
    topic: { type: String, default: "general" },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    prompt: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    answer: {
      type: interviewAnswerSchema,
      default: () => ({})
    }
  },
  { timestamps: true, _id: false }
);

export default interviewQuestionSchema;
