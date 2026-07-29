import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Lesson } from '../../src/types';
import lessonService from '../../src/services/lessonService';
import Input from '../../src/components/common/Input';
import Card from '../../src/components/common/Card';
import Badge from '../../src/components/common/Badge';
import ProgressRing from '../../src/components/animations/ProgressRing';

const LANGUAGES = ['All', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];
const LEVELS = ['All', 'beginner', 'intermediate', 'advanced'];

export default function LessonsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, [selectedLang, selectedLevel]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const data = await lessonService.getLessons({
        language: selectedLang === 'All' ? undefined : selectedLang,
        level: selectedLevel === 'All' ? undefined : selectedLevel,
      });
      setLessons(data);
    } catch (err) {
      // Offline mock fallback
      setLessons([
        { _id: 'l1', title: 'Basic Hindi Greetings', description: 'Master essential polite greetings like Namaste and Dhanyavaad.', language: 'Hindi', level: 'beginner', category: 'Grammar', xpReward: 50, estimatedMinutes: 10 },
        { _id: 'l2', title: 'Tamil Numbers & Counting', description: 'Learn numbers 1 to 50 in Tamil script and pronunciation.', language: 'Tamil', level: 'beginner', category: 'Vocabulary', xpReward: 60, estimatedMinutes: 15 },
        { _id: 'l3', title: 'Telugu Verb Conjugations', description: 'Deep dive into present and future tense verbs in Telugu.', language: 'Telugu', level: 'intermediate', category: 'Verbs', xpReward: 100, estimatedMinutes: 20 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.headerTitle, isDark && styles.textDark]}>Lesson Library 📚</Text>

      <Input
        placeholder="Search lessons, topics, vocabulary..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* Language Chips */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={LANGUAGES}
        keyExtractor={(item) => item}
        style={styles.filterBar}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedLang === item && styles.chipActive]}
            onPress={() => setSelectedLang(item)}
          >
            <Text style={[styles.chipText, selectedLang === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Difficulty Filter Row */}
      <View style={styles.levelRow}>
        {LEVELS.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.levelBtn, selectedLevel === lvl && styles.levelBtnActive]}
            onPress={() => setSelectedLevel(lvl)}
          >
            <Text style={[styles.levelText, selectedLevel === lvl && styles.levelTextActive]}>
              {lvl.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={filteredLessons}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/quiz/${item._id}`)}>
              <Card style={styles.lessonCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <Badge label={item.language} variant="primary" />
                    <Badge label={item.level} variant="success" />
                  </View>
                  <ProgressRing progress={item.completed ? 100 : 0} size={36} strokeWidth={4} />
                </View>
                <Text style={[styles.title, isDark && styles.textDark]}>{item.title}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>⚡ {item.xpReward} XP</Text>
                  <Text style={styles.metaText}>⏱️ {item.estimatedMinutes} mins</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  textDark: { color: '#F8FAFC' },
  searchInput: { marginBottom: 12 },
  filterBar: { maxHeight: 40, marginBottom: 10 },
  chip: { backgroundColor: '#E2E8F0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  chipActive: { backgroundColor: '#2563EB' },
  chipText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  chipTextActive: { color: '#FFFFFF' },
  levelRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  levelBtn: { flex: 1, paddingVertical: 6, alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 8 },
  levelBtnActive: { backgroundColor: '#8B5CF6' },
  levelText: { fontSize: 11, fontWeight: '800', color: '#475569' },
  levelTextActive: { color: '#FFFFFF' },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lessonCard: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  title: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  desc: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 8 },
  metaText: { fontSize: 12, fontWeight: '700', color: '#334155' },
});
