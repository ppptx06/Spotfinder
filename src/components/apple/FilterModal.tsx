"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { NoiseCategory } from "@/types/spot";

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
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border-t sm:border border-apple-border space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-apple-border pb-3">
          <button onClick={onReset} className="text-xs font-semibold text-apple-gray1 hover:text-black dark:hover:text-white">
            Сбросить
          </button>
          <h3 className="text-sm font-bold text-black dark:text-white">Фильтры для учёбы</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-apple-gray5 dark:bg-apple-darkElevated flex items-center justify-center text-apple-gray1 active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Noise Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-apple-gray1 uppercase tracking-wide">
            Уровень шума в помещении
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "ALL", label: "Любой" },
              { id: "SILENT", label: "Тихий (<35дБ)" },
              { id: "QUIET", label: "Умеренно" },
              { id: "LIVELY", label: "Оживлённо" },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    noiseCategory: n.id as NoiseCategory | "ALL",
                  }))
                }
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                  filters.noiseCategory === n.id
                    ? "bg-apple-blue text-white shadow-sm"
                    : "bg-apple-gray6 dark:bg-apple-darkElevated text-black dark:text-white"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum Wi-Fi Speed */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-apple-gray1 uppercase">Скорость Wi-Fi</span>
            <span className="font-semibold text-apple-blue">
              {filters.minWifiSpeed === 0 ? "Любая" : `от ${filters.minWifiSpeed} Мб/с`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0, 50, 100, 200].map((speed) => (
              <button
                key={speed}
                onClick={() => setFilters((prev) => ({ ...prev, minWifiSpeed: speed }))}
                className={`py-2 rounded-xl text-xs font-semibold ${
                  filters.minWifiSpeed === speed
                    ? "bg-apple-blue text-white"
                    : "bg-apple-gray6 dark:bg-apple-darkElevated text-black dark:text-white"
                }`}
              >
                {speed === 0 ? "Любая" : `${speed}+ Мб/с`}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-1 border-t border-apple-border">
          <div
            onClick={() =>
              setFilters((prev) => ({ ...prev, outletsRequired: !prev.outletsRequired }))
            }
            className="flex items-center justify-between p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated cursor-pointer"
          >
            <span className="text-xs font-semibold text-black dark:text-white">
              Много свободных розеток
            </span>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                filters.outletsRequired ? "bg-apple-blue text-white" : "border border-apple-gray3"
              }`}
            >
              {filters.outletsRequired && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          <div
            onClick={() => setFilters((prev) => ({ ...prev, freeOnly: !prev.freeOnly }))}
            className="flex items-center justify-between p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated cursor-pointer"
          >
            <span className="text-xs font-semibold text-black dark:text-white">
              Бесплатный вход (без обязательного заказа)
            </span>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                filters.freeOnly ? "bg-apple-blue text-white" : "border border-apple-gray3"
              }`}
            >
              {filters.freeOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-apple-blue text-white font-bold text-sm shadow-md active:scale-98 transition-all"
        >
          Применить фильтры
        </button>
      </div>
    </div>
  );
};
