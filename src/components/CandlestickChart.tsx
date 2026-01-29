"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  BarChart3,
  Play,
  Pause,
} from "lucide-react";

// Enhanced pattern identification with more accurate logic
const identifyPattern = (
  open: number,
  high: number,
  low: number,
  close: number,
  prevCandle?: { open: number; high: number; low: number; close: number }
): { pattern: string | null; strength: "weak" | "moderate" | "strong" } => {
  const bodySize = Math.abs(close - open);
  const totalRange = high - low;
  const upperWick = high - Math.max(open, close);
  const lowerWick = Math.min(open, close) - low;
  const bodyRatio = bodySize / totalRange;

  // Doji Pattern
  if (
    bodySize < totalRange * 0.1 &&
    upperWick > bodySize * 1.5 &&
    lowerWick > bodySize * 1.5
  ) {
    return {
      pattern: "Doji",
      strength:
        upperWick > bodySize * 3 && lowerWick > bodySize * 3
          ? "strong"
          : "moderate",
    };
  }

  if (
    bodyRatio > 0.3 &&
    lowerWick > bodySize * 2 &&
    upperWick < bodySize * 0.5 &&
    close > open
  ) {
    return {
      pattern: "Hammer",
      strength: lowerWick > bodySize * 3 ? "strong" : "moderate",
    };
  }

  // Inverted Hammer
  if (
    bodyRatio > 0.3 &&
    upperWick > bodySize * 2 &&
    lowerWick < bodySize * 0.5 &&
    close > open
  ) {
    return {
      pattern: "Inverted Hammer",
      strength: upperWick > bodySize * 3 ? "strong" : "moderate",
    };
  }

  // Shooting Star (bearish reversal)
  if (
    bodyRatio > 0.3 &&
    upperWick > bodySize * 2 &&
    lowerWick < bodySize * 0.5 &&
    close < open
  ) {
    return {
      pattern: "Shooting Star",
      strength: upperWick > bodySize * 3 ? "strong" : "moderate",
    };
  }

  // Hanging Man
  if (
    bodyRatio > 0.3 &&
    lowerWick > bodySize * 2 &&
    upperWick < bodySize * 0.5 &&
    close < open
  ) {
    return {
      pattern: "Hanging Man",
      strength: lowerWick > bodySize * 3 ? "strong" : "moderate",
    };
  }

  // Engulfing patterns (require previous candle)
  if (prevCandle) {
    const prevBodySize = Math.abs(prevCandle.close - prevCandle.open);

    // Bullish Engulfing
    if (
      close > open &&
      prevCandle.close < prevCandle.open &&
      open < prevCandle.close &&
      close > prevCandle.open &&
      bodySize > prevBodySize * 1.2
    ) {
      return {
        pattern: "Bullish Engulfing",
        strength: bodySize > prevBodySize * 1.5 ? "strong" : "moderate",
      };
    }

    // Bearish Engulfing
    if (
      close < open &&
      prevCandle.close > prevCandle.open &&
      open > prevCandle.close &&
      close < prevCandle.open &&
      bodySize > prevBodySize * 1.2
    ) {
      return {
        pattern: "Bearish Engulfing",
        strength: bodySize > prevBodySize * 1.5 ? "strong" : "moderate",
      };
    }
  }

  // Morning Star / Evening Star would require 3 candles - simplified version
  if (
    bodySize < totalRange * 0.2 &&
    Math.abs(upperWick - lowerWick) < totalRange * 0.3
  ) {
    return { pattern: "Star", strength: "weak" };
  }

  return { pattern: null, strength: "weak" };
};

interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  pattern: string | null;
  strength: "weak" | "moderate" | "strong";
  volume: number;
}

