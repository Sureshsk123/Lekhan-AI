import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Diamond, Check, Sparkles, ShoppingCart, Info, UserCircle, Palette, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const EpicStore = () => {
    const { user, token, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [catalog, setCatalog] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catalogRes, invRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/shop/catalog', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5001/api/shop/inventory', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (catalogRes.data.success) setCatalog(catalogRes.data.catalog);
                if (invRes.data.success) setInventory(invRes.data.inventory);
            } catch (err) {
                console.error('Failed to fetch store data:', err);
                setError('Failed to load the store. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const categories = [
        { id: 'all', icon: Sparkles, label: 'All' },
        { id: 'avatar', icon: UserCircle, label: 'Avatars' },
        { id: 'theme', icon: Palette, label: 'Themes' },
        { id: 'booster', icon: Zap, label: 'Boosters' }
    ];

    const filteredItems = selectedCategory === 'all'
        ? catalog
        : catalog.filter(item => item.type === selectedCategory);

    const isOwned = (itemId) => inventory.some(i => i.itemId === itemId);
    const isEquipped = (itemId) => {
        if (!user) return false;
        return user.avatar === itemId || user.theme === itemId;
    };

    const handlePurchase = async (item) => {
        if (user.diamonds < item.price) {
            alert('Not enough diamonds! 💎');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5001/api/shop/purchase',
                { itemId: item.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                alert(`Successfully purchased ${item.name}! 🎉`);
                setInventory(res.data.inventory);
                updateUser(res.data.user);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Purchase failed');
        }
    };

    const handleEquip = async (item) => {
        try {
            const res = await axios.post('http://localhost:5001/api/shop/equip',
                { itemId: item.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                updateUser(res.data.user);
            }
        } catch (err) {
            alert('Equip failed');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            <TopBar />
            <div className="max-w-7xl mx-auto pt-28 px-6 pb-20">
                <header className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block relative mb-4"
                    >
                        <ShoppingCart className="w-16 h-16 text-indigo-600 mb-2 mx-auto" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-2 -right-2 text-3xl"
                        >✨</motion.div>
                    </motion.div>
                    <h1 className="text-5xl font-black text-gray-800 mb-4 tracking-tight">Epic Marketplace</h1>
                    <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
                        Trade your hard-earned diamonds for exclusive avatars, premium themes, and boosters!
                    </p>
                </header>

                <div className="bg-white rounded-[2.5rem] p-4 shadow-xl mb-12 flex justify-center gap-2 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${selectedCategory === cat.id
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <cat.icon className="w-5 h-5" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, idx) => {
                            const owned = isOwned(item.id);
                            const equipped = isEquipped(item.id);

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    whileHover={{ y: -10 }}
                                    className={`bg-white rounded-[2rem] p-6 shadow-xl border-2 transition-all ${equipped ? 'border-green-500 ring-4 ring-green-100' : 'border-gray-50'
                                        }`}
                                >
                                    <div className="relative aspect-square bg-gray-50 rounded-2xl flex items-center justify-center mb-6 overflow-hidden group">
                                        <span className="text-7xl group-hover:scale-125 transition-transform duration-500 select-none">
                                            {item.metadata?.emoji || '💎'}
                                        </span>
                                        {equipped && (
                                            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                                Active
                                            </div>
                                        )}
                                        {owned && !equipped && (
                                            <div className="absolute top-3 right-3 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                                Owned
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-gray-800 mb-1">{item.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-2">{item.description}</p>

                                    <div className="flex items-center justify-between gap-4">
                                        {!owned ? (
                                            <>
                                                <div className="flex items-center gap-1.5 bg-cyan-50 px-3 py-1.5 rounded-full">
                                                    <Diamond className="w-4 h-4 text-cyan-600 fill-cyan-600" />
                                                    <span className="font-black text-cyan-700">{item.price}</span>
                                                </div>
                                                <button
                                                    onClick={() => handlePurchase(item)}
                                                    disabled={user.diamonds < item.price}
                                                    className={`px-6 py-2.5 rounded-2xl font-black transition-all ${user.diamonds >= item.price
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Buy
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEquip(item)}
                                                disabled={equipped}
                                                className={`w-full py-2.5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${equipped
                                                        ? 'bg-green-100 text-green-700 cursor-default'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                                                    }`}
                                            >
                                                {equipped ? <><Check className="w-5 h-5" /> Equipped</> : 'Equip Item'}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default EpicStore;
