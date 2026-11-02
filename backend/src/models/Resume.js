import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDeletePlugin.js';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      trim: true,
      required: true,
    },
    mimeType: {
      type: String,
      trim: true,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: [0, 'File size must be a non-negative number.'],
    },
    resourceType: {
      type: String,
      trim: true,
      required: true,
    },
    publicId: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    url: {
      type: String,
      trim: true,
      required: true,
    },
    secureUrl: {
      type: String,
      trim: true,
      required: true,
    },
    folder: {
      type: String,
      trim: true,
      default: 'mock-interview/resumes',
    },
    provider: {
      type: String,
      trim: true,
      default: 'cloudinary',
      required: true,
    },
    parsedText: {
      type: String,
      default: null,
    },
    parsedAt: {
      type: Date,
      default: null,
    },
    parseStatus: {
      type: String,
      trim: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    parseError: {
      type: String,
      trim: true,
      default: null,
    },
    extractedSkills: {
      type: [String],
      default: () => [],
    },
    extractedProjects: {
      type: [
        new mongoose.Schema(
          {
            name: { type: String, trim: true, default: null },
            description: { type: String, trim: true, default: null },
            technologies: { type: [String], default: () => [] },
          },
          { _id: false }
        ),
      ],
      default: () => [],
    },
    extractedExperience: {
      type: {
        summary: { type: String, trim: true, default: null },
        totalYears: { type: String, trim: true, default: null },
        roles: {
          type: [
            new mongoose.Schema(
              {
                title: { type: String, trim: true, default: null },
                company: { type: String, trim: true, default: null },
                duration: { type: String, trim: true, default: null },
                summary: { type: String, trim: true, default: null },
              },
              { _id: false }
            ),
          ],
          default: () => [],
        },
      },
      default: () => ({ summary: null, totalYears: null, roles: [] }),
    },
    extractedEducation: {
      type: [
        new mongoose.Schema(
          {
            institution: { type: String, trim: true, default: null },
            degree: { type: String, trim: true, default: null },
            field: { type: String, trim: true, default: null },
            years: { type: String, trim: true, default: null },
          },
          { _id: false }
        ),
      ],
      default: () => [],
    },
    extractedCertifications: {
      type: [String],
      default: () => [],
    },
    extractedSummary: {
      type: String,
      trim: true,
      default: null,
    },
    extractionStatus: {
      type: String,
      trim: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    extractionError: {
      type: String,
      trim: true,
      default: null,
    },
    extractedAt: {
      type: Date,
      default: null,
    },
    weaknesses: {
      type: [
        new mongoose.Schema(
          {
            type: { type: String, trim: true, default: null },
            detail: { type: String, trim: true, default: null },
            recommendation: { type: String, trim: true, default: null },
          },
          { _id: false }
        ),
      ],
      default: () => [],
    },
    weaknessStatus: {
      type: String,
      trim: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    weaknessError: {
      type: String,
      trim: true,
      default: null,
    },
    weaknessesAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'resumes',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

resumeSchema.plugin(softDeletePlugin);
resumeSchema.index({ createdAt: -1, userId: 1 });

export const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
