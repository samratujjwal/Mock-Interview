import { Router } from "express";
import {
  signup,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { changePassword } from "../controllers/password.controller.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/password.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../utils/rateLimiter.js";
import validate from "../validators/validate.js";
import {
  signupBodySchema,
  loginBodySchema,
} from "../validators/auth.validators.js";

const router = Router();

// Apply a stricter rate limit on auth endpoints
const authRateLimit = rateLimiter({ windowMs: 60_000, max: 5 });

router.post(
  "/signup",
  authRateLimit,
  validate({ body: signupBodySchema }),
  signup,
);
router.post(
  "/login",
  authRateLimit,
  validate({ body: loginBodySchema }),
  login,
);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Password management
router.put("/change-password", requireAuth, changePassword); // authenticated
router.post("/forgot-password", authRateLimit, forgotPassword);
router.post("/reset-password", authRateLimit, resetPassword);

// Email verification (scaffolded)
import {
  sendVerification,
  verifyEmail,
} from "../controllers/verification.controller.js";

// Allow authenticated users to request a verification email, and public endpoint to verify
router.post("/send-verification", requireAuth, sendVerification);
router.post("/verify-email", authRateLimit, verifyEmail);

export default router;
