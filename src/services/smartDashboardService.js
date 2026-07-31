import apiClient from './apiClient';

export const getSmartDashboard = async (language = null) => {
  const url = language ? `/v1/dashboard?language=${language}` : '/v1/dashboard';
  const res = await apiClient.get(url);
  return res.data;
};

export default {
  getSmartDashboard
};
