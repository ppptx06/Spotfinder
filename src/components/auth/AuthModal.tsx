"use client";

import React, { useState } from "react";
import { X, ShieldAlert, GraduationCap, Laptop, CheckCircle } from "lucide-react";
import { loginWithApi, registerWithApi, AuthUser } from "@/lib/auth";
import { Language, useTranslation } from "@/lib/i18n";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang,
}) => {
  const t = useTranslation(lang);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "login") {
      const res = await loginWithApi(email, password);
      if (res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || "Ошибка авторизации");
      }
    } else {
      const res = await registerWithApi(name, email, password, role);
      if (res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || "Ошибка регистрации");
      }
    }
    setLoading(false);
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setLoading(true);
    setError("");
    const res = await loginWithApi(demoEmail, demoPass);
    if (res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setError(res.error || "Ошибка");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-3xl p-5 shadow-2xl border-t sm:border border-[rgba(60,60,67,0.08)] space-y-4 animate-slideUp">
        {/* iOS Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(60,60,67,0.08)]">
          <div className="w-9 h-[5px] bg-[#D1D1D6] rounded-full absolute left-1/2 -translate-x-1/2 top-2 sm:hidden" />
          <h3 className="text-base font-bold text-[#1C1C1E]">
            {mode === "login" ? t("loginBtn") : "Регистрация"}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93] active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo One-Tap Quick Logins */}
        <div className="p-3 rounded-2xl bg-[#F2F2F7] space-y-2">
          <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide block">
            {t("switchAccount")}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() =>
                handleQuickLogin("admin@spotfinder.kz", "admin123")
              }
              disabled={loading}
              className="p-2.5 rounded-xl bg-white text-xs font-semibold text-[#007AFF] shadow-sm flex items-center justify-center space-x-1.5 active:scale-95 transition-all border border-[rgba(60,60,67,0.06)]"
            >
              <ShieldAlert className="w-4 h-4 text-[#007AFF]" />
              <span>Администратор</span>
            </button>
            <button
              onClick={() =>
                handleQuickLogin("student@astanait.edu.kz", "student123")
              }
              disabled={loading}
              className="p-2.5 rounded-xl bg-white text-xs font-semibold text-[#1C1C1E] shadow-sm flex items-center justify-center space-x-1.5 active:scale-95 transition-all border border-[rgba(60,60,67,0.06)]"
            >
              <GraduationCap className="w-4 h-4 text-[#34C759]" />
              <span>Студент (AITU)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FF3B30]/10 text-[#FF3B30] text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                ФИО / Имя
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ибрахим Нұрғали"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="i_nurgali@astanait.edu.kz"
              className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
              Пароль
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                {t("roleType")}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none"
              >
                <option value="STUDENT">{t("student")}</option>
                <option value="REMOTE_WORKER">{t("remoteWorker")}</option>
                <option value="HIGH_SCHOOL_STUDENT">{t("schoolStudent")}</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#007AFF] text-white font-semibold text-sm shadow-md active:opacity-80 transition-all mt-1"
          >
            {loading
              ? "Подождите..."
              : mode === "login"
              ? t("loginBtn")
              : "Зарегистрироваться"}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="text-xs text-[#007AFF] font-medium"
          >
            {mode === "login"
              ? "Нет аккаунта? Зарегистрироваться"
              : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
};
