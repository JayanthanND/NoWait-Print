import { motion } from "motion/react";

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className="relative flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        >
          {value === option.value && (
            <motion.div
              layoutId="segmented-control-active"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${value === option.value ? "text-gray-900" : "text-gray-600"}`}>
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
