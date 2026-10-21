"use client";

import React from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenFilters,
  activeFilterCount,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 pt-3 pb-2 safe-top">
      <div className="max-w-md mx-auto space-y-2">
        {/* Top Mini Bar with Location */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-apple-gray1">
            <MapPin className="w-3.5 h-3.5 text-apple-blue" />
            <span className="text-black dark:text-white font-medium">Астана, Казахстан</span>
            <span className="text-[10px] bg-apple-gray5 dark:bg-apple-darkElevated px-1.5 py-0.5 rounded-full text-apple-gray1">
              Рядом с вами
            </span>
          </div>
          <span className="text-[11px] font-bold tracking-tight text-apple-blue uppercase">
            SpotFinder PWA
          </span>
        </div>

        {/* Floating Search Bar (iOS Style) */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative flex items-center apple-glass rounded-2xl shadow-apple px-3.5 py-2.5 transition-all">
            <Search className="w-4 h-4 text-apple-gray1 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск библиотеки, кафе, коворкинга..."
              className="w-full bg-transparent text-sm text-[#1C1C1E] dark:text-white placeholder-apple-gray1 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="w-4 h-4 rounded-full bg-apple-gray3 text-white dark:bg-apple-gray1 flex items-center justify-center text-xs ml-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={onOpenFilters}
            className={`relative p-2.5 rounded-2xl apple-glass shadow-apple transition-all active:scale-95 ${
              activeFilterCount > 0 ? "text-apple-blue ring-2 ring-apple-blue/30" : "text-[#1C1C1E] dark:text-white"
            }`}
            aria-label="Фильтры"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-apple-blue text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
