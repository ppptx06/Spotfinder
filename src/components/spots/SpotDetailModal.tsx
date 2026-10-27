"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Wifi,
  Zap,
  Users,
  CheckCircle,
  Coffee,
  BookOpen,
  Presentation,
  Bookmark,
  Navigation,
  Send,
  ExternalLink,
  Trash2,
  Sparkles,
  Share2,
} from "lucide-react";
import { StudySpotItem, ReviewData } from "@/types/spot";
import { NoiseIndicator } from "./NoiseIndicator";
import { isBookmarked, toggleBookmark } from "@/lib/storage";
import { Language, useTranslation } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { calculateSmartMetrics } from "@/lib/smartScore";

interface SpotDetailModalProps {
  spot: StudySpotItem;
  onClose: () => void;
  onUpdateSeats: (spotId: number, delta: number) => void;
  onToggleBookmark: (spotId: number) => void;
  lang?: Language;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  onUpdateSeats,
  onToggleBookmark,
  lang = "ru",
}) => {
  const t = useTranslation(lang);
  const currentUser = getCurrentUser();
  const metrics = calculateSmartMetrics(spot);

  const [crowdReported, setCrowdReported] = useState(false);
  const [saved, setSaved] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState<ReviewData[]>(
    spot.reviews || []
  );

  useEffect(() => {
    setSaved(isBookmarked(spot.id));
    setReviewsList(spot.reviews || []);
  }, [spot.id, spot.reviews]);

  // Handle hardware back button on mobile
  useEffect(() => {
    window.history.pushState({ modal: "spotDetail" }, "");
    const handlePop = () => onClose();
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [onClose]);

  const handleClose = () => {
    if (window.history.state?.modal === "spotDetail") {
      window.history.back();
    } else {
      onClose();
    }
  };

  const handleToggleBookmark = () => {
    const result = toggleBookmark(spot.id);
    setSaved(result);
    onToggleBookmark(spot.id);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(15);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SpotFinder — ${spot.name}`,
          text: `Идеальное место для учёбы в Астане: ${spot.name} (${spot.address})`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Ссылка скопирована в буфер обмена!");
    }
  };

  // Submit Review to Database via /api/reviews
  const handleSubmitReview = async () => {
    if (reviewRating === 0 || !reviewText.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotId: spot.id,
          rating: reviewRating,
          comment: reviewText.trim(),
          authorName: currentUser?.name || "Студент",
          userEmail: currentUser?.email,
        }),
      });

      if (res.ok) {
        const createdReview = await res.json();
        setReviewsList((prev) => [createdReview, ...prev]);
        setReviewSubmitted(true);
        setReviewText("");
      }
    } catch (err) {
      console.error("Submit review error:", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Delete review (Admin functionality)
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Удалить этот отзыв из базы данных?")) return;
    try {
      const res = await fetch(
        `/api/reviews?id=${reviewId}&adminEmail=${currentUser?.email}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setReviewsList((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  // Handle seat crowdsourcing with DB sync
  const handleSeatClick = async (delta: number) => {
    onUpdateSeats(spot.id, delta);
    setCrowdReported(true);

    try {
      await fetch("/api/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotId: spot.id, delta }),
      });
    } catch (err) {
      console.error("Sync seats to DB failed:", err);
    }
  };

  const avgRating =
    reviewsList.length > 0
      ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length
      : spot.overallRating;

  // External Map Routes
  const dgisUrl = `https://2gis.kz/astana/geo/${spot.longitude},${spot.latitude}`;
  const dgisRouteUrl = `https://2gis.kz/astana/directions/points/${spot.longitude},${spot.latitude}`;
  const yandexRouteUrl = `https://yandex.kz/maps/?rtext=~${spot.latitude},${spot.longitude}&rtt=auto`;

  // Simulated peak hours data based on spot type
  const currentHour = new Date().getHours();
  const peakHoursData = [
    { hour: "09:00", load: 20 },
    { hour: "11:00", load: 45 },
    { hour: "13:00", load: 75 },
    { hour: "15:00", load: 90 },
    { hour: "17:00", load: 95 },
    { hour: "19:00", load: 80 },
    { hour: "21:00", load: 40 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] sm:max-h-[85vh] overflow-y-auto apple-scrollbar shadow-apple-modal flex flex-col border border-white/60 animate-slideUp">
        {/* iOS Navigation Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-2xl border-b border-[rgba(60,60,67,0.06)]">
          {/* Mobile Handle */}
          <div className="w-10 h-[5px] bg-[#D1D1D6] rounded-full absolute left-1/2 -translate-x-1/2 top-2 sm:hidden" />

          {/* Back Button */}
          <button
            onClick={handleClose}
            className="flex items-center text-[#007AFF] active:opacity-60 transition-opacity -ml-1 text-[15px] font-medium"
          >
            <ChevronLeft className="w-5 h-5 -mr-0.5" />
            <span>{t("back")}</span>
          </button>

          <h2 className="text-[15px] font-semibold text-[#1C1C1E] truncate max-w-[50%] text-center">
            {spot.name}
          </h2>

          {/* Actions: Share + Bookmark */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-[#F2F2F7] text-[#8E8E93] active:scale-90 transition-transform"
              title="Поделиться"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleBookmark}
              className="p-1.5 rounded-full hover:bg-[#F2F2F7] active:scale-90 transition-transform"
              title="В закладки"
            >
              <Bookmark
                className={`w-4 h-4 transition-colors ${
                  saved ? "fill-[#007AFF] text-[#007AFF]" : "text-[#8E8E93]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        {spot.imageUrl && (
          <div className="relative w-full h-52 sm:h-60 shrink-0 bg-[#F2F2F7] overflow-hidden">
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Floating badges on image */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-bold border border-white/20">
                  <Star className="w-3.5 h-3.5 fill-[#FF9500] text-[#FF9500]" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span className="text-white/70 font-normal">({reviewsList.length})</span>
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-medium border border-white/20">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      metrics.isOpenNow ? "bg-[#34C759]" : "bg-[#FF3B30]"
                    }`}
                  />
                  <span>{metrics.statusText}</span>
                </div>
              </div>

              {metrics.score >= 80 && (
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#007AFF]/80 backdrop-blur-md text-xs font-bold border border-white/20">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>{metrics.score}% Fit</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-5 space-y-5">
          {/* Address & Hours */}
          <div className="space-y-1.5 text-xs text-[#8E8E93]">
            <div className="flex items-center space-x-2 text-[#1C1C1E] font-medium text-sm">
              <MapPin className="w-4 h-4 text-[#007AFF] shrink-0" />
              <span>{spot.address}</span>
            </div>
            {spot.operatingHours && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#8E8E93] shrink-0" />
                <span>{spot.operatingHours}</span>
              </div>
            )}
          </div>

          {/* Quick Route Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={dgisRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-[#007AFF] hover:bg-[#0069D9] text-white font-semibold text-xs active:scale-[0.98] transition-all shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>{t("route2gis")}</span>
            </a>
            <a
              href={yandexRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] font-semibold text-xs active:scale-[0.98] transition-all border border-[rgba(60,60,67,0.06)]"
            >
              <ExternalLink className="w-4 h-4 text-[#8E8E93]" />
              <span>{t("routeYandex")}</span>
            </a>
          </div>

          {/* Apple Style Study Fit Score Dashboard */}
          <div className="p-4 rounded-[22px] bg-gradient-to-br from-[#007AFF]/6 via-white to-[#AF52DE]/6 border border-[#007AFF]/12 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1C1E] uppercase tracking-wider">
                    {t("fitScore")}
                  </h4>
                  <p className="text-[11px] text-[#8E8E93]">{metrics.scoreLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#007AFF] tracking-tight">
                  {metrics.score}
                </span>
                <span className="text-xs font-semibold text-[#8E8E93]">/100</span>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[rgba(60,60,67,0.06)] text-[10px]">
              <div>
                <span className="text-[#8E8E93] block mb-1">Тишина</span>
                <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#34C759] rounded-full"
                    style={{ width: `${(metrics.breakdown.noise / 35) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <span className="text-[#8E8E93] block mb-1">Розетки</span>
                <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF9500] rounded-full"
                    style={{ width: `${(metrics.breakdown.outlets / 25) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <span className="text-[#8E8E93] block mb-1">Места</span>
                <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#007AFF] rounded-full"
                    style={{ width: `${(metrics.breakdown.seats / 20) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <span className="text-[#8E8E93] block mb-1">Wi-Fi</span>
                <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#AF52DE] rounded-full"
                    style={{ width: `${(metrics.breakdown.wifi / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Peak Hours Histogram */}
          <div className="p-4 rounded-[22px] bg-[#F2F2F7] border border-[rgba(60,60,67,0.06)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1C1C1E]">{t("peakHours")}</span>
              <span className="text-[11px] text-[#8E8E93]">
                Сейчас: {currentHour >= 14 && currentHour <= 19 ? "Высокая" : "Умеренная"}
              </span>
            </div>
            <div className="flex items-end justify-between h-14 pt-2 gap-1.5">
              {peakHoursData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      d.load > 85 ? "bg-[#FF9500]" : "bg-[#007AFF]/60"
                    }`}
                    style={{ height: `${d.load}%` }}
                  />
                  <span className="text-[9px] text-[#8E8E93] font-medium">{d.hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#F2F2F7] text-center border border-[rgba(60,60,67,0.04)]">
              <div className="text-[10px] text-[#8E8E93] font-semibold uppercase">
                {t("noiseLabel")}
              </div>
              <div className="mt-1 flex justify-center">
                {spot.noiseLevel && (
                  <NoiseIndicator
                    category={spot.noiseLevel.noiseCategory}
                    decibel={spot.noiseLevel.decibelLevel}
                    lang={lang}
                  />
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F2F2F7] text-center border border-[rgba(60,60,67,0.04)]">
              <div className="text-[10px] text-[#8E8E93] font-semibold uppercase">
                {t("wifiSpeed")}
              </div>
              <div className="mt-1 text-xs font-bold text-[#007AFF]">
                {spot.wifiInfo?.speedMbps || 0} Мб/с
              </div>
              <div className="text-[9px] text-[#8E8E93] mt-0.5">
                {spot.wifiInfo?.isFree ? t("wifiFree") : t("wifiPaid")}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F2F2F7] text-center border border-[rgba(60,60,67,0.04)]">
              <div className="text-[10px] text-[#8E8E93] font-semibold uppercase">
                Розетки
              </div>
              <div className="mt-1 text-xs font-bold text-[#34C759]">
                {spot.outlets?.reduce((acc, o) => acc + o.count, 0) || 0} шт.
              </div>
              <div className="text-[9px] text-[#8E8E93] mt-0.5">
                {t("outletsAvail")}
              </div>
            </div>
          </div>

          {/* Subtype Specific Details */}
          {spot.library && (
            <div className="p-4 rounded-2xl bg-[#007AFF]/5 border border-[#007AFF]/12 space-y-2">
              <div className="flex items-center space-x-2 text-[#007AFF] font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Параметры библиотеки</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#1C1C1E]">
                <div>Зона тишины: <strong>{spot.library.silentStudyArea ? "Да" : "Нет"}</strong></div>
                <div>Этажей: <strong>{spot.library.floorCount}</strong></div>
                <div>Бронь книг: <strong>{spot.library.bookReservation ? "Есть" : "Нет"}</strong></div>
                <div>Доступ: <strong>{spot.library.publicAccess ? "Открытый" : "По билету/ID"}</strong></div>
              </div>
            </div>
          )}

          {spot.cafe && (
            <div className="p-4 rounded-2xl bg-[#FF9500]/5 border border-[#FF9500]/12 space-y-2">
              <div className="flex items-center space-x-2 text-[#FF9500] font-bold text-xs uppercase tracking-wider">
                <Coffee className="w-4 h-4" />
                <span>Параметры кафе</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#1C1C1E]">
                <div>Средний кофе: <strong>{spot.cafe.avgCoffeePrice} ₸</strong></div>
                <div>Мин. заказ: <strong>{spot.cafe.minOrderRequired ? "Да" : "Нет"}</strong></div>
                <div>Меню еды: <strong>{spot.cafe.hasFoodMenu ? "Есть" : "Напитки"}</strong></div>
                <div>Розетки: <strong>{spot.cafe.outletAvailability}</strong></div>
              </div>
            </div>
          )}

          {spot.studyRoom && (
            <div className="p-4 rounded-2xl bg-[#AF52DE]/5 border border-[#AF52DE]/12 space-y-2">
              <div className="flex items-center space-x-2 text-[#AF52DE] font-bold text-xs uppercase tracking-wider">
                <Presentation className="w-4 h-4" />
                <span>Параметры коворкинга</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#1C1C1E]">
                <div>Вместимость: <strong>до {spot.studyRoom.maxCapacity} чел.</strong></div>
                <div>Маркерная доска: <strong>{spot.studyRoom.hasWhiteboard ? "Есть" : "Нет"}</strong></div>
                <div>Проектор: <strong>{spot.studyRoom.hasProjector ? "Есть" : "Нет"}</strong></div>
                <div>Тариф: <strong>{spot.studyRoom.hourlyRate} ₸ / час</strong></div>
              </div>
            </div>
          )}

          {/* Crowdsourcing Live Update Box */}
          <div className="p-4 rounded-2xl bg-[#F2F2F7] border border-[rgba(60,60,67,0.06)] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1C1C1E] flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-[#007AFF]" />
                <span>{t("currentOccupancy")}</span>
              </span>
              <span className="text-[#007AFF] font-bold">
                {spot.seating?.availableSeats} {t("seatsLeft")}
              </span>
            </div>

            {spot.seating && (
              <div className="w-full h-2 bg-[#E5E5EA] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    (spot.seating.availableSeats / spot.seating.totalSeats) * 100 > 50
                      ? "bg-[#34C759]"
                      : (spot.seating.availableSeats / spot.seating.totalSeats) * 100 > 20
                      ? "bg-[#FF9500]"
                      : "bg-[#FF3B30]"
                  }`}
                  style={{
                    width: `${(spot.seating.availableSeats / spot.seating.totalSeats) * 100}%`,
                  }}
                />
              </div>
            )}

            {crowdReported ? (
              <div className="flex items-center space-x-2 text-xs text-[#34C759] font-medium py-1">
                <CheckCircle className="w-4 h-4" />
                <span>{t("seatThanks")}</span>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSeatClick(-1)}
                  className="flex-1 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#1C1C1E] active:scale-95 transition-all border border-[rgba(60,60,67,0.08)] shadow-sm hover:border-[rgba(60,60,67,0.15)]"
                >
                  {t("occupiedSeatBtn")}
                </button>
                <button
                  onClick={() => handleSeatClick(1)}
                  className="flex-1 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#1C1C1E] active:scale-95 transition-all border border-[rgba(60,60,67,0.08)] shadow-sm hover:border-[rgba(60,60,67,0.15)]"
                >
                  {t("freedSeatBtn")}
                </button>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="p-4 rounded-2xl bg-[#F2F2F7] border border-[rgba(60,60,67,0.06)] space-y-3">
            <h4 className="text-[13px] font-semibold text-[#1C1C1E]">
              {t("leaveReview")}
            </h4>

            {reviewSubmitted ? (
              <div className="flex items-center space-x-2 text-xs text-[#34C759] font-medium py-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t("reviewAdded")}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="active:scale-90 transition-transform p-0.5"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? "fill-[#FF9500] text-[#FF9500]"
                            : "text-[#D1D1D6]"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#8E8E93] ml-2 font-medium">
                    {reviewRating}/5
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t("yourComment")}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-[rgba(60,60,67,0.08)] text-sm text-[#1C1C1E] placeholder-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview || !reviewText.trim()}
                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${
                      reviewText.trim()
                        ? "bg-[#007AFF] text-white shadow-sm"
                        : "bg-[#E5E5EA] text-[#C7C7CC]"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Reviews */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide">
              {t("reviewsList")} ({reviewsList.length})
            </h4>
            <div className="space-y-2">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl bg-[#F2F2F7] space-y-1 text-xs relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1C1C1E]">{rev.authorName}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-[#FF9500] font-bold">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        <span>{rev.rating}</span>
                      </div>
                      {currentUser?.isAdmin && (
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-[#FF3B30] hover:opacity-80 p-0.5"
                          title="Удалить отзыв (Админ)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[#8E8E93]">{rev.comment}</p>
                  <span className="text-[10px] text-[#AEAEB2] block">{rev.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
