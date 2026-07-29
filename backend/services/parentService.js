import { linkChild, getChildrenByParentId, findLink } from '../repositories/parentRepository.js';
import User from '../models/User.js';
import { getSmartDashboardMetrics } from './smartDashboardService.js';
import { analyzeAndGetPersonalizedRecommendations } from './personalizedLearningService.js';
import QuizAttempt from '../models/QuizAttempt.js';
import HandwritingScore from '../models/HandwritingScore.js';

export const linkChildToParent = async (parentId, childEmail, relationship = 'parent') => {
  const child = await User.findOne({ email: childEmail.toLowerCase(), isDeleted: false });
  if (!child) {
    throw new Error('Child user account not found with provided email');
  }

  return await linkChild({
    parentId,
    childId: child._id,
    relationship
  });
};

export const getParentChildrenOverview = async (parentId) => {
  const children = await getChildrenByParentId(parentId);
  return children;
};

export const getChildDetailDashboard = async (parentId, childId) => {
  const link = await findLink(parentId, childId);
  if (!link && parentId.toString() !== childId.toString()) {
    throw new Error('Unauthorized: You are not linked as a parent for this child');
  }

  const childUser = await User.findById(childId);
  if (!childUser) {
    throw new Error('Child user not found');
  }

  const smartMetrics = await getSmartDashboardMetrics(childUser);
  const personalized = await analyzeAndGetPersonalizedRecommendations(childId);

  const quizHistory = await QuizAttempt.find({ userId: childId, isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(5);

  const handwritingHistory = await HandwritingScore.find({ userId: childId, isDeleted: false })
    .sort({ timestamp: -1 })
    .limit(5);

  return {
    child: {
      id: childUser._id,
      username: childUser.username,
      email: childUser.email,
      xp: childUser.xp,
      level: childUser.level,
      streak: childUser.streak
    },
    metrics: smartMetrics,
    weakAreas: personalized.weakAreas,
    recommendations: personalized.recommendations,
    quizHistory,
    handwritingHistory
  };
};

export default {
  linkChildToParent,
  getParentChildrenOverview,
  getChildDetailDashboard
};
