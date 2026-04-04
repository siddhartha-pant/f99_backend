import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Profile from "../models/profile.model";
import FoodEntry from "../models/foodEntry.model";
import DiaryEntry from "../models/diaryEntry.model";
import { calculateGoals, calculateStreak } from "../utils/calculateGoals";

// ── Create or update profile ──
export const createOrUpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const { age, gender, weight, height, bodyFat, targets } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        ...(age !== undefined && { age }),
        ...(gender !== undefined && { gender }),
        ...(weight !== undefined && { weight }),
        ...(height !== undefined && { height }),
        ...(bodyFat !== undefined && { bodyFat }),
        ...(targets !== undefined && { targets }),
      },
      { new: true, upsert: true, runValidators: true },
    );

    res.json({ message: "Profile saved.", profile });
  } catch (err) {
    next(err);
  }
};

// ── Get basic profile ──
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

// ── Update profile (partial) ──
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const allowed = ["age", "gender", "weight", "height", "bodyFat", "targets"];
    const updates: Record<string, any> = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const profile = await Profile.findOneAndUpdate({ user: userId }, updates, {
      new: true,
      runValidators: true,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    res.json({ message: "Profile updated.", profile });
  } catch (err) {
    next(err);
  }
};

// ── Full profile data for the Profile page ──
export const getFullProfileData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    // Run independent queries in parallel for speed
    const [user, profile] = await Promise.all([
      User.findById(userId),
      Profile.findOne({ user: userId }),
    ]);

    if (!user || !profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    // ── FIXED: no locale arg — matches frontend and all controllers ──
    const todayStr = new Date().toLocaleDateString();

    // Get or create today's FoodEntry atomically
    const todayFoodEntry = await FoodEntry.findOneAndUpdate(
      { user: userId, date: todayStr },
      { $setOnInsert: { foods: [], water: 0 } },
      { new: true, upsert: true },
    );

    // Get recent diary entries
    const diaryEntries = await DiaryEntry.find({ user: userId })
      .sort({ date: -1 })
      .limit(90);

    // Isolate calculateGoals / calculateStreak so a bug there
    // doesn't take down the entire profile page
    let goals: any[] = [];
    let streak = 0;
    try {
      goals = calculateGoals(profile, diaryEntries);
      streak = calculateStreak(diaryEntries);
    } catch (utilErr) {
      console.error("calculateGoals/calculateStreak error:", utilErr);
      // goals and streak stay as safe defaults
    }

    // Today's nutrition totals
    const totals = (todayFoodEntry.foods ?? []).reduce(
      (acc: any, f: any) => {
        acc.calories += Number(f.calories) || 0;
        acc.protein += Number(f.protein) || 0;
        acc.carbs += Number(f.carbs) || 0;
        acc.fats += Number(f.fats) || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    );

    const targets = profile.targets ?? {
      calories: 2300,
      protein: 140,
      water: 3000,
    };

    res.json({
      success: true,
      user: {
        name: user.name,
        age: profile.age,
        weight: profile.weight,
        bodyFat: profile.bodyFat ?? 15,
        avatar: user.profileImage ?? "https://i.pravatar.cc/150?img=3",
      },
      todayFood: {
        foods: todayFoodEntry.foods ?? [],
        water: todayFoodEntry.water ?? 0,
        totals,
      },
      diaryEntries,
      goals,
      streak,
      targets,
    });
  } catch (error) {
    console.error("getFullProfileData error:", error);
    next(error);
  }
};
