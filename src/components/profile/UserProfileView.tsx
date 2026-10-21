"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Laptop,
  BookOpen,
  Globe,
  ChevronLeft,
  Key,
  LogOut,
  LogIn,
  Sliders,
  CheckCircle,
  Map,
} from "lucide-react";
import { Language, useTranslation, setLanguage } from "@/lib/i18n";
import { getCurrentUser, logout, AuthUser } from "@/lib/auth";

interface UserProfileViewProps {
  onBack: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onBack,
  lang,
  onLanguageChange,
  onOpenAuth,
  onOpenAdmin,
}) => {
  const t = useTranslation(lang);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuth = () => setUser(getCurrentUser());
    window.addEventListener("auth-changed", handleAuth);
    return () => window.removeEventListener("auth-changed", handleAuth);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F2F2F7] overflow-y-auto safe-top pb-24 animate-fadeIn">
      <div className="max-w-md mx-auto space-y-4">
        {/* iOS Navigation Bar */}
        <div className="sticky top-0 z-10 bg-[#F2F2F7]/90 backdrop-blur-xl px-4 pt-4 pb-2 border-b border-[rgba(60,60,67,0.08)]">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-[#007AFF] active:opacity-60 transition-opacity -ml-1"
            >
              <ChevronLeft className="w-5 h-5 -mr-0.5" />
              <span className="text-[15px] font-normal">{t("mapBack")}</span>
            </button>
            <h2 className="text-[17px] font-semibold text-[#1C1C1E]">
              {t("profileTitle")}
            </h2>
            <div className="w-14" />
          </div>
        </div>

        <div className="px-4 space-y-4">
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-5 shadow-apple border border-[rgba(60,60,67,0.04)] flex items-center space-x-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-apple-elevated shrink-0 ${
                user?.isAdmin
                  ? "bg-gradient-to-br from-[#007AFF] to-[#5856D6]"
                  : "bg-gradient-to-br from-[#007AFF] to-[#5AC8FA]"
              }`}
            >
              {user?.isAdmin ? (
                <ShieldAlert className="w-8 h-8" />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <h2 className="text-[17px] font-bold text-[#1C1C1E] truncate">
                  {user?.name || "Гость"}
                </h2>
                {user?.isAdmin ? (
                  <ShieldAlert className="w-4 h-4 text-[#007AFF] shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#34C759] shrink-0" />
                )}
              </div>
              <p className="text-[13px] text-[#8E8E93] truncate">
                {user?.email || "Гостевой режим"}
              </p>
              <div className="mt-1">
                {user?.isAdmin ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-[10px] font-bold">
                    {t("adminRole")}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] text-[10px] font-bold">
                    {t("verifiedStudentBadge")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Admin Panel Quick Access Button */}
          {user?.isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full p-4 rounded-2xl bg-[#007AFF] text-white flex items-center justify-between shadow-apple active:scale-[0.99] transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold">{t("adminPanelBtn")}</div>
                  <div className="text-[11px] text-white/80">
                    Добавление, редактирование и удаление точек в SQLite
                  </div>
                </div>
              </div>
              <span className="text-xs bg-white text-[#007AFF] px-2.5 py-1 rounded-full font-bold">
                Открыть →
              </span>
            </button>
          )}

          {/* Language Switcher — REAL TRILINGUAL WORKING SWITCHER */}
          <div className="bg-white rounded-2xl shadow-apple border border-[rgba(60,60,67,0.04)] overflow-hidden">
            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#007AFF]" />
                <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide">
                  {t("interfaceLang")}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#007AFF]">
                {lang === "kk" ? "Қазақ тілі" : lang === "ru" ? "Русский" : "English"}
              </span>
            </div>
            <div className="px-4 py-3">
              <div className="flex p-1 bg-[#E5E5EA]/70 rounded-xl space-x-1">
                {[
                  { id: "kk" as Language, label: "Қазақша" },
                  { id: "ru" as Language, label: "Русский" },
                  { id: "en" as Language, label: "English" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onLanguageChange(l.id);
                      setLanguage(l.id);
                      if (typeof window !== "undefined" && "vibrate" in navigator) {
                        navigator.vibrate(10);
                      }
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      lang === l.id
                        ? "bg-white text-[#1C1C1E] shadow-sm font-bold scale-[1.02]"
                        : "text-[#8E8E93] hover:text-[#1C1C1E]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Role & ERD Attributes */}
          <div className="bg-white rounded-2xl shadow-apple border border-[rgba(60,60,67,0.04)] overflow-hidden">
            <div className="px-4 pt-3 pb-1">
              <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide">
                {t("studentData")}
              </span>
            </div>
            {[
              {
                label: t("university"),
                value: "Astana IT University",
              },
              {
                label: t("major"),
                value: "Software Engineering (SE-2610)",
              },
              {
                label: t("studyStyle"),
                value: "Solo Deep Work",
                highlight: true,
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between px-4 py-3 ${
                  idx < 2 ? "border-b border-[rgba(60,60,67,0.06)]" : ""
                }`}
              >
                <span className="text-[15px] text-[#8E8E93]">{row.label}</span>
                <span
                  className={`text-[15px] font-medium ${
                    row.highlight ? "text-[#007AFF]" : "text-[#1C1C1E]"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Database & Map Info Card */}
          <div className="bg-white rounded-2xl shadow-apple border border-[rgba(60,60,67,0.04)] p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#1C1C1E]">
              <Map className="w-4 h-4 text-[#34C759]" />
              <span>Картографический движок: OpenStreetMap / Leaflet</span>
            </div>
            <p className="text-[11px] text-[#8E8E93]">
              100% бесплатные карты без регистрации и API-ключей с полным покрытием Астаны и Алматы. Навигация в 2ГИС работает в один клик.
            </p>
            <div className="pt-1 flex items-center space-x-2 text-[11px] text-[#34C759] font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>База данных: SQLite + Prisma ORM (Таблицы users, study_spots, reviews)</span>
            </div>
          </div>

          {/* Authentication Actions */}
          <div className="bg-white rounded-2xl shadow-apple border border-[rgba(60,60,67,0.04)] p-3 space-y-2">
            <div className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide px-1">
              {t("authSection")}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onOpenAuth}
                className="flex-1 py-3 rounded-xl bg-[#007AFF]/10 text-[#007AFF] text-xs font-bold flex items-center justify-center space-x-1.5 active:scale-95 transition-transform"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("switchAccount")}</span>
              </button>
              {user && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-xl bg-[#FF3B30]/10 text-[#FF3B30] text-xs font-bold flex items-center justify-center space-x-1 active:scale-95 transition-transform"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("logoutBtn")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Project & Team Info */}
          <div className="bg-white rounded-2xl shadow-apple border border-[rgba(60,60,67,0.04)] p-4 text-center space-y-1">
            <div className="text-[15px] font-semibold text-[#1C1C1E]">
              SpotFinder — Database Systems Course Project
            </div>
            <div className="text-[13px] text-[#8E8E93]">
              Astana IT University • SE-2610
            </div>
            <div className="text-[11px] text-[#AEAEB2] pt-1">
              Разработчики: Ibrahim, Bagymzhan, Alizhan, Nurtas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
