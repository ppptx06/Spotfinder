"use client";

import React, { useState } from "react";
import { User, ShieldCheck, GraduationCap, Laptop, BookOpen, Globe, LogOut } from "lucide-react";
import { UserType } from "@/types/spot";

interface UserProfileViewProps {
  onClose?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = () => {
  const [userRole, setUserRole] = useState<UserType>("STUDENT");
  const [lang, setLang] = useState<"kk" | "ru" | "en">("ru");

  return (
    <div className="fixed inset-0 z-40 bg-[#F2F2F7] dark:bg-black overflow-y-auto safe-top pb-24 px-4 space-y-4 animate-fadeIn">
      <div className="max-w-md mx-auto space-y-4 pt-4">
        {/* Profile Header */}
        <div className="apple-glass rounded-3xl p-5 shadow-apple flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-apple-blue to-cyan-400 flex items-center justify-center text-white shadow-md">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-bold text-black dark:text-white">Ибрахим Нұрғали</h2>
              <ShieldCheck className="w-4 h-4 text-apple-blue" />
            </div>
            <p className="text-xs text-apple-gray1">i_nurgali@astanait.edu.kz</p>
            <div className="inline-flex items-center space-x-1 mt-1 px-2 py-0.5 rounded-full bg-apple-green/15 text-apple-green text-[10px] font-bold">
              <span>Студент подтверждён (Student ID)</span>
            </div>
          </div>
        </div>

        {/* Role Selector (ERD Subtypes) */}
        <div className="apple-glass rounded-3xl p-4 shadow-apple space-y-3">
          <span className="text-[11px] font-bold text-apple-gray1 uppercase tracking-wide">
            Тип профиля (ERD Subtype)
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "STUDENT" as UserType, label: "Студент", icon: GraduationCap },
              { id: "REMOTE_WORKER" as UserType, label: "Удалёнщик", icon: Laptop },
              { id: "HIGH_SCHOOL_STUDENT" as UserType, label: "Школьник", icon: BookOpen },
            ].map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setUserRole(role.id)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1 text-xs font-semibold transition-all ${
                    userRole === role.id
                      ? "bg-apple-blue text-white shadow-sm"
                      : "bg-apple-gray6 dark:bg-apple-darkElevated text-black dark:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subtype Attributes Form */}
          {userRole === "STUDENT" && (
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated flex justify-between">
                <span className="text-apple-gray1">Университет:</span>
                <span className="font-semibold text-black dark:text-white">Astana IT University</span>
              </div>
              <div className="p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated flex justify-between">
                <span className="text-apple-gray1">Специальность:</span>
                <span className="font-semibold text-black dark:text-white">Software Engineering (SE-2610)</span>
              </div>
              <div className="p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated flex justify-between">
                <span className="text-apple-gray1">Стиль учёбы:</span>
                <span className="font-semibold text-apple-blue">Solo Deep Work</span>
              </div>
            </div>
          )}

          {userRole === "REMOTE_WORKER" && (
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated flex justify-between">
                <span className="text-apple-gray1">Компания / IT:</span>
                <span className="font-semibold text-black dark:text-white">Freelance Developer</span>
              </div>
              <div className="p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated flex justify-between">
                <span className="text-apple-gray1">Формат работы:</span>
                <span className="font-semibold text-apple-blue">Full-time Remote</span>
              </div>
            </div>
          )}

          {userRole === "HIGH_SCHOOL_STUDENT" && (
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated flex justify-between">
                <span className="text-apple-gray1">Школа:</span>
                <span className="font-semibold text-black dark:text-white">РФМШ Астана</span>
              </div>
              <div className="p-3 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated flex justify-between">
                <span className="text-apple-gray1">Класс:</span>
                <span className="font-semibold text-apple-blue">11 класс (ЕНТ / Олимпиады)</span>
              </div>
            </div>
          )}
        </div>

        {/* Trilingual Language Selector */}
        <div className="apple-glass rounded-3xl p-4 shadow-apple space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-apple-gray1 uppercase">
            <Globe className="w-4 h-4 text-apple-blue" />
            <span>Трёхъязычный интерфейс</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "kk", label: "Қазақша" },
              { id: "ru", label: "Русский" },
              { id: "en", label: "English" },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id as any)}
                className={`py-2 rounded-xl text-xs font-semibold ${
                  lang === l.id
                    ? "bg-apple-blue text-white"
                    : "bg-apple-gray6 dark:bg-apple-darkElevated text-black dark:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Info & Team */}
        <div className="apple-glass rounded-3xl p-4 shadow-apple space-y-1 text-center text-xs text-apple-gray1">
          <div className="font-bold text-black dark:text-white">SpotFinder — ICT Course Project</div>
          <div>Astana IT University • SE-2610</div>
          <div className="text-[10px] text-apple-gray2 pt-1">
            Разработчики: Ibrahim, Bagymzhan, Alizhan, Nurtas
          </div>
        </div>
      </div>
    </div>
  );
};
