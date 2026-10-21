"use client";

import React from "react";
import { Volume2, Volume1, VolumeX } from "lucide-react";
import { NoiseCategory } from "@/types/spot";

interface NoiseIndicatorProps {
  category: NoiseCategory;
  decibel?: number | null;
}

export const NoiseIndicator: React.FC<NoiseIndicatorProps> = ({ category, decibel }) => {
  const config = {
    SILENT: {
      label: "Тихо",
      color: "bg-apple-green/15 text-apple-green border-apple-green/30",
      icon: VolumeX,
    },
    QUIET: {
      label: "Умеренно",
      color: "bg-apple-yellow/20 text-[#B8860B] dark:text-apple-yellow border-apple-yellow/40",
      icon: Volume1,
    },
    LIVELY: {
      label: "Оживлённо",
      color: "bg-apple-orange/15 text-apple-orange border-apple-orange/30",
      icon: Volume2,
    },
  }[category];

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${config.color}`}
    >
      <Icon className="w-3 h-3 stroke-[2.2]" />
      <span>{config.label}</span>
      {decibel && <span className="opacity-75 text-[10px]">({decibel} дБ)</span>}
    </div>
  );
};
