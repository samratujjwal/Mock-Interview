import { User, Progress } from '../models/index.js';
import { RefreshToken } from '../models/RefreshToken.js';
import authService from '../services/auth.service.js';

// Basic helper to send standard envelope
function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

// Signup controller
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ success: false, message: 'Name, email and password are required' });
    }

    // Check for existing user
    const existing = await User.findOne({ email }).lean().exec();
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    // Hash password
    const hashed = await authService.hashPassword(password);

    const user = await User.create({ name, email, password: hashed });

    // Provision a Progress row for the new user so dashboard endpoints can return zero-state gracefully.
    try {
      await Progress.create({ userId: user._id });
    } catch (progressErr) {
      console.warn('Failed to create progress row for new user', progressErr);
    }

    // Issue refresh token
    const refreshPlain = authService.generateRefreshToken();
    const refreshHash = await authService.hashRefreshToken(refreshPlain);
    const signedRefresh = authService.signRefreshToken(user._id, refreshPlain);

    // Persist refresh token
    const expiry = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // default 30d
    await RefreshToken.create({ userId: user._id, token: refreshHash, expiresAt: expiry, device: req.get('User-Agent') || null, ipAddress: req.ip });

    // Set cookie
    const cookieOptions = authService.refreshTokenCookieOptions();
    res.cookie('refreshToken', signedRefresh, cookieOptions);

    // Return access token
    const accessToken = authService.generateAccessToken(user);

    return success(res, { user, accessToken }, 'User registered successfully');
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ success: false, message: 'Failed to register user' });
  }
}

// Login controller
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password').exec();
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const ok = await authService.comparePassword(password, user.password);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Rotate refresh token: create new, revoke previous tokens for this user/device
    const refreshPlain = authService.generateRefreshToken();
    const refreshHash = await authService.hashRefreshToken(refreshPlain);
    const signedRefresh = authService.signRefreshToken(user._id, refreshPlain);

    // Revoke existing tokens (simple approach: mark all as revoked)
    await RefreshToken.updateMany({ userId: user._id, revoked: false }, { revoked: true }).exec();

    const expiry = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
    await RefreshToken.create({ userId: user._id, token: refreshHash, expiresAt: expiry, device: req.get('User-Agent') || null, ipAddress: req.ip });

    // Set cookie
    const cookieOptions = authService.refreshTokenCookieOptions();
    res.cookie('refreshToken', signedRefresh, cookieOptions);

    // Return access token
    const accessToken = authService.generateAccessToken(user);

    return success(res, { user: user.toObject(), accessToken }, 'Logged in successfully');
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ success: false, message: 'Failed to login' });
  }
}

// Refresh token controller
export async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken || req.get('authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token provided' });

    const payload = authService.verifyRefreshToken(token);
    if (!payload) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

    const { sub: userId, rt: refreshPlain } = payload;
    if (!userId || !refreshPlain) return res.status(401).json({ success: false, message: 'Invalid token payload' });

    // Find stored token hash for this user and compare
    const stored = await RefreshToken.findOne({ userId, revoked: false }).select('+token').exec();
    if (!stored) return res.status(401).json({ success: false, message: 'No active refresh token found' });

    const match = await authService.compareRefreshToken(refreshPlain, stored.token);
    if (!match) return res.status(401).json({ success: false, message: 'Refresh token mismatch' });

    // Rotate: revoke current, issue new
    stored.revoked = true;
    await stored.save();

    const newPlain = authService.generateRefreshToken();
    const newHash = await authService.hashRefreshToken(newPlain);
    const signedNew = authService.signRefreshToken(userId, newPlain);
    const expiry = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
    await RefreshToken.create({ userId, token: newHash, expiresAt: expiry, device: req.get('User-Agent') || null, ipAddress: req.ip });

    // Set cookie
    const cookieOptions = authService.refreshTokenCookieOptions();
    res.cookie('refreshToken', signedNew, cookieOptions);

    // Return new access token
    const user = await User.findById(userId).lean().exec();
    const accessToken = authService.generateAccessToken(user);

    return success(res, { user, accessToken }, 'Token refreshed');
  } catch (err) {
    console.error('Refresh error', err);
    return res.status(500).json({ success: false, message: 'Failed to refresh token' });
  }
}

// Logout controller
export async function logout(req, res) {
  try {
    const token = req.cookies?.refreshToken || null;
    if (token) {
      const payload = authService.verifyRefreshToken(token);
      if (payload?.sub) {
        // Revoke all tokens for this user
        await RefreshToken.updateMany({ userId: payload.sub }, { revoked: true }).exec();
      }
    }

    // Clear cookie
    res.clearCookie('refreshToken', authService.refreshTokenCookieOptions());

    return success(res, {}, 'Logged out');
  } catch (err) {
    console.error('Logout error', err);
    return res.status(500).json({ success: false, message: 'Failed to logout' });
  }
}
