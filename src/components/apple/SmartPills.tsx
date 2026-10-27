"use client";

import React from "react";
import { SmartFilterId } from "@/lib/smartScore";
import { Language, useTranslation } from "@/lib/i18n";
import { VolumeX, Zap, Coffee, Wifi, Clock, Sparkles } from "lucide-react";

interface SmartPillsProps {
  activeFilter: SmartFilterId;
  onChange: (id: SmartFilterId) => void;
  lang: Language;
}

export const SmartPills: React.FC<SmartPillsProps> = ({
  activeFilter,
  onChange,
  lang,
}) => {
  const t = useTranslation(lang);

  const pills: { id: SmartFilterId; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "all",
      label: t("smartAll"),
      icon: <Sparkles className="w-3.5 h-3.5" />,
      color: "text-[#007AFF]",
    },
    {
      id: "focus",
      label: t("smartFocus"),
      icon: <VolumeX className="w-3.5 h-3.5" />,
      color: "text-[#34C759]",
    },
    {
      id: "power",
      label: t("smartPower"),
      icon: <Zap className="w-3.5 h-3.5" />,
      color: "text-[#FF9500]",
    },
    {
      id: "coffee",
      label: t("smartCoffee"),
      icon: <Coffee className="w-3.5 h-3.5" />,
      color: "text-[#AF52DE]",
    },
    {
      id: "openNow",
      label: t("smartOpenNow"),
      icon: <Clock className="w-3.5 h-3.5" />,
      color: "text-[#34C759]",
    },
    {
      id: "fastWifi",
      label: t("smartFastWifi"),
      icon: <Wifi className="w-3.5 h-3.5" />,
      color: "text-[#007AFF]",
    },
  ];

  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 px-1 -mx-1">
      {pills.map((pill) => {
        const isActive = activeFilter === pill.id;
        return (
          <button
            key={pill.id}
            onClick={() => {
              if (typeof window !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate(8);
              }
              onChange(pill.id);
            }}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 shrink-0 ${
              isActive
                ? "bg-[#1C1C1E] text-white shadow-sm ring-1 ring-black/10"
                : "bg-white/80 hover:bg-white text-[#1C1C1E] border border-[rgba(60,60,67,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            }`}
          >
            <span className={isActive ? "text-white" : pill.color}>{pill.icon}</span>
            <span>{pill.label}</span>
          </button>
        );
      })}
    </div>
  );
};
