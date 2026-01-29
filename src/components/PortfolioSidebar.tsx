// src/components/PortfolioSidebar.tsx
"use client";
import { fadeInUp } from "@/lib/animation";
import { motion } from "framer-motion";
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export interface PortfolioItem {
  name: string;
  currentPrice: number;
  quantity: number;
  purchasePrice: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface PortfolioSidebarProps {
  portfolio: PortfolioItem[];
  remove: (name: string) => void;
  updatePrice: (name: string, newPrice: number) => void;
  handleTransaction: (
    name: string,
    type: "buy" | "sell",
    price: number
  ) => void;
}

const PortfolioSidebarComponent: React.FC<PortfolioSidebarProps> = ({
  portfolio,
  remove,
  updatePrice, // Assumed to be memoized in parent
  handleTransaction, // Assumed to be memoized in parent
}) => {
  // Local state for simulated prices. This is ONLY for the visual effect.
  // The source of truth for actual current prices is the `portfolio` prop.
  const [displayPrices, setDisplayPrices] = useState<{ [key: string]: number }>(
    {}
  );

  // Ref to track if the initial display prices have been set from the portfolio prop
  const initialSyncDone = useRef(false);

  // --- EFFECT 1: Synchronize displayPrices with portfolio prop ---
  // This effect ensures that our local displayPrices are initialized from
  // and updated by the parent's portfolio data.
  useEffect(() => {
    // console.log("EFFECT 1: Syncing displayPrices with portfolio prop", portfolio);
    const newDisplayPrices: { [key: string]: number } = {};
    let changesMade = false;

    portfolio.forEach((item) => {
      const currentPropPrice =
        typeof item.currentPrice === "number" ? item.currentPrice : 0;
      newDisplayPrices[item.name] = currentPropPrice;
      if (displayPrices[item.name] !== currentPropPrice) {
        changesMade = true;
      }
    });

    // If the portfolio items themselves changed (e.g., item added/removed)
    if (
      Object.keys(newDisplayPrices).length !== Object.keys(displayPrices).length
    ) {
      changesMade = true;
    }

    if (changesMade) {
      // console.log("EFFECT 1: Updating displayPrices from prop:", newDisplayPrices);
      setDisplayPrices(newDisplayPrices);
    }
    initialSyncDone.current = true; // Mark that an attempt to sync has occurred
  }, [portfolio]); // Dependency: Only the portfolio prop from parent

  // --- EFFECT 2: Interval for simulating price fluctuations for DISPLAY ONLY ---
  // This effect updates the local `displayPrices` for visual purposes.
  // It then calls `updatePrice` to notify the parent of these *simulated* changes.
  useEffect(() => {
    if (!initialSyncDone.current || portfolio.length === 0) {
      // console.log("EFFECT 2: Interval - Skipping, initial sync not done or no portfolio.");
      return; // Don't run interval if not synced or portfolio is empty
    }

    // console.log("EFFECT 2: Interval - Setting up simulation interval.");
    const intervalId = setInterval(() => {
      // Create a *new* object for the next state to ensure React detects a change
      const nextDisplayPrices: { [key: string]: number } = {};
      let pricesChangedInSim = false;

      portfolio.forEach((item) => {
        // Iterate based on the current portfolio prop
        const basePrice =
          displayPrices[item.name] !== undefined
            ? displayPrices[item.name] // Use current display price as base for simulation
            : typeof item.currentPrice === "number"
            ? item.currentPrice
            : 0; // Fallback to prop price

        const numericBasePrice = typeof basePrice === "number" ? basePrice : 0;
        const randomFactor = (Math.random() * 2 - 1) * 0.005; // Smaller fluctuation (+/- 0.5%)
        const newSimulatedPrice = Math.max(
          numericBasePrice * (1 + randomFactor),
          0.01
        );

        nextDisplayPrices[item.name] = newSimulatedPrice;
        if (displayPrices[item.name] !== newSimulatedPrice) {
          pricesChangedInSim = true;
        }
      });

      if (pricesChangedInSim) {
        // console.log("EFFECT 2: Interval - Simulated prices changed:", nextDisplayPrices);
        setDisplayPrices(nextDisplayPrices); // Update local display prices

        // Propagate these *simulated* changes to the parent
        Object.entries(nextDisplayPrices).forEach(([name, newSimPrice]) => {
          const parentItem = portfolio.find((p) => p.name === name);
          // IMPORTANT: Only call updatePrice if the new simulated price is different
          // from what the PARENT currently holds. This is the key to prevent loops.
          if (parentItem && parentItem.currentPrice !== newSimPrice) {
            // console.log(`EFFECT 2: Interval - Calling updatePrice for ${name} to ${newSimPrice}`);
            updatePrice(name, newSimPrice);
          }
        });
      }
    }, 2500); // Simulation interval

    return () => {
      // console.log("EFFECT 2: Interval - Clearing simulation interval.");
      clearInterval(intervalId);
    };
    // Dependencies:
    // - `portfolio`: To know which items to simulate for. If portfolio items change (add/remove), restart interval.
    // - `displayPrices`: The simulation bases off the current display prices.
    // - `updatePrice`: The stable function to call the parent.
  }, [portfolio, displayPrices, updatePrice]);

  // --- JSX Calculation Setup ---
  const portfolioStats = portfolio.reduce(
    (acc, item) => {
      // ALWAYS use item.currentPrice from the prop (parent's state) for financial calculations
      const safeCurrentPrice =
        typeof item.currentPrice === "number" ? item.currentPrice : 0;
      const itemCurrentValue = safeCurrentPrice * item.quantity;
      const itemProfitLoss = itemCurrentValue - item.totalInvested;
      return {
        totalInvested: acc.totalInvested + item.totalInvested,
        currentValue: acc.currentValue + itemCurrentValue,
        totalProfitLoss: acc.totalProfitLoss + itemProfitLoss,
      };
    },
    { totalInvested: 0, currentValue: 0, totalProfitLoss: 0 }
  );

  const totalProfitLossPercent =
    portfolioStats.totalInvested > 0
      ? (portfolioStats.totalProfitLoss / portfolioStats.totalInvested) * 100
      : 0;

  return (
    <motion.aside
      {...fadeInUp}
      className="w-full xl:w-96 bg-card/60 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="text-primary" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Portfolio
            </h3>
            <p className="text-sm text-muted-foreground">
              Your investment holdings
            </p>
          </div>
        </div>
        <div className="p-2 bg-muted/30 rounded-lg">
          <PieChart className="text-muted-foreground" size={18} />
        </div>
      </div>

      {portfolio.length > 0 && (
        <motion.div
          className="mb-8 p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-xl border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <TrendingUp className="mr-2 text-primary" size={18} />
            Portfolio Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="bg-muted/30 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-muted-foreground text-sm mb-1">Total Invested</p>
              <p className="font-bold text-foreground text-lg">
                ₹{portfolioStats.totalInvested.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </p>
            </motion.div>
            <motion.div
              className="bg-muted/30 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-muted-foreground text-sm mb-1">Current Value</p>
              <p className="font-bold text-foreground text-lg">
                ₹{portfolioStats.currentValue.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </p>
            </motion.div>
            <motion.div
              className="col-span-2 bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-muted-foreground text-sm mb-2">Total P&L</p>
              <div
                className={`font-bold text-lg flex items-center ${
                  portfolioStats.totalProfitLoss >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {portfolioStats.totalProfitLoss >= 0 ? (
                  <TrendingUp size={18} className="mr-2" />
                ) : (
                  <TrendingDown size={18} className="mr-2" />
                )}
                ₹{Math.abs(portfolioStats.totalProfitLoss).toLocaleString("en-IN", {
                  maximumFractionDigits: 0
                })}
                <span className="ml-2 text-sm">
                  ({totalProfitLossPercent >= 0 ? "+" : ""}
                  {totalProfitLossPercent.toFixed(2)}%)
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {portfolio.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 bg-muted/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <PieChart className="text-muted-foreground w-10 h-10" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            No assets in portfolio
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Start building your investment portfolio
          </p>
          <motion.button
            className="text-primary hover:text-primary/80 font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Markets →
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {portfolio.map((item, index) => {
            // For DISPLAY, use the local displayPrices.
            // For financial CALCULATIONS and TRANSACTIONS, use item.currentPrice from the prop.
            const priceForDisplay =
              displayPrices[item.name] !== undefined
                ? displayPrices[item.name]
                : item.currentPrice; // Fallback to prop price

            const actualCurrentPriceFromProp = item.currentPrice;
            const itemCurrentValueUsingActual =
              actualCurrentPriceFromProp * item.quantity;
            const itemProfitLossUsingActual =
              itemCurrentValueUsingActual - item.totalInvested;
            const itemProfitLossPercentUsingActual =
              item.totalInvested > 0
                ? (itemProfitLossUsingActual / item.totalInvested) * 100
                : 0;
            const allocation =
              portfolioStats.currentValue > 0
                ? (itemCurrentValueUsingActual / portfolioStats.currentValue) *
                  100
                : 0;
            // Price for transaction MUST come from the parent's data (prop)
            const priceForTransaction = actualCurrentPriceFromProp;

            return (
              <motion.div
                key={item.name}
                className="bg-card/60 backdrop-blur-sm p-5 rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-base mb-1">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity} shares
                      </span>
                      <span className="text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                        {allocation.toFixed(1)}% allocation
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => remove(item.name)}
                    className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-all duration-200"
                    title="Remove from portfolio"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <motion.div
                    className="bg-muted/30 p-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-muted-foreground text-xs mb-1">Current Price</p>
                    <p className="font-bold text-foreground text-sm">
                      ₹{priceForDisplay.toFixed(2)}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-muted/30 p-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-muted-foreground text-xs mb-1">Avg. Buy Price</p>
                    <p className="font-bold text-foreground text-sm">
                      ₹{(typeof item.purchasePrice === "number"
                        ? item.purchasePrice
                        : 0
                      ).toFixed(2)}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-muted/30 p-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-muted-foreground text-xs mb-1">Total Invested</p>
                    <p className="font-bold text-foreground text-sm">
                      ₹{(typeof item.totalInvested === "number"
                        ? item.totalInvested
                        : 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-muted/30 p-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-muted-foreground text-xs mb-1">Current Value</p>
                    <p className="font-bold text-foreground text-sm">
                      ₹{itemCurrentValueUsingActual.toLocaleString("en-IN")}
                    </p>
                  </motion.div>
                </div>
                <div className="mb-4">
                  <p className="text-muted-foreground text-xs mb-2">P&L</p>
                  <motion.div
                    className={`font-bold text-base flex items-center p-3 rounded-lg ${
                      itemProfitLossUsingActual >= 0
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {itemProfitLossUsingActual >= 0 ? (
                      <TrendingUp size={16} className="mr-2" />
                    ) : (
                      <TrendingDown size={16} className="mr-2" />
                    )}
                    ₹{Math.abs(itemProfitLossUsingActual).toLocaleString("en-IN", {
                      maximumFractionDigits: 0
                    })}
                    <span className="ml-2 text-sm">
                      ({itemProfitLossUsingActual >= 0 ? "+" : ""}
                      {itemProfitLossPercentUsingActual.toFixed(2)}%)
                    </span>
                  </motion.div>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() =>
                      handleTransaction(item.name, "buy", priceForTransaction)
                    }
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Buy More
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      handleTransaction(item.name, "sell", priceForTransaction)
                    }
                    className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={item.quantity <= 0}
                  >
                    Sell
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.aside>
  );
};
export default PortfolioSidebarComponent;
