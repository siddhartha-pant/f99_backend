import { Request, Response, NextFunction } from "express";
import FoodEntry from "../models/foodEntry.model";

/**
 * POST /api/v1/nutrition/water
 * Body: { amount: number }  — positive to add, negative to subtract
 * Updates today's FoodEntry.water so it's always in sync with the profile page.
 */
export const logWater = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const amount = Number(req.body.amount);

    if (isNaN(amount)) {
      return res.status(400).json({ message: "amount must be a number." });
    }

    const todayStr = new Date().toLocaleDateString();

    // Atomically increment water — create today's entry if missing
    const entry = await FoodEntry.findOneAndUpdate(
      { user: userId, date: todayStr },
      { $inc: { water: amount } },
      { new: true, upsert: true },
    );

    // Clamp to 0 — can't have negative water
    if (entry.water < 0) {
      entry.water = 0;
      await entry.save();
    }

    res.json({ message: "Water updated", water: entry.water });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/nutrition/water
 * Returns today's water intake in ml.
 */
export const getWaterLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const todayStr = new Date().toLocaleDateString();

    const entry = await FoodEntry.findOne({ user: userId, date: todayStr });
    res.json({ water: entry?.water ?? 0 });
  } catch (err) {
    next(err);
  }
};
