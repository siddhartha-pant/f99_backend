import { Router } from "express";
import { signup, signin } from "../controllers/auth.controller";
import { verifyEmail } from "../controllers/auth.extra.controller";
import {
  forgotPassword,
  resetPassword,
} from "../utils/passwordReset.controller";
import { logout } from "../controllers/logout.controller";
import { validateSignup, validateSignin } from "../middlewares/validation";
import auth from "../middlewares/auth";
import rateLimit from "express-rate-limit";

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Extra strict limit for password reset — prevents email spam abuse
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: "Too many reset attempts. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

// ── Auth ──
router.post("/signup", validateSignup, asyncHandler(signup));
router.post("/signin", validateSignin, asyncHandler(signin));
router.post("/verify-email", asyncHandler(verifyEmail));

// ── Password reset ──
router.post("/forgot-password", resetLimiter, asyncHandler(forgotPassword));
router.post("/reset-password", resetLimiter, asyncHandler(resetPassword));

// ── Logout (requires valid token) ──
router.post("/logout", auth, asyncHandler(logout));

export default router;
