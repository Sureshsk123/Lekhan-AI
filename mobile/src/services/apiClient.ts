import axios from 'axios';
import { getSecureItem, removeSecureItem } from '../utils/secureStore';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

const getBaseURL = () => {
  const envBase = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL;
  if (envBase) {
    return envBase;
  }

  // Dynamically extract Mac host IP from Expo Go debugger / manifest if running on physical device
  const debuggerHost = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (debuggerHost) {
    const hostIp = debuggerHost.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:5005/api`;
    }
  }

  // Android Emulator default fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5005/api';
  }

  // Local development default fallback
  return 'http://localhost:5005/api';
};

export const API_URL = getBaseURL();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Bearer token from SecureStore
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getSecureItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore token read error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Unauthorized handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await removeSecureItem('auth_token');
      } catch (e) {
        // Ignore wipe error
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
