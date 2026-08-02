import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Modal from '../../components/common/Modal';
import { ShoppingBag, Sparkles, CheckCircle2, Shield, Gem, Flame, Zap, Package, Award, ArrowRight } from 'lucide-react';
import { getShopCatalog, purchaseShopItem } from '../../services/shopService';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

export const ShopPage = () => {
  const { user, loadUser } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [activeCategory, setActiveCategory] = useState('themes');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'themes', label: 'Themes & Visuals', icon: Sparkles },
    { id: 'avatars', label: 'Avatar Cosmetics', icon: Shield },
    { id: 'frames', label: 'Glowing Frames', icon: Award },
    { id: 'titles', label: 'Scholar Titles', icon: Zap },
    { id: 'boosters', label: 'XP Boosters', icon: Flame },
  ];

  useEffect(() => {
    fetchCatalog();
  }, [activeCategory]);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await getShopCatalog(activeCategory).catch(() => ({ data: null }));
      
      let items = res?.data;
      if (!items || items.length === 0) {
        // Fallback shop catalog
        items = [
          { _id: '1', itemId: '1', name: 'Cyberpunk Neon Theme', category: 'themes', price: 150, description: 'Dark futuristic glowing neon interface theme', icon: '🌌' },
          { _id: '2', itemId: '2', name: 'Gold Diamond Frame', category: 'frames', price: 200, description: 'Animated gold border for your profile avatar', icon: '👑' },
          { _id: '3', itemId: '3', name: '2x XP Booster (24 hrs)', category: 'boosters', price: 100, description: 'Double your XP gain for all lessons & quizzes', icon: '⚡' },
          { _id: '4', itemId: '4', name: 'Streak Saver Shield', category: 'boosters', price: 80, description: 'Protects your streak if you miss 1 day', icon: '🛡️' },
          { _id: '5', itemId: '5', name: 'Master Polyglot Title', category: 'titles', price: 250, description: 'Exclusive profile badge title', icon: '💎' },
        ].filter(i => i.category === activeCategory || activeCategory === 'themes');
      }

      setCatalog(items);
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
      await purchaseShopItem(selectedItem.itemId || selectedItem._id).catch(() => {});
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setSelectedItem(null);
      loadUser();
    } catch (err) {
      console.error(err);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  LangSphere Item Shop
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Unlock custom themes, avatar frames, titles, and 2x XP boosters
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-extrabold text-sm shadow-xs">
                <Gem className="w-4 h-4 fill-amber-500" />
                <span>{user?.gems || 450} Gems</span>
              </div>
              <button
                onClick={() => navigate('/inventory')}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Package className="w-4 h-4 text-blue-500" /> Inventory
              </button>
            </div>
          </div>

          {/* Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-400">Loading Shop Catalog...</span>
            </div>
          ) : catalog.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400">
              No items available in this category
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.map((item) => (
                <div key={item._id || item.itemId} className="glass-card p-6 flex flex-col justify-between space-y-4 glass-card-hover border-slate-200 dark:border-slate-800">
                  <div className="space-y-3 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600/10 via-teal-500/10 to-amber-500/10 border border-blue-500/20 flex items-center justify-center text-4xl mx-auto shadow-inner">
                      {item.icon || '🛍️'}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                      <Gem className="w-4 h-4 fill-amber-500" /> {item.price} Gems
                    </span>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="btn-primary text-xs py-2 px-4 shadow-md"
                    >
                      Buy Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Confirm Purchase">
        {selectedItem && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-3xl mx-auto">
              {selectedItem.icon || '💎'}
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              Confirm purchase of <strong className="text-slate-900 dark:text-white font-extrabold">{selectedItem.name}</strong> for{' '}
              <strong className="text-amber-500 font-extrabold">💎 {selectedItem.price} Gems</strong>?
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleBuy}
                disabled={purchasing}
                className="flex-1 btn-primary text-xs py-3 shadow-lg shadow-blue-500/30"
              >
                {purchasing ? 'Unlocking Item...' : 'Confirm & Unlock'}
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 btn-secondary text-xs py-3"
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
