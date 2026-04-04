import Progress from '../models/progress.model';

export const createProgress = async (userId: string, data: any) => {
  return Progress.create({ ...data, user: userId, date: new Date() });
};

export const getProgressByUser = async (userId: string) => {
  return Progress.find({ user: userId }).sort({ date: -1 });
};

export const updateProgressEntry = async (userId: string, entryId: string, updateData: any) => {
  return Progress.findOneAndUpdate(
    { _id: entryId, user: userId },
    updateData,
    { new: true }
  );
};
