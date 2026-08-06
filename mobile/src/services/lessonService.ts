import apiClient from './apiClient';
import { Lesson } from '../types';
import { getOfflineCache, setOfflineCache } from '../utils/offlineCache';

export const getLessons = async (params: { language?: string; level?: string; search?: string } = {}): Promise<Lesson[]> => {
  try {
    const url = params.language ? `/lessons/${params.language}` : '/lessons';
    const res = await apiClient.get(url, { params });
    const lessons = res.data.lessons || res.data.data || res.data || [];
    await setOfflineCache(`lessons_${params.language || 'all'}`, lessons);
    return lessons;
  } catch (err) {
    const cached = await getOfflineCache<Lesson[]>(`lessons_${params.language || 'all'}`);
    if (cached) return cached;
    throw err;
  }
};

export const getLessonById = async (language: string, id: string): Promise<Lesson> => {
  try {
    const res = await apiClient.get(`/lessons/${language}/${id}`);
    const lesson = res.data.lesson || res.data.data || res.data;
    await setOfflineCache(`lesson_${id}`, lesson);
    return lesson;
  } catch (err) {
    const cached = await getOfflineCache<Lesson>(`lesson_${id}`);
    if (cached) return cached;
    throw err;
  }
};

export const completeLesson = async (lessonId: string, score?: number): Promise<any> => {
  const res = await apiClient.post(`/lessons/complete/${lessonId}`, { score });
  return res.data;
};

export default {
  getLessons,
  getLessonById,
  completeLesson,
};
