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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[rgba(60,60,67,0.12)] safe-bottom shadow-apple">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2">
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
              className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 transition-all duration-150 active:scale-90 ${
                isActive ? "text-[#007AFF] font-semibold" : "text-[#8E8E93]"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "stroke-[2.4]" : "stroke-[1.8]"
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
