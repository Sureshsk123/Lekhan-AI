import apiClient from './apiClient';

export const signup = async (userData) => {
  const res = await apiClient.post('/auth/signup', userData);
  return res.data;
};

export const login = async (email, password) => {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await apiClient.get('/user/profile');
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await apiClient.put('/user/profile', profileData);
  return res.data;
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (err) {
    // Ignore logout network errors
  }
};

export default {
  signup,
  login,
  getProfile,
  updateProfile,
  logout
};
