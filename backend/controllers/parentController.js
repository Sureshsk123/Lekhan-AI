import {
  linkChildToParent,
  getParentChildrenOverview,
  getChildDetailDashboard
} from '../services/parentService.js';
import { sendError } from '../utils/responseHandler.js';

export const linkChildController = async (req, res) => {
  try {
    const { childEmail, relationship } = req.body;
    const link = await linkChildToParent(req.user._id, childEmail, relationship);

    return res.status(200).json({
      success: true,
      message: 'Child linked successfully',
      data: link
    });
  } catch (error) {
    console.error('Error linking child:', error);
    return sendError(res, 400, error.message || 'Failed to link child');
  }
};

export const getChildrenOverview = async (req, res) => {
  try {
    const children = await getParentChildrenOverview(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Linked children retrieved successfully',
      data: children
    });
  } catch (error) {
    console.error('Error fetching children overview:', error);
    return sendError(res, 500, error.message || 'Failed to fetch linked children');
  }
};

export const getChildDashboardController = async (req, res) => {
  try {
    const { childId } = req.params;
    const dashboard = await getChildDetailDashboard(req.user._id, childId);

    return res.status(200).json({
      success: true,
      message: 'Child dashboard data retrieved successfully',
      data: dashboard
    });
  } catch (error) {
    console.error('Error fetching child dashboard:', error);
    return sendError(res, 400, error.message || 'Failed to fetch child dashboard');
  }
};

export default {
  linkChildController,
  getChildrenOverview,
  getChildDashboardController
};
