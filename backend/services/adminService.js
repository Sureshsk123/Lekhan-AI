import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import Story from '../models/Story.js';
import QuizAttempt from '../models/QuizAttempt.js';
import AIUsageLog from '../models/AIUsageLog.js';

export const getAdminOverviewMetrics = async () => {
  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalLessons = await Lesson.countDocuments({ isDeleted: false });
  const totalStories = await Story.countDocuments({ isDeleted: false });
  const totalQuizzesAttempted = await QuizAttempt.countDocuments({ isDeleted: false });
  const totalAICalls = await AIUsageLog.countDocuments();

  const recentUsers = await User.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('-password');

  return {
    totalUsers,
    totalLessons,
    totalStories,
    totalQuizzesAttempted,
    totalAICalls,
    recentUsers
  };
};

export const getAdminUsersList = async ({ page = 1, limit = 10, search = '', role }) => {
  const skip = (page - 1) * limit;
  const filter = { isDeleted: false };
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

export const updateUserRoleByAdmin = async (targetUserId, role) => {
  const validRoles = ['user', 'admin', 'parent'];
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role '${role}'. Must be one of: ${validRoles.join(', ')}`);
  }

  return await User.findByIdAndUpdate(
    targetUserId,
    { role },
    { new: true }
  ).select('-password');
};

export default {
  getAdminOverviewMetrics,
  getAdminUsersList,
  updateUserRoleByAdmin
};
