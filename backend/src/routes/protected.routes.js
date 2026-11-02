import { Router } from 'express';
import { getProtectedResource } from '../controllers/protected.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Any authenticated user
router.get('/test', requireAuth, getProtectedResource);

// Example: admin-only
router.get('/admin-test', requireAuth, requireRole(['admin']), (req, res) => {
  return res.json({ success: true, message: 'Admin access granted' });
});

export default router;
