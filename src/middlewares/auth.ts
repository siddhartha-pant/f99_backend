import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/tokenBlacklist";

const auth: RequestHandler = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET is not set in environment variables.");
    res.status(500).json({ message: "Server misconfiguration." });
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (isTokenBlacklisted(token)) {
    res.status(401).json({
      message: "Token has been invalidated. Please log in again."
    });
    return;
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET);

    const resolvedUserId =
      decodedToken.userId || decodedToken.id || decodedToken._id;

    if (!resolvedUserId) {
      res.status(401).json({ message: "Invalid token payload." });
      return;
    }

    // Keep both keys for compatibility with existing controllers.
    (req as any).user = {
      userId: resolvedUserId,
      id: resolvedUserId
    };

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired. Please log in again." });
    } else {
      res.status(401).json({ message: "Invalid token." });
    }
  }
};

export default auth;
