import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getSecureItem, setSecureItem, removeSecureItem } from '../utils/secureStore';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  login: (email: string, pass: string, remember?: boolean) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; role?: string; targetLanguage?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      setIsLoading(true);
      const savedToken = await getSecureItem('auth_token');
      if (savedToken) {
        setToken(savedToken);
        const res = await authService.getProfile();
        const profileUser = res.user || (res.data && res.data.user);
        if (profileUser) {
          setUser(profileUser);
        }
      }
    } catch (err) {
      await removeSecureItem('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string, remember: boolean = true) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, pass);
      const jwt = res.token || (res.data && res.data.token);
      const userData = res.user || (res.data && res.data.user);

      if (jwt && userData) {
        setToken(jwt);
        setUser(userData);
        setRememberMe(remember);
        if (remember) {
          await setSecureItem('auth_token', jwt);
        }
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; password: string; role?: string; targetLanguage?: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.signup(data);
      const jwt = res.token || (res.data && res.data.token);
      const userData = res.user || (res.data && res.data.user);

      if (jwt && userData) {
        setToken(jwt);
        setUser(userData);
        await setSecureItem('auth_token', jwt);
      } else {
        throw new Error(res.message || 'Signup failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      await removeSecureItem('auth_token');
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      await authService.updateProfile(data);
    } catch (err) {
      // Revert if error
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await authService.getProfile();
      const profileUser = res.user || (res.data && res.data.user);
      if (profileUser) {
        setUser(profileUser);
      }
    } catch (err) {
      // Ignore background refresh errors
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        rememberMe,
        setRememberMe,
        login,
        signup,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
