"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Brain, ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import DataAnalyticsDashboard from "@/components/DataAnalyticsDashboard";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Types
type MarketStatus = "BULLISH" | "BEARISH" | "NEUTRAL";
type Trend = "up" | "down" | "neutral";

interface Metric {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: Trend;
}

// Helper function to determine trend
const getTrend = (value: number): Trend => {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
};

// Components
const AnalyticsHeader = () => (
  <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="inline-flex items-center justify-center gap-3 mb-6">
      <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
        <BarChart3 className="text-primary w-8 h-8" />
      </div>
    </div>
    <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
      Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Analytics</span>
    </h1>
    <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
      Gain a competitive edge with our professional-grade market intelligence and AI-powered predictions.
    </p>
  </motion.div>
);

const MetricCard = ({ metric, index }: { metric: Metric; index: number }) => {
  const { title, value, icon: Icon, trend } = metric;

  const trendClasses = {
    up: {
      bg: "bg-primary/10",
      text: "text-primary",
      icon: ArrowUpRight,
    },
    down: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      icon: ArrowDownRight,
    },
    neutral: {
      bg: "bg-muted/10",
      text: "text-muted-foreground",
      icon: Minus,
    },
  };
  
  const TrendIcon = title === "Performance" ? trendClasses[trend].icon : Icon;

  return (
    <motion.div
      key={title}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      whileHover={{ y: -5 }}
    >
      <div className={cn(
        "relative bg-card/70 backdrop-blur-lg rounded-xl p-5 border border-border/20 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 overflow-hidden",
        "hover:border-primary/30"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-300" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-2.5 rounded-lg", trendClasses[trend].bg)}>
              <TrendIcon className={cn("w-5 h-5", trendClasses[trend].text)} />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
            <p className={cn("text-2xl font-semibold", trendClasses[trend].text)}>
              {value}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatusIndicator = ({ label, colorClass }: { label: string; colorClass: string }) => (
    <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border", colorClass)}>
      <div className={cn("w-2 h-2 rounded-full animate-pulse", colorClass.replace(/text-\w+/g, 'bg-primary').replace(/border-\w+/g, 'bg-primary'))} />
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/20 shadow-soft-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="relative px-6 py-5 border-b border-border/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Advanced Analytics</h2>
            <p className="text-sm text-muted-foreground">Real-time market data and technical indicators</p>
          </div>
          <StatusIndicator label="LIVE" colorClass="border-primary/20 text-primary" />
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
);


export default function Page() {
  const [marketStatus, setMarketStatus] = useState<MarketStatus>("BULLISH");
  const [performance, setPerformance] = useState(12.4);

  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: MarketStatus[] = ["BULLISH", "BEARISH", "NEUTRAL"];
      setMarketStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      setPerformance(parseFloat((Math.random() * 20 - 10).toFixed(1)));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const performanceTrend = getTrend(performance);

  const metrics: Metric[] = [
    {
      title: "Market Status",
      value: marketStatus,
      icon: TrendingUp,
      trend: marketStatus === "BULLISH" ? "up" : marketStatus === "BEARISH" ? "down" : "neutral",
    },
    {
      title: "Performance",
      value: `${performance > 0 ? "+" : ""}${performance}%`,
      icon: Activity, // Placeholder, actual icon is based on trend in MetricCard
      trend: performanceTrend,
    },
    {
      title: "Active Indicators",
      value: "4",
      icon: Activity,
      trend: "neutral", // Or some other logic
    },
    {
      title: "AI Insights",
      value: "Live",
      icon: Brain,
      trend: "up", // Or some other logic
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <div className="relative overflow-hidden">
        {/* Subtle background gradients */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <main className="container mx-auto px-4 py-10">
          <AnalyticsHeader />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {metrics.map((metric, index) => (
              <MetricCard key={metric.title} metric={metric} index={index} />
            ))}
          </motion.div>

          <DashboardWrapper>
            <DataAnalyticsDashboard />
          </DashboardWrapper>
        </main>
      </div>
    </div>
  );
}
