import authService from '../services/auth.service.js';
import { User } from '../models/index.js';

// requireAuth middleware verifies access token and attaches user to req.user
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing authorization token' });
    }

    const payload = authService.verifyAccessToken(token);
    if (!payload || !payload.sub) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const userId = payload.sub;
    const user = await User.findById(userId).lean().exec();
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    // Attach sanitized user object (omit sensitive fields)
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication middleware error', err);
    return res.status(500).json({ success: false, message: 'Authentication failed' });
  }
}

// requireRole checks that req.user.role is one of allowed roles
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated' });
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      next();
    } catch (err) {
      console.error('Role middleware error', err);
      return res.status(500).json({ success: false, message: 'Authorization failed' });
    }
  };
}
