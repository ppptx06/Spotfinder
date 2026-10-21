"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface BottomSheetProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}

export type SheetHeight = "collapsed" | "medium" | "expanded";

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  headerContent,
}) => {
  const [heightState, setHeightState] = useState<SheetHeight>("medium");

  const heightClasses = {
    collapsed: "h-[130px]",
    medium: "h-[45vh]",
    expanded: "h-[82vh]",
  }[heightState];

  const toggleHeight = () => {
    if (heightState === "collapsed") setHeightState("medium");
    else if (heightState === "medium") setHeightState("expanded");
    else setHeightState("medium");
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-2xl rounded-t-[28px] shadow-apple-sheet border-t border-[rgba(60,60,67,0.08)] transition-all duration-300 ease-out flex flex-col ${heightClasses} pb-16`}
    >
      {/* Draggable Notch / Handle */}
      <div
        onClick={toggleHeight}
        className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-pointer select-none active:opacity-70"
      >
        <div className="w-9 h-[5px] bg-[#D1D1D6] rounded-full mb-1" />
        <div className="flex items-center text-[10px] text-[#8E8E93] font-medium">
          {heightState === "collapsed" && (
            <span className="flex items-center">
              Развернуть список <ChevronUp className="w-3 h-3 ml-0.5" />
            </span>
          )}
          {heightState === "expanded" && (
            <span className="flex items-center">
              Свернуть <ChevronDown className="w-3 h-3 ml-0.5" />
            </span>
          )}
        </div>
      </div>

      {/* Header (e.g. Segmented Control / Filters) */}
      {headerContent && (
        <div className="px-4 pb-2 border-b border-[rgba(60,60,67,0.08)] shrink-0">
          {headerContent}
        </div>
      )}

      {/* Scrollable Spots List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar overscroll-contain">
        {children}
      </div>
    </div>
  );
};
