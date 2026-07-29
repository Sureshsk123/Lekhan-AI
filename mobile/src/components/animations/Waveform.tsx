import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface WaveformProps {
  isRecording?: boolean;
  barCount?: number;
  color?: string;
}

export const Waveform: React.FC<WaveformProps> = ({
  isRecording = false,
  barCount = 12,
  color = '#2563EB',
}) => {
  const animations = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(10))
  ).current;

  useEffect(() => {
    if (isRecording) {
      const loops = animations.map((anim) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 40 + 10,
              duration: 200 + Math.random() * 200,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 8,
              duration: 200 + Math.random() * 200,
              useNativeDriver: false,
            }),
          ])
        )
      );
      loops.forEach((l) => l.start());
      return () => loops.forEach((l) => l.stop());
    } else {
      animations.forEach((anim) => anim.setValue(10));
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            { height: anim, backgroundColor: color },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 4,
  },
  bar: {
    width: 5,
    borderRadius: 3,
  },
});

export default Waveform;
