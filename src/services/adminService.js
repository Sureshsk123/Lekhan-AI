import apiClient from './apiClient';

export const getAdminDashboard = async () => {
  const res = await apiClient.get('/admin/dashboard');
  return res.data;
};

export const getAdminUsers = async (params = {}) => {
  const res = await apiClient.get('/admin/users', { params });
  return res.data;
};

export const updateUserRole = async (userId, role) => {
  const res = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return res.data;
};

export default {
  getAdminDashboard,
  getAdminUsers,
  updateUserRole
};
