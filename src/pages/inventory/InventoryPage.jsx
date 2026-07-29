import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Package, CheckCircle2, Shield } from 'lucide-react';
import { getUserInventory, equipShopItem } from '../../services/shopService';
import { useAuth } from '../../context/AuthContext';

export const InventoryPage = () => {
  const { user, loadUser } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await getUserInventory();
      if (res && res.data) setInventory(res.data);
    } catch (err) {
      console.error('Fetch inventory error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEquip = async (itemId, itemType) => {
    try {
      await equipShopItem(itemId, itemType);
      loadUser();
      fetchInventory();
    } catch (err) {
      console.error('Equip error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <Package className="w-7 h-7 text-teal-500" /> User Inventory & Equipped Cosmetics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage owned themes, avatars, titles, and active booster multipliers</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading inventory...</div>
          ) : inventory.length === 0 ? (
            <div className="py-12 text-center text-slate-400">You don't own any shop items yet. Visit the Epic Shop to acquire cosmetics!</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item, idx) => (
                <GlassCard key={idx} className="p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-teal-500">{item.itemType || 'Cosmetic'}</span>
                    <h3 className="font-bold text-base text-slate-800 dark:text-white">{item.name || item.itemId}</h3>
                    <p className="text-xs text-slate-400">Purchased {new Date(item.purchasedAt || Date.now()).toLocaleDateString()}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() => handleEquip(item.itemId, item.itemType)}
                      className="w-full py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:scale-[1.02] transition-all"
                    >
                      Equip Item
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default InventoryPage;
