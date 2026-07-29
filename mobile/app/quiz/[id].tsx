import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useToast } from '../../src/contexts/ToastContext';
import Header from '../../src/components/layout/Header';
import Card from '../../src/components/common/Card';
import Button from '../../src/components/common/Button';
import ProgressBar from '../../src/components/common/ProgressBar';
import Confetti from '../../src/components/animations/Confetti';
import XPCounter from '../../src/components/animations/XPCounter';

const MOCK_QUESTIONS = [
  {
    id: 'q1',
    type: 'mcq',
    question: 'What is the correct formal Hindi greeting?',
    options: ['Namaste', 'Alvida', 'Haan', 'Nahi'],
    correctAnswer: 'Namaste',
    explanation: 'Namaste is the traditional and respectful greeting used across Hindi-speaking regions.',
  },
  {
    id: 'q2',
    type: 'fill-blank',
    question: 'Complete the sentence: "Mera naam _____ hai."',
    options: ['Rahul', 'Khana', 'Paani', 'Ghar'],
    correctAnswer: 'Rahul',
    explanation: '"Mera naam ___ hai" translates to "My name is ___".',
  },
  {
    id: 'q3',
    type: 'image',
    question: 'Select the image depicting "Water" (जल / पानी):',
    options: ['🚰 Water', '🍎 Apple', '🏡 House', '🚗 Car'],
    correctAnswer: '🚰 Water',
    explanation: '🚰 represents water, which is called Paani or Jal in Hindi.',
  },
];

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = MOCK_QUESTIONS[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    if (selectedOption === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
      showToast('Correct answer! +20 XP', 'success');
    } else {
      showToast('Incorrect choice', 'error');
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < MOCK_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Interactive Quiz Engine 🎯" showBack onBack={() => router.back()} />

      {!isFinished ? (
        <ScrollView contentContainerStyle={styles.content}>
          <ProgressBar progress={(currentIndex + 1) / MOCK_QUESTIONS.length} height={8} />

          <Text style={styles.qCount}>
            Question {currentIndex + 1} of {MOCK_QUESTIONS.length}
          </Text>

          <Card style={styles.qCard}>
            <Text style={[styles.qText, isDark && styles.textDark]}>{currentQ.question}</Text>

            <View style={styles.optionsList}>
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = isAnswered && opt === currentQ.correctAnswer;
                const isWrong = isAnswered && isSelected && opt !== currentQ.correctAnswer;

                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionSelected,
                      isCorrect && styles.optionCorrect,
                      isWrong && styles.optionWrong,
                    ]}
                    onPress={() => handleSelectOption(opt)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        (isSelected || isCorrect) && styles.optionTextBold,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {isAnswered && (
            <Card style={styles.expCard}>
              <Text style={styles.expTitle}>Explanation:</Text>
              <Text style={styles.expBody}>{currentQ.explanation}</Text>
            </Card>
          )}

          <View style={{ marginTop: 16 }}>
            {!isAnswered ? (
              <Button title="Check Answer" onPress={handleCheckAnswer} disabled={!selectedOption} />
            ) : (
              <Button title={currentIndex + 1 === MOCK_QUESTIONS.length ? 'Finish Quiz' : 'Next Question'} onPress={handleNext} variant="secondary" />
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.finishContainer}>
          <Confetti active={isFinished} />
          <Text style={styles.congratsEmoji}>🎉</Text>
          <Text style={[styles.congratsTitle, isDark && styles.textDark]}>Quiz Completed!</Text>

          <Card style={styles.resultCard}>
            <Text style={styles.resScoreText}>{score} / {MOCK_QUESTIONS.length} Correct</Text>
            <XPCounter xp={score * 30} prefix="Earned " suffix=" XP!" style={{ fontSize: 24 }} />
            <Text style={styles.streakNotice}>🔥 Streak updated to 8 Days!</Text>
          </Card>

          <Button title="Return to Dashboard" onPress={() => router.replace('/(tabs)')} style={{ marginTop: 24, width: '100%' }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  content: { padding: 18 },
  qCount: { fontSize: 13, fontWeight: '700', color: '#64748B', marginVertical: 12 },
  qCard: { padding: 18, marginBottom: 16 },
  qText: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  textDark: { color: '#F8FAFC' },
  optionsList: { gap: 10 },
  optionItem: { backgroundColor: '#F1F5F9', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1' },
  optionSelected: { backgroundColor: '#DBEAFE', borderColor: '#2563EB' },
  optionCorrect: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  optionWrong: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  optionText: { fontSize: 15, color: '#334155' },
  optionTextBold: { fontWeight: '800', color: '#0F172A' },
  expCard: { backgroundColor: '#FFFBEB', borderColor: '#F59E0B', borderWidth: 1, padding: 14, marginBottom: 16 },
  expTitle: { fontWeight: '800', color: '#B45309', marginBottom: 4 },
  expBody: { color: '#92400E', fontSize: 13 },
  finishContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  congratsEmoji: { fontSize: 64, marginBottom: 12 },
  congratsTitle: { fontSize: 26, fontWeight: '900', color: '#0F172A', marginBottom: 16 },
  resultCard: { width: '100%', alignItems: 'center', padding: 24 },
  resScoreText: { fontSize: 22, fontWeight: '800', color: '#2563EB', marginBottom: 8 },
  streakNotice: { fontSize: 14, fontWeight: '700', color: '#EF4444', marginTop: 12 },
});
