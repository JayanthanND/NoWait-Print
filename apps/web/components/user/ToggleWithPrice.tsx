import { motion } from "motion/react";

interface ToggleWithPriceProps {
  label: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  offPrice?: number;
  onPrice?: number;
}

export function ToggleWithPrice({
  label,
  enabled,
  onChange,
  offPrice,
  onPrice,
}: ToggleWithPriceProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {offPrice !== undefined && onPrice !== undefined && (
          <span className="text-xs text-gray-500 mt-0.5">
            B&W ₹{offPrice.toFixed(2)} • Color ₹{onPrice.toFixed(2)}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          enabled ? "bg-indigo-600" : "bg-gray-300"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
