import { ReactNode } from "react";
import { motion } from "motion/react";

interface StickyBottomBarProps {
  children: ReactNode;
  price?: number;
}

export function StickyBottomBar({ children, price }: StickyBottomBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-30"
    >
      <div className="max-w-2xl mx-auto">
        {price !== undefined && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ₹{price.toFixed(2)}
            </span>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}
