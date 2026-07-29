import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
}) => {
  const { isDark } = useTheme();

  return (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backText, isDark && styles.textDark]}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerDark: {
    backgroundColor: '#0F172A',
    borderBottomColor: '#1E293B',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backText: {
    fontSize: 24,
    color: '#0F172A',
    fontWeight: '600',
  },
  textDark: {
    color: '#F8FAFC',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  titleDark: {
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  subtitleDark: {
    color: '#94A3B8',
  },
  rightContainer: {
    marginLeft: 12,
  },
});

export default Header;
