import apiClient from './apiClient';

export const getSmartDashboard = async () => {
  const res = await apiClient.get('/dashboard/smart');
  return res.data;
};

export default {
  getSmartDashboard
};
