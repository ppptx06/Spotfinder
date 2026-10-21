"use client";

import React from "react";

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
    <div className="flex p-1 bg-[#E5E5EA]/70 rounded-xl space-x-0.5">
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
            className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
              isSelected
                ? "bg-white text-[#1C1C1E] shadow-sm font-semibold"
                : "text-[#8E8E93]"
            }`}
          >
            {opt.icon && <span className="mr-0.5">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
