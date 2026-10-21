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
} from "lucide-react";
import { StudySpotItem, ReviewData } from "@/types/spot";
import { NoiseIndicator } from "./NoiseIndicator";
import { isBookmarked, toggleBookmark } from "@/lib/storage";
import { Language, useTranslation } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";

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

  const [crowdReported, setCrowdReported] = useState(false);
  const [saved, setSaved] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reviews state (combines server + local)
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

  // 2GIS direct links (No API key needed!)
  const dgisUrl = `https://2gis.kz/astana/geo/${spot.longitude},${spot.latitude}`;
  const dgisRouteUrl = `https://2gis.kz/astana/directions/points/${spot.longitude},${spot.latitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-t-[28px] max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col border-t border-[rgba(60,60,67,0.06)] animate-slideUp">
        {/* iOS Navigation Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-[rgba(60,60,67,0.06)]">
          {/* Grabber */}
          <div className="w-9 h-[5px] bg-[#D1D1D6] rounded-full absolute left-1/2 -translate-x-1/2 top-1.5 sm:hidden" />

          {/* ‹ Назад Button */}
          <button
            onClick={handleClose}
            className="flex items-center text-[#007AFF] active:opacity-60 transition-opacity -ml-1"
          >
            <ChevronLeft className="w-5 h-5 -mr-0.5" />
            <span className="text-[15px] font-normal">{t("back")}</span>
          </button>

          <h2 className="text-[15px] font-semibold text-[#1C1C1E] truncate max-w-[45%] text-center">
            {spot.name}
          </h2>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className="active:scale-90 transition-transform p-1"
          >
            <Bookmark
              className={`w-5 h-5 ${
                saved ? "fill-[#007AFF] text-[#007AFF]" : "text-[#8E8E93]"
              }`}
            />
          </button>
        </div>

        {/* Hero Image */}
        {spot.imageUrl && (
          <div className="relative w-full h-48 sm:h-56 shrink-0 bg-[#F2F2F7]">
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="w-full h-full object-cover"
            />
            {/* Floating back button */}
            <button
              onClick={handleClose}
              className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-xl flex items-center justify-center shadow-apple active:scale-90 transition-transform sm:hidden"
            >
              <ChevronLeft className="w-5 h-5 text-[#1C1C1E]" />
            </button>

            {/* Rating badge */}
            <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[#1C1C1E] text-xs font-semibold shadow-apple">
              <Star className="w-3.5 h-3.5 fill-[#FF9500] text-[#FF9500]" />
              <span>{avgRating.toFixed(1)}</span>
              <span className="text-[#8E8E93] font-normal">
                ({reviewsList.length})
              </span>
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Address & Hours */}
          <div className="space-y-1.5 text-xs text-[#8E8E93]">
            <div className="flex items-center space-x-2 text-[#1C1C1E] font-medium">
              <MapPin className="w-4 h-4 text-[#007AFF] shrink-0" />
              <span>{spot.address}</span>
            </div>
            {spot.operatingHours && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{spot.operatingHours}</span>
              </div>
            )}
          </div>

          {/* Action Buttons: Route in 2GIS + Open in 2GIS */}
          <div className="flex space-x-2">
            <a
              href={dgisRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl bg-[#007AFF] text-white font-semibold text-[13px] active:opacity-80 transition-all shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>{t("route2gis")}</span>
            </a>
            <a
              href={dgisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 rounded-2xl bg-[#F2F2F7] text-[#007AFF] font-semibold text-[13px] active:opacity-80 transition-all border border-[rgba(60,60,67,0.06)]"
              title={t("open2gis")}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-[#F2F2F7] text-center">
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

            <div className="p-2.5 rounded-2xl bg-[#F2F2F7] text-center">
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

            <div className="p-2.5 rounded-2xl bg-[#F2F2F7] text-center">
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

          {/* Subtype Specific Card */}
          {spot.library && (
            <div className="p-3.5 rounded-2xl bg-[#007AFF]/5 border border-[#007AFF]/10 space-y-2">
              <div className="flex items-center space-x-2 text-[#007AFF] font-semibold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Параметры библиотеки</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#1C1C1E]">
                <div>
                  Зона тишины:{" "}
                  <strong>{spot.library.silentStudyArea ? "Да" : "Нет"}</strong>
                </div>
                <div>
                  Этажей: <strong>{spot.library.floorCount}</strong>
                </div>
                <div>
                  Бронь книг:{" "}
                  <strong>{spot.library.bookReservation ? "Есть" : "Нет"}</strong>
                </div>
                <div>
                  Доступ:{" "}
                  <strong>
                    {spot.library.publicAccess ? "Открытый" : "По билету/ID"}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {spot.cafe && (
            <div className="p-3.5 rounded-2xl bg-[#FF9500]/5 border border-[#FF9500]/10 space-y-2">
              <div className="flex items-center space-x-2 text-[#FF9500] font-semibold text-xs">
                <Coffee className="w-4 h-4" />
                <span>Параметры кафе</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#1C1C1E]">
                <div>
                  Средний кофе: <strong>{spot.cafe.avgCoffeePrice} ₸</strong>
                </div>
                <div>
                  Мин. заказ:{" "}
                  <strong>{spot.cafe.minOrderRequired ? "Да" : "Нет"}</strong>
                </div>
                <div>
                  Меню еды:{" "}
                  <strong>{spot.cafe.hasFoodMenu ? "Есть" : "Напитки"}</strong>
                </div>
                <div>
                  Розетки: <strong>{spot.cafe.outletAvailability}</strong>
                </div>
              </div>
            </div>
          )}

          {spot.studyRoom && (
            <div className="p-3.5 rounded-2xl bg-[#AF52DE]/5 border border-[#AF52DE]/10 space-y-2">
              <div className="flex items-center space-x-2 text-[#AF52DE] font-semibold text-xs">
                <Presentation className="w-4 h-4" />
                <span>Параметры коворкинга</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#1C1C1E]">
                <div>
                  Вместимость:{" "}
                  <strong>до {spot.studyRoom.maxCapacity} чел.</strong>
                </div>
                <div>
                  Маркерная доска:{" "}
                  <strong>{spot.studyRoom.hasWhiteboard ? "Есть" : "Нет"}</strong>
                </div>
                <div>
                  Проектор:{" "}
                  <strong>{spot.studyRoom.hasProjector ? "Есть" : "Нет"}</strong>
                </div>
                <div>
                  Тариф:{" "}
                  <strong>{spot.studyRoom.hourlyRate} ₸ / час</strong>
                </div>
              </div>
            </div>
          )}

          {/* Crowdsourcing Live Update Box */}
          <div className="p-3.5 rounded-2xl bg-[#F2F2F7] border border-[rgba(60,60,67,0.06)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1C1C1E] flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-[#007AFF]" />
                <span>{t("currentOccupancy")}</span>
              </span>
              <span className="text-[#007AFF] font-bold">
                {spot.seating?.availableSeats} {t("seatsLeft")}
              </span>
            </div>

            {/* Seat progress bar */}
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
                    width: `${
                      (spot.seating.availableSeats / spot.seating.totalSeats) * 100
                    }%`,
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
                  className="flex-1 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#1C1C1E] active:scale-95 transition-all border border-[rgba(60,60,67,0.08)] shadow-sm"
                >
                  {t("occupiedSeatBtn")}
                </button>
                <button
                  onClick={() => handleSeatClick(1)}
                  className="flex-1 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#1C1C1E] active:scale-95 transition-all border border-[rgba(60,60,67,0.08)] shadow-sm"
                >
                  {t("freedSeatBtn")}
                </button>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="p-3.5 rounded-2xl bg-[#F2F2F7] border border-[rgba(60,60,67,0.06)] space-y-3">
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
                {/* Star Rating Picker */}
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
                  <span className="text-xs text-[#8E8E93] ml-2">
                    {reviewRating}/5
                  </span>
                </div>

                {/* Comment Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t("yourComment")}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-[rgba(60,60,67,0.08)] text-sm text-[#1C1C1E] placeholder-[#C7C7CC] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
                  />
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview || !reviewText.trim()}
                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${
                      reviewText.trim()
                        ? "bg-[#007AFF] text-white"
                        : "bg-[#E5E5EA] text-[#C7C7CC]"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Reviews with Admin Delete */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide">
              {t("reviewsList")} ({reviewsList.length})
            </h4>
            <div className="space-y-2">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 rounded-xl bg-[#F2F2F7] space-y-1 text-xs relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1C1C1E]">
                      {rev.authorName}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-[#FF9500] font-bold">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        <span>{rev.rating}</span>
                      </div>
                      {/* Admin moderation delete button */}
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
                  <span className="text-[10px] text-[#AEAEB2] block">
                    {rev.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};
