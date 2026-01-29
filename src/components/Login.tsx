'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ArrowLeft, Shield, Zap, BarChart2 } from 'lucide-react';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard');
      } else {
        setError(response.data.error || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
          {/* Left side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Login
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Doesn't have an account yet?{' '}
                  <Link href="/register" className="text-primary font-semibold hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter 8 characters or more"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
                >
                  LOGIN
                </motion.button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">or</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Enhanced Trading Illustration */}
              <svg viewBox="0 0 680 460" className="w-full h-auto">
                <defs>
                  <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M16 0H0V16" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                  </pattern>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" />
                  </linearGradient>
                </defs>

                {/* Background blobs */}
                <circle cx="620" cy="60" r="50" fill="hsl(var(--primary))" opacity="0.08" />
                <circle cx="70" cy="420" r="40" fill="hsl(var(--chart-2))" opacity="0.08" />

                {/* Device frame */}
                <rect x="60" y="40" width="560" height="360" rx="20" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />

                {/* Sidebar */}
                <rect x="80" y="70" width="70" height="300" rx="12" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" />
                <rect x="92" y="86" width="46" height="10" rx="5" fill="hsl(var(--primary))" opacity="0.9" />
                <rect x="92" y="110" width="46" height="10" rx="5" fill="hsl(var(--muted-foreground))" opacity="0.4" />
                <rect x="92" y="132" width="46" height="10" rx="5" fill="hsl(var(--muted-foreground))" opacity="0.4" />
                <rect x="92" y="154" width="46" height="10" rx="5" fill="hsl(var(--muted-foreground))" opacity="0.4" />

                {/* Main chart card */}
                <g transform="translate(170 70)">
                  <rect width="430" height="210" rx="14" fill="hsl(var(--background))" stroke="hsl(var(--border))" />
                  <rect width="430" height="210" fill="url(#grid)" opacity="0.6" />

                  {/* Candlesticks */}
                  <g strokeLinecap="round">
                    <g>
                      <line x1="30" y1="130" x2="30" y2="170" stroke="hsl(var(--destructive))" strokeWidth="2" />
                      <rect x="26" y="140" width="8" height="20" fill="hsl(var(--destructive))" rx="2" />
                    </g>
                    <g>
                      <line x1="60" y1="110" x2="60" y2="160" stroke="hsl(var(--chart-2))" strokeWidth="2" />
                      <rect x="56" y="120" width="8" height="25" fill="hsl(var(--chart-2))" rx="2" />
                    </g>
                    <g>
                      <line x1="90" y1="118" x2="90" y2="165" stroke="hsl(var(--chart-2))" strokeWidth="2" />
                      <rect x="86" y="130" width="8" height="22" fill="hsl(var(--chart-2))" rx="2" />
                    </g>
                    <g>
                      <line x1="120" y1="105" x2="120" y2="160" stroke="hsl(var(--destructive))" strokeWidth="2" />
                      <rect x="116" y="125" width="8" height="25" fill="hsl(var(--destructive))" rx="2" />
                    </g>
                    <g>
                      <line x1="150" y1="100" x2="150" y2="150" stroke="hsl(var(--chart-2))" strokeWidth="2" />
                      <rect x="146" y="118" width="8" height="20" fill="hsl(var(--chart-2))" rx="2" />
                    </g>
                    <g>
                      <line x1="180" y1="95" x2="180" y2="145" stroke="hsl(var(--chart-2))" strokeWidth="2" />
                      <rect x="176" y="110" width="8" height="22" fill="hsl(var(--chart-2))" rx="2" />
                    </g>
                    <g>
                      <line x1="210" y1="115" x2="210" y2="155" stroke="hsl(var(--destructive))" strokeWidth="2" />
                      <rect x="206" y="130" width="8" height="18" fill="hsl(var(--destructive))" rx="2" />
                    </g>
                    <g>
                      <line x1="240" y1="90" x2="240" y2="140" stroke="hsl(var(--chart-2))" strokeWidth="2" />
                      <rect x="236" y="105" width="8" height="24" fill="hsl(var(--chart-2))" rx="2" />
                    </g>
                    <g>
                      <line x1="270" y1="95" x2="270" y2="150" stroke="hsl(var(--chart-2))" strokeWidth="2" />
                      <rect x="266" y="112" width="8" height="22" fill="hsl(var(--chart-2))" rx="2" />
                    </g>
                  </g>

                  {/* Line chart */}
                  <path d="M20 170 L 60 150 L 90 155 L 120 140 L 150 145 L 180 130 L 210 138 L 240 120 L 270 128 L 300 110 L 340 125 L 370 118 L 410 125" fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* KPI cards */}
                <g transform="translate(170 300)">
                  <rect width="200" height="80" rx="12" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                  <text x="16" y="28" fill="hsl(var(--muted-foreground))" fontSize="12">Daily P/L</text>
                  <text x="16" y="52" fill="hsl(var(--foreground))" fontSize="22" fontWeight="700">+$1,245.22</text>
                  <rect x="130" y="22" width="54" height="8" rx="4" fill="hsl(var(--chart-1))" opacity="0.2" />
                  <rect x="130" y="40" width="38" height="8" rx="4" fill="hsl(var(--chart-1))" opacity="0.5" />
                </g>

                <g transform="translate(400 300)">
                  <rect width="200" height="80" rx="12" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                  <text x="16" y="28" fill="hsl(var(--muted-foreground))" fontSize="12">Open Positions</text>
                  <circle cx="28" cy="50" r="6" fill="hsl(var(--chart-2))" />
                  <text x="42" y="54" fill="hsl(var(--foreground))" fontSize="14">AAPL 2.1%</text>
                  <circle cx="128" cy="50" r="6" fill="hsl(var(--destructive))" />
                  <text x="142" y="54" fill="hsl(var(--foreground))" fontSize="14">TSLA -1.0%</text>
                </g>

                {/* Decorative dots */}
                <circle cx="120" cy="70" r="4" fill="hsl(var(--primary))" />
                <circle cx="540" cy="380" r="4" fill="hsl(var(--chart-3))" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
