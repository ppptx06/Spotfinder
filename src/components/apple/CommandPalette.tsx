"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { StudySpotItem } from "@/types/spot";
import { Language, useTranslation } from "@/lib/i18n";
import { SmartFilterId, calculateSmartMetrics } from "@/lib/smartScore";
import {
  Search,
  Sparkles,
  VolumeX,
  Zap,
  Coffee,
  Clock,
  MapPin,
  Star,
  CornerDownLeft,
  X,
  BookOpen,
  Presentation,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  spots: StudySpotItem[];
  onSelectSpot: (spot: StudySpotItem) => void;
  onSelectSmartFilter: (filterId: SmartFilterId) => void;
  lang: Language;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  spots,
  onSelectSpot,
  onSelectSmartFilter,
  lang,
}) => {
  const t = useTranslation(lang);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter spots
  const filteredSpots = useMemo(() => {
    if (!query.trim()) return spots.slice(0, 6);
    const q = query.toLowerCase();
    return spots
      .filter((s) => {
        const matchName = s.name.toLowerCase().includes(q);
        const matchAddr = s.address.toLowerCase().includes(q);
        const matchCampus = s.library?.campusAffiliation?.toLowerCase().includes(q);
        return matchName || matchAddr || matchCampus;
      })
      .slice(0, 8);
  }, [spots, query]);

  // Quick scenarios
  const scenarios: { id: SmartFilterId; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "focus", label: t("smartFocus"), icon: <VolumeX className="w-4 h-4" />, color: "text-[#34C759]" },
    { id: "power", label: t("smartPower"), icon: <Zap className="w-4 h-4" />, color: "text-[#FF9500]" },
    { id: "coffee", label: t("smartCoffee"), icon: <Coffee className="w-4 h-4" />, color: "text-[#AF52DE]" },
    { id: "openNow", label: t("smartOpenNow"), icon: <Clock className="w-4 h-4" />, color: "text-[#34C759]" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-28 px-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Spotlight Window */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-3xl rounded-[26px] shadow-apple-modal border border-white/60 overflow-hidden flex flex-col max-h-[75vh] animate-slideUp">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[rgba(60,60,67,0.08)] bg-white/60">
          <Search className="w-5 h-5 text-[#8E8E93] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("commandPlaceholder")}
            className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder-[#8E8E93] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-[#8E8E93] hover:text-[#1C1C1E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center space-x-1 pl-2 text-[10px] text-[#8E8E93] font-medium border-l border-[rgba(60,60,67,0.1)]">
            <span className="px-1.5 py-0.5 rounded bg-[#E5E5EA]">ESC</span>
          </div>
        </div>

        {/* Quick Scenarios Bar (when query is empty) */}
        {!query && (
          <div className="px-4 py-3 border-b border-[rgba(60,60,67,0.06)] bg-[#F2F2F7]/50">
            <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-[#007AFF]" />
              {t("commandScenarios")}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectSmartFilter(sc.id);
                    onClose();
                  }}
                  className="flex items-center space-x-2 p-2 rounded-xl bg-white/80 hover:bg-white text-xs font-medium text-[#1C1C1E] border border-[rgba(60,60,67,0.06)] shadow-sm transition-all active:scale-95"
                >
                  <span className={sc.color}>{sc.icon}</span>
                  <span className="truncate">{sc.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 apple-scrollbar">
          {filteredSpots.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8E8E93]">
              <p className="font-semibold text-sm text-[#1C1C1E] mb-1">{t("commandNoResults")}</p>
              <p>Попробуйте поискать по AITU, кофейням или библиотекам</p>
            </div>
          ) : (
            filteredSpots.map((spot, idx) => {
              const metrics = calculateSmartMetrics(spot);
              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    onSelectSpot(spot);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                    idx === selectedIndex
                      ? "bg-[#007AFF]/10 text-[#1C1C1E] ring-1 ring-[#007AFF]/20"
                      : "hover:bg-[#F2F2F7]/80 text-[#1C1C1E]"
                  }`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E5E5EA] overflow-hidden shrink-0 flex items-center justify-center">
                      {spot.imageUrl ? (
                        <img src={spot.imageUrl} alt={spot.name} className="w-full h-full object-cover" />
                      ) : spot.spotType === "library" ? (
                        <BookOpen className="w-5 h-5 text-[#007AFF]" />
                      ) : spot.spotType === "cafe" ? (
                        <Coffee className="w-5 h-5 text-[#FF9500]" />
                      ) : (
                        <Presentation className="w-5 h-5 text-[#AF52DE]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold truncate">{spot.name}</span>
                        {metrics.score >= 85 && (
                          <span className="hidden sm:inline-flex text-[10px] font-bold text-[#34C759] bg-[#34C759]/10 px-1.5 py-0.2 rounded-full">
                            {metrics.score}% Fit
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8E8E93] truncate">{spot.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 text-right">
                    <div className="hidden sm:block text-xs">
                      <span className="font-semibold text-[#1C1C1E]">
                        {spot.seating?.availableSeats || 0} мест
                      </span>
                      <p className="text-[10px] text-[#8E8E93]">{metrics.statusText}</p>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-[#8E8E93]" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-[#F2F2F7]/60 border-t border-[rgba(60,60,67,0.06)] flex items-center justify-between text-[11px] text-[#8E8E93]">
          <span>{t("commandHint")}</span>
          <span className="font-medium text-[#007AFF]">SpotFinder Spotlight</span>
        </div>
      </div>
    </div>
  );
};
