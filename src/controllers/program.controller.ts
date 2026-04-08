import { Request, Response } from "express";
import { getSplit, generateWorkouts } from "../utils/programGenerator";
import {
  createProgram,
  getProgramById,
  updateProgram
} from "../repositories/program.repository";
import { adjustDifficulty } from "../utils/progression.logic";

//  Generate Program
export const generateProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { goal, location } = req.body;
    const daysInput = req.body.days ?? req.body.daysPerWeek;
    const days = Number(daysInput);
    const userId = (req as any).user?.id;

    if (!userId || !goal || !location || !Number.isFinite(days) || days <= 0) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const split = getSplit(days);
    const workouts = generateWorkouts(split);

    const program = await createProgram({
      userId,
      daysPerWeek: days,
      goal,
      location,
      split,
      duration: 8,
      workouts,
      startedAt: new Date()
    });

    res.status(201).json(program);
  } catch (error) {
    console.error("Generate Program Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📥 Get Program
export const getProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId } = req.params;

    const program = await getProgramById(programId);

    if (!program) {
      res.status(404).json({ message: "Program not found" });
      return;
    }

    res.json(program);
  } catch (error) {
    console.error("Get Program Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Weekly Progression Update
export const updateWeeklyProgression = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { programId } = req.body;

    const program = await getProgramById(programId);

    if (!program) {
      res.status(404).json({ message: "Program not found" });
      return;
    }

    const updatedProgram = adjustDifficulty(program);

    const updated = await updateProgram(programId, updatedProgram);

    res.json(updated);
  } catch (error) {
    console.error("Weekly Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
