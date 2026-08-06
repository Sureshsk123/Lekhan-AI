import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { OfflineProvider } from '../src/contexts/OfflineContext';
import { ToastProvider } from '../src/contexts/ToastContext';
import ErrorBoundary from '../src/components/layout/ErrorBoundary';
import OfflineBanner from '../src/components/layout/OfflineBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <OfflineProvider>
              <ToastProvider>
                <OfflineBanner />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="voice" options={{ headerShown: false }} />
                  <Stack.Screen name="quiz/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="shop" options={{ headerShown: false }} />
                  <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
                  <Stack.Screen name="smart-dashboard" options={{ headerShown: false }} />
                  <Stack.Screen name="parent" options={{ headerShown: false }} />
                  <Stack.Screen name="admin" options={{ headerShown: false }} />
                  <Stack.Screen name="search" options={{ headerShown: false }} />
                  <Stack.Screen name="notifications" options={{ headerShown: false }} />
                  <Stack.Screen name="reports" options={{ headerShown: false }} />
                  <Stack.Screen name="lesson-detail/[id]" options={{ headerShown: false }} />
                </Stack>
              </ToastProvider>
            </OfflineProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
