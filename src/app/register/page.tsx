'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle2, TrendingUp, Users, Award } from 'lucide-react';
import Link from 'next/link';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        router.push('/login');
      } else {
        setError(response.data.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
          {/* Left side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto order-2 lg:order-1"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Sign Up
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-semibold hover:underline">
                    Login
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

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    autoComplete="username"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter 8 characters or more"
                      autoComplete="new-password"
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
                    required
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms & Conditions
                    </Link>
                  </span>
                </label>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
                >
                  SIGN UP
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
            className="hidden lg:flex items-center justify-center order-1 lg:order-2"
          >
            <div className="relative w-full max-w-lg">
              {/* Enhanced Team Collaboration Illustration */}
              <svg viewBox="0 0 680 460" className="w-full h-auto">
                <defs>
                  <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" />
                  </linearGradient>
                  <pattern id="smallGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                    <path d="M12 0H0V12" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Background shapes */}
                <circle cx="620" cy="70" r="50" fill="hsl(var(--primary))" opacity="0.08" />
                <circle cx="70" cy="420" r="40" fill="hsl(var(--chart-2))" opacity="0.08" />

                {/* Flow line */}
                <path d="M 120 240 L 560 240" stroke="hsl(var(--border))" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" />

                {/* Step 1 Card */}
                <g transform="translate(80 120)">
                  <rect width="160" height="180" rx="16" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                  <circle cx="40" cy="40" r="26" fill="hsl(var(--primary))" opacity="0.15" />
                  <circle cx="40" cy="40" r="22" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                  {/* User icon */}
                  <path d="M 40 30 a10 10 0 1 0 0.001 0 Z" fill="hsl(var(--primary))" />
                  <path d="M 20 58 q20 -12 40 0" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <text x="20" y="100" fill="hsl(var(--foreground))" fontSize="16" fontWeight="700">Create</text>
                  <text x="20" y="122" fill="hsl(var(--muted-foreground))" fontSize="12">Open your account</text>
                  <rect x="20" y="135" width="120" height="6" rx="3" fill="hsl(var(--primary))" opacity="0.25" />
                  <rect x="20" y="147" width="90" height="6" rx="3" fill="hsl(var(--primary))" opacity="0.4" />
                </g>

                {/* Step 2 Card */}
                <g transform="translate(260 120)">
                  <rect width="160" height="180" rx="16" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                  <circle cx="40" cy="40" r="26" fill="hsl(var(--chart-2))" opacity="0.15" />
                  <circle cx="40" cy="40" r="22" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" />
                  {/* Wallet icon */}
                  <rect x="26" y="32" width="28" height="18" rx="4" fill="hsl(var(--chart-2))" />
                  <circle cx="48" cy="41" r="2.5" fill="hsl(var(--card))" />
                  <text x="20" y="100" fill="hsl(var(--foreground))" fontSize="16" fontWeight="700">Fund</text>
                  <text x="20" y="122" fill="hsl(var(--muted-foreground))" fontSize="12">Add money securely</text>
                  <rect x="20" y="135" width="120" height="6" rx="3" fill="hsl(var(--chart-2))" opacity="0.25" />
                  <rect x="20" y="147" width="90" height="6" rx="3" fill="hsl(var(--chart-2))" opacity="0.4" />
                </g>

                {/* Step 3 Card */}
                <g transform="translate(440 120)">
                  <rect width="160" height="180" rx="16" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                  <circle cx="40" cy="40" r="26" fill="hsl(var(--chart-1))" opacity="0.15" />
                  <circle cx="40" cy="40" r="22" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" />
                  {/* Chart icon */}
                  <rect x="30" y="36" width="4" height="14" rx="2" fill="hsl(var(--chart-1))" />
                  <rect x="38" y="32" width="4" height="18" rx="2" fill="hsl(var(--chart-1))" />
                  <rect x="46" y="40" width="4" height="10" rx="2" fill="hsl(var(--chart-1))" />
                  <path d="M 28 52 L 50 52" stroke="hsl(var(--chart-1))" strokeWidth="2" strokeLinecap="round" />
                  <text x="20" y="100" fill="hsl(var(--foreground))" fontSize="16" fontWeight="700">Trade</text>
                  <text x="20" y="122" fill="hsl(var(--muted-foreground))" fontSize="12">Start investing</text>
                  <rect x="20" y="135" width="120" height="6" rx="3" fill="hsl(var(--chart-1))" opacity="0.25" />
                  <rect x="20" y="147" width="90" height="6" rx="3" fill="hsl(var(--chart-1))" opacity="0.4" />
                </g>

                {/* Decorative dashboard card */}
                <g transform="translate(120 320)">
                  <rect width="440" height="90" rx="14" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                  <rect x="16" y="18" width="200" height="54" rx="10" fill="hsl(var(--background))" stroke="hsl(var(--border))" />
                  <rect x="16" y="18" width="200" height="54" fill="url(#smallGrid)" opacity="0.6" />
                  <path d="M 26 60 L 54 44 L 78 50 L 100 38 L 130 45 L 160 34 L 190 40" stroke="url(#accentGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <text x="240" y="40" fill="hsl(var(--muted-foreground))" fontSize="12">Welcome to TradePro</text>
                  <text x="240" y="62" fill="hsl(var(--foreground))" fontSize="18" fontWeight="700">Create • Fund • Trade</text>
                </g>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
