import express from "express";
import auth from "../middlewares/auth";
import {
  logExercise,
  getUserLogs,
  getSuggestedWeight
} from "../controllers/workout.controller";

const router = express.Router();

router.post("/log", auth, logExercise);
router.get("/logs", auth, getUserLogs);
router.post("/suggest-weight", auth, getSuggestedWeight);

export default router;
