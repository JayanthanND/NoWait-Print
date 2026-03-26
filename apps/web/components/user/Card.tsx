"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  elevated?: boolean;
}

export function Card({ children, className = "", onClick, elevated = false }: CardProps) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 transition-all duration-200 ${
        elevated ? "shadow-[var(--shadow-elevated)]" : "shadow-[var(--shadow-soft)]"
      } ${onClick ? "cursor-pointer hover:shadow-[var(--shadow-elevated)] active:scale-[0.98]" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}
