import mongoose from "mongoose";
import { softDeletePlugin } from "./plugins/softDeletePlugin.js";

const interviewTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    prompt: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      trim: true,
      enum: ["technical", "behavioral", "system_design", "mixed", "hr"],
      default: "technical",
      index: true,
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
    topic: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    tags: {
      type: [String],
      default: () => [],
    },
    duplicateKey: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    isFallback: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "interview_templates",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

interviewTemplateSchema.plugin(softDeletePlugin);
interviewTemplateSchema.index({ createdAt: -1, title: 1 });

export const InterviewTemplate =
  mongoose.models.InterviewTemplate ||
  mongoose.model("InterviewTemplate", interviewTemplateSchema);
