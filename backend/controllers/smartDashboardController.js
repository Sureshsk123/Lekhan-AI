import { getSmartDashboardMetrics } from '../services/smartDashboardService.js';
import { sendError } from '../utils/responseHandler.js';

export const getSmartDashboard = async (req, res) => {
  try {
    const metrics = await getSmartDashboardMetrics(req.user);

    return res.status(200).json({
      success: true,
      message: 'Smart Dashboard analytics retrieved successfully',
      data: metrics
    });
  } catch (error) {
    console.error('Error in getSmartDashboard:', error);
    return sendError(res, 500, error.message || 'Failed to retrieve Smart Dashboard metrics');
  }
};

export default {
  getSmartDashboard
};
