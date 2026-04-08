import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import progressRoutes from "./progress.routes";
import uploadRoutes from "./upload.routes";
import nutritionRoutes from "./nutrition.routes";
import progressPhotoRoutes from "./progressPhoto.routes";
import goalRoutes from "./goal.routes";
import healthRoutes from "./health.routes";

import programRoutes from "./program.routes";
import workoutRoutes from "./workout.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/goals", goalRoutes);
router.use("/progress", progressRoutes);
router.use("/upload", uploadRoutes);
router.use("/nutrition", nutritionRoutes);
router.use("/progress-photo", progressPhotoRoutes);
router.use("/program", programRoutes);
router.use("/workout", workoutRoutes);


export default router;
