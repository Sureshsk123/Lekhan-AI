import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>}
      <TextInput
        placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
        style={[
          styles.input,
          isDark && styles.inputDark,
          error ? styles.inputError : null,
          style,
        ]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  labelDark: {
    color: '#E2E8F0',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  inputDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    color: '#F8FAFC',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
