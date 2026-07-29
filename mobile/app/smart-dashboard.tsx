import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { SmartDashboardData } from '../src/types';
import smartDashboardService from '../src/services/smartDashboardService';
import Header from '../src/components/layout/Header';
import Card from '../src/components/common/Card';
import Badge from '../src/components/common/Badge';

export default function SmartDashboardScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [data, setData] = useState<SmartDashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await smartDashboardService.getSmartDashboard();
      setData(res);
    } catch (e) {
      // Mock fallback
    }
  };

  const activity = data?.dailyActivity || [
    { date: 'Mon', xp: 40, studyMinutes: 20 },
    { date: 'Tue', xp: 75, studyMinutes: 35 },
    { date: 'Wed', xp: 120, studyMinutes: 50 },
    { date: 'Thu', xp: 90, studyMinutes: 40 },
    { date: 'Fri', xp: 110, studyMinutes: 45 },
    { date: 'Sat', xp: 150, studyMinutes: 60 },
    { date: 'Sun', xp: 80, studyMinutes: 30 },
  ];

  const maxXP = Math.max(...activity.map((a) => a.xp), 1);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Smart Dashboard 📊" showBack onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Summary Metrics */}
        <View style={styles.metricsRow}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricEmoji}>⏱️</Text>
            <Text style={styles.metricVal}>{data?.studyHours || 12.5} hrs</Text>
            <Text style={styles.metricLabel}>Study Hours</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricEmoji}>⚡</Text>
            <Text style={styles.metricVal}>{data?.totalXP || 1450}</Text>
            <Text style={styles.metricLabel}>Total XP</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricEmoji}>🔥</Text>
            <Text style={styles.metricVal}>{data?.currentStreak || 7} Days</Text>
            <Text style={styles.metricLabel}>Current Streak</Text>
          </Card>
        </View>

        {/* Weekly Activity Bar Chart */}
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Weekly XP Activity Chart</Text>
        <Card style={styles.chartCard}>
          <View style={styles.barChartContainer}>
            {activity.map((item, idx) => {
              const heightPercent = (item.xp / maxXP) * 100;
              return (
                <View key={idx} style={styles.barCol}>
                  <Text style={styles.barVal}>{item.xp}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${heightPercent}%` }]} />
                  </View>
                  <Text style={styles.barLabel}>{item.date}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Learning Heatmap Grid */}
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>30-Day Activity Heatmap</Text>
        <Card style={styles.heatmapCard}>
          <View style={styles.heatmapGrid}>
            {Array.from({ length: 28 }, (_, i) => {
              const intensity = (i % 4) + 1;
              let bg = '#E2E8F0';
              if (intensity === 2) bg = '#93C5FD';
              if (intensity === 3) bg = '#3B82F6';
              if (intensity === 4) bg = '#1D4ED8';
              return <View key={i} style={[styles.heatBox, { backgroundColor: bg }]} />;
            })}
          </View>
        </Card>

        {/* AI Recommendations */}
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>AI Learning Recommendations</Text>
        {(data?.recommendations || [
          { id: '1', type: 'lesson', title: 'Honorific Pronouns in Hindi', reason: 'Recommended based on your recent quiz errors' },
          { id: '2', type: 'story', title: 'The Tenali Raman Tale', reason: 'Ideal story length for your reading speed' },
        ]).map((rec, i) => (
          <Card key={i} style={styles.recCard}>
            <Badge label={rec.type.toUpperCase()} variant="primary" />
            <Text style={[styles.recTitle, isDark && styles.textDark]}>{rec.title}</Text>
            <Text style={styles.recReason}>💡 {rec.reason}</Text>
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
  metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  metricCard: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  metricEmoji: { fontSize: 20 },
  metricVal: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  metricLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginTop: 12, marginBottom: 10 },
  textDark: { color: '#F8FAFC' },
  chartCard: { paddingVertical: 18, paddingHorizontal: 12, marginBottom: 16 },
  barChartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 160 },
  barCol: { alignItems: 'center', flex: 1 },
  barVal: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 4 },
  barTrack: { width: 14, height: 110, backgroundColor: '#F1F5F9', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { backgroundColor: '#2563EB', width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 11, fontWeight: '700', color: '#334155', marginTop: 6 },
  heatmapCard: { padding: 16, marginBottom: 16 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  heatBox: { width: 34, height: 34, borderRadius: 6 },
  recCard: { marginBottom: 10, padding: 14 },
  recTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginTop: 6, marginBottom: 2 },
  recReason: { fontSize: 12, color: '#64748B' },
});
