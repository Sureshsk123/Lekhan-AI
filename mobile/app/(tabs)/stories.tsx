import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Story } from '../../src/types';
import storyService from '../../src/services/storyService';
import Card from '../../src/components/common/Card';
import Badge from '../../src/components/common/Badge';
import Button from '../../src/components/common/Button';

export default function StoriesScreen() {
  const { isDark } = useTheme();

  const [stories, setStories] = useState<Story[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [activeWord, setActiveWord] = useState<{ word: string; translation: string } | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const data = await storyService.getStories();
      setStories(data);
    } catch (err) {
      setStories([
        {
          _id: 's1',
          title: 'The Wise Crow (चतुर कौआ)',
          language: 'Hindi',
          difficulty: 'easy',
          category: 'Fables',
          content: 'एक बार एक कौआ बहुत प्यासा था। उसे एक घड़ा मिला जिसमें थोड़ा पानी था। कौए ने घड़े में छोटे-छोटे कंकड़ डाले और पानी ऊपर आ गया।',
          englishTranslation: 'Once a crow was very thirsty. He found a pot with a little water. The crow dropped small pebbles into the pot and the water rose up.',
          vocabularyList: [
            { word: 'कौआ', translation: 'Crow' },
            { word: 'प्यासा', translation: 'Thirsty' },
            { word: 'कंकड़', translation: 'Pebbles' },
          ],
          bookmarked: true,
        },
        {
          _id: 's2',
          title: 'The Golden Harvest (பொன் விளைந்தது)',
          language: 'Tamil',
          difficulty: 'medium',
          category: 'Culture',
          content: 'ஒரு கிராமத்தில் அறிவாளி விவசாயி ஒருவன் வாழ்ந்து வந்தான். அவன் தனது நிலத்தில் கடினமாக உழைத்து தங்கம் போன்ற பயிர்களை விளைவித்தான்.',
          englishTranslation: 'In a village lived a wise farmer. He worked hard on his land and produced golden crops.',
          vocabularyList: [
            { word: 'கிராமம்', translation: 'Village' },
            { word: 'விவசாயி', translation: 'Farmer' },
          ],
          bookmarked: false,
        },
      ]);
    }
  };

  const handleToggleBookmark = async (id: string) => {
    try {
      await storyService.toggleBookmark(id);
    } catch (e) {
      // Local optimistic update
    }
    setStories((prev) =>
      prev.map((s) => (s._id === id ? { ...s, bookmarked: !s.bookmarked } : s))
    );
  };

  const handleSpeech = (text: string) => {
    if (isPlayingTTS) {
      Speech.stop();
      setIsPlayingTTS(false);
    } else {
      setIsPlayingTTS(true);
      Speech.speak(text, {
        language: selectedStory?.language === 'Hindi' ? 'hi-IN' : 'ta-IN',
        onDone: () => setIsPlayingTTS(false),
        onError: () => setIsPlayingTTS(false),
      });
    }
  };

  const displayedStories = showBookmarksOnly ? stories.filter((s) => s.bookmarked) : stories;

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.topRow}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Story Library 📖</Text>
        <TouchableOpacity
          style={[styles.bookmarkFilter, showBookmarksOnly && styles.bookmarkFilterActive]}
          onPress={() => setShowBookmarksOnly(!showBookmarksOnly)}
        >
          <Text style={[styles.filterText, showBookmarksOnly && styles.filterTextActive]}>
            🔖 {showBookmarksOnly ? 'Bookmarks' : 'All Stories'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedStories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedStory(item)}>
            <Card style={styles.storyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.badgeRow}>
                  <Badge label={item.language} variant="accent" />
                  <Badge label={item.difficulty} variant="warning" />
                </View>
                <TouchableOpacity onPress={() => handleToggleBookmark(item._id)}>
                  <Text style={{ fontSize: 20 }}>{item.bookmarked ? '🔖' : '🏷️'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.title, isDark && styles.textDark]}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.previewText}>{item.content}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />

      {/* Story Reader Modal */}
      {selectedStory && (
        <Modal visible animationType="slide">
          <View style={[styles.modalContainer, isDark && styles.containerDark]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedStory(null)}>
                <Text style={styles.closeBtn}>✕ Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSpeech(selectedStory.content)}>
                <Text style={styles.ttsBtn}>{isPlayingTTS ? '⏹️ Stop TTS' : '🔊 Listen TTS'}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.storyContentScroll}>
              <Text style={[styles.storyModalTitle, isDark && styles.textDark]}>{selectedStory.title}</Text>

              <View style={styles.toggleRow}>
                <Text style={[styles.toggleLabel, isDark && styles.textDark]}>Show English Translation</Text>
                <TouchableOpacity
                  style={[styles.switch, showTranslation && styles.switchOn]}
                  onPress={() => setShowTranslation(!showTranslation)}
                >
                  <Text style={styles.switchText}>{showTranslation ? 'ON' : 'OFF'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.storyText, isDark && styles.textDark]}>{selectedStory.content}</Text>

              {showTranslation && selectedStory.englishTranslation && (
                <View style={styles.translationBox}>
                  <Text style={styles.translationTitle}>English Translation:</Text>
                  <Text style={styles.translationBody}>{selectedStory.englishTranslation}</Text>
                </View>
              )}

              {/* Vocabulary Popup Cards */}
              {selectedStory.vocabularyList && selectedStory.vocabularyList.length > 0 && (
                <View style={styles.vocabSection}>
                  <Text style={[styles.vocabHeader, isDark && styles.textDark]}>Interactive Vocabulary Popup</Text>
                  <View style={styles.vocabGrid}>
                    {selectedStory.vocabularyList.map((vocab, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.vocabChip}
                        onPress={() => setActiveWord(vocab)}
                      >
                        <Text style={styles.vocabWord}>{vocab.word}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Word Definition Modal Popup */}
            {activeWord && (
              <View style={styles.popupCard}>
                <Text style={styles.popupWord}>{activeWord.word}</Text>
                <Text style={styles.popupTranslation}>Meaning: {activeWord.translation}</Text>
                <Button title="Close Definition" onPress={() => setActiveWord(null)} size="sm" style={{ marginTop: 8 }} />
              </View>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  bookmarkFilter: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#E2E8F0' },
  bookmarkFilterActive: { backgroundColor: '#8B5CF6' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  filterTextActive: { color: '#FFFFFF' },
  storyCard: { marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  previewText: { fontSize: 14, color: '#64748B' },
  modalContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 16 },
  closeBtn: { fontSize: 16, fontWeight: '800', color: '#EF4444' },
  ttsBtn: { fontSize: 15, fontWeight: '800', color: '#2563EB' },
  storyContentScroll: { paddingBottom: 40 },
  storyModalTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: '#334155' },
  switch: { backgroundColor: '#CBD5E1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  switchOn: { backgroundColor: '#10B981' },
  switchText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  storyText: { fontSize: 18, lineHeight: 28, color: '#1E293B', marginBottom: 20 },
  translationBox: { backgroundColor: '#F1F5F9', padding: 16, borderRadius: 12, marginBottom: 20 },
  translationTitle: { fontWeight: '700', color: '#334155', marginBottom: 4 },
  translationBody: { color: '#475569', fontSize: 15, lineHeight: 22 },
  vocabSection: { marginTop: 12 },
  vocabHeader: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  vocabGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vocabChip: { backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  vocabWord: { color: '#6D28D9', fontWeight: '700', fontSize: 15 },
  popupCard: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#0F172A', padding: 18, borderRadius: 16, alignItems: 'center' },
  popupWord: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  popupTranslation: { color: '#94A3B8', fontSize: 15, marginTop: 4 },
});
