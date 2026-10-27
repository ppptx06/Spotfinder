"use client";

import React from "react";
import { Search, SlidersHorizontal, MapPin, Sparkles, Globe } from "lucide-react";
import { Language, useTranslation, setLanguage } from "@/lib/i18n";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenFilters: () => void;
  onOpenCommandPalette: () => void;
  activeFilterCount: number;
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenFilters,
  onOpenCommandPalette,
  activeFilterCount,
  lang,
}) => {
  const t = useTranslation(lang);

  const cycleLanguage = () => {
    const nextLang: Language = lang === "ru" ? "kk" : lang === "kk" ? "en" : "ru";
    setLanguage(nextLang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 pb-2 pointer-events-none safe-top">
      <div className="max-w-2xl mx-auto pointer-events-auto space-y-2">
        {/* Top Island Bar: Location + Lang + Logo */}
        <div className="flex items-center justify-between px-2">
          {/* Location Chip */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xl border border-[rgba(60,60,67,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs text-[#8E8E93]">
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
            <span className="text-[#1C1C1E] font-medium">{t("cityAstana")}</span>
            <span className="text-[10px] text-[#8E8E93] hidden sm:inline">
              · {t("nearYou")}
            </span>
          </div>

          {/* Right Action: Language Badge + Logo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={cycleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xl border border-[rgba(60,60,67,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-[#1C1C1E] active:scale-95 transition-transform"
              title="Переключить язык (RU/KK/EN)"
            >
              <Globe className="w-3.5 h-3.5 text-[#007AFF]" />
              <span className="uppercase text-[11px]">{lang}</span>
            </button>
            <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-[11px] font-bold tracking-tight">
              SpotFinder
            </div>
          </div>
        </div>

        {/* Floating Spotlight Search Bar (Apple / Raycast Island) */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative flex items-center bg-white/90 backdrop-blur-2xl rounded-2xl shadow-apple border border-[rgba(60,60,67,0.08)] px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#007AFF]/30">
            <Search className="w-4 h-4 text-[#8E8E93] mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent text-sm text-[#1C1C1E] placeholder-[#8E8E93] focus:outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="w-5 h-5 rounded-full bg-[#E5E5EA] text-[#8E8E93] hover:text-[#1C1C1E] flex items-center justify-center text-xs ml-1 shrink-0"
              >
                ×
              </button>
            ) : (
              <button
                onClick={onOpenCommandPalette}
                className="hidden sm:flex items-center space-x-1 text-[10px] font-semibold text-[#8E8E93] bg-[#F2F2F7] hover:bg-[#E5E5EA] px-2 py-0.5 rounded-lg border border-[rgba(60,60,67,0.08)] shrink-0 transition-colors"
                title="Открыть быстрый поиск (⌘K)"
              >
                <Sparkles className="w-3 h-3 text-[#007AFF]" />
                <span>⌘K</span>
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={onOpenFilters}
            className={`relative p-2.5 rounded-2xl bg-white/90 backdrop-blur-2xl shadow-apple border border-[rgba(60,60,67,0.08)] transition-all active:scale-95 ${
              activeFilterCount > 0 ? "text-[#007AFF] ring-1 ring-[#007AFF]" : "text-[#8E8E93] hover:text-[#1C1C1E]"
            }`}
            title="Фильтры"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#007AFF] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {activeFilterCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
