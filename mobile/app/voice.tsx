import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useTheme } from '../src/contexts/ThemeContext';
import { useToast } from '../src/contexts/ToastContext';
import Header from '../src/components/layout/Header';
import Card from '../src/components/common/Card';
import Button from '../src/components/common/Button';
import Waveform from '../src/components/animations/Waveform';
import speechService from '../src/services/speechService';

export default function VoiceScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const [referenceText, setReferenceText] = useState('नमस्ते, आप कैसे हैं? (Namaste, how are you?)');
  const [score, setScore] = useState<number | null>(null);
  const [accentFeedback, setAccentFeedback] = useState<string | null>(null);

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      showToast('Evaluating pronunciation...', 'info');
      // Simulate audio record evaluation
      setTimeout(() => {
        setScore(94);
        setAccentFeedback('Outstanding tone pitch and vowel length! Sounds like a native speaker.');
      }, 1500);
    } else {
      setIsRecording(true);
      setScore(null);
      setAccentFeedback(null);
    }
  };

  const handleSpeakSample = () => {
    Speech.speak('नमस्ते, आप कैसे हैं?', { language: 'hi-IN' });
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Voice Practice 🎙️" showBack onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Target Practice Phrase:</Text>
          <Text style={[styles.phraseText, isDark && styles.textDark]}>{referenceText}</Text>
          <Button title="🔊 Listen Native TTS Audio" onPress={handleSpeakSample} variant="outline" size="sm" style={{ marginTop: 12 }} />
        </Card>

        {/* Waveform Visualizer */}
        <Card style={styles.waveformCard}>
          <Text style={[styles.statusText, isDark && styles.textDark]}>
            {isRecording ? 'Listening... Speak phrase now!' : 'Tap Microphone to Start Recording'}
          </Text>
          <Waveform isRecording={isRecording} barCount={16} color={isRecording ? '#EF4444' : '#2563EB'} />

          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micActive]}
            onPress={toggleRecording}
          >
            <Text style={styles.micEmoji}>{isRecording ? '⏹️' : '🎙️'}</Text>
          </TouchableOpacity>
        </Card>

        {/* Feedback Card */}
        {score !== null && (
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Pronunciation Analysis</Text>
            <Text style={styles.scoreText}>{score} / 100</Text>
            <Text style={styles.feedbackText}>{accentFeedback}</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  content: { padding: 18 },
  card: { padding: 18, marginBottom: 16 },
  sectionLabel: { fontSize: 13, color: '#64748B', fontWeight: '700', marginBottom: 6 },
  phraseText: { fontSize: 20, fontWeight: '800', color: '#0F172A', lineHeight: 28 },
  textDark: { color: '#F8FAFC' },
  waveformCard: { alignItems: 'center', paddingVertical: 24, marginBottom: 16 },
  statusText: { fontSize: 15, fontWeight: '700', marginBottom: 16 },
  micButton: { backgroundColor: '#2563EB', width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  micActive: { backgroundColor: '#EF4444' },
  micEmoji: { fontSize: 32 },
  resultCard: { backgroundColor: '#ECFDF5', borderColor: '#10B981', borderWidth: 1, alignItems: 'center', padding: 20 },
  resultTitle: { fontSize: 16, fontWeight: '800', color: '#065F46' },
  scoreText: { fontSize: 36, fontWeight: '900', color: '#047857', marginVertical: 8 },
  feedbackText: { fontSize: 14, color: '#065F46', textAlign: 'center' },
});
