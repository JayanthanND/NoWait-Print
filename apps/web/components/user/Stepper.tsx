"use client";

import { Minus, Plus } from "lucide-react";
import { motion } from "motion/react";

interface StepperProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({ label, value, onChange, min = 1, max = 999 }: StepperProps) {
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="flex items-center justify-between">
      {label && <span className="text-base text-gray-900">{label}</span>}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={decrement}
          disabled={value <= min}
          className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4 text-gray-700" />
        </motion.button>
        <span className="text-lg font-semibold text-gray-900 min-w-[40px] text-center">
          {value}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={increment}
          disabled={value >= max}
          className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 text-gray-700" />
        </motion.button>
      </div>
    </div>
  );
}
