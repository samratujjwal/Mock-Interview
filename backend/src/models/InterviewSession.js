import mongoose from "mongoose";
import { softDeletePlugin } from "./plugins/softDeletePlugin.js";
import interviewQuestionSchema from "./InterviewQuestion.js";

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
    jobDescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobDescription",
      default: null,
    },
    title: { type: String, trim: true, default: "Mock interview session" },
    role: { type: String, trim: true, required: true, default: "General" },
    type: {
      type: String,
      trim: true,
      enum: ["technical", "behavioral", "system_design", "mixed"],
      default: "technical",
    },
    difficulty: {
      type: String,
      trim: true,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      index: true,
    },
    companyMode: {
      type: String,
      trim: true,
      enum: ["startup", "product", "faang", "scale-up"],
      default: "product",
      index: true,
    },
    personality: {
      type: String,
      trim: true,
      enum: [
        "friendly",
        "professional",
        "strict",
        "startup",
        "faang",
        "hr",
        "behavioral",
      ],
      default: "professional",
      index: true,
    },
    practiceMode: { type: Boolean, default: false },
    status: {
      type: String,
      trim: true,
      enum: ["Pending", "Active", "Paused", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },
    memory: { type: mongoose.Schema.Types.Mixed, default: {} },
    currentQuestionIndex: { type: Number, default: 0, min: 0 },
    questions: { type: [interviewQuestionSchema], default: () => [] },
    totalScore: { type: Number, min: 0, max: 100, default: null },
    summary: { type: String, trim: true, default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "interview_sessions",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

interviewSessionSchema.plugin(softDeletePlugin);
interviewSessionSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const InterviewSession =
  mongoose.models.InterviewSession ||
  mongoose.model("InterviewSession", interviewSessionSchema);
export { interviewQuestionSchema as InterviewQuestionSchema };
