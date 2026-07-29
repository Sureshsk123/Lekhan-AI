import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useOffline } from '../../contexts/OfflineContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, triggerRetrySync } = useOffline();

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>⚠️ You are currently in Offline Mode</Text>
      <TouchableOpacity style={styles.button} onPress={triggerRetrySync}>
        <Text style={styles.buttonText}>Retry Sync</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
});

export default OfflineBanner;
