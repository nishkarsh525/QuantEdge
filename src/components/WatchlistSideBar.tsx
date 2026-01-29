"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, X, Trash, Star } from "lucide-react";
import { useState } from "react";

export interface WatchlistItem {
  name: string;
  price: number;
}

export interface WatchlistSidebarProps {
  watchlist: WatchlistItem[];
  remove: (name: string) => void;
}

const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  watchlist,
  remove,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Watchlist Toggle Button - Enhanced styling */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed top-20 right-4 sm:right-6 z-50 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-primary/20"
        onClick={() => setIsOpen(true)}
        aria-label="Toggle Watchlist"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ClipboardList size={20} />
        {watchlist.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md"
          >
            {watchlist.length}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sidebar - Enhanced styling */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 sm:w-96 bg-card/95 backdrop-blur-xl border-l border-border/50 shadow-2xl z-[60] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            >
              {/* Header - Enhanced */}
              <div className="flex justify-between items-center p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Watchlist
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Track your favorite stocks
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Close Watchlist"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Watchlist Content */}
              <div className="p-6">
                {watchlist.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-4 bg-muted/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <ClipboardList className="text-muted-foreground w-10 h-10" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      No items in watchlist
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add stocks to monitor their prices and performance
                    </p>
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      className="text-primary hover:text-primary/80 font-medium text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Browse Markets →
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {watchlist.length} item{watchlist.length !== 1 ? "s" : ""} tracked
                      </div>
                      <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                        Live Updates
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {watchlist.map((item, index) => (
                        <motion.li
                          key={`${item.name}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="group bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground truncate text-base mb-1">
                                {item.name}
                              </div>
                              <div className="text-lg font-bold text-primary">
                                ₹{item.price.toLocaleString('en-IN', {
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                            <motion.button
                              onClick={() => remove(item.name)}
                              className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-all duration-200 flex-shrink-0"
                              title="Remove from watchlist"
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.aside>

            {/* Backdrop - No change needed here for backdrop behavior */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 z-[55] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// AddToWatchlistButton component remains the same
export interface AddToWatchlistButtonProps {
  item: {
    name: string;
    price: number;
  };
  isInWatchlist: boolean;
  onAdd: (item: WatchlistItem) => void;
  onRemove: (name: string) => void;
}

export const AddToWatchlistButton: React.FC<AddToWatchlistButtonProps> = ({
  item,
  isInWatchlist,
  onAdd,
  onRemove,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isInWatchlist) {
      onRemove(item.name);
    } else {
      onAdd(item);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 shadow-sm hover:shadow-md
        ${
          isInWatchlist
            ? "bg-amber-500 text-amber-900 hover:bg-amber-400 focus:ring-amber-300 border border-amber-400"
            : "bg-card/60 backdrop-blur-sm text-foreground hover:bg-primary/10 focus:ring-primary/50 border border-border/50"
        }
      `}
      title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Star
        className={`w-4 h-4 ${
          isInWatchlist ? "fill-current" : ""
        }`}
      />
      <span>
        {isInWatchlist ? "Watching" : "Watch"}
      </span>
    </motion.button>
  );
};

export default WatchlistSidebar;
