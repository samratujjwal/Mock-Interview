import mongoose from "mongoose";
import { softDeletePlugin } from "./plugins/softDeletePlugin.js";

const codingSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      default: null,
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingQuestion",
      required: true,
      index: true,
    },
    language: {
      type: String,
      trim: true,
      required: true,
      default: "javascript",
    },
    sourceCode: {
      type: String,
      required: true,
    },
    executionTimeMs: {
      type: Number,
      min: 0,
      default: null,
    },
    memoryUsedKb: {
      type: Number,
      min: 0,
      default: null,
    },
    passedTests: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalTests: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      trim: true,
      enum: ["queued", "running", "passed", "failed", "error"],
      default: "queued",
      index: true,
    },
    judgeResult: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    aiReview: {
      type: String,
      trim: true,
      default: null,
    },
    optimizationSuggestions: {
      type: [String],
      default: () => [],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "coding_submissions",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

codingSubmissionSchema.plugin(softDeletePlugin);
codingSubmissionSchema.index({ userId: 1, questionId: 1, submittedAt: -1 });

export const CodingSubmission =
  mongoose.models.CodingSubmission ||
  mongoose.model("CodingSubmission", codingSubmissionSchema);
