import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema(
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
    collection: 'passwordResetTokens',
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

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'idx_password_reset_expiry_ttl' });

export const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', passwordResetSchema);
export { passwordResetSchema };
