import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'accent';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary' }) => {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  primary: { backgroundColor: '#DBEAFE' },
  success: { backgroundColor: '#D1FAE5' },
  warning: { backgroundColor: '#FEF3C7' },
  accent: { backgroundColor: '#EDE9FE' },
  text: { fontSize: 12, fontWeight: '700' },
  primaryText: { color: '#1D4ED8' },
  successText: { color: '#047857' },
  warningText: { color: '#B45309' },
  accentText: { color: '#6D28D9' },
});

export default Badge;
