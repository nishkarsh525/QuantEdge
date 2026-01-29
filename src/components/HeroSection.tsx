"use client";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Brain } from "lucide-react";
import DataAnalyticsDashboard from "@/components/DataAnalyticsDashboard";

export default function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <BarChart3 className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Data Analytics
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
          Gain deep insights from your trading data with advanced analytics and AI-powered predictions
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div
            className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-2 bg-blue-500/10 rounded-lg w-fit mx-auto mb-3">
              <TrendingUp className="text-blue-500 w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Market Trends</h3>
            <p className="text-sm text-muted-foreground">Real-time trend analysis and predictions</p>
          </motion.div>

          <motion.div
            className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="p-2 bg-green-500/10 rounded-lg w-fit mx-auto mb-3">
              <Activity className="text-green-500 w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Live Metrics</h3>
            <p className="text-sm text-muted-foreground">RSI, volatility, and moving averages</p>
          </motion.div>

          <motion.div
            className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="p-2 bg-purple-500/10 rounded-lg w-fit mx-auto mb-3">
              <Brain className="text-purple-500 w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Trading Bot</h3>
            <p className="text-sm text-muted-foreground">Algorithmic trading strategies</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Analytics Dashboard */}
      <motion.div
        className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="text-2xl font-bold text-foreground mb-2">Advanced Analytics Dashboard</h2>
          <p className="text-muted-foreground">Professional-grade trading analytics and market intelligence</p>
        </div>
        <div className="p-6">
          <DataAnalyticsDashboard />
        </div>
      </motion.div>
    </>
  );
}