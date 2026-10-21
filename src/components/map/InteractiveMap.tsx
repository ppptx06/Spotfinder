"use client";

import React from "react";
import { StudySpotItem } from "@/types/spot";
import { BookOpen, Coffee, Presentation, Compass, Plus, Minus } from "lucide-react";

interface InteractiveMapProps {
  spots: StudySpotItem[];
  selectedSpot: StudySpotItem | null;
  onSelectSpot: (spot: StudySpotItem) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
}) => {
  return (
    <div className="absolute inset-0 bg-[#E8ECEF] dark:bg-[#121214] overflow-hidden select-none">
      {/* Apple-style Minimalist Vector Map Simulation Canvas */}
      <svg
        className="w-full h-full opacity-60 dark:opacity-30 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="currentColor"
              className="text-[#D3D8DE] dark:text-[#252528]"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Diagonal Arteries (Astana Mangilik El / Kabanbay Batyr style avenues) */}
        <path
          d="M -100 250 L 800 650"
          stroke="#FFFFFF"
          className="dark:stroke-[#2A2A2E]"
          strokeWidth="24"
        />
        <path
          d="M -50 450 L 750 150"
          stroke="#FFFFFF"
          className="dark:stroke-[#2A2A2E]"
          strokeWidth="20"
        />
        <path
          d="M 200 -50 L 320 900"
          stroke="#FFFFFF"
          className="dark:stroke-[#2A2A2E]"
          strokeWidth="16"
        />

        {/* River Ishim / Park Greenery */}
        <path
          d="M -50 120 Q 250 80 500 200 T 900 180"
          fill="none"
          stroke="#CBE3F8"
          className="dark:stroke-[#1A2E3D]"
          strokeWidth="42"
        />
        <circle
          cx="280"
          cy="380"
          r="120"
          fill="#D6EEDB"
          className="dark:fill-[#1E2E22]"
        />
      </svg>

      {/* Floating Apple Map Controls */}
      <div className="absolute right-4 top-28 z-20 flex flex-col space-y-2">
        <button
          onClick={() => {}}
          className="w-10 h-10 rounded-2xl apple-glass flex items-center justify-center text-black dark:text-white shadow-apple active:scale-90 transition-transform"
        >
          <Compass className="w-5 h-5 text-apple-blue" />
        </button>
        <div className="rounded-2xl apple-glass shadow-apple flex flex-col overflow-hidden">
          <button className="w-10 h-10 flex items-center justify-center text-black dark:text-white border-b border-apple-border active:bg-black/5">
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-black dark:text-white active:bg-black/5">
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Geolocation Radar Marker */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: "48%", top: "42%" }}
      >
        <div className="w-6 h-6 rounded-full bg-apple-blue/25 animate-ping absolute -inset-0" />
        <div className="relative w-4 h-4 rounded-full bg-apple-blue border-2 border-white shadow-md" />
      </div>

      {/* StudySpot Interactive Pins */}
      {spots.map((spot, index) => {
        const isSelected = selectedSpot?.id === spot.id;

        // Spread pins gracefully across the map view
        const positions = [
          { left: "46%", top: "35%" }, // AITU
          { left: "28%", top: "48%" }, // NU
          { left: "68%", top: "32%" }, // Espresso Bar
          { left: "62%", top: "46%" }, // SmArt.Point
          { left: "75%", top: "25%" }, // Nat. Library
        ];

        const pos = positions[index % positions.length];

        const pinIcon = {
          library: BookOpen,
          cafe: Coffee,
          studyRoom: Presentation,
        }[spot.spotType];

        const Icon = pinIcon;

        return (
          <div
            key={spot.id}
            onClick={() => onSelectSpot(spot)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
            style={{ left: pos.left, top: pos.top }}
          >
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full shadow-apple-elevated transition-transform duration-200 active:scale-90 ${
                isSelected
                  ? "bg-apple-blue text-white ring-4 ring-apple-blue/30 scale-110"
                  : "apple-glass text-black dark:text-white hover:scale-105"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                  spot.spotType === "library"
                    ? "bg-blue-500"
                    : spot.spotType === "cafe"
                    ? "bg-amber-500"
                    : "bg-purple-500"
                }`}
              >
                <Icon className="w-3 h-3 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold whitespace-nowrap max-w-[110px] truncate">
                {spot.name.split(" ")[0]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
