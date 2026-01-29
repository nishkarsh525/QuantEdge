"use client";
import { useState, useEffect, useRef } from "react";

interface Order {
  type: "BUY" | "SELL";
  price: number;
  quantity: number;
  status: "Pending" | "Filled";
  time: string;
  id: number;
}

interface MarketOrdersProps {
  marketPrice: number;
  onTrade: (order: Order) => void;
  cashBalance?: number;
  stockBalance?: number;
}

const MarketOrders = ({
  marketPrice,
  onTrade,
  cashBalance = 10000,
  stockBalance = 0,
}: MarketOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [notification, setNotification] = useState<string>("");
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | "info"
  >("info");

  const orderIdCounter = useRef(0);
  const processedOrders = useRef(new Set<number>());

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(""), 4000);
  };

  useEffect(() => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => {
        if (processedOrders.current.has(order.id)) {
          return order;
        }
        const shouldFill =
          order.status === "Pending" &&
          ((order.type === "BUY" && marketPrice <= order.price) ||
            (order.type === "SELL" && marketPrice >= order.price));
        if (shouldFill) {
          processedOrders.current.add(order.id);
          const filledOrder = {
            ...order,
            status: "Filled" as const,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          };
          onTrade(filledOrder);
          showNotification(
            `Limit ${order.type} order filled: ${
              order.quantity
            } shares at $${order.price.toFixed(2)}`,
            "success"
          );
          return filledOrder;
        }
        return order;
      });
      setTimeout(() => {
        setOrders((current) =>
          current.filter((order) => order.status !== "Filled")
        );
      }, 3000);
      return updatedOrders;
    });
  }, [marketPrice, onTrade]); // onTrade was missing, important for callback stability

  const canBuy = (price: number, qty: number) => {
    const totalCost = price * qty;
    return cashBalance >= totalCost;
  };

  const canSell = (qty: number) => {
    return stockBalance >= qty;
  };

  const placeMarketOrder = (type: "BUY" | "SELL") => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      showNotification("Please enter a valid quantity", "error");
      return;
    }
    if (type === "BUY" && !canBuy(marketPrice, qty)) {
      showNotification(
        `Insufficient cash. Need $${(marketPrice * qty).toFixed(
          2
        )}, have $${cashBalance.toFixed(2)}`,
        "error"
      );
      return;
    }
    if (type === "SELL" && !canSell(qty)) {
      showNotification(
        `Insufficient stock. Need ${qty} shares, have ${stockBalance}`,
        "error"
      );
      return;
    }
    const order: Order = {
      id: orderIdCounter.current++,
      type,
      price: marketPrice,
      quantity: qty,
      status: "Filled",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    onTrade(order);
    showNotification(
      `Market ${type} executed: ${qty} shares at $${marketPrice.toFixed(2)}`,
      "success"
    );
  };

  const placeLimitOrder = (type: "BUY" | "SELL") => {
    const price = parseFloat(limitPrice);
    const qty = parseInt(quantity);
    if (isNaN(price) || price <= 0) {
      showNotification("Please enter a valid limit price", "error");
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      showNotification("Please enter a valid quantity", "error");
      return;
    }
    if (type === "BUY" && !canBuy(price, qty)) {
      showNotification(
        `Insufficient cash for limit order. Need $${(price * qty).toFixed(
          2
        )}, have $${cashBalance.toFixed(2)}`,
        "error"
      );
      return;
    }
    if (type === "SELL" && !canSell(qty)) {
      showNotification(
        `Insufficient stock for limit order. Need ${qty} shares, have ${stockBalance}`,
        "error"
      );
      return;
    }
    const wouldFillImmediately =
      (type === "BUY" && marketPrice <= price) ||
      (type === "SELL" && marketPrice >= price);
    if (wouldFillImmediately) {
      const order: Order = {
        id: orderIdCounter.current++,
        type,
        price: marketPrice,
        quantity: qty,
        status: "Filled",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      onTrade(order);
      showNotification(
        `Limit order filled immediately at market price: ${qty} shares at $${marketPrice.toFixed(
          2
        )}`,
        "success"
      );
    } else {
      const newOrder: Order = {
        id: orderIdCounter.current++,
        type,
        price,
        quantity: qty,
        status: "Pending",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      showNotification(
        `Limit ${type} order placed: ${qty} shares at $${price.toFixed(2)}`,
        "info"
      );
    }
    setLimitPrice("");
    setQuantity("1");
  };

  const cancelOrder = (orderId: number) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
    showNotification("Order cancelled", "info");
  };

  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const recentlyFilled = orders.filter((order) => order.status === "Filled");

  return (
    <div className="bg-gray-700 p-3 sm:p-4 md:p-6 rounded-lg mt-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
        🏪 Manual Trading Orders
      </h3>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-2 sm:p-3 rounded-lg text-center font-semibold text-sm sm:text-base ${
            notificationType === "success"
              ? "bg-green-600 text-white"
              : notificationType === "error"
              ? "bg-red-600 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          {notification}
        </div>
      )}

      {/* Current Market Info */}
      <div className="mb-4 text-center bg-gray-800 p-2 sm:p-3 rounded-lg">
        <div className="text-xs sm:text-sm text-gray-400">
          Current Market Price
        </div>
        <div className="text-xl sm:text-2xl font-bold text-blue-400">
          ${marketPrice.toFixed(2)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Cash: ${cashBalance.toFixed(2)} | Stock: {stockBalance} shares
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Market Orders */}
        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
          <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
            📈 Market Orders
          </h4>
          <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
            Execute immediately at current market price
          </p>

          <div className="mb-2 sm:mb-3">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 text-sm sm:text-base rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-400 focus:outline-none"
              min="1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => placeMarketOrder("BUY")}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
              disabled={!quantity || parseInt(quantity) <= 0}
            >
              🟢 Market Buy
            </button>
            <button
              onClick={() => placeMarketOrder("SELL")}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              disabled={!quantity || parseInt(quantity) <= 0}
            >
              🔴 Market Sell
            </button>
          </div>
        </div>

        {/* Limit Orders */}
        <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
          <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
            🎯 Limit Orders
          </h4>
          <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
            Execute only when price reaches your target
          </p>

          <div className="mb-2 sm:mb-3">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Limit Price ($)
            </label>
            <input
              type="number"
              placeholder="Enter target price"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="w-full p-2 text-sm sm:text-base rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-400 focus:outline-none"
              step="0.01"
              min="0.01"
            />
          </div>

          <div className="mb-2 sm:mb-3">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity} // Re-using the same quantity state for both market and limit. Consider separating if needed.
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 text-sm sm:text-base rounded-lg bg-gray-600 text-white border border-gray-500 focus:border-blue-400 focus:outline-none"
              min="1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => placeLimitOrder("BUY")}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              disabled={
                !limitPrice ||
                !quantity ||
                parseFloat(limitPrice) <= 0 ||
                parseInt(quantity) <= 0
              }
            >
              🔵 Limit Buy
            </button>
            <button
              onClick={() => placeLimitOrder("SELL")}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
              disabled={
                !limitPrice ||
                !quantity ||
                parseFloat(limitPrice) <= 0 ||
                parseInt(quantity) <= 0
              }
            >
              🟠 Limit Sell
            </button>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="mt-4 sm:mt-6 bg-gray-800 p-3 sm:p-4 rounded-lg">
        <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
          ⏳ Pending Limit Orders ({pendingOrders.length})
        </h4>
        {pendingOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-3 sm:py-4 text-sm sm:text-base">
            No pending orders
          </p>
        ) : (
          <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700 p-2 sm:p-3 rounded-lg gap-2 sm:gap-0"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span
                      className={`font-semibold text-sm sm:text-base ${
                        order.type === "BUY" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {order.type === "BUY" ? "🟢" : "🔴"} {order.type}
                    </span>
                    <span className="ml-2 text-white text-sm sm:text-base">
                      {order.quantity} shares at ${order.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 sm:mt-0">
                    Placed: {order.time} |
                    {order.type === "BUY"
                      ? ` Wait: Price ≤ $${order.price.toFixed(2)}`
                      : ` Wait: Price ≥ $${order.price.toFixed(2)}`}
                  </div>
                </div>
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm rounded transition-colors self-end sm:self-center"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Filled Orders */}
      {recentlyFilled.length > 0 && (
        <div className="mt-4 bg-green-900 bg-opacity-30 p-3 sm:p-4 rounded-lg border border-green-500">
          <h4 className="text-base sm:text-lg font-bold mb-2 text-green-400">
            ✅ Recently Filled
          </h4>
          <div className="space-y-1 max-h-32 sm:max-h-40 overflow-y-auto">
            {recentlyFilled.map((order) => (
              <div key={order.id} className="text-xs sm:text-sm text-green-300">
                {order.type} {order.quantity} shares at $
                {order.price.toFixed(2)} - {order.time}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketOrders;
