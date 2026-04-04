import { Request, Response, NextFunction } from 'express';
import Progress from '../models/progress.model';

export const logProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = (req as any).user.userId;
  try {
    const entry = await Progress.create({ ...req.body, user: userId, date: new Date() });
    res.status(201).json({ message: 'Progress logged', entry });
    return;
  } catch (err) {
    next(err);
  }
};

export const getProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = (req as any).user.userId;
  try {
    const entries = await Progress.find({ user: userId }).sort({ date: -1 });
    res.json(entries);
    return;
  } catch (err) {
    next(err);
  }
};

export const updateProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = (req as any).user.userId;
  const { entryId } = req.params;
  try {
    const entry = await Progress.findOneAndUpdate(
      { _id: entryId, user: userId },
      req.body,
      { new: true }
    );
    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }
    res.json({ message: 'Progress updated', entry });
    return;
  } catch (err) {
    next(err);
  }
};
