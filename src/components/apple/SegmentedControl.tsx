"use client";

import React from "react";
import { motion } from "framer-motion";

interface Option<T> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (val: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="relative flex p-1 bg-[#E5E5EA]/80 backdrop-blur-md rounded-xl space-x-1 border border-[rgba(60,60,67,0.06)]">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => {
              if (typeof window !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate(8);
              }
              onChange(opt.value);
            }}
            className={`relative flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors duration-150 z-10 ${
              isSelected ? "text-[#1C1C1E] font-semibold" : "text-[#8E8E93] hover:text-[#1C1C1E]"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="segmentedIndicator"
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-[rgba(60,60,67,0.04)] z-[-1]"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
