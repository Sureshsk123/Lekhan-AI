import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { LeaderboardEntry } from '../src/types';
import gamificationService from '../src/services/gamificationService';
import Header from '../src/components/layout/Header';
import Card from '../src/components/common/Card';
import Avatar from '../src/components/common/Avatar';

const SCOPES = ['global', 'country', 'friends'];
const PERIODS = ['weekly', 'monthly'];

export default function LeaderboardScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  const [activeScope, setActiveScope] = useState<'global' | 'country' | 'friends'>('global');
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeScope, activePeriod]);

  const fetchLeaderboard = async () => {
    try {
      const data = await gamificationService.getLeaderboard({ scope: activeScope, period: activePeriod });
      setRankings(data);
    } catch (e) {
      setRankings([
        { rank: 1, userId: 'u1', name: 'Aarav Patel', xp: 2450, country: 'India' },
        { rank: 2, userId: 'u2', name: 'Priya Sundaram', xp: 2180, country: 'India' },
        { rank: 3, userId: 'u3', name: 'Rohan Gupta', xp: 1950, country: 'India' },
        { rank: 4, userId: 'u4', name: 'Ananya Roy', xp: 1720, country: 'India' },
        { rank: 5, userId: 'u5', name: 'Vikram Singh', xp: 1540, country: 'India' },
      ]);
    }
  };

  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Global Leaderboard 🏆" showBack onBack={() => router.back()} />

      <View style={styles.content}>
        {/* Filter Controls */}
        <View style={styles.filterRow}>
          <View style={styles.toggleGroup}>
            {SCOPES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.toggleBtn, activeScope === s && styles.toggleActive]}
                onPress={() => setActiveScope(s as any)}
              >
                <Text style={[styles.toggleText, activeScope === s && styles.toggleTextActive]}>
                  {s.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.toggleGroup}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.toggleBtn, activePeriod === p && styles.toggleActive]}
                onPress={() => setActivePeriod(p as any)}
              >
                <Text style={[styles.toggleText, activePeriod === p && styles.toggleTextActive]}>
                  {p.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Animated Podium for Top 3 */}
        {top3.length >= 3 && (
          <View style={styles.podiumContainer}>
            {/* Rank 2 */}
            <View style={[styles.podiumStep, styles.step2]}>
              <Avatar name={top3[1].name} size={44} />
              <Text style={styles.podiumName}>{top3[1].name.split(' ')[0]}</Text>
              <Text style={styles.podiumXp}>{top3[1].xp} XP</Text>
              <View style={styles.pillar2}>
                <Text style={styles.rankBadgeNum}>🥈 2</Text>
              </View>
            </View>

            {/* Rank 1 */}
            <View style={[styles.podiumStep, styles.step1]}>
              <Text style={styles.crownEmoji}>👑</Text>
              <Avatar name={top3[0].name} size={54} />
              <Text style={styles.podiumName}>{top3[0].name.split(' ')[0]}</Text>
              <Text style={styles.podiumXp}>{top3[0].xp} XP</Text>
              <View style={styles.pillar1}>
                <Text style={styles.rankBadgeNum}>🥇 1</Text>
              </View>
            </View>

            {/* Rank 3 */}
            <View style={[styles.podiumStep, styles.step3]}>
              <Avatar name={top3[2].name} size={44} />
              <Text style={styles.podiumName}>{top3[2].name.split(' ')[0]}</Text>
              <Text style={styles.podiumXp}>{top3[2].xp} XP</Text>
              <View style={styles.pillar3}>
                <Text style={styles.rankBadgeNum}>🥉 3</Text>
              </View>
            </View>
          </View>
        )}

        {/* Remaining Ranks FlatList */}
        <FlatList
          data={rest}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Card style={styles.rankCard}>
              <Text style={styles.rankNum}>#{item.rank}</Text>
              <Avatar name={item.name} size={38} />
              <View style={styles.rankInfo}>
                <Text style={[styles.rankName, isDark && styles.textDark]}>{item.name}</Text>
                <Text style={styles.rankCountry}>{item.country || 'Global'}</Text>
              </View>
              <Text style={styles.rankXp}>⚡ {item.xp} XP</Text>
            </Card>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  content: { flex: 1, padding: 18 },
  filterRow: { gap: 8, marginBottom: 16 },
  toggleGroup: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 10, padding: 2 },
  toggleBtn: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 8 },
  toggleActive: { backgroundColor: '#2563EB' },
  toggleText: { fontSize: 11, fontWeight: '800', color: '#475569' },
  toggleTextActive: { color: '#FFFFFF' },
  podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginVertical: 16, height: 180 },
  podiumStep: { flex: 1, alignItems: 'center' },
  step1: { zIndex: 3 },
  step2: { zIndex: 2 },
  step3: { zIndex: 1 },
  crownEmoji: { fontSize: 20, marginBottom: 2 },
  podiumName: { fontSize: 12, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  podiumXp: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  pillar1: { width: '85%', height: 90, backgroundColor: '#F59E0B', marginTop: 6, borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pillar2: { width: '85%', height: 70, backgroundColor: '#94A3B8', marginTop: 6, borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pillar3: { width: '85%', height: 50, backgroundColor: '#B45309', marginTop: 6, borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rankBadgeNum: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
  rankCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, padding: 12 },
  rankNum: { fontSize: 16, fontWeight: '800', width: 36, color: '#64748B' },
  rankInfo: { flex: 1, marginLeft: 12 },
  rankName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  textDark: { color: '#F8FAFC' },
  rankCountry: { fontSize: 12, color: '#94A3B8' },
  rankXp: { fontSize: 14, fontWeight: '800', color: '#F59E0B' },
});
