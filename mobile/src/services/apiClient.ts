import axios from 'axios';
import { getSecureItem, removeSecureItem } from '../utils/secureStore';
import { Platform } from 'react-native';

// Standard default API Base URL connecting to backend server on localhost:5001/api
const getBaseURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android Emulator uses 10.0.2.2 to access host localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }
  return 'http://localhost:5001/api';
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
