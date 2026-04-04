import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import cloudinary from '../utils/cloudinary';
import fs from 'fs';
import path from 'path';

export const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.userId;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_images',
      use_filename: true,
      unique_filename: false,
    });
    // Remove local file after upload
    fs.unlinkSync(req.file.path);
    const imageUrl = result.secure_url;
    await User.findByIdAndUpdate(userId, { profileImage: imageUrl });
    return res.json({ message: 'Profile image uploaded', url: imageUrl });
  } catch (err) {
    next(err);
  }
};
