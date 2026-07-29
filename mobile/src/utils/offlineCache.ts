import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryCache: Record<string, string> = {};

export const setOfflineCache = async <T>(key: string, data: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify({
      data,
      timestamp: Date.now(),
    });
    memoryCache[key] = jsonValue;
    await AsyncStorage.setItem(`@offline_cache_${key}`, jsonValue);
  } catch (err) {
    // Fallback to memory
  }
};

export const getOfflineCache = async <T>(key: string): Promise<T | null> => {
  try {
    const item = await AsyncStorage.getItem(`@offline_cache_${key}`);
    const raw = item || memoryCache[key];
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data as T;
  } catch (err) {
    if (memoryCache[key]) {
      try {
        return JSON.parse(memoryCache[key]).data as T;
      } catch {
        return null;
      }
    }
    return null;
  }
};

export const removeOfflineCache = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`@offline_cache_${key}`);
    delete memoryCache[key];
  } catch (err) {
    delete memoryCache[key];
  }
};

export default {
  setOfflineCache,
  getOfflineCache,
  removeOfflineCache,
};
