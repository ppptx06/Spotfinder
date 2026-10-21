"use client";

import React from "react";
import { Bookmark, Sparkles } from "lucide-react";
import { StudySpotItem } from "@/types/spot";
import { SpotCard } from "../spots/SpotCard";

interface SavedSpotsViewProps {
  spots: StudySpotItem[];
  onSelectSpot: (spot: StudySpotItem) => void;
}

export const SavedSpotsView: React.FC<SavedSpotsViewProps> = ({
  spots,
  onSelectSpot,
}) => {
  const favoriteSpots = spots.slice(0, 2); // Sample favorites

  return (
    <div className="fixed inset-0 z-40 bg-[#F2F2F7] dark:bg-black overflow-y-auto safe-top pb-24 px-4 space-y-4 animate-fadeIn">
      <div className="max-w-md mx-auto space-y-4 pt-4">
        <div className="flex items-center space-x-2 px-1">
          <Bookmark className="w-5 h-5 text-apple-blue" />
          <h2 className="text-lg font-bold text-black dark:text-white">Сохранённые места</h2>
        </div>

        <div className="space-y-3">
          {favoriteSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onSelect={onSelectSpot}
            />
          ))}
        </div>

        <div className="p-4 rounded-3xl apple-glass text-center space-y-1 text-xs text-apple-gray1">
          <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="font-semibold text-black dark:text-white">Синхронизация с аккаунтом</p>
          <p>Ваши избранные места сохраняются локально в PWA и доступны даже без интернета.</p>
        </div>
      </div>
    </div>
  );
};
