import mongoose from 'mongoose';

import { REFRESH_TOKEN_HASH_MIN_LENGTH } from '../constants/auth.constants.js';

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required.'],
      index: true,
    },
    token: {
      type: String,
      required: [true, 'Refresh token hash is required.'],
      minlength: [REFRESH_TOKEN_HASH_MIN_LENGTH, 'Refresh token hash is invalid.'],
      select: false,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Refresh token expiry is required.'],
      index: true,
    },
    revoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    device: {
      type: String,
      trim: true,
      maxlength: [180, 'Device description must contain at most 180 characters.'],
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
      maxlength: [64, 'IP address must contain at most 64 characters.'],
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'refreshTokens',
    toJSON: {
      virtuals: true,
      transform: (_document, returnedToken) => {
        delete returnedToken.token;
        delete returnedToken.__v;

        return returnedToken;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_document, returnedToken) => {
        delete returnedToken.token;
        delete returnedToken.__v;

        return returnedToken;
      },
    },
  },
);

refreshTokenSchema.index({ token: 1 }, { unique: true, name: 'idx_refresh_tokens_token_unique' });
refreshTokenSchema.index({ userId: 1, revoked: 1 }, { name: 'idx_refresh_tokens_user_revoked' });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'idx_refresh_tokens_expiry_ttl' });

export const RefreshToken =
  mongoose.models.RefreshToken || mongoose.model('RefreshToken', refreshTokenSchema);
export { refreshTokenSchema };
