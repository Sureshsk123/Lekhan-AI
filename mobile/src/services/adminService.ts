import apiClient from './apiClient';

export const getAdminDashboard = async (): Promise<any> => {
  const res = await apiClient.get('/admin/dashboard');
  return res.data.analytics || res.data.dashboard || res.data;
};

export const getAdminUsers = async (params: { page?: number; limit?: number; role?: string } = {}): Promise<any[]> => {
  const res = await apiClient.get('/admin/users', { params });
  return res.data.users || res.data.data || [];
};

export const updateUserRole = async (userId: string, role: string): Promise<any> => {
  const res = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return res.data;
};

export default {
  getAdminDashboard,
  getAdminUsers,
  updateUserRole,
};
