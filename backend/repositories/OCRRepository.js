import OCRResult from '../models/OCRResult.js';

class OCRRepository {
  async recordResult(data) {
    return await OCRResult.create(data);
  }

  async findByUserId(userId, { page = 1, limit = 10, search = '' } = {}) {
    const skip = (page - 1) * limit;
    const query = { userId, isDeleted: false };

    if (search) {
      query.$or = [
        { extractedText: { $regex: search, $options: 'i' } },
        { detectedText: { $regex: search, $options: 'i' } },
        { detectedLanguage: { $regex: search, $options: 'i' } }
      ];
    }

    const data = await OCRResult.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await OCRResult.countDocuments(query);
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
}

export default new OCRRepository();
