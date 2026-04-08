import { Request, Response } from "express";
import {
  createLog,
  getLogsByUser,
  getLastExerciseLog
} from "../repositories/workout.repository";

import { getNextWeight } from "../utils/progression.logic";


//  Log Workout
export const logExercise = async (req: Request, res: Response) => {
  try {
    const { userId, programId, exerciseName, workoutDay, sets } = req.body;

    if (!userId || !programId || !exerciseName || !sets) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const log = await createLog({
      userId,
      programId,
      exerciseName,
      workoutDay,
      sets,
      date: new Date()
    });

    return res.status(201).json(log);
  } catch (error) {
    console.error("Log Exercise Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//  Get All Logs (for dashboard)
export const getUserLogs = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const logs = await getLogsByUser(userId);

    return res.json(logs);
  } catch (error) {
    console.error("Get Logs Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//  Get Suggested Weight (Progressive Overload)
export const getSuggestedWeight = async (req: Request, res: Response) => {
  try {
    const { userId, exerciseName } = req.body;

    const lastLog = await getLastExerciseLog(userId, exerciseName);

    if (!lastLog) {
      return res.json({ suggestedWeight: null });
    }

    const nextWeight = getNextWeight(lastLog.sets);

    return res.json({
      lastWeight: lastLog.sets[0].weight,
      suggestedWeight: nextWeight
    });
  } catch (error) {
    console.error("Suggested Weight Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
