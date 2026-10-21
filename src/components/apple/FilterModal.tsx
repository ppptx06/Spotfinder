"use client";

import React, { useEffect } from "react";
import { NoiseCategory } from "@/types/spot";
import { Language, useTranslation } from "@/lib/i18n";

export interface FilterState {
  noiseCategory: NoiseCategory | "ALL";
  minWifiSpeed: number;
  outletsRequired: boolean;
  freeOnly: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  lang: Language;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onReset,
  lang,
}) => {
  const t = useTranslation(lang);

  // Handle hardware back button
  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ modal: "filters" }, "");
    const handlePop = () => onClose();
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (window.history.state?.modal === "filters") {
      window.history.back();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-[28px] p-5 shadow-2xl border-t border-[rgba(60,60,67,0.08)] space-y-5 animate-slideUp">
        {/* Header — iOS Form Sheet Style */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(60,60,67,0.08)]">
          <button
            onClick={() => onReset()}
            className="text-sm font-normal text-[#007AFF]"
          >
            {t("reset")}
          </button>
          <h3 className="text-[15px] font-semibold text-[#1C1C1E]">
            {t("filtersTitle")}
          </h3>
          <button
            onClick={handleClose}
            className="text-sm font-semibold text-[#007AFF]"
          >
            {t("done")}
          </button>
        </div>

        {/* Noise Filter */}
        <div className="space-y-2.5">
          <label className="text-[13px] font-semibold text-[#1C1C1E]">
            {t("noiseLabel")}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "ALL", label: t("any") },
              { id: "SILENT", label: t("noiseSilent") },
              { id: "QUIET", label: t("noiseQuiet") },
              { id: "LIVELY", label: t("noiseLively") },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    noiseCategory: n.id as NoiseCategory | "ALL",
                  }))
                }
                className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                  filters.noiseCategory === n.id
                    ? "bg-[#007AFF] text-white font-semibold"
                    : "bg-[#F2F2F7] text-[#1C1C1E]"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wi-Fi Speed */}
        <div className="space-y-2.5">
          <div className="flex justify-between">
            <span className="text-[13px] font-semibold text-[#1C1C1E]">
              {t("wifiSpeed")}
            </span>
            <span className="text-[13px] font-normal text-[#007AFF]">
              {filters.minWifiSpeed === 0
                ? t("any")
                : `от ${filters.minWifiSpeed} Мб/с`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0, 50, 100, 200].map((speed) => (
              <button
                key={speed}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, minWifiSpeed: speed }))
                }
                className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                  filters.minWifiSpeed === speed
                    ? "bg-[#007AFF] text-white font-semibold"
                    : "bg-[#F2F2F7] text-[#1C1C1E]"
                }`}
              >
                {speed === 0 ? t("any") : `${speed}+`}
              </button>
            ))}
          </div>
        </div>

        {/* iOS Toggle Rows */}
        <div className="space-y-0 border-t border-[rgba(60,60,67,0.08)] pt-3">
          <div
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                outletsRequired: !prev.outletsRequired,
              }))
            }
            className="flex items-center justify-between py-3 cursor-pointer"
          >
            <span className="text-[15px] text-[#1C1C1E]">{t("manyOutlets")}</span>
            <div
              className={`ios-toggle ${filters.outletsRequired ? "active" : ""}`}
            />
          </div>

          <div className="border-t border-[rgba(60,60,67,0.08)]" />

          <div
            onClick={() =>
              setFilters((prev) => ({ ...prev, freeOnly: !prev.freeOnly }))
            }
            className="flex items-center justify-between py-3 cursor-pointer"
          >
            <span className="text-[15px] text-[#1C1C1E]">
              {t("freeEntrance")}
            </span>
            <div className={`ios-toggle ${filters.freeOnly ? "active" : ""}`} />
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-2xl bg-[#007AFF] text-white font-semibold text-[15px] active:opacity-80 transition-all"
        >
          {t("showResults")}
        </button>
      </div>
    </div>
  );
};
