import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

interface DrawingCanvasProps {
  onStrokeComplete?: (strokes: Stroke[]) => void;
  strokeColor?: string;
  strokeWidth?: number;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onStrokeComplete,
  strokeColor = '#0F172A',
  strokeWidth = 6,
}) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentStroke([{ x: locationX, y: locationY }]);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentStroke((prev) => [...prev, { x: locationX, y: locationY }]);
    },
    onPanResponderRelease: () => {
      if (currentStroke.length > 0) {
        const newStroke: Stroke = {
          points: currentStroke,
          color: strokeColor,
          size: strokeWidth,
        };
        const updated = [...strokes, newStroke];
        setStrokes(updated);
        setRedoStack([]);
        setCurrentStroke([]);
        if (onStrokeComplete) {
          onStrokeComplete(updated);
        }
      }
    },
  });

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    const updated = strokes.slice(0, -1);
    setStrokes(updated);
    setRedoStack((prev) => [...prev, last]);
    if (onStrokeComplete) onStrokeComplete(updated);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const updatedRedo = redoStack.slice(0, -1);
    const updatedStrokes = [...strokes, next];
    setStrokes(updatedStrokes);
    setRedoStack(updatedRedo);
    if (onStrokeComplete) onStrokeComplete(updatedStrokes);
  };

  const handleClear = () => {
    setStrokes([]);
    setRedoStack([]);
    setCurrentStroke([]);
    if (onStrokeComplete) onStrokeComplete([]);
  };

  const pointsToSvgPath = (points: Point[]) => {
    if (points.length === 0) return '';
    const d = points.reduce(
      (acc, point, i) => (i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`),
      ''
    );
    return d;
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg style={StyleSheet.absoluteFill}>
          {strokes.map((stroke, idx) => (
            <Path
              key={idx}
              d={pointsToSvgPath(stroke.points)}
              stroke={stroke.color}
              strokeWidth={stroke.size}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentStroke.length > 0 && (
            <Path
              d={pointsToSvgPath(currentStroke)}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={handleUndo} disabled={strokes.length === 0}>
          <Text style={styles.btnText}>↩ Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleRedo} disabled={redoStack.length === 0}>
          <Text style={styles.btnText}>↪ Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnClear]} onPress={handleClear}>
          <Text style={[styles.btnText, styles.btnClearText]}>🗑 Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  canvasContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  btn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnText: {
    fontWeight: '700',
    color: '#334155',
    fontSize: 14,
  },
  btnClear: {
    backgroundColor: '#FEE2E2',
  },
  btnClearText: {
    color: '#EF4444',
  },
});

export default DrawingCanvas;
