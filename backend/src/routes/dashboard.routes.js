import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  dashboardSummary,
  dashboardWeekly,
  dashboardMonthly,
  dashboardTopics,
  dashboardStatistics,
} from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/', requireAuth, dashboardSummary);
router.get('/weekly', requireAuth, dashboardWeekly);
router.get('/monthly', requireAuth, dashboardMonthly);
router.get('/topics/:type', requireAuth, dashboardTopics);
router.get('/statistics', requireAuth, dashboardStatistics);

export default router;
