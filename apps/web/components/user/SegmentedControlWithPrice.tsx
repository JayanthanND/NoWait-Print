"use client";

import { motion } from "motion/react";

interface SegmentOption {
  value: string;
  label: string;
  price?: number;
}

interface SegmentedControlWithPriceProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControlWithPrice({
  options,
  value,
  onChange,
}: SegmentedControlWithPriceProps) {
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div className="relative bg-gray-100 rounded-xl p-1 flex">
      <motion.div
        className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm"
        initial={false}
        animate={{
          left: `${(selectedIndex * 100) / options.length}%`,
          width: `${100 / options.length}%`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className="relative flex-1 px-4 py-2 text-sm font-medium transition-colors z-10"
        >
          <div className="flex flex-col items-center">
            <span
              className={
                option.value === value ? "text-gray-900" : "text-gray-600"
              }
            >
              {option.label}
            </span>
            {option.price !== undefined && (
              <span className="text-xs text-gray-500 mt-0.5">
                ₹{option.price.toFixed(2)}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
