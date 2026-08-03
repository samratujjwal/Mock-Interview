import mongoose from "mongoose";
import { softDeletePlugin } from "./plugins/softDeletePlugin.js";

const codingTestCaseSchema = new mongoose.Schema(
  {
    input: { type: String, trim: true, default: "" },
    output: { type: String, trim: true, default: "" },
    explanation: { type: String, trim: true, default: null },
  },
  { _id: false },
);

const codingQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      trim: true,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      index: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    constraints: {
      type: [String],
      default: () => [],
    },
    examples: {
      type: [codingTestCaseSchema],
      default: () => [],
    },
    starterCode: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    sampleTestCases: {
      type: [codingTestCaseSchema],
      default: () => [],
    },
    hiddenTestCases: {
      type: [codingTestCaseSchema],
      default: () => [],
    },
    expectedComplexity: {
      type: String,
      trim: true,
      default: null,
    },
    supportedLanguages: {
      type: [String],
      default: () => ["javascript"],
    },
    companyTags: {
      type: [String],
      default: () => [],
      index: true,
    },
    topicTags: {
      type: [String],
      default: () => [],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "coding_questions",
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

codingQuestionSchema.plugin(softDeletePlugin);
codingQuestionSchema.index({ createdAt: -1, title: 1 });

export const CodingQuestion =
  mongoose.models.CodingQuestion ||
  mongoose.model("CodingQuestion", codingQuestionSchema);
