import { Router } from 'express';
import { logProgress, getProgress, updateProgress } from '../controllers/progress.controller';
import auth from '../middlewares/auth';
import { validateProgress } from '../middlewares/validation';

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const router = Router();

router.post('/', auth, validateProgress, asyncHandler(async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => { await logProgress(req, res, next); }));
router.get('/', auth, asyncHandler(async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => { await getProgress(req, res, next); return undefined; }));
router.patch('/:entryId', auth, asyncHandler(async (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => { await updateProgress(req, res, next); }));

export default router;
