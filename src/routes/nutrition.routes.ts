import { Router } from 'express';
import { logMeal, getMeals } from '../controllers/meal.controller';
import { logWater, getWaterLogs } from '../controllers/water.controller';
import auth from '../middlewares/auth';
import { validateMeal } from '../middlewares/validation';

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const router = Router();

router.post('/meal', auth, validateMeal, asyncHandler(async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => { await logMeal(req, res, next); return; }));
router.get('/meal', auth, asyncHandler(async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => { await getMeals(req, res, next); return; }));
router.post('/water', auth, asyncHandler(async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => { await logWater(req, res, next); return; }));
router.get('/water', auth, asyncHandler(async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => { await getWaterLogs(req, res, next); return; }));

export default router;
