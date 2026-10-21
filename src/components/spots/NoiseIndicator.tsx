"use client";

import React from "react";
import { Volume2, Volume1, VolumeX } from "lucide-react";
import { NoiseCategory } from "@/types/spot";
import { Language, useTranslation } from "@/lib/i18n";

interface NoiseIndicatorProps {
  category: NoiseCategory;
  decibel?: number | null;
  lang?: Language;
}

export const NoiseIndicator: React.FC<NoiseIndicatorProps> = ({
  category,
  decibel,
  lang = "ru",
}) => {
  const t = useTranslation(lang);

  const config = {
    SILENT: {
      label: t("noiseSilent"),
      color: "bg-[#34C759]/10 text-[#34C759]",
      icon: VolumeX,
    },
    QUIET: {
      label: t("noiseQuiet"),
      color: "bg-[#FF9500]/10 text-[#FF9500]",
      icon: Volume1,
    },
    LIVELY: {
      label: t("noiseLively"),
      color: "bg-[#FF3B30]/10 text-[#FF3B30]",
      icon: Volume2,
    },
  }[category];

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${config.color}`}
    >
      <Icon className="w-3 h-3 stroke-[2.2]" />
      <span>{config.label}</span>
      {decibel && (
        <span className="opacity-70 text-[10px]">({decibel} дБ)</span>
      )}
    </div>
  );
};
