"use client";

import { motion } from "motion/react";
import { Check, Clock, Printer, Package, CheckCircle } from "lucide-react";

interface StatusTrackerProps {
  currentStatus: "uploaded" | "accepted" | "printing" | "ready" | "collected";
}

const statuses = [
  { id: "uploaded", label: "Uploaded", icon: Check },
  { id: "accepted", label: "Accepted", icon: Clock },
  { id: "printing", label: "Printing", icon: Printer },
  { id: "ready", label: "Ready", icon: Package },
  { id: "collected", label: "Collected", icon: CheckCircle },
];

export function StatusTracker({ currentStatus }: StatusTrackerProps) {
  const currentIndex = statuses.findIndex((s) => s.id === currentStatus);

  return (
    <div className="py-6">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10" />
        <div
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 -z-10 transition-all duration-500"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        />

        {/* Status items */}
        <div className="flex justify-between">
          {statuses.map((status, index) => {
            const Icon = status.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={status.id} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-indigo-200" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span
                  className={`text-xs font-medium text-center ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
