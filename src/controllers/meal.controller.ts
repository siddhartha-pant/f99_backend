import { Request, Response, NextFunction } from "express";
import FoodEntry from "../models/foodEntry.model";

export const logMeal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const { name, calories, protein, carbs, fat } = req.body;
    const todayStr = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const foodItem = {
      name,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fat) || 0,
      quantity: 100,
      time,
    };
    const entry = await FoodEntry.findOneAndUpdate(
      { user: userId, date: todayStr },
      { $push: { foods: foodItem } },
      { new: true, upsert: true },
    );
    res.status(201).json({ message: "Meal logged", entry });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/nutrition/meal         — today's foods (used by FoodDiary)
 * GET /api/v1/nutrition/meal?all=true&page=1&limit=10 — paginated history
 */
export const getMeals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;

    if (!req.query.all) {
      const todayStr = new Date().toLocaleDateString();
      const entry = await FoodEntry.findOne({ user: userId, date: todayStr });
      res.json(entry?.foods ?? []);
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 10),
    );
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      FoodEntry.find({ user: userId })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .select("date foods water"),
      FoodEntry.countDocuments({ user: userId }),
    ]);

    res.json({
      entries,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + entries.length < total,
    });
  } catch (err) {
    next(err);
  }
};
