'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  BarChart2,
  PieChart,
  DollarSign,
  Activity,
  PlusSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import axios from 'axios';

import ActualWatchlistSidebar, {
  WatchlistItem as ClientWatchlistItem,
  AddToWatchlistButton,
} from '@/components/WatchlistSideBar';

import PortfolioSidebarComponent, {
  PortfolioItem as ClientPortfolioItem,
} from '@/components/PortfolioSidebar';
import { fadeInUp } from '@/lib/animation';

const PRESET_NEWS = [
  {
    id: 1,
    title: 'Global Markets Rally on Tech Gains',
    source: 'Reuters',
    url: 'https://www.reuters.com/markets/global-markets-rally-tech-gains-2025-04-23/',
    summary:
      'Tech stocks led a global market rally today as investors cheered strong earnings reports.',
  },
  {
    id: 2,
    title: 'Oil Prices Dip Amid Supply Easing',
    source: 'Bloomberg',
    url: 'https://www.bloomberg.com/news/articles/2025-04-22/oil-prices-dip-amid-supply-easing',
    summary:
      'Oil prices fell for a second session as OPEC+ signaled plans to boost output.',
  },
  {
    id: 3,
    title: "India's GDP Growth Forecast Upgraded",
    source: 'Economic Times',
    url: 'https://economictimes.indiatimes.com/news/economy/indicators/indias-gdp-growth-forecast-upgraded-2025/articleshow/99712345.cms',
    summary:
      'The Reserve Bank raised its GDP growth forecast for India for the fiscal year to 7.2%.',
  },
];
const TabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Stocks');
  const tabs = ['Stocks', 'Mutual Funds', 'ETFs', 'Options', 'Futures'];
  return (
    <motion.div {...fadeInUp} className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-6 lg:space-x-8 overflow-x-auto py-4 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.li
              key={tab}
              className={`cursor-pointer whitespace-nowrap text-sm sm:text-base font-medium pb-3 px-1 relative ${
                activeTab === tab
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              } transition-colors duration-200`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
type SentimentType = 'Positive' | 'Neutral' | 'Negative';
const generateSentiment = (): SentimentType => {
  const sentiments: SentimentType[] = ['Positive', 'Neutral', 'Negative'];
  return sentiments[Math.floor(Math.random() * sentiments.length)];
};

interface MarketIndicesProps {
  watchlist: ClientWatchlistItem[];
  onAddToWatchlist: (item: ClientWatchlistItem) => void;
  onRemoveFromWatchlist: (name: string) => void;
}

interface MarketIndexData {
  name: string;
  value: number;
  change: number;
  percentChange: number;
  sentiment: SentimentType;
}

const MarketIndices: React.FC<MarketIndicesProps> = ({
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const router = useRouter();
  const initialMarketData: MarketIndexData[] = [
    {
      name: 'NIFTY50',
      value: 18245.32,
      change: 0,
      percentChange: 0,
      sentiment: 'Neutral',
    },
    {
      name: 'SENSEX',
      value: 61002.57,
      change: 0,
      percentChange: 0,
      sentiment: 'Neutral',
    },
    {
      name: 'BANKNIFTY',
      value: 43123.45,
      change: 0,
      percentChange: 0,
      sentiment: 'Neutral',
    },
  ];
  const [marketData, setMarketData] = useState<MarketIndexData[]>(
    initialMarketData.map((i) => ({ ...i }))
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setMarketData((prevData): MarketIndexData[] =>
        prevData.map((index) => {
          const delta = (Math.random() * 2 - 1) * (index.value * 0.001);
          const pct = index.value !== 0 ? (delta / index.value) * 100 : 0;
          const newValue = index.value + delta;
          return {
            name: index.name,
            value: Math.max(0.01, newValue),
            change: delta,
            percentChange: pct,
            sentiment: generateSentiment(),
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isClient]);

  return (
    <motion.div
      {...fadeInUp}
      className="my-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Market Overview</h2>
          <p className="text-muted-foreground">Live market indices and sentiment analysis</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Last updated</div>
          <div className="text-sm font-medium text-foreground">
            {new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketData.map((index, mapIndex) => {
          const isWatched = watchlist.some(
            (watchItem) => watchItem.name === index.name
          );
          return (
            <motion.div
              key={index.name}
              className="group bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/dashboard/${index.name}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mapIndex * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                className="absolute top-3 right-3 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <AddToWatchlistButton
                  item={{ name: index.name, price: index.value }}
                  isInWatchlist={isWatched}
                  onAdd={onAddToWatchlist}
                  onRemove={onRemoveFromWatchlist}
                />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-foreground text-lg mb-3 pr-8">
                  {index.name}
                </h3>
                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-2xl font-bold text-foreground">
                    {isClient
                      ? index.value.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 2,
                        })
                      : `₹${index.value.toFixed(2)}`}
                  </span>
                  <motion.span
                    key={index.change}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-sm font-semibold flex items-center px-2 py-1 rounded-full ${
                      index.change >= 0
                        ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                        : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                    }`}
                  >
                    {index.change >= 0 ? (
                      <ArrowUpRight size={14} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={14} className="mr-1" />
                    )}
                    {Math.abs(index.change).toFixed(2)} ({Math.abs(index.percentChange).toFixed(2)}%)
                  </motion.span>
                </div>
                <motion.div
                  className={`text-sm font-medium ${
                    index.sentiment === 'Positive'
                      ? 'text-green-600 dark:text-green-400'
                      : index.sentiment === 'Negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  Sentiment: {index.sentiment}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

interface StockCardProps {
  name: string;
  initialPrice: number;
  onAddToPortfolio: (item: {
    name: string;
    price: number;
    quantity: number;
  }) => void;
  watchlist: ClientWatchlistItem[];
  onAddToWatchlist: (item: ClientWatchlistItem) => void;
  onRemoveFromWatchlist: (name: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({
  name,
  initialPrice,
  onAddToPortfolio,
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [change, setChange] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<number>(0);
  const [sentiment, setSentiment] = useState<SentimentType>('Neutral');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      const delta = (Math.random() * 2 - 1) * (price * 0.01);
      const pct = price !== 0 ? (delta / price) * 100 : 0;
      setPrice((prev) => Math.max(0.01, prev + delta));
      setChange(delta);
      setPercentChange(pct);
      setSentiment(generateSentiment());
    }, 1500);
    return () => clearInterval(interval);
  }, [price, isClient]);

  const isWatched = watchlist.some((watchItem) => watchItem.name === name);

  return (
    <motion.div
      className="group relative bg-card/60 backdrop-blur-sm p-5 rounded-xl border border-border/50 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => router.push(`/dashboard/${name}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-3 right-3 z-10 flex space-x-2">
        <div onClick={(e) => e.stopPropagation()}>
          <AddToWatchlistButton
            item={{ name, price }}
            isInWatchlist={isWatched}
            onAdd={onAddToWatchlist}
            onRemove={onRemoveFromWatchlist}
          />
        </div>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPortfolio({ name, price, quantity: 1 });
          }}
          className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
          title="Add to Portfolio"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <PlusSquare size={14} />
        </motion.button>
      </div>
      <div className="relative z-10">
        <h3 className="font-bold text-foreground mb-3 text-lg pr-20 leading-tight">
          {name}
        </h3>
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-xl font-bold text-foreground">
            {isClient
              ? price.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 2,
                })
              : `₹${price.toFixed(2)}`}
          </span>
          <motion.span
            key={`${name}-${change}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-sm font-semibold flex items-center px-2 py-1 rounded-full ${
              change >= 0
                ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
            }`}
          >
            {change >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
            {Math.abs(change).toFixed(2)} ({Math.abs(percentChange).toFixed(2)}%)
          </motion.span>
        </div>
        <motion.div
          className={`text-sm font-medium ${
            sentiment === 'Positive'
              ? 'text-green-600 dark:text-green-400'
              : sentiment === 'Negative'
              ? 'text-red-600 dark:text-red-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          Sentiment: {sentiment}
        </motion.div>
      </div>
    </motion.div>
  );
};
interface MostBoughtProps {
  onAddToPortfolio: (item: {
    name: string;
    price: number;
    quantity: number;
  }) => void;
  watchlist: ClientWatchlistItem[];
  onAddToWatchlist: (item: ClientWatchlistItem) => void;
  onRemoveFromWatchlist: (name: string) => void;
}
const MostBought: React.FC<MostBoughtProps> = ({
  onAddToPortfolio,
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const list = [
    { name: 'Reliance', price: 2345.6 },
    { name: 'Tata Motors', price: 456.75 },
    { name: 'Suzlon Energy', price: 18.45 },
    { name: 'Zomato', price: 82.3 },
  ];
  return (
    <motion.div {...fadeInUp} className="my-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Most Bought on TradePro
          </h2>
          <p className="text-muted-foreground">Popular stocks trending among our users</p>
        </div>
        <motion.a
          href="#"
          className="text-primary text-sm font-medium hover:text-primary/80 flex items-center px-4 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View all <ChevronRight size={16} className="ml-1" />
        </motion.a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((s, index) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StockCard
              name={s.name}
              initialPrice={s.price}
              onAddToPortfolio={onAddToPortfolio}
              watchlist={watchlist}
              onAddToWatchlist={onAddToWatchlist}
              onRemoveFromWatchlist={onRemoveFromWatchlist}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
const ProductsAndTools = () => {
  const products = [
    { name: 'F&O', icon: BarChart2 },
    { name: 'IPO', icon: DollarSign },
    { name: 'ETFs', icon: PieChart },
    { name: 'FDs', icon: TrendingUp },
    { name: 'US Stocks', icon: Activity },
  ];
  return (
    <motion.div {...fadeInUp} className="my-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Products & Tools
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive trading solutions and investment tools designed for every type of investor
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.name}
            className="group bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 text-center cursor-pointer"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary to-primary/80 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <product.icon className="text-primary-foreground w-7 h-7" />
            </motion.div>
            <span className="text-foreground font-medium text-base group-hover:text-primary transition-colors duration-200">
              {product.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
interface TopGainersProps {
  onAddToPortfolio: (item: {
    name: string;
    price: number;
    quantity: number;
  }) => void;
  watchlist: ClientWatchlistItem[];
  onAddToWatchlist: (item: ClientWatchlistItem) => void;
  onRemoveFromWatchlist: (name: string) => void;
}
const TopGainers: React.FC<TopGainersProps> = ({
  onAddToPortfolio,
  watchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  const list = [
    { name: 'TCS', price: 3845.6 },
    { name: 'HDFC Bank', price: 1535.6 },
    { name: 'ICICI Bank', price: 945.6 },
    { name: 'Bharti Airtel', price: 835.6 },
  ];
  return (
    <motion.div {...fadeInUp} className="my-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Top Gainers
          </h2>
          <p className="text-muted-foreground">Best performing stocks today</p>
        </div>
        <motion.a
          href="#"
          className="text-primary text-sm font-medium hover:text-primary/80 flex items-center px-4 py-2 rounded-lg hover:bg-primary/10 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          See more <ChevronRight size={16} className="ml-1" />
        </motion.a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((s, index) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StockCard
              name={s.name}
              initialPrice={s.price}
              onAddToPortfolio={onAddToPortfolio}
              watchlist={watchlist}
              onAddToWatchlist={onAddToWatchlist}
              onRemoveFromWatchlist={onRemoveFromWatchlist}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
const TopByMarketCap = () => {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const companies = [
    { name: 'Reliance Industries', marketCap: 1923456.78 },
    { name: 'TCS', marketCap: 1434567.89 },
    { name: 'HDFC Bank', marketCap: 1187654.32 },
    { name: 'Infosys', marketCap: 676543.21 },
    { name: 'ICICI Bank', marketCap: 654321.98 },
  ];
  return (
    <motion.div {...fadeInUp} className="py-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Top by Market Cap
      </h2>
      <div className="space-y-4">
        {companies.map((company) => (
          <motion.div
            key={company.name}
            layout
            className="bg-card p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() =>
              setExpandedCompany(
                expandedCompany === company.name ? null : company.name
              )
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-foreground text-base font-medium">
                {company.name}
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground text-base">
                  ₹
                  {company.marketCap.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                  })}
                  Cr
                </span>
                <motion.div
                  animate={{
                    rotate: expandedCompany === company.name ? 45 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="text-primary w-5 h-5" />
                </motion.div>
              </div>
            </div>
            <AnimatePresence>
              {expandedCompany === company.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-muted-foreground overflow-hidden"
                >
                  <p className="text-base mb-2">
                    Additional information about {company.name} goes here.
                  </p>
                  <p className="text-base mb-4">
                    You can add more details, charts, or any other relevant
                    data.
                  </p>
                  <motion.button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details <ChevronRight size={16} className="ml-1" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const NewsFeed = () => {
  const [articles, setArticles] = useState(() => PRESET_NEWS);
  const [isClientForNews, setIsClientForNews] = useState(false);

  useEffect(() => {
    setIsClientForNews(true);
  }, []);

  const shuffleArticles = useCallback(() => {
    setArticles((prevArticles) =>
      [...prevArticles].sort(() => Math.random() - 0.5)
    );
  }, []);

  useEffect(() => {
    if (isClientForNews) {
      shuffleArticles();
      const intervalId = setInterval(shuffleArticles, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isClientForNews, shuffleArticles]);

  const articlesToRender = isClientForNews ? articles : PRESET_NEWS;

  return (
    <motion.div {...fadeInUp} className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Latest News
        </h2>
        {isClientForNews && (
          <motion.button
            onClick={shuffleArticles}
            className="text-primary text-sm hover:underline flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh news
          </motion.button>
        )}
      </div>
      <div className="space-y-4">
        {articlesToRender.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-card rounded-lg hover:bg-accent transition-colors"
          >
            <h3 className="text-foreground font-semibold text-base mb-1">
              {article.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              {article.source}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {article.summary}
            </p>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

interface DbWatchlistItem {
  name: string;
  price?: number;
}

interface DbPortfolioItem {
  name: string;
  price?: number;
  quantity?: number;
}

const EnhancedTradeProDashboard: React.FC = () => {
  const [watchlist, setWatchlist] = useState<ClientWatchlistItem[]>([]);
  const [portfolio, setPortfolio] = useState<ClientPortfolioItem[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetError, setAssetError] = useState<string | null>(null);
  const router = useRouter();

  const initialFetchDone = useRef(false);

  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }, []);

  const debouncedSaveUserAssets = useCallback(
    (
      currentWatchlist: ClientWatchlistItem[],
      currentPortfolio: ClientPortfolioItem[],
      authToken: string
    ) => {
      if ((debouncedSaveUserAssets as any).timer) {
        clearTimeout((debouncedSaveUserAssets as any).timer);
      }
      (debouncedSaveUserAssets as any).timer = setTimeout(async () => {
        if (!authToken) {
          return;
        }
        try {
          const portfolioToSave = currentPortfolio.map((p) => ({
            name: p.name,

            price: p.purchasePrice,
            quantity: p.quantity,
          }));

          await axios.post(
            '/api/assets',
            { watchlist: currentWatchlist, portfolio: portfolioToSave },
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
        } catch (error) {
          console.error('Debounced: Error saving assets:', error);
        }
      }, 1500);
    },
    []
  );

  const fetchUserAssets = useCallback(
    async (authToken: string) => {
      if (!authToken) {
        setIsLoadingAssets(false);
        setAssetError('Not authenticated.');
        return;
      }
      setIsLoadingAssets(true);
      setAssetError(null);
      try {
        const response = await axios.get('/api/assets', {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
          setWatchlist(
            response.data.watchlist
              ?.map((item: DbWatchlistItem) => ({
                name: item.name,
                price: typeof item.price === 'number' ? item.price : 0,
              }))
              .filter(
                (item: ClientWatchlistItem): item is ClientWatchlistItem =>
                  item.name && typeof item.price === 'number'
              ) || []
          );

          setPortfolio(
            response.data.portfolio
              ?.map((item: DbPortfolioItem) => {
                const quantity =
                  typeof item.quantity === 'number' ? item.quantity : 0;

                const purchasePrice =
                  typeof item.price === 'number' ? item.price : 0;

                const currentPrice = purchasePrice;

                const totalInvested = purchasePrice * quantity;
                const currentValue = currentPrice * quantity;
                const profitLoss = currentValue - totalInvested;
                const profitLossPercent =
                  totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

                return {
                  name: item.name,
                  currentPrice: currentPrice,
                  quantity: quantity,
                  purchasePrice: purchasePrice,
                  totalInvested: totalInvested,
                  currentValue: currentValue,
                  profitLoss: profitLoss,
                  profitLossPercent: profitLossPercent,
                };
              })
              .filter(
                (item: ClientPortfolioItem): item is ClientPortfolioItem =>
                  item.name && typeof item.quantity === 'number'
              ) || []
          );
          initialFetchDone.current = true;
        }
      } catch (error: any) {
        setAssetError(error.response?.data?.error || 'Failed to load assets.');
        setWatchlist([]);
        setPortfolio([]);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setIsLoadingAssets(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setToken(savedToken);
      if (!initialFetchDone.current) {
        fetchUserAssets(savedToken);
      }
    } else {
      setIsLoadingAssets(false);
      router.push('/login');
    }
  }, [getToken, fetchUserAssets, router]);

  const addToWatchlist = useCallback(
    (item: ClientWatchlistItem) => {
      setWatchlist((prev) => {
        if (prev.some((stock) => stock.name === item.name)) return prev;
        const newWatchlist = [...prev, item];
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(newWatchlist, portfolio, token);
        return newWatchlist;
      });
    },
    [token, portfolio, debouncedSaveUserAssets]
  );

  const removeFromWatchlist = useCallback(
    (name: string) => {
      setWatchlist((prev) => {
        const newWatchlist = prev.filter((stock) => stock.name !== name);
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(newWatchlist, portfolio, token);
        return newWatchlist;
      });
    },
    [token, portfolio, debouncedSaveUserAssets]
  );

  const addToPortfolio = useCallback(
    (stockToAdd: { name: string; price: number; quantity: number }) => {
      setPortfolio((prevPortfolio) => {
        const existingStockIndex = prevPortfolio.findIndex(
          (p) => p.name === stockToAdd.name
        );
        let updatedPortfolio;

        if (existingStockIndex > -1) {
          updatedPortfolio = prevPortfolio.map((p, index) => {
            if (index === existingStockIndex) {
              const newQuantity = p.quantity + stockToAdd.quantity;
              const newTotalInvested =
                p.totalInvested + stockToAdd.price * stockToAdd.quantity;
              const newPurchasePrice =
                newQuantity > 0 ? newTotalInvested / newQuantity : 0;
              const currentPrice = stockToAdd.price;
              const currentValue = currentPrice * newQuantity;
              const profitLoss = currentValue - newTotalInvested;
              const profitLossPercent =
                newTotalInvested > 0
                  ? (profitLoss / newTotalInvested) * 100
                  : 0;
              return {
                ...p,
                quantity: newQuantity,
                totalInvested: newTotalInvested,
                purchasePrice: newPurchasePrice,
                currentPrice: currentPrice,
                currentValue,
                profitLoss,
                profitLossPercent,
              };
            }
            return p;
          });
        } else {
          const totalInvested = stockToAdd.price * stockToAdd.quantity;
          updatedPortfolio = [
            ...prevPortfolio,
            {
              name: stockToAdd.name,
              currentPrice: stockToAdd.price,
              quantity: stockToAdd.quantity,
              purchasePrice: stockToAdd.price,
              totalInvested: totalInvested,
              currentValue: totalInvested,
              profitLoss: 0,
              profitLossPercent: 0,
            },
          ];
        }
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(watchlist, updatedPortfolio, token);
        return updatedPortfolio;
      });
    },
    [token, watchlist, debouncedSaveUserAssets]
  );

  const removeFromPortfolio = useCallback(
    (name: string) => {
      setPortfolio((prev) => {
        const newPortfolio = prev.filter((i) => i.name !== name);
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(watchlist, newPortfolio, token);
        return newPortfolio;
      });
    },
    [token, watchlist, debouncedSaveUserAssets]
  );

  const updatePrice = useCallback(
    (name: string, newPrice: number) => {
      setPortfolio((prevPortfolio) => {
        const updatedPortfolio = prevPortfolio.map((stock) => {
          if (stock.name === name) {
            const updatedStock = { ...stock, currentPrice: newPrice };
            updatedStock.currentValue = newPrice * updatedStock.quantity;
            updatedStock.profitLoss =
              updatedStock.currentValue - updatedStock.totalInvested;
            updatedStock.profitLossPercent =
              updatedStock.totalInvested > 0
                ? (updatedStock.profitLoss / updatedStock.totalInvested) * 100
                : 0;
            return updatedStock;
          }
          return stock;
        });

        return updatedPortfolio;
      });

      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((stock) =>
          stock.name === name ? { ...stock, price: newPrice } : stock
        )
      );
    },
    []
  );

  const handleTransaction = useCallback(
    (
      name: string,
      type: 'buy' | 'sell',
      transactionPrice: number,
      shares: number = 1
    ) => {
      setPortfolio((prevPortfolio) => {
        const itemIndex = prevPortfolio.findIndex((p) => p.name === name);
        let updatedPortfolio = [...prevPortfolio];

        if (itemIndex === -1 && type === 'sell') {
          return prevPortfolio;
        }

        if (itemIndex > -1) {
          const stock = updatedPortfolio[itemIndex];
          let newQuantity = stock.quantity;
          let newTotalInvested = stock.totalInvested;
          let newPurchasePrice = stock.purchasePrice;

          if (type === 'buy') {
            newQuantity += shares;
            newTotalInvested += transactionPrice * shares;
            newPurchasePrice =
              newQuantity > 0 ? newTotalInvested / newQuantity : 0;
          } else {
            if (shares > stock.quantity) {
              return prevPortfolio;
            }
            newQuantity -= shares;

            if (newQuantity > 0) {
              newTotalInvested = newPurchasePrice * newQuantity;
            } else {
              newTotalInvested = 0;
            }
          }

          if (newQuantity === 0 && type === 'sell') {
            updatedPortfolio.splice(itemIndex, 1);
          } else {
            const currentValue = transactionPrice * newQuantity;
            const profitLoss = currentValue - newTotalInvested;
            const profitLossPercent =
              newTotalInvested > 0 ? (profitLoss / newTotalInvested) * 100 : 0;
            updatedPortfolio[itemIndex] = {
              ...stock,
              quantity: newQuantity,
              totalInvested: newTotalInvested,
              purchasePrice: newPurchasePrice,
              currentPrice: transactionPrice,
              currentValue,
              profitLoss,
              profitLossPercent,
            };
          }
        } else if (type === 'buy') {
          const newTotalInvested = transactionPrice * shares;
          updatedPortfolio.push({
            name,
            currentPrice: transactionPrice,
            quantity: shares,
            purchasePrice: transactionPrice,
            totalInvested: newTotalInvested,
            currentValue: newTotalInvested,
            profitLoss: 0,
            profitLossPercent: 0,
          });
        }
        if (token && initialFetchDone.current)
          debouncedSaveUserAssets(watchlist, updatedPortfolio, token);
        return updatedPortfolio;
      });
    },
    [token, watchlist, debouncedSaveUserAssets]
  );

  if (isLoadingAssets && !initialFetchDone.current) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        Loading dashboard data...
      </div>
    );
  }
  if (!token && !isLoadingAssets) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        Please login to view the dashboard.
      </div>
    );
  }
  if (assetError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-destructive">
        Error: {assetError}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-background/95 min-h-screen text-foreground flex flex-col lg:flex-row relative">
      <ActualWatchlistSidebar
        watchlist={watchlist}
        remove={removeFromWatchlist}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 max-w-7xl py-8">
          {/* Market Overview Section */}
          <TabSection />
          <MarketIndices
            watchlist={watchlist}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
          />

          {/* Trading Section */}
          <div className="space-y-12">
            <MostBought
              onAddToPortfolio={(item) =>
                addToPortfolio({
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                })
              }
              watchlist={watchlist}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
            />

            <TopGainers
              onAddToPortfolio={(item) =>
                addToPortfolio({
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                })
              }
              watchlist={watchlist}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
            />
          </div>

          {/* Tools and Features Section */}
          <ProductsAndTools />

          {/* Portfolio and Analytics Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 my-12">
            <div className="xl:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Portfolio Overview
                </h2>
                <p className="text-muted-foreground">Track your investments and performance</p>
              </div>
              <PortfolioSidebarComponent
                portfolio={portfolio}
                remove={removeFromPortfolio}
                updatePrice={updatePrice}
                handleTransaction={handleTransaction}
              />
            </div>
            <div className="space-y-6">
              <TopByMarketCap />
            </div>
          </div>

          {/* News and Insights Section */}
          <div className="mt-12">
            <NewsFeed />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnhancedTradeProDashboard;
