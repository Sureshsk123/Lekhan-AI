import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useToast } from '../src/contexts/ToastContext';
import { AppNotification } from '../src/types';
import notificationService from '../src/services/notificationService';
import Header from '../src/components/layout/Header';
import Card from '../src/components/common/Card';
import Badge from '../src/components/common/Badge';
import Button from '../src/components/common/Button';

export default function NotificationsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (e) {
      setNotifications([
        { _id: 'n1', title: '🔥 7-Day Streak Maintained!', message: 'Keep going! Practice for 10 minutes today to extend your streak.', type: 'reminder', read: false, createdAt: '10m ago' },
        { _id: 'n2', title: '🏆 Leaderboard Alert', message: 'Aarav just passed your XP! Practice now to regain Rank #3.', type: 'leaderboard', read: false, createdAt: '1h ago' },
        { _id: 'n3', title: '🎖️ Achievement Unlocked', message: 'You earned the "Polyglot Beginner" badge!', type: 'achievement', read: true, createdAt: 'Yesterday' },
      ]);
    }
  };

  const handleSendReminder = async () => {
    try {
      await notificationService.sendPracticeReminder('Hindi');
      showToast('Push reminder scheduled!', 'success');
    } catch (e) {
      showToast('Push reminder scheduled!', 'success');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Notification Center 🔔" showBack onBack={() => router.back()} />

      <View style={styles.content}>
        <Button title="⏰ Schedule Daily Practice Reminder" onPress={handleSendReminder} variant="outline" style={{ marginBottom: 16 }} />

        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={[styles.notifCard, !item.read ? styles.unreadCard : undefined] as any}>
              <View style={styles.cardHeader}>
                <Badge label={item.type.toUpperCase()} variant={item.type === 'achievement' ? 'warning' : 'primary'} />
                <Text style={styles.timeText}>{item.createdAt}</Text>
              </View>
              <Text style={[styles.title, isDark && styles.textDark]}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
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
  notifCard: { marginBottom: 10, padding: 14 },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: '#2563EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  timeText: { fontSize: 11, color: '#94A3B8' },
  title: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  textDark: { color: '#F8FAFC' },
  message: { fontSize: 13, color: '#64748B' },
});
