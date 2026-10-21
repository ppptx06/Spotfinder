"use client";

import React from "react";
import { Wifi, Zap, Star, Users, MapPin } from "lucide-react";
import { StudySpotItem } from "@/types/spot";
import { NoiseIndicator } from "./NoiseIndicator";

interface SpotCardProps {
  spot: StudySpotItem;
  onSelect: (spot: StudySpotItem) => void;
  isSelected?: boolean;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, onSelect, isSelected }) => {
  const typeLabels = {
    library: { text: "Библиотека", color: "bg-blue-500/10 text-apple-blue" },
    cafe: { text: "Кафе", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    studyRoom: { text: "Коворкинг", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  }[spot.spotType];

  const totalSeats = spot.seating?.totalSeats || 1;
  const availableSeats = spot.seating?.availableSeats || 0;
  const seatPercentage = Math.round((availableSeats / totalSeats) * 100);

  return (
    <div
      onClick={() => {
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(10);
        }
        onSelect(spot);
      }}
      className={`apple-glass-card rounded-2xl p-3.5 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-apple relative overflow-hidden ${
        isSelected ? "ring-2 ring-apple-blue shadow-apple-elevated" : "hover:border-apple-gray3"
      }`}
    >
      <div className="flex space-x-3">
        {/* Spot Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-apple-gray5 dark:bg-[#2C2C2E]">
          {spot.imageUrl ? (
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-apple-gray1">
              <MapPin className="w-6 h-6" />
            </div>
          )}
          <span
            className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-md ${typeLabels.color} bg-white/80 dark:bg-black/70`}
          >
            {typeLabels.text}
          </span>
        </div>

        {/* Spot Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-sm font-semibold text-black dark:text-white truncate">
              {spot.name}
            </h3>
            <div className="flex items-center space-x-0.5 text-xs font-bold text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{spot.overallRating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-[11px] text-apple-gray1 truncate mt-0.5">{spot.address}</p>

          {/* Infrastructure Metrics Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {spot.noiseLevel && (
              <NoiseIndicator
                category={spot.noiseLevel.noiseCategory}
                decibel={spot.noiseLevel.decibelLevel}
              />
            )}

            {spot.wifiInfo && (
              <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-apple-blue/10 text-apple-blue">
                <Wifi className="w-2.5 h-2.5" />
                <span>{spot.wifiInfo.speedMbps} Мб/с</span>
              </div>
            )}

            {spot.outlets && spot.outlets.length > 0 && (
              <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-2.5 h-2.5" />
                <span>{spot.outlets.reduce((acc, o) => acc + o.count, 0)} роз.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Seats Bar */}
      {spot.seating && (
        <div className="mt-2.5 pt-2 border-t border-apple-border flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1 text-apple-gray1">
            <Users className="w-3 h-3" />
            <span>
              Свободно: <strong className="text-black dark:text-white">{availableSeats}</strong> из {totalSeats}
            </span>
          </div>
          <div className="w-24 h-1.5 bg-apple-gray5 dark:bg-apple-darkElevated rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                seatPercentage > 40
                  ? "bg-apple-green"
                  : seatPercentage > 15
                  ? "bg-apple-yellow"
                  : "bg-apple-red"
              }`}
              style={{ width: `${seatPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
