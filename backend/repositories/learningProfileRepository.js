import LearningProfile from '../models/LearningProfile.js';

export const findProfileByUserId = async (userId) => {
  let profile = await LearningProfile.findOne({ userId });
  if (!profile) {
    profile = await LearningProfile.create({ userId });
  }
  return profile;
};

export const updateProfile = async (userId, updateData) => {
  return await LearningProfile.findOneAndUpdate(
    { userId },
    { ...updateData, lastAnalyzed: new Date() },
    { new: true, upsert: true }
  );
};

export default {
  findProfileByUserId,
  updateProfile
};
