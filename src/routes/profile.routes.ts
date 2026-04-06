import { Router } from "express";
import {
  createOrUpdateProfile,
  getProfile,
  updateProfile,
  getFullProfileData,
} from "../controllers/profile.controller";
import auth from "../middlewares/auth";
import { validateProfile } from "../middlewares/validation";

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", auth, validateProfile, asyncHandler(createOrUpdateProfile));
router.patch("/", auth, asyncHandler(updateProfile));
router.get("/full", auth, asyncHandler(getFullProfileData));
router.get("/", auth, asyncHandler(getProfile));

export default router;
