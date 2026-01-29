'use client';
import CandlestickChart from "@/components/CandlestickChart";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Eye, Zap } from "lucide-react";

export default function CandlestickChartPage() {
  return (
    <div className="bg-gradient-to-br from-background via-background to-background/95 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              Advanced Charting
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Professional candlestick pattern recognition with real-time analysis and AI-powered insights
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <motion.div
              className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-2 bg-green-500/10 rounded-lg w-fit mx-auto mb-3">
                <TrendingUp className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Pattern Recognition</h3>
              <p className="text-sm text-muted-foreground">Advanced candlestick pattern detection</p>
            </motion.div>

            <motion.div
              className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="p-2 bg-blue-500/10 rounded-lg w-fit mx-auto mb-3">
                <Activity className="text-blue-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-time Analysis</h3>
              <p className="text-sm text-muted-foreground">Live market data and instant updates</p>
            </motion.div>

            <motion.div
              className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="p-2 bg-purple-500/10 rounded-lg w-fit mx-auto mb-3">
                <Eye className="text-purple-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Visual Indicators</h3>
              <p className="text-sm text-muted-foreground">Support, resistance, and trend lines</p>
            </motion.div>

            <motion.div
              className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="p-2 bg-amber-500/10 rounded-lg w-fit mx-auto mb-3">
                <Zap className="text-amber-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Fast Execution</h3>
              <p className="text-sm text-muted-foreground">High-performance charting engine</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Chart Dashboard */}
        <motion.div
          className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
            <h2 className="text-2xl font-bold text-foreground mb-2">Professional Candlestick Analysis</h2>
            <p className="text-muted-foreground">Advanced pattern recognition with real-time market data</p>
          </div>
          <div className="p-6">
            <CandlestickChart />
          </div>
        </motion.div>
      </main>
    </div>
  );
}