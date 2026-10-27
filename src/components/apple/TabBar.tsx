"use client";

import React from "react";
import { Compass, Bookmark, User, Sliders, ShieldAlert } from "lucide-react";
import { Language, useTranslation } from "@/lib/i18n";

export type TabType = "explore" | "filters" | "saved" | "profile" | "admin";

interface TabBarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  lang: Language;
  isAdmin?: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({
  currentTab,
  onChangeTab,
  lang,
  isAdmin,
}) => {
  const t = useTranslation(lang);

  const tabs = [
    { id: "explore" as TabType, label: t("tabMap"), icon: Compass },
    { id: "filters" as TabType, label: t("tabFilters"), icon: Sliders },
    { id: "saved" as TabType, label: t("tabSaved"), icon: Bookmark },
    { id: "profile" as TabType, label: t("tabProfile"), icon: User },
    ...(isAdmin
      ? [{ id: "admin" as TabType, label: t("tabAdmin"), icon: ShieldAlert }]
      : []),
  ];

  return (
    <nav className="fixed bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md pointer-events-none">
      <div className="bg-white/90 backdrop-blur-2xl border border-[rgba(60,60,67,0.1)] rounded-full py-1.5 px-3 shadow-apple-modal flex items-center justify-around pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (typeof window !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(10);
                }
                onChangeTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3.5 rounded-full transition-all duration-200 active:scale-90 ${
                isActive
                  ? "text-[#007AFF] font-bold"
                  : "text-[#8E8E93] hover:text-[#1C1C1E]"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "stroke-[2.5] scale-110" : "stroke-[1.8]"
                }`}
              />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
