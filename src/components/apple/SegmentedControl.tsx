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
    <div className="flex p-1 bg-apple-gray5/70 dark:bg-[#2C2C2E]/80 backdrop-blur-md rounded-xl space-x-1">
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
                ? "bg-white dark:bg-[#1C1C1E] text-black dark:text-white shadow-sm font-semibold scale-[1.01]"
                : "text-apple-gray1 hover:text-black dark:hover:text-white"
            }`}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
