import {
  getAdminOverviewMetrics,
  getAdminUsersList,
  updateUserRoleByAdmin
} from '../services/adminService.js';
import { sendError } from '../utils/responseHandler.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const overview = await getAdminOverviewMetrics();

    return res.status(200).json({
      success: true,
      message: 'Admin Dashboard overview metrics retrieved successfully',
      data: overview
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    return sendError(res, 500, error.message || 'Failed to fetch admin dashboard metrics');
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role } = req.query;
    const result = await getAdminUsersList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      role
    });

    return res.status(200).json({
      success: true,
      message: 'Users list retrieved for admin',
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return sendError(res, 500, error.message || 'Failed to fetch users list');
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const updatedUser = await updateUserRoleByAdmin(userId, role);

    if (!updatedUser) {
      return sendError(res, 404, 'User not found');
    }

    return res.status(200).json({
      success: true,
      message: `User role updated successfully to '${role}'`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return sendError(res, 400, error.message || 'Failed to update user role');
  }
};

export default {
  getAdminDashboard,
  getAdminUsers,
  updateUserRole
};
