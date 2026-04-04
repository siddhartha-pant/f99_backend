import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import progressRoutes from "./progress.routes";
import uploadRoutes from "./upload.routes";
import nutritionRoutes from "./nutrition.routes";
import progressPhotoRoutes from "./progressPhoto.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/progress", progressRoutes);
router.use("/upload", uploadRoutes);
router.use("/nutrition", nutritionRoutes);
router.use("/progress-photo", progressPhotoRoutes);

export default router;
