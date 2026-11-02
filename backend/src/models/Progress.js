import mongoose from 'mongoose';

const progressEntrySchema = new mongoose.Schema(
  {
    weekStart: {
      type: Date,
      required: true,
    },
    hours: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const monthlyEntrySchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      trim: true,
    },
    hours: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    totalInterviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    practiceHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastInterviewAt: {
      type: Date,
      default: null,
    },
    streakDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    strongTopics: {
      type: [String],
      default: [],
    },
    weakTopics: {
      type: [String],
      default: [],
    },
    weeklyHours: {
      type: [progressEntrySchema],
      default: [],
    },
    monthlyHours: {
      type: [monthlyEntrySchema],
      default: [],
    },
    statistics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'progress',
  },
);

export const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);
