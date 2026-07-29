import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  anim: Animated.Value;
}

export const Confetti: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const particles = useRef<Particle[]>(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * (SCREEN_WIDTH - 20),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 6,
      anim: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (active) {
      particles.forEach((p) => {
        p.anim.setValue(0);
        Animated.timing(p.anim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((p) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, SCREEN_HEIGHT + 20],
        });
        const rotate = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                left: p.x,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                transform: [{ translateY }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 3,
  },
});

export default Confetti;
