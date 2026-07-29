import apiClient from './apiClient';

export const linkChild = async (childEmail, relationship = 'parent') => {
  const res = await apiClient.post('/parent/link-child', { childEmail, relationship });
  return res.data;
};

export const getChildrenOverview = async () => {
  const res = await apiClient.get('/parent/children');
  return res.data;
};

export const getChildDashboard = async (childId) => {
  const res = await apiClient.get(`/parent/dashboard/${childId}`);
  return res.data;
};

export default {
  linkChild,
  getChildrenOverview,
  getChildDashboard
};
