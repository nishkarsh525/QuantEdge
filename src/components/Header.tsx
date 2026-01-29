'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  PieChart,
  BarChart3,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    return (
      <button
        className="p-2 rounded-md hover:bg-accent"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    );
  };

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <motion.span
            onClick={() => router.push('/')}
            className="text-xl md:text-2xl font-semibold tracking-tight text-foreground cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            QuantEdge
          </motion.span>
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/dataanalytics"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <PieChart className="h-4 w-4" /> Analytics
                </a>
              </li>
              <li>
                <a
                  href="/candlestick-chart"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <BarChart3 className="h-4 w-4" /> Charts
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {renderThemeChanger()}
          <motion.button
            className="relative rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
          >
            <Bell size={20} />
          </motion.button>
          <motion.button
            className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Account"
          >
            <User size={20} />
          </motion.button>
        </div>

        <div className="lg:hidden flex items-center">
          {renderThemeChanger()}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2 rounded-md p-2 hover:bg-accent"
            aria-label="Open menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 right-0 h-full w-72 bg-card/95 backdrop-blur border-l shadow-xl z-50"
          >
            <div className="p-4 flex items-center justify-between">
              <span className="text-foreground font-medium">Menu</span>
              <motion.button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-2 hover:bg-accent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close menu"
              >
                <X size={22} />
              </motion.button>
            </div>
            <nav className="px-4">
              <ul className="space-y-4">
                <li>
                  <a
                    href="/dashboard"
                    className="block rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/dataanalytics"
                    className="block rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <span className="inline-flex items-center gap-2"><PieChart className="h-4 w-4" /> Analytics</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/candlestick-chart"
                    className="block rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <span className="inline-flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Charts</span>
                  </a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
