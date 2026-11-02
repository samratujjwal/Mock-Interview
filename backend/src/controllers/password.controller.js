import crypto from 'crypto';
import { User } from '../models/index.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import authService from '../services/auth.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

// Change password (authenticated)
export async function changePassword(req, res) {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(422).json({ success: false, message: 'Current and new password required' });

    const user = await User.findById(userId).select('+password').exec();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const ok = await authService.comparePassword(currentPassword, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Current password incorrect' });

    const hashed = await authService.hashPassword(newPassword);
    user.password = hashed;
    user.refreshTokenVersion = (user.refreshTokenVersion || 0) + 1;
    await user.save();

    // Revoke outstanding refresh tokens
    await RefreshToken.updateMany({ userId: user._id, revoked: false }, { revoked: true }).exec();

    return success(res, {}, 'Password changed');
  } catch (err) {
    console.error('Change password error', err);
    return res.status(500).json({ success: false, message: 'Failed to change password' });
  }
}

// Forgot password: generate reset token and (stub) send email. Always respond 200.
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(422).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      // Do not reveal email existence
      return success(res, {}, 'If an account with that email exists, a reset link has been sent');
    }

    const plain = crypto.randomBytes(32).toString('hex');
    const hash = await authService.hashRefreshToken(plain);
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({ userId: user._id, token: hash, expiresAt: expiry, ipAddress: req.ip });

    // TODO: send actual email via email provider. For now, log reset link.
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${plain}&id=${user._id}`;
    console.log('Password reset link (stub):', resetUrl);

    return success(res, {}, 'If an account with that email exists, a reset link has been sent');
  } catch (err) {
    console.error('Forgot password error', err);
    // Still return generic message
    return success(res, {}, 'If an account with that email exists, a reset link has been sent');
  }
}

// Reset password using token
export async function resetPassword(req, res) {
  try {
    const { token, id: userId, newPassword } = req.body;
    if (!token || !userId || !newPassword) return res.status(422).json({ success: false, message: 'Token, user id and new password are required' });

    const record = await PasswordResetToken.findOne({ userId, used: false, expiresAt: { $gt: new Date() } }).select('+token').exec();
    if (!record) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    const match = await authService.compareRefreshToken(token, record.token);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    // Mark used
    record.used = true;
    await record.save();

    // Update user password
    const user = await User.findById(userId).select('+password').exec();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const hashed = await authService.hashPassword(newPassword);
    user.password = hashed;
    user.refreshTokenVersion = (user.refreshTokenVersion || 0) + 1;
    await user.save();

    // Revoke outstanding refresh tokens
    await RefreshToken.updateMany({ userId: user._id, revoked: false }, { revoked: true }).exec();

    return success(res, {}, 'Password has been reset');
  } catch (err) {
    console.error('Reset password error', err);
    return res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
}
