import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {toasts.map((toast) => (
          <View
            key={toast.id}
            style={[
              styles.toast,
              toast.type === 'success' && styles.success,
              toast.type === 'error' && styles.error,
              toast.type === 'info' && styles.info,
            ]}
          >
            <Text style={styles.text}>{toast.message}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  success: { backgroundColor: '#10B981' },
  error: { backgroundColor: '#EF4444' },
  info: { backgroundColor: '#3B82F6' },
  text: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});

export const useToast = () => useContext(ToastContext);
export default ToastContext;
