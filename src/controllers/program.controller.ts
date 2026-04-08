import { Request, Response } from "express";
import { adjustDifficulty } from "../utils/progression.logic";
import {
  getSplit,
  generateWorkouts
} from "../utils/programGenerator";

import {
  createProgram,
  getProgramById,
  updateProgram
} from "../repositories/program.repository";

import { adjustDifficulty } from "../utils/progression.logic";


//  Generate Program
export const generateProgram = async (req: Request, res: Response) => {
  try {
    const { userId, days, goal, location } = req.body;

    if (!userId || !days) {
      return res.status(400).json({ message: "Missing required fields" });
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

    return res.status(201).json(program);
  } catch (error) {
    console.error("Generate Program Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//  Get Program
export const getProgram = async (req: Request, res: Response) => {
  try {
    const { programId } = req.params;

    const program = await getProgramById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    return res.json(program);
  } catch (error) {
    console.error("Get Program Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//  Weekly Progression Update
export const updateWeeklyProgression = async (req: Request, res: Response) => {
  try {
    const { programId } = req.body;

    let program = await getProgramById(programId);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    program = adjustDifficulty(program);

    const updated = await updateProgram(programId, program);

    return res.json(updated);
  } catch (error) {
    console.error("Weekly Update Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
