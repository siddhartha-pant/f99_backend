import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Password reset and email verification features are currently disabled.

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ emailVerificationToken: token, emailVerificationTokenExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};
