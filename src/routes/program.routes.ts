import express from "express";
import {
  generateProgram,
  getProgram,
  updateWeeklyProgression
} from "../controllers/program.controller";

const router = express.Router();

/**
 * @route   POST /api/program/generate
 * @desc    Generate a new workout program
 */
router.post("/generate", generateProgram);

/**
 * @route   GET /api/program/:programId
 * @desc    Get program by ID
 */
router.get("/:programId", getProgram);

/**
 * @route   POST /api/program/update-week
 * @desc    Apply weekly progression (increase difficulty)
 */
router.post("/update-week", updateWeeklyProgression);

export default router;