const CandlestickChart: React.FC = () => {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("2s");

  useEffect(() => {
    if (!isRunning) return;

    const intervalTime =
      selectedTimeframe === "1s"
        ? 1000
        : selectedTimeframe === "2s"
        ? 2000
        : 5000;

    const interval = setInterval(() => {
      const timestamp = Date.now();
      const basePrice = 1500 + Math.sin(timestamp / 10000) * 200; // Trending base
      const volatility = 30;

      const open = basePrice + (Math.random() - 0.5) * volatility;
      const closeChange = (Math.random() - 0.5) * volatility;
      const close = open + closeChange;
      const high = Math.max(open, close) + Math.random() * (volatility * 0.8);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.8);
      const volume = Math.floor(Math.random() * 10000 + 5000);

      setCandles((prev) => {
        const prevCandle = prev.length > 0 ? prev[prev.length - 1] : undefined;
        const patternResult = identifyPattern(
          open,
          high,
          low,
          close,
          prevCandle
        );

        const newCandle: CandleData = {
          time: new Date(timestamp).toLocaleTimeString(),
          timestamp,
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(close.toFixed(2)),
          pattern: patternResult.pattern,
          strength: patternResult.strength,
          volume,
        };

        return [...prev.slice(-99), newCandle];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isRunning, selectedTimeframe]);

  const detectedPatterns = candles.filter((candle) => candle.pattern);
  const recentPatterns = detectedPatterns.slice(-10);

  const chartData = candles.map((candle) => ({
    ...candle,
    price: candle.close,
  }));

  const getPatternIcon = (pattern: string) => {
    if (pattern.includes("Hammer") || pattern.includes("Bullish"))
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (pattern.includes("Star") || pattern.includes("Bearish"))
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-yellow-500" />;
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "text-red-400";
      case "moderate":
        return "text-orange-400";
      default:
        return "text-yellow-400";
    }
  };

  const PatternDot = (props: { cx: number; cy: number; payload?: CandleData }) => {
    const { cx, cy, payload } = props;
    if (!payload?.pattern) return null;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={payload.strength === "strong" ? "#ef4444" : "#f59e0b"}
        stroke="#ffffff"
        strokeWidth={1}
      />
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-card/40 via-card/20 to-card/40 backdrop-blur-sm text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3">
              Professional Candlestick Pattern Recognition
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
              Real-time pattern detection with professional-grade analysis and AI-powered insights
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-end">
            <div className="flex-shrink-0">
              <label className="block text-sm text-gray-400 mb-1 sm:hidden">
                Timeframe
              </label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full sm:w-auto bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="1s">1 Second</option>
                <option value="2s">2 Seconds</option>
                <option value="5s">5 Seconds</option>
              </select>
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95 min-w-[120px] ${
                isRunning
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {candles.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
              <div className="text-xs sm:text-sm text-gray-400">
                Current Price
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white truncate">
                ${candles[candles.length - 1]?.close.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
              <div className="text-xs sm:text-sm text-gray-400">
                Patterns Detected
              </div>
              <div className="text-lg sm:text-2xl font-bold text-blue-400">
                {detectedPatterns.length}
              </div>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700 col-span-2 lg:col-span-1">
              <div className="text-xs sm:text-sm text-gray-400">
                Last Pattern
              </div>
              <div className="text-sm sm:text-lg font-bold text-yellow-400 truncate">
                {detectedPatterns.length > 0
                  ? detectedPatterns[detectedPatterns.length - 1].pattern
                  : "None"}
              </div>
            </div>
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700 col-span-2 lg:col-span-1">
              <div className="text-xs sm:text-sm text-gray-400">Volume</div>
              <div className="text-sm sm:text-lg font-bold text-green-400 truncate">
                {candles[candles.length - 1]?.volume.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Main Chart - Responsive Height */}
        <div className="bg-gray-800 p-3 sm:p-6 rounded-lg border border-gray-700 mb-6">
          <div className="h-64 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  fontSize={10}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={10}
                  domain={["dataMin - 10", "dataMax + 10"]}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: any, props: any) => {
                    const data = props.payload;
                    return [
                      <div key="tooltip" className="text-xs">
                        <div>Open: ${data.open}</div>
                        <div>High: ${data.high}</div>
                        <div>Low: ${data.low}</div>
                        <div>Close: ${data.close}</div>
                        <div>Volume: {data.volume.toLocaleString()}</div>
                        {data.pattern && (
                          <div
                            className={`font-bold ${getStrengthColor(
                              data.strength
                            )}`}
                          >
                            Pattern: {data.pattern} ({data.strength})
                          </div>
                        )}
                      </div>,
                      "Details",
                    ];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
                {/* Pattern indicators as separate line with custom dot component */}
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="transparent"
                  strokeWidth={0}
                  dot={PatternDot}
                />
                {/* Add reference lines for support/resistance */}
                {candles.length > 20 && (
                  <>
                    <ReferenceLine
                      y={Math.max(...candles.slice(-20).map((c) => c.high))}
                      stroke="#ef4444"
                      strokeDasharray="5 5"
                      label={{
                        value: "Resistance",
                        fontSize: 10,
                        fill: "#ef4444",
                        position: "insideTopRight",
                      }}
                    />
                    <ReferenceLine
                      y={Math.min(...candles.slice(-20).map((c) => c.low))}
                      stroke="#22c55e"
                      strokeDasharray="5 5"
                      label={{
                        value: "Support",
                        fontSize: 10,
                        fill: "#22c55e",
                        position: "insideBottomRight",
                      }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Analysis - Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Patterns */}
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span>Recent Patterns</span>
            </h3>
            <div className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
              {recentPatterns.length > 0 ? (
                recentPatterns
                  .slice()
                  .reverse()
                  .map((candle, index) => (
                    <div
                      key={`pattern-${candle.timestamp}-${index}`}
                      className={`p-3 rounded-lg border-l-4 ${
                        candle.strength === "strong"
                          ? "border-red-500 bg-red-900/20"
                          : candle.strength === "moderate"
                          ? "border-orange-500 bg-orange-900/20"
                          : "border-yellow-500 bg-yellow-900/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            {getPatternIcon(candle.pattern!)}
                          </div>
                          <span className="font-semibold text-white text-sm sm:text-base truncate">
                            {candle.pattern}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded flex-shrink-0 ${getStrengthColor(
                              candle.strength
                            )}`}
                          >
                            {candle.strength.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                          {candle.time}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 mt-1">
                        Price: ${candle.close} | Volume:{" "}
                        {candle.volume.toLocaleString()}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base">
                    No patterns detected yet
                  </p>
                  <p className="text-xs sm:text-sm">
                    Patterns will appear as market data updates
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pattern Legend */}
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>Pattern Guide</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <div className="font-semibold text-green-400 mb-1">
                  Bullish Patterns
                </div>
                <div className="text-gray-300 text-xs sm:text-sm">
                  Hammer, Bullish Engulfing, Inverted Hammer
                </div>
              </div>
              <div className="p-3 bg-red-900/20 rounded-lg border-l-4 border-red-500">
                <div className="font-semibold text-red-400 mb-1">
                  Bearish Patterns
                </div>
                <div className="text-gray-300 text-xs sm:text-sm">
                  Shooting Star, Bearish Engulfing, Hanging Man
                </div>
              </div>
              <div className="p-3 bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                <div className="font-semibold text-yellow-400 mb-1">
                  Neutral Patterns
                </div>
                <div className="text-gray-300 text-xs sm:text-sm">
                  Doji, Star formations
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                <div className="font-semibold text-blue-400 mb-2 text-sm">
                  Strength Indicators
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                  <span className="text-red-400">● Strong</span>
                  <span className="text-orange-400">● Moderate</span>
                  <span className="text-yellow-400">● Weak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;
