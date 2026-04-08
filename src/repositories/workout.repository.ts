import ExerciseLog from "../models/exerciseLog.model";
import { IExerciseLog } from "../models/exerciseLog.model";

//  Create Exercise Log
export const createLog = async (data: Partial<IExerciseLog>) => {
  return await ExerciseLog.create(data);
};

//  Get All Logs for User (Dashboard)
export const getLogsByUser = async (userId: string) => {
  return await ExerciseLog.find({ userId })
    .sort({ createdAt: -1 });
};

// Get Logs by Program
export const getLogsByProgram = async (programId: string) => {
  return await ExerciseLog.find({ programId })
    .sort({ createdAt: -1 });
};

//  Get Last Log of Specific Exercise (for progression)
export const getLastExerciseLog = async (
  userId: string,
  exerciseName: string
) => {
  return await ExerciseLog.findOne({
    userId,
    exerciseName
  }).sort({ createdAt: -1 });
};

//  Get Exercise History (for charts)
export const getExerciseHistory = async (
  userId: string,
  exerciseName: string
) => {
  return await ExerciseLog.find({
    userId,
    exerciseName
  }).sort({ createdAt: 1 });
};

//  Delete Log (optional)
export const deleteLog = async (logId: string) => {
  return await ExerciseLog.findByIdAndDelete(logId);
};
