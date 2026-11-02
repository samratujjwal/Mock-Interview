import crypto from 'crypto';
import { User } from '../models/index.js';
import { EmailVerificationToken } from '../models/EmailVerificationToken.js';
import authService from '../services/auth.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

// Send (or resend) verification email. Authenticated users can call this, or it can be triggered after signup.
export async function sendVerification(req, res) {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) return res.status(422).json({ success: false, message: 'User id required' });

    const user = await User.findById(userId).lean().exec();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.emailVerified) return success(res, {}, 'Email already verified');

    const plain = crypto.randomBytes(32).toString('hex');
    const hash = await authService.hashRefreshToken(plain);
    const expiry = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours

    await EmailVerificationToken.create({ userId: user._id, token: hash, expiresAt: expiry, ipAddress: req.ip });

    // TODO: send actual email via provider. For now log verification link.
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${plain}&id=${user._id}`;
    console.log('Email verification link (stub):', verifyUrl);

    return success(res, {}, 'Verification email sent (stub)');
  } catch (err) {
    console.error('Send verification error', err);
    return res.status(500).json({ success: false, message: 'Failed to send verification' });
  }
}

// Verify email using token
export async function verifyEmail(req, res) {
  try {
    const { token, id: userId } = req.body;
    if (!token || !userId) return res.status(422).json({ success: false, message: 'Token and user id required' });

    const record = await EmailVerificationToken.findOne({ userId, used: false, expiresAt: { $gt: new Date() } }).select('+token').exec();
    if (!record) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    const match = await authService.compareRefreshToken(token, record.token);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    // Mark used and set user's emailVerified
    record.used = true;
    await record.save();

    await User.findByIdAndUpdate(userId, { emailVerified: true }).exec();

    return success(res, {}, 'Email verified');
  } catch (err) {
    console.error('Verify email error', err);
    return res.status(500).json({ success: false, message: 'Failed to verify email' });
  }
}
