import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useToast } from '../../src/contexts/ToastContext';
import Avatar from '../../src/components/common/Avatar';
import Card from '../../src/components/common/Card';
import Badge from '../../src/components/common/Badge';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/Input';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const { themeMode, setThemeMode, isDark } = useTheme();
  const { showToast } = useToast();

  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState(user?.name || 'Learner');
  const [targetLang, setTargetLang] = useState(user?.targetLanguage || 'Hindi');

  const handleSaveProfile = async () => {
    await updateUser({ name, targetLanguage: targetLang });
    setEditModal(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out', 'info');
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {/* Header Profile Info */}
      <Card style={styles.profileCard}>
        <Avatar name={user?.name || 'Learner'} url={user?.avatarUrl} size={72} />
        <Text style={[styles.name, isDark && styles.textDark]}>{user?.name || 'Learner'}</Text>
        <Text style={styles.email}>{user?.email || 'learner@langsphere.com'}</Text>
        <View style={styles.badgeRow}>
          <Badge label={user?.equippedTitle || 'Master Linguist'} variant="accent" />
          <Badge label={user?.role?.toUpperCase() || 'LEARNER'} variant="primary" />
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => setEditModal(true)}>
          <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
        </TouchableOpacity>
      </Card>

      {/* Main Stats Grid */}
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Player Statistics 📊</Text>
      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Text style={styles.statEmoji}>⚡</Text>
          <Text style={styles.statNum}>{user?.xp || 420}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </Card>
        <Card style={styles.statBox}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statNum}>{user?.streak || 7}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </Card>
        <Card style={styles.statBox}>
          <Text style={styles.statEmoji}>🥇</Text>
          <Text style={styles.statNum}>Rank #{user?.level || 4}</Text>
          <Text style={styles.statLabel}>Global Rank</Text>
        </Card>
      </View>

      {/* Theme Preference Toggle */}
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>App Appearance 🎨</Text>
      <Card style={styles.themeRow}>
        <TouchableOpacity
          style={[styles.themeChip, themeMode === 'light' && styles.themeChipActive]}
          onPress={() => setThemeMode('light')}
        >
          <Text style={[styles.themeText, themeMode === 'light' && styles.themeTextActive]}>☀️ Light</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.themeChip, themeMode === 'dark' && styles.themeChipActive]}
          onPress={() => setThemeMode('dark')}
        >
          <Text style={[styles.themeText, themeMode === 'dark' && styles.themeTextActive]}>🌙 Dark</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.themeChip, themeMode === 'system' && styles.themeChipActive]}
          onPress={() => setThemeMode('system')}
        >
          <Text style={[styles.themeText, themeMode === 'system' && styles.themeTextActive]}>⚙️ System</Text>
        </TouchableOpacity>
      </Card>

      {/* Quick Navigation Links */}
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Portal Links 🌐</Text>
      <Card style={styles.linksCard}>
        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/parent')}>
          <Text style={styles.linkIcon}>👨‍👩‍👧</Text>
          <Text style={[styles.linkTitle, isDark && styles.textDark]}>Parent Portal</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/admin')}>
          <Text style={styles.linkIcon}>🛡️</Text>
          <Text style={[styles.linkTitle, isDark && styles.textDark]}>Admin Console</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/reports')}>
          <Text style={styles.linkIcon}>📄</Text>
          <Text style={[styles.linkTitle, isDark && styles.textDark]}>Learning Reports & PDF</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
      </Card>

      <Button title="Sign Out" onPress={handleLogout} variant="danger" style={{ marginVertical: 20 }} />

      {/* Edit Profile Modal */}
      {editModal && (
        <Modal visible animationType="slide" transparent>
          <View style={styles.modalBg}>
            <View style={[styles.modalCard, isDark && styles.containerDark]}>
              <Text style={[styles.modalTitle, isDark && styles.textDark]}>Edit Profile</Text>
              <Input label="Name" value={name} onChangeText={setName} />
              <Input label="Target Language" value={targetLang} onChangeText={setTargetLang} />
              <View style={styles.modalBtnRow}>
                <Button title="Cancel" onPress={() => setEditModal(false)} variant="outline" style={{ flex: 1 }} />
                <Button title="Save" onPress={handleSaveProfile} style={{ flex: 1 }} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  profileCard: { alignItems: 'center', paddingVertical: 20 },
  name: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginTop: 10 },
  email: { fontSize: 13, color: '#64748B', marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  editBtn: { marginTop: 14, backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  editBtnText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  textDark: { color: '#F8FAFC' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 10 },
  statsGrid: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statEmoji: { fontSize: 22 },
  statNum: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 2 },
  themeRow: { flexDirection: 'row', gap: 8, padding: 8 },
  themeChip: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10 },
  themeChipActive: { backgroundColor: '#2563EB' },
  themeText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  themeTextActive: { color: '#FFFFFF' },
  linksCard: { padding: 4 },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  linkIcon: { fontSize: 18, marginRight: 12 },
  linkTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#0F172A' },
  linkArrow: { fontSize: 18, color: '#94A3B8' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 14 },
  modalBtnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
});
