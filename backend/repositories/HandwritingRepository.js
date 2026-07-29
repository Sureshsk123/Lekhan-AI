import HandwritingScore from '../models/HandwritingScore.js';

class HandwritingRepository {
  async recordScore(data) {
    return await HandwritingScore.create(data);
  }

  async findByUserId(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const data = await HandwritingScore.find({ userId, isDeleted: false })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await HandwritingScore.countDocuments({ userId, isDeleted: false });
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
  }

  async getProgressGraphData(userId, limit = 30) {
    const records = await HandwritingScore.find({ userId, isDeleted: false })
      .sort({ timestamp: 1 })
      .limit(limit)
      .select('score formation spacing consistency timestamp targetChar inputType')
      .lean();

    return records.map(r => ({
      date: r.timestamp.toISOString().split('T')[0],
      timestamp: r.timestamp,
      targetChar: r.targetChar,
      inputType: r.inputType,
      score: r.score,
      formation: r.formation,
      spacing: r.spacing,
      consistency: r.consistency
    }));
  }
}

export default new HandwritingRepository();
