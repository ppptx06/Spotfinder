"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, ChevronLeft, Trash2 } from "lucide-react";
import { StudySpotItem } from "@/types/spot";
import { SpotCard } from "../spots/SpotCard";
import { getBookmarks, toggleBookmark } from "@/lib/storage";
import { Language, useTranslation } from "@/lib/i18n";

interface SavedSpotsViewProps {
  spots: StudySpotItem[];
  onSelectSpot: (spot: StudySpotItem) => void;
  onBack: () => void;
  lang: Language;
}

export const SavedSpotsView: React.FC<SavedSpotsViewProps> = ({
  spots,
  onSelectSpot,
  onBack,
  lang,
}) => {
  const t = useTranslation(lang);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  useEffect(() => {
    setBookmarkedIds(getBookmarks());
  }, []);

  const savedSpots = spots.filter((s) => bookmarkedIds.includes(s.id));

  const handleRemoveBookmark = (spotId: number) => {
    toggleBookmark(spotId);
    setBookmarkedIds((prev) => prev.filter((id) => id !== spotId));
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F2F2F7] overflow-y-auto safe-top pb-24 animate-fadeIn">
      <div className="max-w-md mx-auto space-y-4">
        {/* iOS Navigation Bar */}
        <div className="sticky top-0 z-10 bg-[#F2F2F7]/90 backdrop-blur-xl px-4 pt-4 pb-2 border-b border-[rgba(60,60,67,0.08)]">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-[#007AFF] active:opacity-60 transition-opacity -ml-1"
            >
              <ChevronLeft className="w-5 h-5 -mr-0.5" />
              <span className="text-[15px] font-normal">{t("mapBack")}</span>
            </button>
            <h2 className="text-[17px] font-semibold text-[#1C1C1E]">
              {t("savedTitle")}
            </h2>
            <div className="w-14" />
          </div>
        </div>

        <div className="px-4 space-y-3">
          {savedSpots.length > 0 ? (
            <>
              <p className="text-[13px] text-[#8E8E93]">
                {savedSpots.length} {t("savedTitle").toLowerCase()}
              </p>
              {savedSpots.map((spot) => (
                <div key={spot.id} className="relative">
                  <SpotCard spot={spot} onSelect={onSelectSpot} lang={lang} />
                  <button
                    onClick={() => handleRemoveBookmark(spot.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-apple flex items-center justify-center active:scale-90 transition-transform border border-[rgba(60,60,67,0.06)]"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                  </button>
                </div>
              ))}
            </>
          ) : (
            /* Empty State — Apple Style */
            <div className="flex flex-col items-center justify-center pt-20 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#E5E5EA] flex items-center justify-center">
                <Bookmark className="w-7 h-7 text-[#C7C7CC]" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#1C1C1E]">
                {t("noSaved")}
              </h3>
              <p className="text-[13px] text-[#8E8E93] text-center max-w-[260px]">
                {t("noSavedHint")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
