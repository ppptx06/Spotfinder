"use client";

import React from "react";
import { Wifi, Zap, Star, MapPin, Bookmark, Sparkles } from "lucide-react";
import { StudySpotItem } from "@/types/spot";
import { NoiseIndicator } from "./NoiseIndicator";
import { isBookmarked } from "@/lib/storage";
import { Language, useTranslation } from "@/lib/i18n";
import { calculateSmartMetrics } from "@/lib/smartScore";

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
  const metrics = calculateSmartMetrics(spot);

  const typeLabels = {
    library: {
      text: t("catLibraries"),
      color: "bg-[#007AFF]/12 text-[#007AFF] border-[#007AFF]/20",
    },
    cafe: {
      text: t("catCafes"),
      color: "bg-[#FF9500]/12 text-[#FF9500] border-[#FF9500]/20",
    },
    studyRoom: {
      text: t("catCoworkings"),
      color: "bg-[#AF52DE]/12 text-[#AF52DE] border-[#AF52DE]/20",
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
      className={`group bg-white rounded-[22px] p-3.5 transition-all duration-200 active:scale-[0.98] cursor-pointer relative overflow-hidden border ${
        isSelected
          ? "border-[#007AFF] shadow-apple-elevated ring-2 ring-[#007AFF]/20"
          : "border-[rgba(60,60,67,0.06)] shadow-apple hover:shadow-apple-card-hover hover:border-[rgba(60,60,67,0.12)]"
      }`}
    >
      <div className="flex space-x-3.5">
        {/* Spot Thumbnail with Floating Category Badge */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F2F2F7] shadow-inner">
          {spot.imageUrl ? (
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C7C7CC]">
              <MapPin className="w-7 h-7" />
            </div>
          )}

          {/* Type Badge */}
          <span
            className={`absolute bottom-1.5 left-1.5 text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md border ${typeLabels.color} bg-white/90 shadow-sm`}
          >
            {typeLabels.text}
          </span>
        </div>

        {/* Spot Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            {/* Title + Rating + Bookmark */}
            <div className="flex items-start justify-between gap-1.5">
              <h3 className="text-[15px] font-semibold text-[#1C1C1E] leading-snug truncate group-hover:text-[#007AFF] transition-colors">
                {spot.name}
              </h3>
              <div className="flex items-center space-x-1.5 shrink-0">
                <div className="flex items-center space-x-0.5 text-xs font-bold text-[#FF9500] bg-[#FF9500]/10 px-1.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{spot.overallRating.toFixed(1)}</span>
                </div>
                {onToggleBookmark && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(spot.id);
                    }}
                    className="p-1 rounded-full hover:bg-[#F2F2F7] active:scale-85 transition-all text-[#8E8E93] hover:text-[#007AFF]"
                    title="В закладки"
                  >
                    <Bookmark
                      className={`w-4 h-4 transition-colors ${
                        saved ? "fill-[#007AFF] text-[#007AFF]" : "text-[#C7C7CC]"
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Address + Operating Status */}
            <div className="flex items-center space-x-1.5 text-xs text-[#8E8E93] mt-0.5 truncate">
              <span className="truncate">{spot.address}</span>
            </div>

            <div className="flex items-center space-x-1.5 mt-1 text-[11px]">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  metrics.isClosingSoon
                    ? "bg-[#FF9500] animate-pulse"
                    : metrics.isOpenNow
                    ? "bg-[#34C759]"
                    : "bg-[#FF3B30]"
                }`}
              />
              <span
                className={`font-medium ${
                  metrics.isClosingSoon
                    ? "text-[#FF9500]"
                    : metrics.isOpenNow
                    ? "text-[#34C759]"
                    : "text-[#8E8E93]"
                }`}
              >
                {metrics.statusText}
              </span>
              {spot.distanceKm !== undefined && (
                <>
                  <span className="text-[#C7C7CC]">·</span>
                  <span className="text-[#8E8E93] font-medium">
                    {spot.distanceKm < 1
                      ? `${Math.round(spot.distanceKm * 1000)} м`
                      : `${spot.distanceKm.toFixed(1)} км`}
                  </span>
                </>
              )}
            </div>
          </div>

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
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#007AFF]/8 text-[#007AFF] border border-[#007AFF]/15">
                <Wifi className="w-2.5 h-2.5" />
                <span>{spot.wifiInfo.speedMbps} Мб/с</span>
              </div>
            )}

            {spot.outlets && spot.outlets.length > 0 && (
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#34C759]/8 text-[#34C759] border border-[#34C759]/15">
                <Zap className="w-2.5 h-2.5" />
                <span>{spot.outlets.reduce((acc, o) => acc + o.count, 0)} роз.</span>
              </div>
            )}

            {/* Smart Study Fit Pill */}
            {metrics.score >= 80 && (
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-[#007AFF]/10 to-[#AF52DE]/10 text-[#5856D6] border border-[#5856D6]/15">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{metrics.score}% Fit</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Seats Progress Bar (Apple Battery / Health Style) */}
      {spot.seating && (
        <div className="mt-3 pt-2.5 border-t border-[rgba(60,60,67,0.06)]">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#8E8E93] font-medium">{t("freeSeats")}</span>
            <span className="font-semibold text-[#1C1C1E]">
              {availableSeats}{" "}
              <span className="text-[#8E8E93] font-normal">/ {totalSeats}</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                seatPercentage > 45
                  ? "bg-[#34C759]"
                  : seatPercentage > 15
                  ? "bg-[#FF9500]"
                  : "bg-[#FF3B30]"
              }`}
              style={{ width: `${Math.max(4, seatPercentage)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
