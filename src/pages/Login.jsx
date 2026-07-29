import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Navigation handled by useEffect
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-4"
                    >
                        🌳
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gradient child-font mb-2">
                        Welcome Back!
                    </h1>
                    <p className="text-gray-600">Continue your learning adventure</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                            <Lock className="inline w-4 h-4 mr-1" /> Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-forest-500 focus:outline-none transition-all"
                            placeholder="Enter your password"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-primary py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        {loading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-forest-600 font-semibold hover:underline">
                        Sign up here
                    </Link>
                </p>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
                    <p className="text-xs text-blue-700">
                        Student: student@demo.com / password123<br />
                        Parent: parent@demo.com / password123
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
