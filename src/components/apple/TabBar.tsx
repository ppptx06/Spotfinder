"use client";

import React from "react";
import { Compass, Bookmark, User, Sliders } from "lucide-react";

export type TabType = "explore" | "filters" | "saved" | "profile";

interface TabBarProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onChangeTab }) => {
  const tabs = [
    { id: "explore" as TabType, label: "Карта", icon: Compass },
    { id: "filters" as TabType, label: "Фильтры", icon: Sliders },
    { id: "saved" as TabType, label: "Закладки", icon: Bookmark },
    { id: "profile" as TabType, label: "Профиль", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 apple-glass border-t border-apple-border safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-3">
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
              className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-4 transition-all duration-150 active:scale-90 ${
                isActive ? "text-apple-blue font-semibold" : "text-apple-gray1 hover:text-black dark:hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.4]" : "stroke-[1.8]"}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
