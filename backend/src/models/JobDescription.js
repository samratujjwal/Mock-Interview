import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDeletePlugin.js';

const jobDescSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: { type: String, trim: true, required: true },
    mimeType: { type: String, trim: true, required: true },
    size: { type: Number, required: true, min: [0, 'File size must be a non-negative number.'] },
    resourceType: { type: String, trim: true, required: true },
    publicId: { type: String, trim: true, required: true, index: true },
    url: { type: String, trim: true, required: true },
    secureUrl: { type: String, trim: true, required: true },
    folder: { type: String, trim: true, default: 'mock-interview/jds' },
    provider: { type: String, trim: true, default: 'cloudinary', required: true },

    // Parsed text and parse metadata
    parsedText: { type: String, default: null },
    parsedAt: { type: Date, default: null },
    parseStatus: { type: String, trim: true, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true },
    parseError: { type: String, trim: true, default: null },

    // Extracted structured fields
    extractedRequiredSkills: { type: [String], default: () => [] },
    extractedPreferredSkills: { type: [String], default: () => [] },
    responsibilities: { type: [String], default: () => [] },
    jdSummary: { type: String, trim: true, default: null },

    extractionStatus: { type: String, trim: true, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true },
    extractionError: { type: String, trim: true, default: null },
    extractedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: 'job_descriptions',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

jobDescSchema.plugin(softDeletePlugin);
jobDescSchema.index({ createdAt: -1, userId: 1 });

export const JobDescription = mongoose.models.JobDescription || mongoose.model('JobDescription', jobDescSchema);
