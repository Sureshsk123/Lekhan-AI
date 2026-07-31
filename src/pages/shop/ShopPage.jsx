import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import Modal from '../../components/common/Modal';
import { ShoppingBag, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { getShopCatalog, purchaseShopItem } from '../../services/shopService';
import { useAuth } from '../../context/AuthContext';

export const ShopPage = () => {
  const { user, loadUser } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [activeCategory, setActiveCategory] = useState('themes');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const categories = [
    { id: 'themes', label: 'Themes' },
    { id: 'avatars', label: 'Avatars' },
    { id: 'frames', label: 'Frames' },
    { id: 'titles', label: 'Titles' },
    { id: 'boosters', label: 'Boosters' },
    { id: 'badges', label: 'Badges' }
  ];

  useEffect(() => {
    fetchCatalog();
  }, [activeCategory]);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await getShopCatalog(activeCategory);
      if (res && res.data) setCatalog(res.data);
    } catch (err) {
      console.error('Fetch shop catalog error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!selectedItem) return;
    setPurchasing(true);
    try {
      await purchaseShopItem(selectedItem.itemId || selectedItem._id);
      setSelectedItem(null);
      loadUser();
      fetchCatalog();
    } catch (err) {
      console.error('Purchase error:', err);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
                <ShoppingBag className="w-7 h-7 text-emerald-500" /> Epic Item Shop
              </h1>
              <p className="text-xs text-content-tertiary mt-1">Unlock custom themes, frames, avatar cosmetics, and XP multipliers</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-2xl bg-amber-500/10 text-amber-500 font-extrabold text-sm border border-amber-500/20">
                💎 {user?.diamonds || 100} Diamonds
              </span>
            </div>
          </div>

          {/* Categories Tab */}
          <div className="flex gap-2 border-b border-border-light pb-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-500 hover:bg-surface-tertiary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading catalog...</div>
          ) : catalog.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No items available in this category</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalog.map((item) => (
                <GlassCard key={item._id || item.itemId} className="p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-3xl mx-auto shadow-inner">
                      {item.icon || '🛍️'}
                    </div>

                    <div className="text-center">
                      <h3 className="font-bold text-base text-slate-800 dark:text-white">{item.name}</h3>
                      <p className="text-xs text-content-tertiary mt-1">{item.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border-light/60 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-500">💎 {item.price}</span>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-4 py-2 rounded-xl bg-accent-primary text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
                    >
                      Buy Item
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Confirm Purchase">
        {selectedItem && (
          <div className="space-y-4 text-center">
            <p className="text-sm font-medium">
              Are you sure you want to buy <strong className="text-emerald-500">{selectedItem.name}</strong> for{' '}
              <strong className="text-amber-500">💎 {selectedItem.price} Diamonds</strong>?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleBuy}
                disabled={purchasing}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
              >
                {purchasing ? 'Processing...' : 'Confirm Purchase'}
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-3 rounded-2xl bg-surface-tertiary text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      <MobileBottomNav />
    </div>
  );
};

export default ShopPage;
