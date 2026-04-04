import User from '../models/user.model';

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const createUser = async (userData: any) => {
  return User.create(userData);
};

export const updateUserProfileImage = async (userId: string, imageUrl: string) => {
  return User.findByIdAndUpdate(userId, { profileImage: imageUrl });
};
