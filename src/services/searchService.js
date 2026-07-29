import apiClient from './apiClient';

export const globalSearch = async (query, category = 'all') => {
  const res = await apiClient.get('/search', { params: { q: query, category } });
  return res.data;
};

export default {
  globalSearch
};
