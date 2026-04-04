import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { blacklistToken } from "../utils/tokenBlacklist";

/**
 * POST /api/v1/auth/logout
 * Blacklists the current JWT so it can't be reused even before it expires.
 * The auth middleware checks the blacklist on every protected request.
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({ message: "No token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Decode without verifying to get expiry — it was already verified by auth middleware
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp
      ? decoded.exp * 1000 // JWT exp is in seconds, Date.now() is ms
      : Date.now() + 7 * 24 * 60 * 60 * 1000; // fallback: 7 days

    blacklistToken(token, expiresAt);

    res.json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
};
