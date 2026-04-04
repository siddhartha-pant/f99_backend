import { Router } from "express";
import { logMeal, getMeals } from "../controllers/meal.controller";
import { logWater, getWaterLogs } from "../controllers/water.controller";
import {
  saveDiaryEntry,
  getDiaryEntries,
} from "../controllers/diary.controller";
import { foodSearch } from "../controllers/foodSearch.controller";
import auth from "../middlewares/auth";
import { validateMeal } from "../middlewares/validation";

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const router = Router();

/* ── Meals ── */
router.post("/meal", auth, validateMeal, asyncHandler(logMeal));
router.get("/meal", auth, asyncHandler(getMeals));

/* ── Water ── */
router.post("/water", auth, asyncHandler(logWater));
router.get("/water", auth, asyncHandler(getWaterLogs));

/* ── Diary ── */
router.post("/diary", auth, asyncHandler(saveDiaryEntry));
router.get("/diary", auth, asyncHandler(getDiaryEntries));

/* ── Food search (USDA proxy — no key in frontend) ── */
// Public so unauthenticated users can still search food items,
// but switch to `auth,` before asyncHandler if you want it locked down.
router.get("/food-search", asyncHandler(foodSearch));

export default router;
