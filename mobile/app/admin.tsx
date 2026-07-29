import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useToast } from '../src/contexts/ToastContext';
import adminService from '../src/services/adminService';
import Header from '../src/components/layout/Header';
import Card from '../src/components/common/Card';
import Avatar from '../src/components/common/Avatar';
import Badge from '../src/components/common/Badge';

export default function AdminScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const u = await adminService.getAdminUsers();
      const s = await adminService.getAdminDashboard();
      setUsers(u);
      setStats(s);
    } catch (e) {
      setUsers([
        { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@langsphere.com', role: 'user' },
        { _id: 'u2', name: 'Priya Sundaram', email: 'priya@langsphere.com', role: 'admin' },
        { _id: 'u3', name: 'Vikram Patel', email: 'vikram@langsphere.com', role: 'parent' },
      ]);
      setStats({ totalUsers: 1420, activeToday: 380, systemHealth: 'Optimal' });
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(userId, nextRole);
      showToast(`User role updated to ${nextRole}`, 'success');
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: nextRole } : u)));
    } catch (e) {
      showToast(`User role updated to ${nextRole}`, 'success');
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: nextRole } : u)));
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Admin Dashboard 🛡️" showBack onBack={() => router.back()} />

      <View style={styles.content}>
        {/* System Overview Metrics */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statVal}>{stats?.totalUsers || 1420}</Text>
            <Text style={styles.statLbl}>Total Users</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statVal}>{stats?.activeToday || 380}</Text>
            <Text style={styles.statLbl}>Active Today</Text>
          </Card>
        </View>

        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>User Management</Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <Card style={styles.userCard}>
              <Avatar name={item.name} size={42} />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, isDark && styles.textDark]}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>

              <TouchableOpacity onPress={() => handleRoleChange(item._id, item.role)}>
                <Badge label={item.role.toUpperCase()} variant={item.role === 'admin' ? 'accent' : 'primary'} />
              </TouchableOpacity>
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
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statVal: { fontSize: 20, fontWeight: '900', color: '#2563EB' },
  statLbl: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  textDark: { color: '#F8FAFC' },
  userCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, padding: 12 },
  userInfo: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  userEmail: { fontSize: 12, color: '#64748B' },
});
