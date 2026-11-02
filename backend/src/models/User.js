import mongoose from 'mongoose';

import {
  AUTH_PROVIDER_VALUES,
  AUTH_PROVIDERS,
  PASSWORD_HASH_MIN_LENGTH,
  USER_ROLE_VALUES,
  USER_ROLES,
} from '../constants/auth.constants.js';
import { softDeletePlugin } from './plugins/softDeletePlugin.js';

const avatarSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      trim: true,
      default: null,
    },
    url: {
      type: String,
      trim: true,
      default: null,
    },
    secureUrl: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters.'],
      maxlength: [80, 'Name must contain at most 80 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email must contain at most 254 characters.'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid.'],
    },
    password: {
      type: String,
      required: [true, 'Password hash is required.'],
      minlength: [PASSWORD_HASH_MIN_LENGTH, 'Password hash is invalid.'],
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: USER_ROLES.USER,
      required: true,
    },
    avatar: {
      type: avatarSchema,
      default: () => ({}),
    },
    provider: {
      type: String,
      enum: AUTH_PROVIDER_VALUES,
      default: AUTH_PROVIDERS.LOCAL,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    refreshTokenVersion: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      virtuals: true,
      transform: (_document, returnedUser) => {
        delete returnedUser.password;
        delete returnedUser.__v;

        return returnedUser;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_document, returnedUser) => {
        delete returnedUser.password;
        delete returnedUser.__v;

        return returnedUser;
      },
    },
  },
);

userSchema.plugin(softDeletePlugin);

userSchema.index({ email: 1 }, { unique: true, name: 'idx_users_email_unique' });
userSchema.index({ provider: 1 }, { name: 'idx_users_provider' });
userSchema.index({ role: 1 }, { name: 'idx_users_role' });
userSchema.index({ createdAt: -1 }, { name: 'idx_users_created_at' });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export { userSchema };
