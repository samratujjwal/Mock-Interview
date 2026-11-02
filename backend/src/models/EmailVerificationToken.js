import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    used: {
      type: Boolean,
      default: false,
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'emailVerificationTokens',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.token;
        delete ret.__v;
        return ret;
      },
    },
  }
);

emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'idx_email_verification_expiry_ttl' });

export const EmailVerificationToken = mongoose.models.EmailVerificationToken || mongoose.model('EmailVerificationToken', emailVerificationSchema);
export { emailVerificationSchema };
