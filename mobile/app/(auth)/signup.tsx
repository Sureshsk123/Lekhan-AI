import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useToast } from '../../src/contexts/ToastContext';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';

const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati'];

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Hindi');
  const [role, setRole] = useState<'user' | 'parent'>('user');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      showToast('Password must be 8+ chars with uppercase, lowercase, and a number (e.g. Password123)', 'error');
      return;
    }
    try {
      setLoading(true);
      await signup({ name: name.trim(), email: email.trim(), password, targetLanguage, role });
      showToast('Account created successfully!', 'success');
      router.replace('/(tabs)');
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={styles.logo}>🌐 LangSphere</Text>
        <Text style={[styles.title, isDark && styles.textDark]}>Create Account</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          Join thousands learning Indian languages with AI
        </Text>
      </View>

      <View style={styles.form}>
        <Input label="Full Name" placeholder="Rahul Sharma" value={name} onChangeText={setName} />

        <Input
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={[styles.sectionLabel, isDark && styles.textDark]}>Target Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.chip, targetLanguage === lang && styles.chipActive]}
              onPress={() => setTargetLanguage(lang)}
            >
              <Text style={[styles.chipText, targetLanguage === lang && styles.chipTextActive]}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionLabel, isDark && styles.textDark]}>Account Type</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'user' && styles.roleBtnActive]}
            onPress={() => setRole('user')}
          >
            <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>Learner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'parent' && styles.roleBtnActive]}
            onPress={() => setRole('parent')}
          >
            <Text style={[styles.roleText, role === 'parent' && styles.roleTextActive]}>Parent</Text>
          </TouchableOpacity>
        </View>

        <Button title="Get Started" onPress={handleSignup} loading={loading} style={styles.button} />

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.linkText}>Already have an account? <Text style={styles.boldText}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  containerDark: { backgroundColor: '#0F172A' },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 32, fontWeight: '900', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 4 },
  textDark: { color: '#F8FAFC' },
  subtitleDark: { color: '#94A3B8' },
  form: { width: '100%' },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#334155', marginTop: 12, marginBottom: 8 },
  chipRow: { marginBottom: 12 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  chipActive: { backgroundColor: '#2563EB' },
  chipText: { color: '#334155', fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#FFFFFF' },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  roleBtn: { flex: 1, paddingVertical: 12, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center' },
  roleBtnActive: { backgroundColor: '#8B5CF6' },
  roleText: { fontWeight: '700', color: '#334155' },
  roleTextActive: { color: '#FFFFFF' },
  button: { marginTop: 8 },
  linkButton: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#64748B', fontSize: 14 },
  boldText: { color: '#2563EB', fontWeight: '700' },
});
