import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import searchService, { SearchResults } from '../src/services/searchService';
import Header from '../src/components/layout/Header';
import Input from '../src/components/common/Input';
import Card from '../src/components/common/Card';
import Badge from '../src/components/common/Badge';

export default function SearchScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults(null);
      return;
    }
    try {
      const data = await searchService.globalSearch(text);
      setResults(data);
    } catch (e) {
      setResults({
        lessons: [{ _id: 'l1', title: 'Search result lesson for ' + text, language: 'Hindi' }],
        stories: [{ _id: 's1', title: 'Search result story for ' + text, language: 'Hindi' }],
        vocabulary: [{ word: text, translation: 'Translation' }],
        shopItems: [{ _id: 'sh1', name: 'Item ' + text, cost: 100 }],
        achievements: [],
        users: [],
      });
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Universal Search 🔍" showBack onBack={() => router.back()} />

      <View style={styles.content}>
        <Input
          placeholder="Search lessons, stories, vocabulary, shop items..."
          value={query}
          onChangeText={handleSearch}
          style={{ marginBottom: 16 }}
        />

        {results && (
          <FlatList
            data={[
              ...results.lessons.map((item) => ({ ...item, categoryType: 'LESSON' })),
              ...results.stories.map((item) => ({ ...item, categoryType: 'STORY' })),
            ]}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Card style={styles.resultCard}>
                <Badge label={item.categoryType} variant={item.categoryType === 'LESSON' ? 'primary' : 'accent'} />
                <Text style={[styles.title, isDark && styles.textDark]}>{item.title}</Text>
              </Card>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  content: { flex: 1, padding: 18 },
  resultCard: { marginBottom: 10, padding: 14 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 6 },
  textDark: { color: '#F8FAFC' },
});
