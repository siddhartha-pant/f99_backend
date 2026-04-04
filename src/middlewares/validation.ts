import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.string(),
  age: z.number().int().min(0),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const profileSchema = z.object({
  weight: z.number().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  trainingExperience: z.string().optional(),
  aim: z.string().optional(),
  bodyMeasurements: z.record(z.string(), z.number()).optional(),
});

const progressSchema = z.object({
  weight: z.number().optional(),
  energyLevel: z.string().optional(),
  notes: z.string().optional(),
});

const mealSchema = z.object({
  name: z.string(),
  calories: z.number(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  date: z.string().datetime().optional(),
});

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
};

export const validateSignin = (req: Request, res: Response, next: NextFunction) => {
  try {
    signinSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
};

export const validateProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    profileSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
};

export const validateProgress = (req: Request, res: Response, next: NextFunction) => {
  try {
    progressSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
};

export const validateMeal = (req: Request, res: Response, next: NextFunction) => {
  try {
    mealSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
};
