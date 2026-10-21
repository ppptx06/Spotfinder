"use client";

import React from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Language, useTranslation } from "@/lib/i18n";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenFilters,
  activeFilterCount,
  lang,
}) => {
  const t = useTranslation(lang);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-3 pb-2 safe-top">
      <div className="max-w-md mx-auto space-y-2">
        {/* Top Mini Bar with Location */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#8E8E93]">
            <MapPin className="w-3.5 h-3.5 text-[#007AFF]" />
            <span className="text-[#1C1C1E] font-medium">{t("cityAstana")}</span>
            <span className="text-[10px] bg-[#E5E5EA] px-1.5 py-0.5 rounded-full text-[#8E8E93]">
              {t("nearYou")}
            </span>
          </div>
          <span className="text-[11px] font-bold tracking-tight text-[#007AFF] uppercase">
            SpotFinder
          </span>
        </div>

        {/* Floating Search Bar (iOS Style) */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative flex items-center bg-white/95 backdrop-blur-xl rounded-2xl shadow-apple border border-[rgba(60,60,67,0.08)] px-3.5 py-2.5 transition-all">
            <Search className="w-4 h-4 text-[#8E8E93] mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent text-sm text-[#1C1C1E] placeholder-[#8E8E93] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="w-4 h-4 rounded-full bg-[#C7C7CC] text-white flex items-center justify-center text-xs ml-1 shrink-0"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={onOpenFilters}
            className={`relative p-2.5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-apple border border-[rgba(60,60,67,0.08)] transition-all active:scale-95 ${
              activeFilterCount > 0 ? "text-[#007AFF]" : "text-[#8E8E93]"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#007AFF] text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
