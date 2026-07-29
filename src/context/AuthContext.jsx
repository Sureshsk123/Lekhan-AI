import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const data = await authService.getProfile();
      if (data && data.data && data.data.user) {
        setUser(data.data.user);
      } else if (data && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const res = await authService.signup(userData);
      const resData = res.data || res;
      const newToken = resData.token;
      const newUser = resData.user;

      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
      }
      if (newUser) {
        setUser(newUser);
      }
      return { success: true, data: resData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      const resData = res.data || res;
      const newToken = resData.token;
      const newUser = resData.user;

      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
      }
      if (newUser) {
        setUser(newUser);
      }
      return { success: true, data: resData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const [activeLanguage, setActiveLanguageState] = useState(localStorage.getItem('activeLanguage') || 'tamil');

  const setActiveLanguage = (lang) => {
    localStorage.setItem('activeLanguage', lang);
    setActiveLanguageState(lang);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    updateUser,
    loadUser,
    activeLanguage,
    setActiveLanguage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
