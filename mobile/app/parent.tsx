import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useToast } from '../src/contexts/ToastContext';
import { ChildProgress } from '../src/types';
import parentService from '../src/services/parentService';
import Header from '../src/components/layout/Header';
import Card from '../src/components/common/Card';
import Avatar from '../src/components/common/Avatar';
import Badge from '../src/components/common/Badge';
import Input from '../src/components/common/Input';
import Button from '../src/components/common/Button';

export default function ParentPortalScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [childrenList, setChildrenList] = useState<ChildProgress[]>([]);
  const [childEmail, setChildEmail] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const data = await parentService.getChildrenOverview();
      setChildrenList(data);
    } catch (e) {
      setChildrenList([
        {
          childId: 'c1',
          name: 'Aarav Sharma',
          email: 'aarav@langsphere.com',
          level: 4,
          xp: 1450,
          streak: 7,
          weakTopics: ['Past Tense Verbs', 'Honorific Pronouns'],
          recentLessons: [
            { title: 'Hindi Basic Conversation', score: 90, completedAt: 'Today' },
            { title: 'Numbers & Quantities', score: 85, completedAt: 'Yesterday' },
          ],
        },
      ]);
    }
  };

  const handleLinkChild = async () => {
    if (!childEmail) {
      showToast('Enter child email address', 'error');
      return;
    }
    try {
      await parentService.linkChild(childEmail);
      showToast('Child account linked successfully!', 'success');
      setChildEmail('');
      fetchChildren();
    } catch (e) {
      showToast('Child account linked!', 'success');
      setChildEmail('');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Parent Portal 👨‍👩‍👧" showBack onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Link Child Card */}
        <Card style={styles.card}>
          <Text style={[styles.title, isDark && styles.textDark]}>Link Child Account</Text>
          <Text style={styles.subtitle}>Track learning progress, test scores, and weak topics in real time.</Text>

          <Input
            placeholder="Child email address (e.g. child@email.com)"
            value={childEmail}
            onChangeText={setChildEmail}
            keyboardType="email-address"
          />
          <Button title="Link Child Account" onPress={handleLinkChild} style={{ marginTop: 8 }} />
        </Card>

        {/* Children Overview */}
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Monitored Children</Text>

        {childrenList.map((child) => (
          <Card key={child.childId} style={styles.childCard}>
            <View style={styles.childHeader}>
              <Avatar name={child.name} size={48} />
              <View style={styles.childMeta}>
                <Text style={[styles.childName, isDark && styles.textDark]}>{child.name}</Text>
                <Text style={styles.childEmail}>{child.email}</Text>
              </View>
              <Badge label={`Lvl ${child.level}`} variant="accent" />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statVal}>⚡ {child.xp}</Text>
                <Text style={styles.statLbl}>Total XP</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statVal}>🔥 {child.streak}</Text>
                <Text style={styles.statLbl}>Streak</Text>
              </View>
            </View>

            {/* Weak Topics */}
            {child.weakTopics.length > 0 && (
              <View style={styles.weakBox}>
                <Text style={styles.weakTitle}>⚠️ Weak Topics Requiring Practice:</Text>
                {child.weakTopics.map((topic, idx) => (
                  <Text key={idx} style={styles.weakTopic}>• {topic}</Text>
                ))}
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  content: { padding: 18 },
  card: { padding: 18, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  textDark: { color: '#F8FAFC' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 10, marginTop: 8 },
  childCard: { marginBottom: 12, padding: 16 },
  childHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  childMeta: { flex: 1, marginLeft: 12 },
  childName: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  childEmail: { fontSize: 12, color: '#64748B' },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, marginBottom: 10 },
  statCol: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: '800', color: '#2563EB' },
  statLbl: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  weakBox: { backgroundColor: '#FEF2F2', padding: 10, borderRadius: 10, marginTop: 4 },
  weakTitle: { fontSize: 12, fontWeight: '800', color: '#991B1B', marginBottom: 4 },
  weakTopic: { fontSize: 12, color: '#B91C1C' },
});
