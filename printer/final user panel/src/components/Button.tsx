import { motion } from "motion/react";
import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: ReactNode;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses = "rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40",
    secondary: "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm min-h-[40px]",
    md: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[56px]",
  };

  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""}`}
      style={isPrimary ? {
        background: "var(--gradient-primary)",
      } : undefined}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
