import mongoose from "mongoose";

const { Schema } = mongoose;

export const interviewAnswerSchema = new Schema(
  {
    response: { type: String, default: null },
    submittedAt: { type: Date, default: null },
    score: { type: Number, default: null },
    feedback: { type: String, default: null },
    aiEvaluation: { type: String, default: null },
    responseTimeMs: { type: Number, default: null },
    thinkingTimeMs: { type: Number, default: null },
    confidence: { type: Number, default: null },
    evaluatedAt: { type: Date, default: null },
  },
  { _id: false }
);

export default interviewAnswerSchema;
