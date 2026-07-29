import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Image } from 'lucide-react';

const avatars = [
    'avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png',
    'avatar5.png', 'avatar6.png', 'avatar7.png', 'avatar8.png'
];

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: 'other',
        avatar: 'avatar1.png',
        mode: 'student',
        enrolledLanguages: []
    });

    const languages = ['tamil', 'telugu', 'hindi', 'kannada', 'malayalam', 'english'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLanguageToggle = (lang) => {
        setFormData(prev => ({
            ...prev,
            enrolledLanguages: prev.enrolledLanguages.includes(lang)
                ? prev.enrolledLanguages.filter(l => l !== lang)
                : [...prev.enrolledLanguages, lang]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await signup(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="card max-w-4xl w-full"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gradient child-font mb-2">
                        🌟 Join LangSphere AI! 🌟
                    </h1>
                    <p className="text-gray-600">Start your magical language learning journey</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Mode Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            I am a:
                        </label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, mode: 'student' })}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${formData.mode === 'student'
                                    ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                🎓 Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, mode: 'parent' })}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${formData.mode === 'parent'
                                    ? 'bg-gradient-to-r from-magic-500 to-magic-600 text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                👨‍👩‍👧 Parent
                            </button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <User className="inline w-4 h-4 mr-1" /> Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-forest-500 focus:outline-none transition-all"
                                placeholder="Choose a cool username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Mail className="inline w-4 h-4 mr-1" /> Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-forest-500 focus:outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Phone className="inline w-4 h-4 mr-1" /> Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{10}"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-forest-500 focus:outline-none transition-all"
                                placeholder="10-digit number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-forest-500 focus:outline-none transition-all"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Lock className="inline w-4 h-4 mr-1" /> Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-forest-500 focus:outline-none transition-all"
                                placeholder="At least 6 characters"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Lock className="inline w-4 h-4 mr-1" /> Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-forest-500 focus:outline-none transition-all"
                                placeholder="Re-enter password"
                            />
                        </div>
                    </div>

                    {/* Avatar Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            <Image className="inline w-4 h-4 mr-1" /> Choose Your Avatar
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                            {avatars.map(avatar => (
                                <motion.button
                                    key={avatar}
                                    type="button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFormData({ ...formData, avatar })}
                                    className={`aspect-square rounded-full p-1 transition-all ${formData.avatar === avatar
                                        ? 'ring-4 ring-forest-500 shadow-lg'
                                        : 'ring-2 ring-gray-200'
                                        }`}
                                >
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-magic-300 to-forest-300 flex items-center justify-center text-2xl">
                                        {avatar.charAt(6)}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Language Selection */}
                    {formData.mode === 'student' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Languages to Learn (select at least one)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {languages.map(lang => (
                                    <motion.button
                                        key={lang}
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleLanguageToggle(lang)}
                                        className={`py-3 px-4 rounded-xl font-semibold capitalize transition-all ${formData.enrolledLanguages.includes(lang)
                                            ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {lang}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-primary py-4 text-lg disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : '🚀 Start Learning!'}
                    </motion.button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-forest-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
