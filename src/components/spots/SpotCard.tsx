"use client";

import React from "react";
import { Wifi, Zap, Star, MapPin, Bookmark } from "lucide-react";
import { StudySpotItem } from "@/types/spot";
import { NoiseIndicator } from "./NoiseIndicator";
import { isBookmarked } from "@/lib/storage";
import { Language, useTranslation } from "@/lib/i18n";

interface SpotCardProps {
  spot: StudySpotItem;
  onSelect: (spot: StudySpotItem) => void;
  isSelected?: boolean;
  onToggleBookmark?: (spotId: number) => void;
  lang?: Language;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  onSelect,
  isSelected,
  onToggleBookmark,
  lang = "ru",
}) => {
  const t = useTranslation(lang);

  const typeLabels = {
    library: {
      text: t("catLibraries"),
      color: "bg-[#007AFF]/10 text-[#007AFF]",
    },
    cafe: {
      text: t("catCafes"),
      color: "bg-[#FF9500]/10 text-[#FF9500]",
    },
    studyRoom: {
      text: t("catCoworkings"),
      color: "bg-[#AF52DE]/10 text-[#AF52DE]",
    },
  }[spot.spotType];

  const totalSeats = spot.seating?.totalSeats || 1;
  const availableSeats = spot.seating?.availableSeats || 0;
  const seatPercentage = Math.round((availableSeats / totalSeats) * 100);
  const saved = isBookmarked(spot.id);

  return (
    <div
      onClick={() => {
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(10);
        }
        onSelect(spot);
      }}
      className={`bg-white rounded-2xl p-3.5 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-apple relative overflow-hidden border ${
        isSelected
          ? "border-[#007AFF] shadow-apple-elevated"
          : "border-[rgba(60,60,67,0.06)]"
      }`}
    >
      <div className="flex space-x-3">
        {/* Spot Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#F2F2F7]">
          {spot.imageUrl ? (
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C7C7CC]">
              <MapPin className="w-6 h-6" />
            </div>
          )}
          <span
            className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-md ${typeLabels.color} bg-white/85`}
          >
            {typeLabels.text}
          </span>
        </div>

        {/* Spot Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-sm font-semibold text-[#1C1C1E] truncate">
              {spot.name}
            </h3>
            <div className="flex items-center space-x-1.5 shrink-0">
              <div className="flex items-center space-x-0.5 text-xs font-bold text-[#FF9500]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{spot.overallRating.toFixed(1)}</span>
              </div>
              {onToggleBookmark && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(spot.id);
                  }}
                  className="active:scale-90 transition-transform"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      saved
                        ? "fill-[#007AFF] text-[#007AFF]"
                        : "text-[#C7C7CC]"
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#8E8E93] truncate mt-0.5">
            {spot.address}
          </p>

          {/* Infrastructure Metrics Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {spot.noiseLevel && (
              <NoiseIndicator
                category={spot.noiseLevel.noiseCategory}
                decibel={spot.noiseLevel.decibelLevel}
                lang={lang}
              />
            )}

            {spot.wifiInfo && (
              <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#007AFF]/8 text-[#007AFF]">
                <Wifi className="w-2.5 h-2.5" />
                <span>{spot.wifiInfo.speedMbps} Мб/с</span>
              </div>
            )}

            {spot.outlets && spot.outlets.length > 0 && (
              <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#34C759]/8 text-[#34C759]">
                <Zap className="w-2.5 h-2.5" />
                <span>
                  {spot.outlets.reduce((acc, o) => acc + o.count, 0)} роз.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Seats Bar */}
      {spot.seating && (
        <div className="mt-2.5 pt-2 border-t border-[rgba(60,60,67,0.06)]">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-[#8E8E93]">{t("freeSeats")}</span>
            <span className="font-semibold text-[#1C1C1E]">
              {availableSeats}/{totalSeats}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                seatPercentage > 50
                  ? "bg-[#34C759]"
                  : seatPercentage > 20
                  ? "bg-[#FF9500]"
                  : "bg-[#FF3B30]"
              }`}
              style={{ width: `${seatPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Distance Badge */}
      {spot.distanceKm !== undefined && (
        <div className="absolute top-2 right-2">
          <span className="text-[9px] font-semibold text-[#8E8E93] bg-[#F2F2F7] px-1.5 py-0.5 rounded-full">
            {spot.distanceKm < 1
              ? `${Math.round(spot.distanceKm * 1000)} м`
              : `${spot.distanceKm.toFixed(1)} км`}
          </span>
        </div>
      )}
    </div>
  );
};
