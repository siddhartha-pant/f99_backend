import { Request, Response, NextFunction } from 'express';
import ProgressPhoto from '../models/progressPhoto.model';
import cloudinary from '../utils/cloudinary';
import fs from 'fs';

export const uploadProgressPhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'progress_photos',
      use_filename: true,
      unique_filename: false,
    });
    // Remove local file after upload
    fs.unlinkSync(req.file.path);
    const photoUrl = result.secure_url;
    const { note } = req.body;
    const photo = await ProgressPhoto.create({ user: userId, photoUrl, note });
    res.status(201).json({ message: 'Progress photo uploaded', photo });
  } catch (err) {
    next(err);
  }
};

export const getProgressPhotos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const photos = await ProgressPhoto.find({ user: userId }).sort({ date: -1 });
    res.json(photos);
  } catch (err) {
    next(err);
  }
};
