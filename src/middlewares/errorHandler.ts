import { Request, Response, NextFunction } from "express";

const isProd = process.env.NODE_ENV === "production";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? "field";
    res
      .status(409)
      .json({ message: `A record with this ${field} already exists.` });
    return;
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors ?? {}).map((e: any) => e.message);
    res.status(400).json({ message: messages.join(", ") });
    return;
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({ message: "Invalid or expired token." });
    return;
  }

  if (err.name === "CastError") {
    res.status(400).json({ message: "Invalid ID format." });
    return;
  }

  if (err.status && err.status < 500) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again."
      : err.message || "Internal Server Error",
  });
};

export default errorHandler;
