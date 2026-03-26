import { motion } from "motion/react";

interface ToggleProps {
  label?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function Toggle({ label, enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between w-full py-2"
    >
      {label && <span className="text-base text-gray-900">{label}</span>}
      <div
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
          enabled ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-300"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
          style={{
            left: enabled ? "calc(100% - 24px)" : "4px",
          }}
        />
      </div>
    </button>
  );
}
