import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Profile from "../models/profile.model";
import FoodEntry from "../models/foodEntry.model";
import DiaryEntry from "../models/diaryEntry.model";
import Goal from "../models/goal.model";
import { calculateStreak } from "../utils/calculateGoals";

export const createOrUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { age, gender, weight, height, bodyFat, trainingExperience, aim, targets } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        ...(age !== undefined && { age }),
        ...(gender !== undefined && { gender }),
        ...(weight !== undefined && { weight }),
        ...(height !== undefined && { height }),
        ...(bodyFat !== undefined && { bodyFat }),
        ...(trainingExperience !== undefined && { trainingExperience }),
        ...(aim !== undefined && { aim }),
        ...(targets !== undefined && { targets }),
      },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ message: "Profile saved.", profile });
  } catch (err) { next(err); }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found." });
    res.json(profile);
  } catch (err) { next(err); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const allowed = ["age", "gender", "weight", "height", "bodyFat", "trainingExperience", "aim", "targets"];
    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }
    const profile = await Profile.findOneAndUpdate({ user: userId }, updates, { new: true, runValidators: true });
    if (!profile) return res.status(404).json({ message: "Profile not found." });
    res.json({ message: "Profile updated.", profile });
  } catch (err) { next(err); }
};

export const getFullProfileData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });

    const [user, profile] = await Promise.all([
      User.findById(userId),
      Profile.findOne({ user: userId }),
    ]);

    if (!user || !profile) return res.status(404).json({ message: "Profile not found." });

    const todayStr = new Date().toLocaleDateString();

    const [todayFoodEntry, diaryEntries, rawGoals] = await Promise.all([
      FoodEntry.findOneAndUpdate(
        { user: userId, date: todayStr },
        { $setOnInsert: { foods: [], water: 0 } },
        { new: true, upsert: true }
      ),
      DiaryEntry.find({ user: userId }).sort({ date: -1 }).limit(10),
      // ← fetch real Goal documents so _id is always present
      Goal.find({ user: userId }).sort({ createdAt: -1 }).lean(),
    ]);

    let streak = 0;
    try {
      streak = calculateStreak(diaryEntries);
    } catch (utilErr) {
      console.error("calculateStreak error:", utilErr);
    }

    // Compute progress on the server so the shape is consistent
    const goals = rawGoals.map((g) => ({
      ...g,
      // lean() gives _id as ObjectId — stringify it so JSON has a plain string
      _id: g._id.toString(),
      progress: Math.min(100, Math.round(((g.current ?? 0) / (g.target || 1)) * 100)),
    }));

    const totals = (todayFoodEntry.foods ?? []).reduce(
      (acc: any, f: any) => {
        acc.calories += Number(f.calories) || 0;
        acc.protein += Number(f.protein) || 0;
        acc.carbs += Number(f.carbs) || 0;
        acc.fats += Number(f.fats) || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    const targets = profile.targets ?? { calories: 2300, protein: 140, water: 3000 };

    res.json({
      success: true,
      user: {
        name: user.name,
        avatar: user.profileImage ?? "https://i.pravatar.cc/150?img=3",
        age: profile.age,
        gender: profile.gender,
        weight: profile.weight,
        height: (profile as any).height,
        bodyFat: profile.bodyFat ?? 15,
        trainingExperience: profile.trainingExperience,
        aim: profile.aim,
      },
      profile: {
        age: profile.age,
        gender: profile.gender,
        weight: profile.weight,
        height: (profile as any).height,
        bodyFat: profile.bodyFat,
        trainingExperience: profile.trainingExperience,
        aim: profile.aim,
      },
      todayFood: {
        foods: todayFoodEntry.foods ?? [],
        water: todayFoodEntry.water ?? 0,
        totals,
      },
      diaryEntries,
      goals,   // ← real Goal docs with _id strings
      streak,
      targets,
    });
  } catch (error) {
    console.error("getFullProfileData error:", error);
    next(error);
  }
};
