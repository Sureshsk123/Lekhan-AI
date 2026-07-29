import apiClient from './apiClient';
import { Story } from '../types';
import { getOfflineCache, setOfflineCache } from '../utils/offlineCache';

export const getStories = async (language?: string, category?: string): Promise<Story[]> => {
  try {
    const url = language ? `/stories/${language}` : '/stories';
    const res = await apiClient.get(url, { params: { category } });
    const stories = res.data.stories || res.data.data || res.data || [];
    await setOfflineCache(`stories_${language || 'all'}`, stories);
    return stories;
  } catch (err) {
    const cached = await getOfflineCache<Story[]>(`stories_${language || 'all'}`);
    if (cached) return cached;
    throw err;
  }
};

export const getStoryById = async (language: string, id: string): Promise<Story> => {
  try {
    const res = await apiClient.get(`/stories/${language}/${id}`);
    const story = res.data.story || res.data.data || res.data;
    await setOfflineCache(`story_${id}`, story);
    return story;
  } catch (err) {
    const cached = await getOfflineCache<Story>(`story_${id}`);
    if (cached) return cached;
    throw err;
  }
};

export const toggleBookmark = async (storyId: string): Promise<any> => {
  const res = await apiClient.post(`/stories/${storyId}/bookmark`);
  return res.data;
};

export const generateAIStory = async (payload: { prompt: string; language: string; difficulty?: string }): Promise<Story> => {
  const res = await apiClient.post('/stories/generate', payload);
  return res.data.story || res.data.data || res.data;
};

export default {
  getStories,
  getStoryById,
  toggleBookmark,
  generateAIStory,
};
