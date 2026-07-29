import STTLog from '../models/STTLog.js';

export const createSTTLog = async (data) => {
  const log = new STTLog(data);
  return await log.save();
};

export const getSTTHistoryByUserId = async (userId, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const data = await STTLog.find({ userId })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const total = await STTLog.countDocuments({ userId });
  return {
    data,
    total,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

export default {
  createSTTLog,
  getSTTHistoryByUserId
};
