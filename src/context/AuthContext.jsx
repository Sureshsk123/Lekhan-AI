import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

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

  // Load token from storage on init — check both localStorage (rememberMe) and sessionStorage
  const getStoredToken = () =>
    localStorage.getItem('token') || sessionStorage.getItem('token');

  const [token, setToken] = useState(getStoredToken);

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
      if (data?.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const storeToken = (tok, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('token', tok);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', tok);
      localStorage.removeItem('token');
    }
    setToken(tok);
  };

  const mapToLangCode = (lang) => {
    if (!lang) return null;
    const l = String(lang).toLowerCase();
    if (l === 'tamil' || l === 'ta') return 'ta';
    if (l === 'english' || l === 'en') return 'en';
    if (l === 'hindi' || l === 'hi') return 'hi';
    if (l === 'telugu' || l === 'te') return 'te';
    if (l === 'malayalam' || l === 'ml') return 'ml';
    if (l === 'kannada' || l === 'kn') return 'kn';
    return l;
  };

  const signup = async ({ email, password, fullName, preferredLanguage }) => {
    try {
      const res = await authService.signup({ email, password, fullName, preferredLanguage });
      if (res.token) storeToken(res.token, true); // always persist after signup
      if (res.user) {
        setUser(res.user);
        const langCode = mapToLangCode(res.user.preferredLanguage || preferredLanguage);
        if (langCode) {
          localStorage.setItem('activeLanguage', langCode);
          setActiveLanguageState(langCode);
        }
      }
      return { success: true, data: res };
    } catch (error) {
      const specificError = error.response?.data?.errors?.[0]?.message;
      const genMsg = error.response?.data?.message;
      return {
        success: false,
        message: specificError || genMsg || error.message || 'Registration failed',
      };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const res = await authService.login(email, password);
      if (res.token) storeToken(res.token, rememberMe);
      if (res.user) {
        setUser(res.user);
        const langCode = mapToLangCode(res.user.preferredLanguage || res.user.enrolledLanguages?.[0]);
        if (langCode) {
          localStorage.setItem('activeLanguage', langCode);
          setActiveLanguageState(langCode);
        }
      }
      return { success: true, data: res };
    } catch (error) {
      const specificError = error.response?.data?.errors?.[0]?.message;
      const genMsg = error.response?.data?.message;
      return {
        success: false,
        message: specificError || genMsg || error.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    authService.logout(refreshToken).catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
    if (updatedData.preferredLanguage) {
      const langCode = mapToLangCode(updatedData.preferredLanguage);
      if (langCode) {
        localStorage.setItem('activeLanguage', langCode);
        setActiveLanguageState(langCode);
      }
    }
  };

  const [activeLanguage, setActiveLanguageState] = useState(
    localStorage.getItem('activeLanguage') || 'ta'
  );

  useEffect(() => {
    if (user) {
      const preferred = user.preferredLanguage || user.enrolledLanguages?.[0];
      const langCode = mapToLangCode(preferred);
      if (langCode && langCode !== activeLanguage) {
        localStorage.setItem('activeLanguage', langCode);
        setActiveLanguageState(langCode);
      }
    }
  }, [user]);

  const setActiveLanguage = (lang) => {
    localStorage.setItem('activeLanguage', lang);
    setActiveLanguageState(lang);
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
    setActiveLanguage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
