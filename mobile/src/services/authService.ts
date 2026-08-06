import apiClient from './apiClient';
import { User } from '../types';

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  data?: {
    token?: string;
    user?: User;
  };
  message?: string;
}

export const signup = async (userData: { name?: string; fullName?: string; email: string; password: string; role?: string; targetLanguage?: string }): Promise<AuthResponse> => {
  const payload = {
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName || userData.name || 'User',
    role: userData.role,
    targetLanguage: userData.targetLanguage
  };
  const res = await apiClient.post('/auth/register', payload);
  return res.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
};

export const getProfile = async (): Promise<AuthResponse> => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const updateProfile = async (profileData: Partial<User>): Promise<AuthResponse> => {
  const res = await apiClient.put('/auth/me', profileData);
  return res.data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (err) {
    // Ignore backend logout network errors
  }
};

export default {
  signup,
  login,
  getProfile,
  updateProfile,
  logout,
};
