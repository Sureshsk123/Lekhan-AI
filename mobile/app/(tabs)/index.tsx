import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import Card from '../../src/components/common/Card';
import Avatar from '../../src/components/common/Avatar';
import Badge from '../../src/components/common/Badge';
import ProgressBar from '../../src/components/common/ProgressBar';
import XPCounter from '../../src/components/animations/XPCounter';
import ProgressRing from '../../src/components/animations/ProgressRing';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const xp = user?.xp || 0;
  const coins = user?.coins || 0;
  const streak = user?.streak || 0;
  const goalProgress = user?.dailyGoalProgress || 100;
  const userName = user?.fullName || user?.name || 'Learner';

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.userRow}>
          <Avatar name={userName} url={user?.avatarUrl} size={44} />
          <View style={styles.userTextCol}>
            <Text style={[styles.greeting, isDark && styles.textDark]}>
              Namaste, {userName.split(' ')[0]}! 👋
            </Text>
            <Text style={styles.subGreeting}>Language: {user?.targetLanguage || 'Tamil'}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.iconBtn}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Top Stats Cards */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <XPCounter xp={xp} />
          <Text style={styles.statLabel}>Daily XP</Text>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.streakVal}>🔥 {streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </Card>

        <Card style={styles.statCard}>
          <ProgressRing progress={goalProgress} size={42} strokeWidth={5} />
          <Text style={styles.statLabel}>Today's Goal</Text>
        </Card>
      </View>

      {/* AI Tutor Shortcut Banner */}
      <TouchableOpacity onPress={() => router.push('/(tabs)/ai-tutor')}>
        <Card style={styles.aiBanner}>
          <View style={styles.aiBannerLeft}>
            <Text style={styles.aiTitle}>🤖 AI Tutor Assistant</Text>
            <Text style={styles.aiSubtitle}>Ask any grammar, translation or sentence structure question</Text>
          </View>
          <Text style={styles.arrowText}>→</Text>
        </Card>
      </TouchableOpacity>

      {/* Quick Tool Hub */}
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Interactive AI Tools</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolRow}>
        <TouchableOpacity style={styles.toolChip} onPress={() => router.push('/voice')}>
          <Text style={styles.toolEmoji}>🎙️</Text>
          <Text style={styles.toolText}>Voice Practice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolChip} onPress={() => router.push('/smart-dashboard')}>
          <Text style={styles.toolEmoji}>📊</Text>
          <Text style={styles.toolText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolChip} onPress={() => router.push('/shop')}>
          <Text style={styles.toolEmoji}>🛒</Text>
          <Text style={styles.toolText}>Shop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolChip} onPress={() => router.push('/leaderboard')}>
          <Text style={styles.toolEmoji}>🏆</Text>
          <Text style={styles.toolText}>Leaderboard</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Continue Learning & Daily Challenge */}
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Daily Challenge</Text>
      <Card style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <Badge label="100 XP" variant="warning" />
          <Text style={styles.challengeTime}>Expires in 8h</Text>
        </View>
        <Text style={[styles.cardTitle, isDark && styles.textDark]}>Master 5 Food & Dining Phrases</Text>
        <Text style={styles.cardDesc}>Complete today's daily quiz to double your streak bonus.</Text>
        <ProgressBar progress={0.6} height={6} color="#10B981" />
        <TouchableOpacity style={styles.challengeBtn} onPress={() => router.push('/quiz/daily_1')}>
          <Text style={styles.challengeBtnText}>Start Challenge</Text>
        </TouchableOpacity>
      </Card>

      {/* Recommended Lesson & Story */}
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Recommended Content</Text>

      <TouchableOpacity onPress={() => router.push('/(tabs)/lessons')}>
        <Card style={styles.recCard}>
          <View style={styles.recBadgeRow}>
            <Badge label="LESSON" variant="primary" />
            <Badge label="Beginner" variant="success" />
          </View>
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>Essential Greetings & Etiquette</Text>
          <Text style={styles.cardDesc}>Learn common polite phrases, formal hellos, and thank yous.</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)/stories')}>
        <Card style={styles.recCard}>
          <View style={styles.recBadgeRow}>
            <Badge label="STORY" variant="accent" />
            <Badge label="Bilingual" variant="warning" />
          </View>
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>The Wise Farmer & The Golden Goose</Text>
          <Text style={styles.cardDesc}>Interactive story with audio TTS and vocabulary popup reader.</Text>
        </Card>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userTextCol: { marginLeft: 12 },
  greeting: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  subGreeting: { fontSize: 13, color: '#64748B' },
  textDark: { color: '#F8FAFC' },
  iconBtn: { padding: 8, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 4 },
  streakVal: { fontSize: 18, fontWeight: '800', color: '#EF4444' },
  aiBanner: { backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, marginBottom: 16 },
  aiBannerLeft: { flex: 1 },
  aiTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  aiSubtitle: { color: '#DBEAFE', fontSize: 12, marginTop: 4 },
  arrowText: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginLeft: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginTop: 12, marginBottom: 10 },
  toolRow: { marginBottom: 16 },
  toolChip: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, marginRight: 10, alignItems: 'center', flexDirection: 'row', gap: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  toolEmoji: { fontSize: 16 },
  toolText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  challengeCard: { marginBottom: 16 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  challengeTime: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#64748B', marginBottom: 10 },
  challengeBtn: { backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  challengeBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  recCard: { marginBottom: 12 },
  recBadgeRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
});
