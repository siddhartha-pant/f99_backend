import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { sendPasswordResetEmail } from "./email";

/**
 * POST /api/v1/auth/forgot-password
 * Body: { email }
 * Generates a reset token, saves it hashed on the user, sends email.
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    const user = await User.findOne({ email });

    // Always return 200 even if email not found — prevents user enumeration
    if (!user) {
      res.json({
        message: "If that email exists, a reset link has been sent.",
      });
      return;
    }

    // Generate a random token and store its hash (never store plain tokens in DB)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, rawToken);
    } catch (emailErr) {
      // If email fails, clear the token so user can try again
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
      await user.save();
      res.status(502).json({
        message: "Failed to send reset email. Please try again later.",
      });
      return;
    }

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/reset-password
 * Body: { token, newPassword }
 * Verifies token, updates password, clears token fields.
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: "Token and new password are required." });
      return;
    }

    if (newPassword.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
      return;
    }

    // Hash the incoming raw token to compare against DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: new Date() }, // not expired
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token." });
      return;
    }

    // Update password and clear reset fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    next(err);
  }
};
