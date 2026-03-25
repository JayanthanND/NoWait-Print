import { motion } from "motion/react";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
  maxLength?: number;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  icon,
  maxLength,
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 ${icon ? "pl-12" : ""} py-4 bg-white border rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
