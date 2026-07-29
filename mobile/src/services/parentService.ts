import apiClient from './apiClient';
import { ChildProgress } from '../types';

export const linkChild = async (childEmail: string, relationship: string = 'parent'): Promise<any> => {
  const res = await apiClient.post('/parent/link-child', { childEmail, relationship });
  return res.data;
};

export const getChildrenOverview = async (): Promise<ChildProgress[]> => {
  const res = await apiClient.get('/parent/children');
  return res.data.children || res.data.data || [];
};

export const getChildDashboard = async (childId: string): Promise<ChildProgress> => {
  const res = await apiClient.get(`/parent/dashboard/${childId}`);
  return res.data.child || res.data.dashboard || res.data.data;
};

export default {
  linkChild,
  getChildrenOverview,
  getChildDashboard,
};
