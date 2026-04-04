import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Profile from '../models/profile.model';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, gender, age } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, gender, age });
    // Automatically create a profile for the user using available info
    await Profile.create({
      user: user._id,
      age,
      gender,
      // Only set fields that are present in signup, leave others undefined
    });
    // await signupSendVerification(user); // Email verification is currently disabled
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ message: 'Signup successful', token });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ message: 'Signin successful', token });
  } catch (err) {
    next(err);
  }
};
