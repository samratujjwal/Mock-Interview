import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'generic',
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
      default: 'mock-interview/uploads',
    },
    provider: {
      type: String,
      trim: true,
      default: 'cloudinary',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'uploads',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

uploadSchema.index({ createdAt: -1 });

export const Upload = mongoose.models.Upload || mongoose.model('Upload', uploadSchema);
