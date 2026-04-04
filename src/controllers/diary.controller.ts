import { Request, Response, NextFunction } from "express";
import DiaryEntry from "../models/diaryEntry.model";

/**
 * POST /api/v1/nutrition/diary
 */
export const saveDiaryEntry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.userId;
    const { mood, rating, note, date } = req.body;

    if (!note?.trim()) {
      res.status(400).json({ message: "Note is required." });
      return;
    }

    const dateStr = date ?? new Date().toLocaleDateString();

    const existing = await DiaryEntry.findOne({ user: userId, date: dateStr });
    if (existing) {
      res.status(409).json({ message: "Already logged today." });
      return;
    }

    const entry = await DiaryEntry.create({
      user: userId,
      mood,
      rating: Number(rating),
      note,
      date: dateStr,
    });

    res.status(201).json({ message: "Diary entry saved.", entry });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/nutrition/diary?page=1&limit=10
 * Returns paginated diary entries, newest first.
 * Response: { entries, page, totalPages, total, hasMore }
 */
export const getDiaryEntries = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.userId;

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 10),
    );
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      DiaryEntry.find({ user: userId })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      DiaryEntry.countDocuments({ user: userId }),
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
