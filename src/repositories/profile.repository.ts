import Profile from '../models/profile.model';

export const findProfileByUser = async (userId: string) => {
  return Profile.findOne({ user: userId });
};

export const upsertProfile = async (userId: string, profileData: any) => {
  return Profile.findOneAndUpdate(
    { user: userId },
    { ...profileData, user: userId },
    { upsert: true, new: true }
  );
};

export const updateProfile = async (userId: string, updateData: any) => {
  return Profile.findOneAndUpdate(
    { user: userId },
    updateData,
    { new: true }
  );
};
