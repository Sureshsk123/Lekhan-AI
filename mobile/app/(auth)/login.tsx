import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useToast } from '../../src/contexts/ToastContext';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { login, rememberMe, setRememberMe } = useAuth();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [email, setEmail] = useState('demo@langsphere.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }
    try {
      setLoading(true);
      await login(email, password, rememberMe);
      showToast('Welcome back to LangSphere!', 'success');
      router.replace('/(tabs)');
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={styles.logo}>🌐 LangSphere</Text>
        <Text style={[styles.title, isDark && styles.textDark]}>Welcome Back</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          Master Indian Languages through AI-Powered Learning
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.rememberRow}>
          <Text style={[styles.rememberText, isDark && styles.textDark]}>Remember Me</Text>
          <Switch value={rememberMe} onValueChange={setRememberMe} trackColor={{ true: '#2563EB' }} />
        </View>

        <Button title="Sign In" onPress={handleLogin} loading={loading} style={styles.button} />

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.boldText}>Sign Up</Text></Text>
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
  containerDark: {
    backgroundColor: '#0F172A',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  textDark: { color: '#F8FAFC' },
  subtitleDark: { color: '#94A3B8' },
  form: {
    width: '100%',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  rememberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  button: {
    marginTop: 12,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#64748B',
    fontSize: 14,
  },
  boldText: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
