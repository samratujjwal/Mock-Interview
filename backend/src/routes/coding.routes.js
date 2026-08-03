import express from 'express';
import { optimizeCodeReview, reviewCodeReview, runCode, submitCode } from '../controllers/coding.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { optimizeSchema, reviewSchema, runSchema, submitSchema } from '../validators/coding.validators.js';
import { codingRateLimiter } from '../middleware/codingRateLimit.middleware.js';

const router = express.Router();

// POST /api/v1/coding/run
// Authenticated, validated, and rate-limited (per-user)
router.post('/run', requireAuth, codingRateLimiter({ windowMs: 60_000, max: 20 }), validate(runSchema), runCode);

// POST /api/v1/coding/submit
// Authenticated, validated, and rate-limited (per-user)
router.post('/submit', requireAuth, codingRateLimiter({ windowMs: 60_000, max: 20 }), validate(submitSchema), submitCode);

// POST /api/v1/coding/review
// Authenticated, validated, and rate-limited (per-user)
router.post('/review', requireAuth, codingRateLimiter({ windowMs: 60_000, max: 20 }), validate(reviewSchema), reviewCodeReview);

// POST /api/v1/coding/optimize
// Authenticated, validated, and rate-limited (per-user)
router.post('/optimize', requireAuth, codingRateLimiter({ windowMs: 60_000, max: 20 }), validate(optimizeSchema), optimizeCodeReview);

export default router;
