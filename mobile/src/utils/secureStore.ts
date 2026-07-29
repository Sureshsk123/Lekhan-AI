import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const inMemoryStore: Record<string, string> = {};

export const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    inMemoryStore[key] = value;
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const val = await SecureStore.getItemAsync(key);
    return val !== null ? val : inMemoryStore[key] || null;
  } catch (error) {
    return inMemoryStore[key] || null;
  }
};

export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
    delete inMemoryStore[key];
  } catch (error) {
    delete inMemoryStore[key];
  }
};

export default {
  setSecureItem,
  getSecureItem,
  removeSecureItem,
};
