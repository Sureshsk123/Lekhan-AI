import apiClient from './apiClient';

export const signup = async ({ email, password, fullName }) => {
  const res = await apiClient.post('/v1/auth/register', { email, password, fullName });
  return {
    success: true,
    token: res.data?.data?.token || res.data?.token,
    user: res.data?.data?.user || res.data?.user,
  };
};

export const login = async (email, password) => {
  const res = await apiClient.post('/v1/auth/login', { email, password });
  return {
    success: true,
    token: res.data?.data?.token || res.data?.token,
    user: res.data?.data?.user || res.data?.user,
  };
};

export const getProfile = async () => {
  const res = await apiClient.get('/v1/auth/me');
  return {
    success: true,
    user: res.data?.data?.user || res.data?.user,
  };
};

export const updateProfile = async (profileData) => {
  const res = await apiClient.put('/v1/auth/me', profileData);
  return {
    success: true,
    user: res.data?.data?.user || res.data?.user,
  };
};

export const logout = async (refreshToken) => {
  try {
    await apiClient.post('/v1/auth/logout', { refreshToken });
  } catch {
    // Silently ignore logout API failures
  }
};

export const forgotPassword = async (email) => {
  const res = await apiClient.post('/v1/auth/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (token, newPassword) => {
  const res = await apiClient.post('/v1/auth/reset-password', { token, newPassword });
  return res.data;
};

export default {
  signup,
  login,
  getProfile,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
};
