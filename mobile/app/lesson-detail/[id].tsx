import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Lesson } from '../../src/types';
import lessonService from '../../src/services/lessonService';
import Header from '../../src/components/layout/Header';
import Card from '../../src/components/common/Card';
import Badge from '../../src/components/common/Badge';
import Button from '../../src/components/common/Button';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();

  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      if (id) {
        const data = await lessonService.getLessonById('Hindi', id);
        setLesson(data);
      }
    } catch (e) {
      setLesson({
        _id: id || 'l1',
        title: 'Essential Polite Expressions',
        description: 'Master polite Indian language greetings and social customs.',
        language: 'Hindi',
        level: 'beginner',
        category: 'Conversation',
        xpReward: 50,
        estimatedMinutes: 10,
      });
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Lesson View 📚" showBack onBack={() => router.back()} />

      {lesson && (
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <View style={styles.badgeRow}>
              <Badge label={lesson.language} variant="primary" />
              <Badge label={lesson.level} variant="success" />
            </View>

            <Text style={[styles.title, isDark && styles.textDark]}>{lesson.title}</Text>
            <Text style={styles.desc}>{lesson.description}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>⚡ {lesson.xpReward} XP</Text>
              <Text style={styles.infoText}>⏱️ {lesson.estimatedMinutes} Mins</Text>
            </View>

            <Button title="Take Lesson Quiz" onPress={() => router.push(`/quiz/${lesson._id}`)} style={{ marginTop: 18 }} />
          </Card>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  content: { padding: 18 },
  card: { padding: 20 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  textDark: { color: '#F8FAFC' },
  desc: { fontSize: 15, color: '#64748B', lineHeight: 22, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  infoText: { fontSize: 14, fontWeight: '700', color: '#334155' },
});
