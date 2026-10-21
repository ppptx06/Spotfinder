"use client";

import React, { useState } from "react";
import { StudySpotItem } from "@/types/spot";
import {
  ShieldAlert,
  Plus,
  Trash2,
  ChevronLeft,
  CheckCircle,
  Building,
  Coffee,
  Presentation,
  BookOpen,
} from "lucide-react";
import { Language, useTranslation } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";

interface AdminManagementViewProps {
  spots: StudySpotItem[];
  onBack: () => void;
  onSpotCreated: (newSpot: StudySpotItem) => void;
  onSpotDeleted: (spotId: number) => void;
  lang: Language;
}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({
  spots,
  onBack,
  onSpotCreated,
  onSpotDeleted,
  lang,
}) => {
  const t = useTranslation(lang);
  const currentUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState<"spots" | "add">("spots");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // New Spot Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    operatingHours: "09:00 - 22:00",
    latitude: "51.1200",
    longitude: "71.4300",
    spotType: "library" as "library" | "cafe" | "studyRoom",
    wifiSpeed: "150",
    totalSeats: "40",
    noiseCategory: "QUIET",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
  });

  const handleCreateSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          adminEmail: currentUser?.email,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        onSpotCreated(created);
        setSuccessMessage(t("createSuccess"));
        setActiveTab("spots");
        setFormData({
          name: "",
          address: "",
          operatingHours: "09:00 - 22:00",
          latitude: "51.1200",
          longitude: "71.4300",
          spotType: "library",
          wifiSpeed: "150",
          totalSeats: "40",
          noiseCategory: "QUIET",
          imageUrl:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Create spot failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSpot = async (spotId: number) => {
    if (!window.confirm(t("deleteSpotConfirm"))) return;

    try {
      const res = await fetch(
        `/api/spots?id=${spotId}&adminEmail=${currentUser?.email}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        onSpotDeleted(spotId);
      }
    } catch (err) {
      console.error("Delete spot failed:", err);
    }
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
              <span className="text-[15px] font-normal">{t("back")}</span>
            </button>
            <h2 className="text-[17px] font-semibold text-[#1C1C1E]">
              {t("adminHeading")}
            </h2>
            <div className="w-14" />
          </div>
        </div>

        <div className="px-4 space-y-4">
          {/* Admin Status Card */}
          <div className="bg-white rounded-2xl p-4 shadow-apple border border-[rgba(60,60,67,0.06)] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1C1E]">
                  {currentUser?.name || "Администратор"}
                </h3>
                <span className="text-xs text-[#34C759] font-medium">
                  ● Подключена база данных SQLite (dev.db)
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-[#007AFF]/10 text-[#007AFF] px-2 py-1 rounded-full font-bold">
              SUPERADMIN
            </span>
          </div>

          {/* Sub Navigation */}
          <div className="flex p-1 bg-[#E5E5EA]/70 rounded-xl space-x-1">
            <button
              onClick={() => setActiveTab("spots")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "spots"
                  ? "bg-white text-[#1C1C1E] shadow-sm"
                  : "text-[#8E8E93]"
              }`}
            >
              Все пространства ({spots.length})
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "add"
                  ? "bg-white text-[#1C1C1E] shadow-sm"
                  : "text-[#8E8E93]"
              }`}
            >
              {t("addNewSpotBtn")}
            </button>
          </div>

          {successMessage && (
            <div className="p-3 rounded-2xl bg-[#34C759]/10 text-[#34C759] text-xs font-semibold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: Spots List & Delete */}
          {activeTab === "spots" && (
            <div className="space-y-2.5">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-2xl p-3.5 shadow-apple border border-[rgba(60,60,67,0.06)] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        spot.spotType === "library"
                          ? "bg-[#007AFF]/10 text-[#007AFF]"
                          : spot.spotType === "cafe"
                          ? "bg-[#FF9500]/10 text-[#FF9500]"
                          : "bg-[#AF52DE]/10 text-[#AF52DE]"
                      }`}
                    >
                      {spot.spotType === "library" ? (
                        <BookOpen className="w-4 h-4" />
                      ) : spot.spotType === "cafe" ? (
                        <Coffee className="w-4 h-4" />
                      ) : (
                        <Presentation className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-[#1C1C1E] truncate">
                        {spot.name}
                      </h4>
                      <p className="text-[11px] text-[#8E8E93] truncate">
                        {spot.address}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSpot(spot.id)}
                    className="w-8 h-8 rounded-full bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30] active:scale-90 transition-transform shrink-0"
                    title={t("deleteBtn")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Add New Spot Form */}
          {activeTab === "add" && (
            <form
              onSubmit={handleCreateSpot}
              className="bg-white rounded-2xl p-4 shadow-apple border border-[rgba(60,60,67,0.06)] space-y-3.5"
            >
              <h3 className="text-sm font-bold text-[#1C1C1E]">
                {t("addNewSpotBtn")}
              </h3>

              <div>
                <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                  {t("spotNameLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Например: Coworking Hub Astana"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                  {t("spotAddressLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Например: ул. Сарайшык, 5"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                    {t("spotCategoryLabel")}
                  </label>
                  <select
                    value={formData.spotType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        spotType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none"
                  >
                    <option value="library">{t("catLibraries")}</option>
                    <option value="cafe">{t("catCafes")}</option>
                    <option value="studyRoom">{t("catCoworkings")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                    {t("hoursLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.operatingHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operatingHours: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                    Широта (Latitude)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                    Долгота (Longitude)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                    Всего мест
                  </label>
                  <input
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) =>
                      setFormData({ ...formData, totalSeats: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8E8E93] block mb-1">
                    Wi-Fi (Мбит/с)
                  </label>
                  <input
                    type="number"
                    value={formData.wifiSpeed}
                    onChange={(e) =>
                      setFormData({ ...formData, wifiSpeed: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F2F2F7] text-sm text-[#1C1C1E] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#007AFF] text-white font-semibold text-sm shadow-md active:opacity-80 transition-all mt-2"
              >
                {isSubmitting ? "Сохранение в БД..." : "Сохранить в базу данных"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
