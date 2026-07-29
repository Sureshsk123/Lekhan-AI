import { performGlobalSearch } from '../services/searchService.js';
import { sendError } from '../utils/responseHandler.js';

export const globalSearchController = async (req, res) => {
  try {
    const { q = '', category = 'all', page = 1, limit = 10 } = req.query;
    const results = await performGlobalSearch({
      query: q,
      category,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      success: true,
      message: 'Global search executed successfully',
      query: q,
      category,
      data: results
    });
  } catch (error) {
    console.error('Error executing global search:', error);
    return sendError(res, 500, error.message || 'Global search failed');
  }
};

export default {
  globalSearchController
};
