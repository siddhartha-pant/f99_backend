import express from "express";
import {
  logExercise,
  getUserLogs,
  getSuggestedWeight
} from "../controllers/workout.controller";

const router = express.Router();

router.post("/log", logExercise);
router.get("/logs/:userId", getUserLogs);
router.post("/suggest-weight", getSuggestedWeight);

export default router;
