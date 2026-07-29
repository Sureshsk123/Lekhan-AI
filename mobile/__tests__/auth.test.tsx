import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { Text, TouchableOpacity } from 'react-native';
import authService from '../src/services/authService';

jest.mock('../src/services/authService');
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(),
}));

const TestComponent = () => {
  const { user, login, isAuthenticated } = useAuth();
  return (
    <>
      <Text testID="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</Text>
      <Text testID="user-name">{user?.name || 'Guest'}</Text>
      <TouchableOpacity testID="login-btn" onPress={() => login('test@email.com', 'password')}>
        <Text>Login</Text>
      </TouchableOpacity>
    </>
  );
};

describe('Auth System Tests', () => {
  it('renders initial unauthenticated state', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(getByTestId('auth-status').children[0]).toBe('LOGGED_OUT');
  });

  it('performs login successfully', async () => {
    (authService.login as jest.Mock).mockResolvedValueOnce({
      token: 'jwt_mock_token',
      user: { name: 'Test User', email: 'test@email.com', role: 'user' },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.press(getByTestId('login-btn'));

    await waitFor(() => {
      expect(getByTestId('auth-status').children[0]).toBe('LOGGED_IN');
      expect(getByTestId('user-name').children[0]).toBe('Test User');
    });
  });
});
