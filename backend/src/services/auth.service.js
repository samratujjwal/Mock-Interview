import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
const JWT_ISSUER = process.env.JWT_ISSUER || 'mock-interview';

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn('JWT_SECRET or JWT_REFRESH_SECRET not set — auth will fail without these env vars');
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function signJwt(payload, secret, options = {}) {
  return jwt.sign(payload, secret, {
    issuer: JWT_ISSUER,
    expiresIn: options.expiresIn,
    ...(options.jwtid ? { jwtid: options.jwtid } : {}),
  });
}

export function generateAccessToken(user) {
  const payload = {
    sub: user._id?.toString?.() || user.id || user.userId,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET;
  return signJwt(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

// Refresh tokens are long-lived and rotated; we store a hash server-side in RefreshToken model
export function generateRefreshToken() {
  // create a cryptographically secure random token
  return crypto.randomBytes(64).toString('hex');
}

export function signRefreshToken(userId, refreshTokenPlain) {
  const secret = process.env.JWT_REFRESH_SECRET;
  const payload = {
    sub: userId?.toString?.(),
    rt: refreshTokenPlain, // signed but actual storage of raw token should be avoided — we store hashed token in DB
  };
  return signJwt(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyAccessToken(token) {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret, { issuer: JWT_ISSUER });
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    return jwt.verify(token, secret, { issuer: JWT_ISSUER });
  } catch (err) {
    return null;
  }
}

export async function hashRefreshToken(tokenPlain) {
  // Use bcrypt to hash the refresh token before storing in DB; prevents token theft from DB
  return bcrypt.hash(tokenPlain, SALT_ROUNDS);
}

export async function compareRefreshToken(tokenPlain, tokenHash) {
  return bcrypt.compare(tokenPlain, tokenHash);
}

// Helper to set refresh token cookie options when sent to client
export function refreshTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // maxAge in ms derived from REFRESH_TOKEN_EXPIRES_IN when possible
    maxAge: (() => {
      // simple parse for days (e.g., "30d") or minutes/hours (m/h)
      const v = REFRESH_TOKEN_EXPIRES_IN;
      if (v.endsWith('d')) return parseInt(v.slice(0, -1), 10) * 24 * 60 * 60 * 1000;
      if (v.endsWith('h')) return parseInt(v.slice(0, -1), 10) * 60 * 60 * 1000;
      if (v.endsWith('m')) return parseInt(v.slice(0, -1), 10) * 60 * 1000;
      return undefined;
    })(),
  };
}

export default {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashRefreshToken,
  compareRefreshToken,
  refreshTokenCookieOptions,
};
