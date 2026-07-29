import apiClient from './apiClient';

export interface SearchResults {
  lessons: any[];
  stories: any[];
  vocabulary: any[];
  shopItems: any[];
  achievements: any[];
  users: any[];
}

export const globalSearch = async (query: string, category: string = 'all'): Promise<SearchResults> => {
  const res = await apiClient.get('/search', { params: { q: query, category } });
  return res.data.results || res.data.data || {
    lessons: res.data.lessons || [],
    stories: res.data.stories || [],
    vocabulary: res.data.vocabulary || [],
    shopItems: res.data.shopItems || [],
    achievements: res.data.achievements || [],
    users: res.data.users || [],
  };
};

export default {
  globalSearch,
};
