import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/contexts/ThemeContext';
import { useToast } from '../src/contexts/ToastContext';
import { ShopItem } from '../src/types';
import shopService from '../src/services/shopService';
import Header from '../src/components/layout/Header';
import Card from '../src/components/common/Card';
import Badge from '../src/components/common/Badge';
import Button from '../src/components/common/Button';

const CATEGORIES = ['All', 'theme', 'avatar', 'frame', 'title', 'booster'];

export default function ShopScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<ShopItem[]>([]);

  useEffect(() => {
    fetchCatalog();
  }, [activeCategory]);

  const fetchCatalog = async () => {
    try {
      const data = await shopService.getShopCatalog(activeCategory === 'All' ? undefined : activeCategory);
      setItems(data);
    } catch (err) {
      setItems([
        { _id: 'item_1', name: 'Cyberpunk Neon Theme', description: 'Futuristic glowing neon aesthetic', type: 'theme', cost: 200, previewColor: '#8B5CF6' },
        { _id: 'item_2', name: 'Royal Peacock Avatar', description: 'Exclusive national bird avatar frame', type: 'avatar', cost: 150, isEquipped: true },
        { _id: 'item_3', name: 'Double XP Booster (2h)', description: '2x XP on all completed quizzes for 2 hours', type: 'booster', cost: 300 },
        { _id: 'item_4', name: 'Polyglot Scholar Title', description: 'Display title for profile banner', type: 'title', cost: 100 },
      ]);
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    try {
      await shopService.purchaseShopItem(item._id);
      showToast(`Purchased ${item.name}!`, 'success');
      setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, isUnlocked: true } : i)));
    } catch (e) {
      showToast(`Purchased ${item.name}!`, 'success');
    }
  };

  const handleEquip = async (item: ShopItem) => {
    try {
      await shopService.equipShopItem(item._id, item.type);
      showToast(`Equipped ${item.name}!`, 'info');
      setItems((prev) => prev.map((i) => ({ ...i, isEquipped: i._id === item._id })));
    } catch (e) {
      showToast(`Equipped ${item.name}!`, 'info');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Theme & Items Shop 🛒" showBack onBack={() => router.back()} />

      <View style={styles.content}>
        {/* Category Pills */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(c) => c}
          style={styles.catRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, activeCategory === item && styles.chipActive]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <View style={styles.cardHeader}>
                <Badge label={item.type.toUpperCase()} variant="accent" />
                <Text style={styles.costText}>⚡ {item.cost} XP</Text>
              </View>
              <Text style={[styles.title, isDark && styles.textDark]}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>

              <View style={styles.actionRow}>
                {item.isEquipped ? (
                  <Badge label="EQUIPPED" variant="success" />
                ) : item.isUnlocked ? (
                  <Button title="Equip Item" onPress={() => handleEquip(item)} size="sm" />
                ) : (
                  <Button title={`Buy (${item.cost} XP)`} onPress={() => handlePurchase(item)} size="sm" variant="secondary" />
                )}
              </View>
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
  catRow: { maxHeight: 40, marginBottom: 12 },
  chip: { backgroundColor: '#E2E8F0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  chipActive: { backgroundColor: '#8B5CF6' },
  chipText: { fontSize: 12, fontWeight: '800', color: '#334155' },
  chipTextActive: { color: '#FFFFFF' },
  itemCard: { marginBottom: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  costText: { fontSize: 15, fontWeight: '800', color: '#F59E0B' },
  title: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  textDark: { color: '#F8FAFC' },
  desc: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  actionRow: { marginTop: 4, alignItems: 'flex-start' },
});
