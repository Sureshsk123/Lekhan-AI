import apiClient from './apiClient';

export const getStories = async (language, category) => {
  const res = await apiClient.get(`/stories/${language}`, { params: { category } });
  return res.data;
};

export const getStoryById = async (language, id) => {
  const res = await apiClient.get(`/stories/${language}/${id}`);
  return res.data;
};

export const getAllStories = async (params = {}) => {
  const res = await apiClient.get('/stories', { params });
  return res.data;
};

export const generateAIStory = async (payload) => {
  const res = await apiClient.post('/stories/generate', payload);
  return res.data;
};

export const getMyGeneratedStories = async (params = {}) => {
  const res = await apiClient.get('/stories/my-generated', { params });
  return res.data;
};

export const toggleBookmark = async (storyId) => {
  const res = await apiClient.post(`/stories/${storyId}/bookmark`);
  return res.data;
};

export default {
  getStories,
  getStoryById,
  getAllStories,
  generateAIStory,
  getMyGeneratedStories,
  toggleBookmark
};
