import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Check, UserCircle, Palette, Zap, ArrowRight, Star } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const Inventory = () => {
    const { user, token, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/shop/inventory', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setInventory(res.data.inventory);
                }
            } catch (err) {
                console.error('Failed to fetch inventory:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, [token]);

    const handleEquip = async (item) => {
        try {
            const res = await axios.post('http://localhost:5001/api/shop/equip',
                { itemId: item.itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                updateUser(res.data.user);
            }
        } catch (err) {
            alert('Equip failed');
        }
    };

    const categories = [
        { id: 'all', icon: Star, label: 'All Items' },
        { id: 'avatar', icon: UserCircle, label: 'Avatars' },
        { id: 'theme', icon: Palette, label: 'Themes' },
        { id: 'booster', icon: Zap, label: 'Boosters' }
    ];

    const filteredInventory = selectedCategory === 'all'
        ? inventory
        : inventory.filter(item => item.itemType === selectedCategory);

    const isEquipped = (itemId) => {
        if (!user) return false;
        return user.avatar === itemId || user.theme === itemId;
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            <TopBar />
            <div className="max-w-5xl mx-auto pt-28 px-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-gray-800 mb-2 tracking-tight">Your Inventory</h1>
                        <p className="text-gray-500 font-medium">Manage and equip your hard-earned rewards.</p>
                    </div>
                    <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${selectedCategory === cat.id
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <cat.icon className="w-5 h-5" />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredInventory.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            📦
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mb-2">It's a bit empty here!</h2>
                        <p className="text-gray-500 mb-10 max-w-sm mx-auto">You haven't purchased any items yet. Head over to the store to see what's new!</p>
                        <button
                            onClick={() => window.location.href = '/shop'}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center gap-3 mx-auto"
                        >
                            Open Epic Store <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredInventory.map((item) => {
                                const equipped = isEquipped(item.itemId);
                                return (
                                    <motion.div
                                        key={item.itemId}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`bg-white rounded-[2.5rem] p-6 shadow-xl border-2 transition-all relative ${equipped ? 'border-green-500 ring-4 ring-green-100' : 'border-gray-50 hover:border-indigo-100'
                                            }`}
                                    >
                                        <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-6xl mx-auto shadow-inner">
                                            {item.metadata?.emoji || '✨'}
                                        </div>

                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-black text-gray-800 mb-1">{item.itemName}</h3>
                                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{item.itemType}</span>
                                        </div>

                                        <button
                                            onClick={() => handleEquip(item)}
                                            disabled={equipped}
                                            className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${equipped
                                                    ? 'bg-green-500 text-white shadow-lg'
                                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                                                }`}
                                        >
                                            {equipped ? <><Check className="w-6 h-6" /> Equipped</> : 'Equip Item'}
                                        </button>

                                        {equipped && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                                            >
                                                <Check className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
