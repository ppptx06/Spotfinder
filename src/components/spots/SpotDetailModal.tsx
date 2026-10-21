"use client";

import React, { useState } from "react";
import {
  X,
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
  Send,
} from "lucide-react";
import { StudySpotItem } from "@/types/spot";
import { NoiseIndicator } from "./NoiseIndicator";

interface SpotDetailModalProps {
  spot: StudySpotItem;
  onClose: () => void;
  onUpdateSeats: (spotId: number, delta: number) => void;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  onUpdateSeats,
}) => {
  const [crowdReported, setCrowdReported] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col border-t sm:border border-apple-border">
        {/* Modal Handle & Close Button */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md border-b border-apple-border">
          <div className="w-10 h-1 bg-apple-gray3 dark:bg-apple-gray1 rounded-full mx-auto sm:hidden absolute left-1/2 -translate-x-1/2 top-2" />
          <h2 className="text-base font-bold text-black dark:text-white truncate pr-6">
            {spot.name}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-apple-gray5 dark:bg-apple-darkElevated flex items-center justify-center text-apple-gray1 active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image */}
        {spot.imageUrl && (
          <div className="relative w-full h-48 sm:h-56 shrink-0 bg-apple-gray5">
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{spot.overallRating.toFixed(1)}</span>
              <span className="opacity-60 font-normal">({spot.reviews?.length || 0} отзывов)</span>
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Address & Hours */}
          <div className="space-y-1.5 text-xs text-apple-gray1">
            <div className="flex items-center space-x-2 text-black dark:text-white font-medium">
              <MapPin className="w-4 h-4 text-apple-blue shrink-0" />
              <span>{spot.address}</span>
            </div>
            {spot.operatingHours && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{spot.operatingHours}</span>
              </div>
            )}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated text-center">
              <div className="text-[10px] text-apple-gray1 font-semibold uppercase">Шум</div>
              <div className="mt-1 flex justify-center">
                {spot.noiseLevel && (
                  <NoiseIndicator
                    category={spot.noiseLevel.noiseCategory}
                    decibel={spot.noiseLevel.decibelLevel}
                  />
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated text-center">
              <div className="text-[10px] text-apple-gray1 font-semibold uppercase">Wi-Fi</div>
              <div className="mt-1 text-xs font-bold text-apple-blue">
                {spot.wifiInfo?.speedMbps || 0} Мб/с
              </div>
              <div className="text-[9px] text-apple-gray1 mt-0.5">
                {spot.wifiInfo?.isFree ? "Бесплатный" : "Платный"}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-apple-gray6 dark:bg-apple-darkElevated text-center">
              <div className="text-[10px] text-apple-gray1 font-semibold uppercase">Розетки</div>
              <div className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {spot.outlets?.reduce((acc, o) => acc + o.count, 0) || 0} шт.
              </div>
              <div className="text-[9px] text-apple-gray1 mt-0.5">Доступны</div>
            </div>
          </div>

          {/* Subtype Specific Card (ERD is-a details) */}
          {spot.library && (
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-apple-blue font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Параметры библиотеки</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Зона тишины: <strong>{spot.library.silentStudyArea ? "Да" : "Нет"}</strong></div>
                <div>Этажей: <strong>{spot.library.floorCount}</strong></div>
                <div>Бронь книг: <strong>{spot.library.bookReservation ? "Есть" : "Нет"}</strong></div>
                <div>Доступ: <strong>{spot.library.publicAccess ? "Открытый" : "По билету/ID"}</strong></div>
              </div>
            </div>
          )}

          {spot.cafe && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                <Coffee className="w-4 h-4" />
                <span>Параметры кафе для работы</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Средний кофе: <strong>{spot.cafe.avgCoffeePrice} ₸</strong></div>
                <div>Мин. заказ: <strong>{spot.cafe.minOrderRequired ? "Да" : "Нет"}</strong></div>
                <div>Меню еды: <strong>{spot.cafe.hasFoodMenu ? "Есть" : "Только напитки"}</strong></div>
                <div>Розетки: <strong>{spot.cafe.outletAvailability}</strong></div>
              </div>
            </div>
          )}

          {spot.studyRoom && (
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
                <Presentation className="w-4 h-4" />
                <span>Параметры коворкинга / Study Room</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Вместимость: <strong>до {spot.studyRoom.maxCapacity} чел.</strong></div>
                <div>Маркерная доска: <strong>{spot.studyRoom.hasWhiteboard ? "Есть" : "Нет"}</strong></div>
                <div>Проектор: <strong>{spot.studyRoom.hasProjector ? "Есть" : "Нет"}</strong></div>
                <div>Тариф: <strong>{spot.studyRoom.hourlyRate} ₸ / час</strong></div>
              </div>
            </div>
          )}

          {/* Crowdsourcing Live Update Box */}
          <div className="p-3.5 rounded-2xl apple-glass border border-apple-border space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-black dark:text-white flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-apple-blue" />
                <span>Текущая заполненность:</span>
              </span>
              <span className="text-apple-blue font-bold">
                {spot.seating?.availableSeats} мест свободно
              </span>
            </div>

            {crowdReported ? (
              <div className="flex items-center space-x-2 text-xs text-apple-green font-medium py-1">
                <CheckCircle className="w-4 h-4" />
                <span>Спасибо! Ваш статус отправлен другим студентам.</span>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onUpdateSeats(spot.id, -1);
                    setCrowdReported(true);
                  }}
                  className="flex-1 py-2 rounded-xl bg-apple-gray6 dark:bg-apple-darkElevated text-xs font-semibold text-black dark:text-white active:scale-95 transition-all"
                >
                  Занял место (-1)
                </button>
                <button
                  onClick={() => {
                    onUpdateSeats(spot.id, 1);
                    setCrowdReported(true);
                  }}
                  className="flex-1 py-2 rounded-xl bg-apple-gray6 dark:bg-apple-darkElevated text-xs font-semibold text-black dark:text-white active:scale-95 transition-all"
                >
                  Освободилось (+1)
                </button>
              </div>
            )}
          </div>

          {/* User Reviews */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-apple-gray1 uppercase tracking-wide">
              Отзывы студентов ({spot.reviews?.length || 0})
            </h4>
            <div className="space-y-2">
              {spot.reviews?.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 rounded-xl bg-apple-gray6 dark:bg-apple-darkElevated space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-black dark:text-white">{rev.authorName}</span>
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current mr-0.5" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-apple-gray1">{rev.comment}</p>
                  <span className="text-[10px] text-apple-gray2 block">{rev.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
