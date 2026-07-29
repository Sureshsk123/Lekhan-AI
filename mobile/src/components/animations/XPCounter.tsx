import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

interface XPCounterProps {
  xp: number;
  prefix?: string;
  suffix?: string;
  style?: any;
}

export const XPCounter: React.FC<XPCounterProps> = ({
  xp,
  prefix = '⚡ ',
  suffix = ' XP',
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: xp,
      friction: 6,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [xp]);

  return (
    <Text style={[styles.text, style]}>
      {prefix}
      {xp}
      {suffix}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F59E0B',
  },
});

export default XPCounter;
