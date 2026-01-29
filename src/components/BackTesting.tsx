import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

interface BacktestResult {
  startBalance: number;
  endBalance: number;
  finalPortfolioValue: number;
  tradesExecuted: number;
  profitLoss: number;
  profitLossPercentage: number;
  winRate: number;
  maxDrawdown: number;
  sharpeRatio: number;
  volatility: number;
  totalReturn: number;
  annualizedReturn: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  avgWinAmount: number;
  avgLossAmount: number;
  performanceData: Array<{
    day: number;
    portfolioValue: number;
    price: number;
    cash: number;
    holdings: number;
    drawdown: number;
    cumulativeReturn: number;
  }>;
  trades: Array<{
    day: number;
    type: "BUY" | "SELL";
    price: number;
    quantity: number;
    balance: number;
    pnl?: number;
    cumulativePnl?: number;
  }>;
  monthlyReturns: Array<{
    month: string;
    return: number;
    portfolioValue: number;
  }>;
}

interface BackTestingProps {
  historicalData?: number[];
}

const BackTesting = ({ historicalData = [] }: BackTestingProps) => {
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(
    null
  );
  const [strategy, setStrategy] = useState<
    | "BUY_LOW_SELL_HIGH"
    | "TREND_FOLLOWING"
    | "MEAN_REVERSION"
    | "MOMENTUM"
    | "BOLLINGER_BANDS"
  >("BUY_LOW_SELL_HIGH");
  const [isLoading, setIsLoading] = useState(false);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [transactionFee, setTransactionFee] = useState(0.1);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "performance" | "trades" | "analysis"
  >("overview");

  const generateSampleData = () => {
    const data = [];
    let price = 100;
    let trend = 0.001;

    for (let i = 0; i < 365; i++) {
      // Full year of data
      const volatility = 0.02 + 0.01 * Math.sin(i / 30);
      const noise = (Math.random() - 0.5) * volatility * price;
      const trendComponent = trend * price;

      price += noise + trendComponent;
      price = Math.max(price, 10);

      if (i % 100 === 0) {
        trend *= -0.5;
      }

      data.push(Math.round(price * 100) / 100);
    }
    return data;
  };

  const dataToUse =
    historicalData.length > 0 ? historicalData : generateSampleData();

  // Validation function
  const validateInputs = (): string[] => {
    const validationErrors = [];

    if (initialBalance < 100) {
      validationErrors.push("Initial balance must be at least $100");
    }
    if (initialBalance > 10000000) {
      validationErrors.push("Initial balance cannot exceed $10,000,000");
    }
    if (transactionFee < 0 || transactionFee > 5) {
      validationErrors.push("Transaction fee must be between 0% and 5%");
    }
    if (dataToUse.length < 30) {
      validationErrors.push(
        "Need at least 30 data points for meaningful backtesting"
      );
    }

    return validationErrors;
  };

  const calculateMovingAverage = (
    data: number[],
    period: number,
    index: number
  ): number => {
    if (index < period - 1) return data[index];
    const slice = data.slice(index - period + 1, index + 1);
    return slice.reduce((sum, val) => sum + val, 0) / period;
  };

  const calculateRSI = (
    data: number[],
    period: number,
    index: number
  ): number => {
    if (index < period) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = index - period + 1; i <= index; i++) {
      const change = data[i] - data[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / (avgLoss || 0.01);
    return 100 - 100 / (1 + rs);
  };

  const calculateBollingerBands = (
    data: number[],
    period: number,
    index: number,
    stdDev: number = 2
  ) => {
    const ma = calculateMovingAverage(data, period, index);
    if (index < period - 1) return { upper: ma, middle: ma, lower: ma };

    const slice = data.slice(index - period + 1, index + 1);
    const variance =
      slice.reduce((sum, val) => sum + (val - ma) ** 2, 0) / period;
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: ma + stdDev * standardDeviation,
      middle: ma,
      lower: ma - stdDev * standardDeviation,
    };
  };

  const runBacktest = async () => {
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let cash = initialBalance;
      let holdings = 0;
      let tradesExecuted = 0;
      const performanceData: BacktestResult["performanceData"] = [];
      const trades: BacktestResult["trades"] = [];
      const monthlyReturns: BacktestResult["monthlyReturns"] = [];

      let maxPortfolioValue = initialBalance;
      let maxDrawdown = 0;
      let winningTrades = 0;
      let losingTrades = 0;
      let totalTrades = 0;
      let lastBuyPrice = 0;
      let consecutiveWins = 0;
      let consecutiveLosses = 0;
      let maxConsecutiveWins = 0;
      let maxConsecutiveLosses = 0;
      let totalWinAmount = 0;
      let totalLossAmount = 0;
      let cumulativePnl = 0;

      dataToUse.forEach((price, index) => {
        let shouldBuy = false;
        let shouldSell = false;

        // Enhanced strategy logic
        if (strategy === "BUY_LOW_SELL_HIGH") {
          const ma20 = calculateMovingAverage(dataToUse, 20, index);
          const ma50 = calculateMovingAverage(dataToUse, 50, index);
          shouldBuy =
            price < ma20 * 0.95 &&
            ma20 > ma50 &&
            cash >= price * (1 + transactionFee / 100);
          shouldSell = price > ma20 * 1.05 && holdings > 0;
        } else if (strategy === "TREND_FOLLOWING") {
          if (index >= 20) {
            const ma10 = calculateMovingAverage(dataToUse, 10, index);
            const ma20 = calculateMovingAverage(dataToUse, 20, index);
            const ma50 = calculateMovingAverage(dataToUse, 50, index);
            shouldBuy =
              ma10 > ma20 &&
              ma20 > ma50 &&
              cash >= price * (1 + transactionFee / 100);
            shouldSell = ma10 < ma20 && holdings > 0;
          }
        } else if (strategy === "MEAN_REVERSION") {
          const rsi = calculateRSI(dataToUse, 14, index);
          const ma20 = calculateMovingAverage(dataToUse, 20, index);
          shouldBuy =
            rsi < 25 &&
            price < ma20 &&
            cash >= price * (1 + transactionFee / 100);
          shouldSell = rsi > 75 && holdings > 0;
        } else if (strategy === "MOMENTUM") {
          if (index >= 10) {
            const shortReturn =
              (price - dataToUse[index - 5]) / dataToUse[index - 5];
            const longReturn =
              (price - dataToUse[index - 10]) / dataToUse[index - 10];
            shouldBuy =
              shortReturn > 0.03 &&
              longReturn > 0.05 &&
              cash >= price * (1 + transactionFee / 100);
            shouldSell = shortReturn < -0.03 && holdings > 0;
          }
        } else if (strategy === "BOLLINGER_BANDS") {
          const bands = calculateBollingerBands(dataToUse, 20, index);
          shouldBuy =
            price < bands.lower && cash >= price * (1 + transactionFee / 100);
          shouldSell = price > bands.upper && holdings > 0;
        }

        // Execute trades with transaction costs
        if (shouldBuy) {
          const totalCost = price * (1 + transactionFee / 100);
          const sharesToBuy = Math.floor(cash / totalCost);
          if (sharesToBuy > 0) {
            const actualCost = sharesToBuy * totalCost;
            cash -= actualCost;
            holdings += sharesToBuy;
            tradesExecuted++;
            lastBuyPrice = price;

            trades.push({
              day: index,
              type: "BUY" as const,
              price: Number(price.toFixed(2)),
              quantity: sharesToBuy,
              balance: Number((cash + holdings * price).toFixed(2)),
              cumulativePnl: cumulativePnl,
            });
          }
        } else if (shouldSell) {
          const grossSellAmount = holdings * price;
          const transactionCost = grossSellAmount * (transactionFee / 100);
          const netSellAmount = grossSellAmount - transactionCost;

          cash += netSellAmount;
          const tradePnl = netSellAmount - holdings * lastBuyPrice;
          cumulativePnl += tradePnl;

          if (tradePnl > 0) {
            winningTrades++;
            totalWinAmount += tradePnl;
            consecutiveWins++;
            consecutiveLosses = 0;
            maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
          } else {
            losingTrades++;
            totalLossAmount += Math.abs(tradePnl);
            consecutiveLosses++;
            consecutiveWins = 0;
            maxConsecutiveLosses = Math.max(
              maxConsecutiveLosses,
              consecutiveLosses
            );
          }
          totalTrades++;

          trades.push({
            day: index,
            type: "SELL" as const,
            price: Number(price.toFixed(2)),
            quantity: holdings,
            balance: Number(cash.toFixed(2)),
            pnl: Number(tradePnl.toFixed(2)),
            cumulativePnl: Number(cumulativePnl.toFixed(2)),
          });

          holdings = 0;
          tradesExecuted++;
        }

        // Track performance metrics
        const portfolioValue = Number((cash + holdings * price).toFixed(2));
        maxPortfolioValue = Math.max(maxPortfolioValue, portfolioValue);
        const drawdown =
          maxPortfolioValue > 0
            ? (maxPortfolioValue - portfolioValue) / maxPortfolioValue
            : 0;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
        const cumulativeReturn =
          ((portfolioValue - initialBalance) / initialBalance) * 100;

        performanceData.push({
          day: index,
          portfolioValue,
          price: Number(price.toFixed(2)),
          cash: Number(cash.toFixed(2)),
          holdings,
          drawdown: drawdown * 100,
          cumulativeReturn,
        });

        // Monthly returns calculation
        if (index % 30 === 0 || index === dataToUse.length - 1) {
          const monthIndex = Math.floor(index / 30);
          const prevValue =
            monthIndex > 0
              ? monthlyReturns[monthIndex - 1]?.portfolioValue || initialBalance
              : initialBalance;
          const monthlyReturn =
            ((portfolioValue - prevValue) / prevValue) * 100;

          monthlyReturns.push({
            month: `Month ${monthIndex + 1}`,
            return: Number(monthlyReturn.toFixed(2)),
            portfolioValue,
          });
        }
      });

      // Final calculations
      const finalPrice = dataToUse[dataToUse.length - 1];
      const finalCash = cash + holdings * finalPrice;
      const profitLoss = finalCash - initialBalance;
      const profitLossPercentage = (profitLoss / initialBalance) * 100;
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
      const avgWinAmount =
        winningTrades > 0 ? totalWinAmount / winningTrades : 0;
      const avgLossAmount =
        losingTrades > 0 ? totalLossAmount / losingTrades : 0;

      // Enhanced metrics calculations
      const returns = performanceData.map((d, i) =>
        i > 0 &&
        performanceData[i - 1] &&
        performanceData[i - 1].portfolioValue > 0
          ? (d.portfolioValue - performanceData[i - 1].portfolioValue) /
            performanceData[i - 1].portfolioValue
          : 0
      );

      const validReturns = returns.filter((r) => !isNaN(r) && isFinite(r));
      const avgReturn =
        validReturns.length > 0
          ? validReturns.reduce((sum, r) => sum + r, 0) / validReturns.length
          : 0;
      const returnStdDev =
        validReturns.length > 1
          ? Math.sqrt(
              validReturns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) /
                validReturns.length
            )
          : 0;

      const annualizedReturn =
        Math.pow(finalCash / initialBalance, 365 / dataToUse.length) - 1;
      const sharpeRatio =
        returnStdDev > 0
          ? ((avgReturn - 0.02 / 365) / returnStdDev) * Math.sqrt(365)
          : 0;
      const volatility = returnStdDev * Math.sqrt(365) * 100;

      setBacktestResults({
        startBalance: initialBalance,
        endBalance: cash,
        finalPortfolioValue: finalCash,
        tradesExecuted,
        profitLoss,
        profitLossPercentage,
        winRate,
        maxDrawdown: maxDrawdown * 100,
        sharpeRatio,
        volatility,
        totalReturn: profitLossPercentage,
        annualizedReturn: annualizedReturn * 100,
        maxConsecutiveWins,
        maxConsecutiveLosses,
        avgWinAmount,
        avgLossAmount,
        performanceData,
        trades,
        monthlyReturns,
      });
    } catch (error) {
      setErrors([
        "An error occurred during backtesting. Please try again." + error,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrategyDescription = () => {
    switch (strategy) {
      case "BUY_LOW_SELL_HIGH":
        return "Buy when price is 5% below 20-day MA (with trend confirmation), sell when 5% above";
      case "TREND_FOLLOWING":
        return "Buy when 10-day MA > 20-day MA > 50-day MA, sell when trend reverses";
      case "MEAN_REVERSION":
        return "Buy when RSI < 25 and price below 20-day MA, sell when RSI > 75";
      case "MOMENTUM":
        return "Buy on strong momentum (3% in 5 days, 5% in 10 days), sell on reversal";
      case "BOLLINGER_BANDS":
        return "Buy when price touches lower Bollinger Band, sell when it touches upper band";
      default:
        return "";
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-8 rounded-xl shadow-2xl min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-4xl font-bold mb-8 text-center text-white bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          🚀 Advanced Backtesting System
        </h3>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-lg">
            <h4 className="text-red-300 font-semibold mb-2">
              ⚠️ Validation Errors:
            </h4>
            <ul className="text-red-200 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-white mb-4">
                📊 Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Initial Balance ($)
                  </label>
                  <input
                    type="number"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(Number(e.target.value))}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                    min="100"
                    max="10000000"
                    step="100"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Transaction Fee (%)
                  </label>
                  <input
                    type="number"
                    value={transactionFee}
                    onChange={(e) => setTransactionFee(Number(e.target.value))}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                    min="0"
                    max="5"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-300 font-medium mb-2">
                  Trading Strategy
                </label>
                <select
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  value={strategy}
                  onChange={(e) =>
                    setStrategy(e.target.value as typeof strategy)
                  }
                >
                  <option value="BUY_LOW_SELL_HIGH">Buy Low, Sell High</option>
                  <option value="TREND_FOLLOWING">Trend Following</option>
                  <option value="MEAN_REVERSION">Mean Reversion</option>
                  <option value="MOMENTUM">Momentum Trading</option>
                  <option value="BOLLINGER_BANDS">Bollinger Bands</option>
                </select>
              </div>

              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-300">
                  {getStrategyDescription()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-xl font-semibold text-white mb-4">
                🎯 Execute
              </h4>
              <button
                className={`w-full px-6 py-4 rounded-lg font-bold text-white transition-all transform hover:scale-105 ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
                }`}
                onClick={runBacktest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Running Backtest...
                  </span>
                ) : (
                  "🚀 Run Backtest"
                )}
              </button>

              <div className="mt-4 text-center text-sm text-gray-400">
                <p>📈 Data Points: {dataToUse.length}</p>
                <p>
                  📊{" "}
                  {historicalData.length > 0
                    ? "Using Provided Data"
                    : "Using Sample Data"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {backtestResults && (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "overview", label: "📊 Overview", icon: "📊" },
                { key: "performance", label: "📈 Performance", icon: "📈" },
                { key: "trades", label: "💼 Trades", icon: "💼" },
                { key: "analysis", label: "🔍 Analysis", icon: "🔍" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">
                      ${backtestResults.finalPortfolioValue.toLocaleString()}
                    </div>
                    <div className="text-green-100 text-sm">Final Value</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-lg text-center">
                    <div
                      className={`text-2xl font-bold ${
                        backtestResults.profitLoss >= 0
                          ? "text-white"
                          : "text-red-200"
                      }`}
                    >
                      {backtestResults.profitLossPercentage >= 0 ? "+" : ""}
                      {backtestResults.profitLossPercentage.toFixed(2)}%
                    </div>
                    <div className="text-blue-100 text-sm">Total Return</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">
                      {backtestResults.tradesExecuted}
                    </div>
                    <div className="text-purple-100 text-sm">Total Trades</div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">
                      {backtestResults.winRate.toFixed(1)}%
                    </div>
                    <div className="text-orange-100 text-sm">Win Rate</div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h5 className="text-lg font-semibold text-white mb-4">
                      💰 Profitability
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total P&L:</span>
                        <span
                          className={
                            backtestResults.profitLoss >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          ${backtestResults.profitLoss.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Annualized Return:
                        </span>
                        <span className="text-blue-400">
                          {backtestResults.annualizedReturn.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Win:</span>
                        <span className="text-green-400">
                          ${backtestResults.avgWinAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Loss:</span>
                        <span className="text-red-400">
                          ${backtestResults.avgLossAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h5 className="text-lg font-semibold text-white mb-4">
                      ⚡ Risk Metrics
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Drawdown:</span>
                        <span className="text-red-400">
                          {backtestResults.maxDrawdown.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volatility:</span>
                        <span className="text-yellow-400">
                          {backtestResults.volatility.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sharpe Ratio:</span>
                        <span className="text-blue-400">
                          {backtestResults.sharpeRatio.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk-Adj Return:</span>
                        <span className="text-purple-400">
                          {(
                            backtestResults.annualizedReturn /
                            backtestResults.volatility
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h5 className="text-lg font-semibold text-white mb-4">
                      🎯 Trade Stats
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Streak:</span>
                        <span className="text-green-400">
                          {backtestResults.maxConsecutiveWins}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Loss Streak:</span>
                        <span className="text-red-400">
                          {backtestResults.maxConsecutiveLosses}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg per Trade:</span>
                        <span className="text-blue-400">
                          $
                          {(
                            backtestResults.profitLoss /
                            Math.max(backtestResults.tradesExecuted, 1)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Final Cash:</span>
                        <span className="text-white">
                          ${backtestResults.endBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <div className="space-y-6">
                {/* Portfolio Performance Chart */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold text-white mb-4">
                    📈 Portfolio Performance Over Time
                  </h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={backtestResults.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="day"
                        stroke="#9CA3AF"
                        label={{
                          value: "Trading Days",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#374151",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                        formatter={(value, name) => [
                          name === "portfolioValue"
                            ? `${Number(value).toLocaleString()}`
                            : `${Number(value).toFixed(2)}`,
                          name === "portfolioValue"
                            ? "Portfolio Value"
                            : "Asset Price",
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="portfolioValue"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="Portfolio Value"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Asset Price"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Drawdown Chart */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold text-white mb-4">
                    📉 Drawdown Analysis
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={backtestResults.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#374151",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                        formatter={(value) => [
                          `${Number(value).toFixed(2)}%`,
                          "Drawdown",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="drawdown"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.3}
                        name="Drawdown %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Monthly Returns */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold text-white mb-4">
                    📅 Monthly Returns
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={backtestResults.monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#374151",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                        formatter={(value) => [
                          `${Number(value).toFixed(2)}%`,
                          "Monthly Return",
                        ]}
                      />
                      <Bar
                        dataKey="return"
                        fill="#8884d8"
                        name="Monthly Return %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Trades Tab */}
            {activeTab === "trades" && (
              <div className="space-y-6">
                {/* Trade Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">
                      {
                        backtestResults.trades.filter((t) => t.pnl && t.pnl > 0)
                          .length
                      }
                    </div>
                    <div className="text-green-100 text-sm">Winning Trades</div>
                  </div>
                  <div className="bg-red-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">
                      {
                        backtestResults.trades.filter((t) => t.pnl && t.pnl < 0)
                          .length
                      }
                    </div>
                    <div className="text-red-100 text-sm">Losing Trades</div>
                  </div>
                  <div className="bg-blue-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white">
                      {
                        backtestResults.trades.filter((t) => t.type === "BUY")
                          .length
                      }
                    </div>
                    <div className="text-blue-100 text-sm">Buy Orders</div>
                  </div>
                </div>

                {/* Trades Table */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold text-white mb-4">
                    📊 Trade History (Last 20)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left p-3 text-gray-300">Day</th>
                          <th className="text-left p-3 text-gray-300">Type</th>
                          <th className="text-left p-3 text-gray-300">Price</th>
                          <th className="text-left p-3 text-gray-300">
                            Quantity
                          </th>
                          <th className="text-left p-3 text-gray-300">P&L</th>
                          <th className="text-left p-3 text-gray-300">
                            Balance
                          </th>
                          <th className="text-left p-3 text-gray-300">
                            Cum. P&L
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {backtestResults.trades
                          .slice(-20)
                          .reverse()
                          .map((trade, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-700 hover:bg-gray-700"
                            >
                              <td className="p-3 text-white">{trade.day}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    trade.type === "BUY"
                                      ? "bg-green-600 text-white"
                                      : "bg-red-600 text-white"
                                  }`}
                                >
                                  {trade.type}
                                </span>
                              </td>
                              <td className="p-3 text-white">
                                ${trade.price.toFixed(2)}
                              </td>
                              <td className="p-3 text-white">
                                {trade.quantity.toLocaleString()}
                              </td>
                              <td className="p-3">
                                {trade.pnl !== undefined ? (
                                  <span
                                    className={
                                      trade.pnl >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }
                                  >
                                    ${trade.pnl.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="p-3 text-white">
                                ${trade.balance.toLocaleString()}
                              </td>
                              <td className="p-3">
                                {trade.cumulativePnl !== undefined ? (
                                  <span
                                    className={
                                      trade.cumulativePnl >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }
                                  >
                                    ${trade.cumulativePnl.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                {/* Strategy Performance Analysis */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold text-white mb-4">
                    🎯 Strategy Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-3">
                        Performance Metrics
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Strategy:</span>
                          <span className="text-white font-medium">
                            {strategy.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Risk-Adjusted Return:
                          </span>
                          <span className="text-blue-400">
                            {(
                              backtestResults.annualizedReturn /
                              Math.max(backtestResults.volatility, 1)
                            ).toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Profit Factor:</span>
                          <span className="text-green-400">
                            {backtestResults.avgLossAmount > 0
                              ? (
                                  backtestResults.avgWinAmount /
                                  backtestResults.avgLossAmount
                                ).toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Trade Frequency:
                          </span>
                          <span className="text-purple-400">
                            {(
                              (backtestResults.tradesExecuted /
                                dataToUse.length) *
                              100
                            ).toFixed(1)}
                            % of days
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-semibold text-white mb-3">
                        Market Conditions
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Data Period:</span>
                          <span className="text-white">
                            {dataToUse.length} days
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price Range:</span>
                          <span className="text-white">
                            ${Math.min(...dataToUse).toFixed(2)} - $
                            {Math.max(...dataToUse).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Return:</span>
                          <span className="text-yellow-400">
                            {(
                              ((dataToUse[dataToUse.length - 1] -
                                dataToUse[0]) /
                                dataToUse[0]) *
                              100
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Alpha vs Market:
                          </span>
                          <span
                            className={
                              backtestResults.profitLossPercentage >
                              ((dataToUse[dataToUse.length - 1] -
                                dataToUse[0]) /
                                dataToUse[0]) *
                                100
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {(
                              backtestResults.profitLossPercentage -
                              ((dataToUse[dataToUse.length - 1] -
                                dataToUse[0]) /
                                dataToUse[0]) *
                                100
                            ).toFixed(2)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Rating */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold text-white mb-4">
                    ⭐ Performance Rating
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold mb-2 ${
                          backtestResults.profitLossPercentage >= 20
                            ? "text-green-400"
                            : backtestResults.profitLossPercentage >= 10
                            ? "text-yellow-400"
                            : backtestResults.profitLossPercentage >= 0
                            ? "text-blue-400"
                            : "text-red-400"
                        }`}
                      >
                        {backtestResults.profitLossPercentage >= 20
                          ? "A"
                          : backtestResults.profitLossPercentage >= 10
                          ? "B"
                          : backtestResults.profitLossPercentage >= 0
                          ? "C"
                          : "D"}
                      </div>
                      <div className="text-gray-400 text-sm">Return Grade</div>
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold mb-2 ${
                          backtestResults.maxDrawdown <= 5
                            ? "text-green-400"
                            : backtestResults.maxDrawdown <= 15
                            ? "text-yellow-400"
                            : backtestResults.maxDrawdown <= 25
                            ? "text-orange-400"
                            : "text-red-400"
                        }`}
                      >
                        {backtestResults.maxDrawdown <= 5
                          ? "A"
                          : backtestResults.maxDrawdown <= 15
                          ? "B"
                          : backtestResults.maxDrawdown <= 25
                          ? "C"
                          : "D"}
                      </div>
                      <div className="text-gray-400 text-sm">Risk Grade</div>
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold mb-2 ${
                          backtestResults.sharpeRatio >= 1.5
                            ? "text-green-400"
                            : backtestResults.sharpeRatio >= 1.0
                            ? "text-yellow-400"
                            : backtestResults.sharpeRatio >= 0.5
                            ? "text-orange-400"
                            : "text-red-400"
                        }`}
                      >
                        {backtestResults.sharpeRatio >= 1.5
                          ? "A"
                          : backtestResults.sharpeRatio >= 1.0
                          ? "B"
                          : backtestResults.sharpeRatio >= 0.5
                          ? "C"
                          : "D"}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Efficiency Grade
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h4 className="text-xl font-bold text-white mb-4">
                    💡 Strategy Recommendations
                  </h4>
                  <div className="space-y-3 text-sm">
                    {backtestResults.maxDrawdown > 20 && (
                      <div className="p-3 bg-red-900 border border-red-600 rounded">
                        <span className="text-red-300">⚠️ High Risk: </span>
                        <span className="text-red-200">
                          Consider position sizing or stop-loss mechanisms to
                          reduce drawdown.
                        </span>
                      </div>
                    )}

                    {backtestResults.winRate < 40 && (
                      <div className="p-3 bg-yellow-900 border border-yellow-600 rounded">
                        <span className="text-yellow-300">
                          💡 Low Win Rate:{" "}
                        </span>
                        <span className="text-yellow-200">
                          Focus on improving entry signals or consider mean
                          reversion strategies.
                        </span>
                      </div>
                    )}

                    {backtestResults.tradesExecuted <
                      dataToUse.length * 0.1 && (
                      <div className="p-3 bg-blue-900 border border-blue-600 rounded">
                        <span className="text-blue-300">📊 Low Activity: </span>
                        <span className="text-blue-200">
                          Strategy generates few trades. Consider more sensitive
                          parameters.
                        </span>
                      </div>
                    )}

                    {backtestResults.sharpeRatio > 1.5 && (
                      <div className="p-3 bg-green-900 border border-green-600 rounded">
                        <span className="text-green-300">✅ Excellent: </span>
                        <span className="text-green-200">
                          Strong risk-adjusted returns. Consider increasing
                          position size.
                        </span>
                      </div>
                    )}

                    {backtestResults.profitLossPercentage >
                      ((dataToUse[dataToUse.length - 1] - dataToUse[0]) /
                        dataToUse[0]) *
                        100 && (
                      <div className="p-3 bg-purple-900 border border-purple-600 rounded">
                        <span className="text-purple-300">
                          🎯 Alpha Generated:{" "}
                        </span>
                        <span className="text-purple-200">
                          Strategy outperformed buy-and-hold. Good market timing
                          ability.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackTesting;
