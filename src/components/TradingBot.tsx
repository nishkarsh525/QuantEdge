"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MarketOrders from "./MarketOrders";
import BackTesting from "./BackTesting";

type Trade = {
  type: "BUY" | "SELL";
  price: number;
  time: string;
  quantity: number;
  id: number;
};
interface Order {
  type: "BUY" | "SELL";
  price: number;
  quantity: number;
  status: "Pending" | "Filled";
  time: string;
}
const TradingBot = () => {
  const [marketData, setMarketData] = useState<number[]>([100]);
  const [chartData, setChartData] = useState<
    { time: string; price: number; index: number }[]
  >([{ time: new Date().toLocaleTimeString(), price: 100, index: 0 }]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [cashBalance, setCashBalance] = useState(10000);
  const [stockBalance, setStockBalance] = useState(0);
  const [running, setRunning] = useState(false);
  const [profitLoss, setProfitLoss] = useState(0);
  const [totalValue, setTotalValue] = useState(10000);

  // Trading parameters
  const [tradeQuantity, setTradeQuantity] = useState(5);
  const [buyThresholdPercent, setBuyThresholdPercent] = useState(3);
  const [sellThresholdPercent, setSellThresholdPercent] = useState(3);
  const [volatility, setVolatility] = useState(5);
  const [trend, setTrend] = useState(0);

  const [debugInfo, setDebugInfo] = useState("");
  const [lastTradeTime, setLastTradeTime] = useState("");

  const tradeIdCounter = useRef(0);
  const marketIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tradeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setChartData([
      { time: new Date().toLocaleTimeString(), price: 100, index: 0 },
    ]);
  }, []);

  useEffect(() => {
    if (marketIntervalRef.current) {
      clearInterval(marketIntervalRef.current);
    }
    if (!running) return;

    const generateMarketData = () => {
      setMarketData((prevData) => {
        const lastPrice = prevData[prevData.length - 1];
        const randomFactor = (Math.random() - 0.5) * volatility;
        const trendFactor = trend / 10;
        const newPrice = Math.max(
          1,
          lastPrice * (1 + (randomFactor + trendFactor) / 100)
        );
        const updatedData = [...prevData, newPrice];
        return updatedData.length > 100 ? updatedData.slice(-100) : updatedData;
      });

      setChartData((prevChart) => {
        const newPoint = {
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          price: 0,
          index: prevChart.length,
        };
        setMarketData((currentData) => {
          newPoint.price = currentData[currentData.length - 1];
          return currentData;
        });
        const updatedChart = [...prevChart, newPoint];
        return updatedChart.length > 50
          ? updatedChart.slice(-50)
          : updatedChart;
      });
    };
    marketIntervalRef.current = setInterval(generateMarketData, 1000);
    return () => {
      if (marketIntervalRef.current) {
        clearInterval(marketIntervalRef.current);
      }
    };
  }, [running, volatility, trend]);

  useEffect(() => {
    if (tradeIntervalRef.current) {
      clearInterval(tradeIntervalRef.current);
    }
    if (!running) return;

    const executeTrade = () => {
      setMarketData((currentMarketData) => {
        setCashBalance((currentCash) => {
          setStockBalance((currentStock) => {
            if (currentMarketData.length < 5) return currentStock;

            const lastPrice = currentMarketData[currentMarketData.length - 1];
            const recentPrices = currentMarketData.slice(-5);
            const movingAverage =
              recentPrices.reduce((sum, price) => sum + price, 0) /
              recentPrices.length;

            const buyThreshold =
              movingAverage * (1 - buyThresholdPercent / 100);
            const sellThreshold =
              movingAverage * (1 + sellThresholdPercent / 100);

            let debugMessage = `Price: $${lastPrice.toFixed(
              2
            )}, MA: $${movingAverage.toFixed(2)} | `;

            if (
              currentCash >= lastPrice * tradeQuantity &&
              (lastPrice < buyThreshold || Math.random() < 0.1)
            ) {
              const cost = lastPrice * tradeQuantity;
              const newTrade: Trade = {
                type: "BUY",
                price: lastPrice,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
                quantity: tradeQuantity,
                id: tradeIdCounter.current++,
              };
              setTrades((prev) => [...prev, newTrade]);
              setCashBalance(currentCash - cost);
              setLastTradeTime(
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              );
              debugMessage += `BOUGHT ${tradeQuantity} shares`;
              return currentStock + tradeQuantity;
            } else if (
              currentStock >= tradeQuantity &&
              (lastPrice > sellThreshold || Math.random() < 0.05)
            ) {
              const revenue = lastPrice * tradeQuantity;
              const newTrade: Trade = {
                type: "SELL",
                price: lastPrice,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
                quantity: tradeQuantity,
                id: tradeIdCounter.current++,
              };
              setTrades((prev) => [...prev, newTrade]);
              setCashBalance(currentCash + revenue);
              setLastTradeTime(
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              );
              debugMessage += `SOLD ${tradeQuantity} shares`;
              return currentStock - tradeQuantity;
            } else {
              debugMessage += `Waiting... (Cash: $${currentCash.toFixed(
                0
              )}, Stock: ${currentStock})`;
            }
            setDebugInfo(debugMessage);
            return currentStock;
          });
          return currentCash;
        });
        return currentMarketData;
      });
    };
    tradeIntervalRef.current = setInterval(executeTrade, 2000);
    return () => {
      if (tradeIntervalRef.current) {
        clearInterval(tradeIntervalRef.current);
      }
    };
  }, [running, buyThresholdPercent, sellThresholdPercent, tradeQuantity]);

  useEffect(() => {
    if (marketData.length > 0) {
      const currentPrice = marketData[marketData.length - 1];
      const stockValue = stockBalance * currentPrice;
      setTotalValue(cashBalance + stockValue);
    }
  }, [cashBalance, stockBalance, marketData]);

  useEffect(() => {
    let realizedPL = 0;
    // FIX: Changed 'let' to 'const' for buyStack
    const buyStack: { price: number; quantity: number }[] = [];
    for (const trade of trades) {
      if (trade.type === "BUY") {
        buyStack.push({ price: trade.price, quantity: trade.quantity });
      } else if (trade.type === "SELL") {
        let remainingSellQuantity = trade.quantity;
        while (remainingSellQuantity > 0 && buyStack.length > 0) {
          const oldestBuy = buyStack[0];
          const quantityToSell = Math.min(
            remainingSellQuantity,
            oldestBuy.quantity
          );
          realizedPL += (trade.price - oldestBuy.price) * quantityToSell;
          oldestBuy.quantity -= quantityToSell;
          remainingSellQuantity -= quantityToSell;
          if (oldestBuy.quantity === 0) {
            buyStack.shift();
          }
        }
      }
    }
    setProfitLoss(realizedPL);
  }, [trades]);

  const reset = () => {
    setRunning(false);
    if (marketIntervalRef.current) clearInterval(marketIntervalRef.current);
    if (tradeIntervalRef.current) clearInterval(tradeIntervalRef.current);
    setMarketData([100]);
    setChartData([
      {
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        price: 100,
        index: 0,
      },
    ]);
    setTrades([]);
    setCashBalance(10000);
    setStockBalance(0);
    setProfitLoss(0);
    setTotalValue(10000);
    setDebugInfo("");
    setLastTradeTime("");
    tradeIdCounter.current = 0;
  };

  const toggleBot = () => setRunning((prev) => !prev);

  const currentPrice = marketData[marketData.length - 1] || 100;
  const handleTradeExecution = (order: Order) => {
    const newTrade: Trade = {
      id: Date.now(),
      type: order.type,
      price: order.price,
      time: order.time,
      quantity: order.quantity,
    };
    if (order.type === "BUY") {
      setCashBalance((prev) => prev - order.price * order.quantity);
      setStockBalance((prev) => prev + order.quantity);
    } else {
      setCashBalance((prev) => prev + order.price * order.quantity);
      setStockBalance((prev) => prev - order.quantity);
    }
    setTrades((prevTrades) => [...prevTrades, newTrade]);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-7xl mx-auto my-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">
        Algorithmic Trading Bot Simulation
      </h2>

      {/* Debug Info */}
      <div className="mb-4 p-2 sm:p-3 bg-gray-900 rounded-lg text-xs sm:text-sm font-mono break-words">
        <div className="text-yellow-400 mb-1">Debug Info:</div>
        <div>{debugInfo || "Bot inactive"}</div>
        {lastTradeTime && (
          <div className="text-green-400 mt-1">Last Trade: {lastTradeTime}</div>
        )}
        <div className="text-blue-400 mt-1">
          Market Data Points: {marketData.length} | Trades: {trades.length}
        </div>
      </div>

      {/* Current Status */}
      <div className="mb-4 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-gray-700 px-3 sm:px-4 py-2 rounded-lg">
          <span className="text-sm sm:text-lg">
            Current Price:{" "}
            <span className="font-bold text-blue-400">
              ${currentPrice.toFixed(2)}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                running ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            ></span>
            <span className="text-xs sm:text-sm">
              {running ? "Bot Active" : "Bot Stopped"}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6 h-64 sm:h-72 md:h-[300px]">
        {" "}
        {/* Responsive height */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 10 }}
              stroke="#9CA3AF"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#272F3E", // Darker gray
                border: "1px solid #4B5563", // Lighter border
                borderRadius: "0.375rem", // Rounded-md
                fontSize: "0.75rem", // text-xs
              }}
              itemStyle={{ color: "#E5E7EB" }} // Lighter text for items
              labelStyle={{ color: "#D1D5DB", fontWeight: "bold" }} // Lighter label
            />
            <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              name="Market Price"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controls and Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Controls */}
        <div className="bg-gray-700 p-3 sm:p-4 md:p-6 rounded-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
            🎛️ Bot Controls
          </h3>

          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-colors ${
                running
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={toggleBot}
            >
              {running ? "🛑 Stop Bot" : "▶️ Start Bot"}
            </button>
            <button
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-colors"
              onClick={reset}
            >
              🔄 Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-medium mb-1 sm:mb-2">
                Trade Quantity
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={tradeQuantity}
                onChange={(e) => setTradeQuantity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-center font-bold mt-1">
                {tradeQuantity} shares
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 sm:mb-2">
                Market Volatility
              </label>
              <input
                type="range"
                min="1"
                max="15"
                value={volatility}
                onChange={(e) => setVolatility(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-center font-bold mt-1">{volatility}%</div>
            </div>

            <div>
              <label className="block font-medium mb-1 sm:mb-2">
                Buy Threshold
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={buyThresholdPercent}
                onChange={(e) =>
                  setBuyThresholdPercent(parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-center font-bold mt-1">
                {buyThresholdPercent}% below MA
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 sm:mb-2">
                Sell Threshold
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sellThresholdPercent}
                onChange={(e) =>
                  setSellThresholdPercent(parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-center font-bold mt-1">
                {sellThresholdPercent}% above MA
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium mb-1 sm:mb-2">
                Market Trend
              </label>
              <input
                type="range"
                min="-5"
                max="5"
                value={trend}
                onChange={(e) => setTrend(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-center font-bold mt-1">
                {trend < 0
                  ? "📉 Bearish"
                  : trend > 0
                  ? "📈 Bullish"
                  : "➡️ Neutral"}{" "}
                ({trend})
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-gray-700 p-3 sm:p-4 md:p-6 rounded-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
            💼 Portfolio Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg text-center">
              <div className="text-gray-400 text-xs sm:text-sm font-medium">
                💰 Cash Balance
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-400">
                ${cashBalance.toFixed(2)}
              </div>
            </div>

            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg text-center">
              <div className="text-gray-400 text-xs sm:text-sm font-medium">
                📊 Stock Holdings
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-400">
                {stockBalance} Units
              </div>
              <div className="text-xs sm:text-sm text-gray-300">
                ≈ ${(stockBalance * currentPrice).toFixed(2)}
              </div>
            </div>

            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg text-center sm:col-span-2 lg:col-span-1">
              <div className="text-gray-400 text-xs sm:text-sm font-medium">
                🏦 Total Portfolio
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                ${totalValue.toFixed(2)}
              </div>
              <div
                className={`text-xs sm:text-sm font-medium ${
                  totalValue > 10000
                    ? "text-green-400"
                    : totalValue < 10000
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {totalValue > 10000 ? "📈+" : totalValue < 10000 ? "📉" : ""}
                {(totalValue - 10000).toFixed(2)} (
                {((totalValue / 10000 - 1) * 100).toFixed(2)}%)
              </div>
            </div>

            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg text-center sm:col-span-2 lg:col-span-1">
              <div className="text-gray-400 text-xs sm:text-sm font-medium">
                💸 Realized P&L
              </div>
              <div
                className={`text-xl sm:text-2xl font-bold ${
                  profitLoss >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ${profitLoss >= 0 ? "+" : ""}
                {profitLoss.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">From completed trades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade History */}
      <div className="bg-gray-700 p-3 sm:p-4 md:p-6 rounded-lg">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
          📋 Trade History ({trades.length} trades)
        </h3>
        <div className="max-h-40 sm:max-h-48 md:max-h-56 overflow-y-auto bg-gray-800 p-2 sm:p-4 rounded-lg">
          {trades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] sm:min-w-full">
                {" "}
                {/* Min-width for horizontal scroll on small screens */}
                <thead className="sticky top-0 bg-gray-800 z-10">
                  <tr className="text-gray-400 text-left border-b border-gray-600 text-xs sm:text-sm">
                    <th className="pb-2 px-1 sm:px-2">Time</th>
                    <th className="pb-2 px-1 sm:px-2">Type</th>
                    <th className="pb-2 px-1 sm:px-2">Price</th>
                    <th className="pb-2 px-1 sm:px-2">Qty</th>
                    <th className="pb-2 px-1 sm:px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[...trades].reverse().map((trade) => (
                    <tr
                      key={trade.id}
                      className={`text-xs sm:text-sm border-b border-gray-700 ${
                        trade.type === "BUY" ? "text-green-300" : "text-red-300" // Softer colors
                      }`}
                    >
                      <td className="py-1.5 sm:py-2 px-1 sm:px-2">
                        {trade.time}
                      </td>
                      <td className="py-1.5 sm:py-2 px-1 sm:px-2 font-semibold whitespace-nowrap">
                        {trade.type === "BUY" ? "🟢 BUY" : "🔴 SELL"}
                      </td>
                      <td className="py-1.5 sm:py-2 px-1 sm:px-2">
                        ${trade.price.toFixed(2)}
                      </td>
                      <td className="py-1.5 sm:py-2 px-1 sm:px-2">
                        {trade.quantity}
                      </td>
                      <td className="py-1.5 sm:py-2 px-1 sm:px-2 font-semibold">
                        ${(trade.price * trade.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="text-3xl sm:text-4xl mb-2">🤖</div>
              <p className="text-gray-400 text-sm sm:text-base">
                No trades yet... Start the bot to see some action!
              </p>
              {running && (
                <p className="text-yellow-400 text-xs sm:text-sm mt-2">
                  Bot is running, waiting for trading opportunities...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* External Components - Assuming they handle their own responsiveness or stack naturally */}
      <div className="mt-6 space-y-6">
        <MarketOrders
          marketPrice={currentPrice}
          onTrade={handleTradeExecution}
          cashBalance={cashBalance}
          stockBalance={stockBalance}
        />
        <BackTesting historicalData={marketData} />
      </div>
    </div>
  );
};

export default TradingBot;
