import { StudySpotItem } from "@/types/spot";

export interface SmartMetrics {
  score: number; // 0..100
  scoreLabel: string;
  isOpenNow: boolean;
  statusText: string;
  isClosingSoon: boolean;
  breakdown: {
    noise: number;
    wifi: number;
    outlets: number;
    seats: number;
  };
}

export type SmartFilterId = "all" | "focus" | "power" | "coffee" | "fastWifi" | "openNow";

/**
 * Parses operating hours like "08:00 - 22:00" or "24/7" and checks against current time.
 */
export function getSpotOperatingStatus(operatingHours?: string | null): {
  isOpenNow: boolean;
  statusText: string;
  isClosingSoon: boolean;
} {
  if (!operatingHours || operatingHours.includes("24/7") || operatingHours.toLowerCase().includes("круглосуточно")) {
    return {
      isOpenNow: true,
      statusText: "24/7",
      isClosingSoon: false,
    };
  }

  // Expecting format like "08:00 - 22:00" or "09:00 - 21:00"
  const match = operatingHours.match(/(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/);
  if (!match) {
    return {
      isOpenNow: true,
      statusText: operatingHours,
      isClosingSoon: false,
    };
  }

  const [, openH, openM, closeH, closeM] = match.map(Number);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;

  // Handle past midnight closing (e.g. 10:00 - 02:00)
  if (closeMinutes < openMinutes) {
    closeMinutes += 24 * 60;
  }

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  const minutesUntilClose = closeMinutes - currentMinutes;
  const isClosingSoon = isOpen && minutesUntilClose > 0 && minutesUntilClose <= 60;

  if (!isOpen) {
    return {
      isOpenNow: false,
      statusText: `Закрыто до ${String(openH).padStart(2, "0")}:${String(openM).padStart(2, "0")}`,
      isClosingSoon: false,
    };
  }

  if (isClosingSoon) {
    return {
      isOpenNow: true,
      statusText: `Закроется через ${minutesUntilClose} мин`,
      isClosingSoon: true,
    };
  }

  return {
    isOpenNow: true,
    statusText: `Открыто до ${String(closeH).padStart(2, "0")}:${String(closeM).padStart(2, "0")}`,
    isClosingSoon: false,
  };
}

/**
 * Calculates a 0-100 Study Fit Score based on noise, outlets, seating & Wi-Fi.
 */
export function calculateSmartMetrics(spot: StudySpotItem): SmartMetrics {
  // 1. Noise factor (35 max)
  let noiseScore = 20;
  if (spot.noiseLevel) {
    if (spot.noiseLevel.noiseCategory === "SILENT") noiseScore = 35;
    else if (spot.noiseLevel.noiseCategory === "QUIET") noiseScore = 28;
    else noiseScore = 15;
  }

  // 2. Outlets factor (25 max)
  let outletScore = 10;
  const totalOutlets = spot.outlets?.reduce((acc, o) => acc + o.count, 0) || 0;
  if (totalOutlets >= 40) outletScore = 25;
  else if (totalOutlets >= 20) outletScore = 20;
  else if (totalOutlets >= 10) outletScore = 15;
  else if (totalOutlets > 0) outletScore = 10;
  else outletScore = 5;

  // 3. Seating availability factor (20 max)
  let seatScore = 10;
  if (spot.seating) {
    const ratio = spot.seating.availableSeats / (spot.seating.totalSeats || 1);
    if (ratio > 0.4) seatScore = 20;
    else if (ratio > 0.15) seatScore = 14;
    else if (ratio > 0) seatScore = 8;
    else seatScore = 2;
  }

  // 4. Wi-Fi factor (20 max)
  let wifiScore = 10;
  const speed = spot.wifiInfo?.speedMbps || 0;
  if (speed >= 150) wifiScore = 20;
  else if (speed >= 80) wifiScore = 16;
  else if (speed >= 30) wifiScore = 12;
  else if (speed > 0) wifiScore = 8;

  const totalScore = Math.min(100, Math.round(noiseScore + outletScore + seatScore + wifiScore));

  let scoreLabel = "Хорошо";
  if (totalScore >= 90) scoreLabel = "Идеально для фокуса";
  else if (totalScore >= 75) scoreLabel = "Отлично для учёбы";
  else if (totalScore >= 60) scoreLabel = "Подходит для работы";

  const { isOpenNow, statusText, isClosingSoon } = getSpotOperatingStatus(spot.operatingHours);

  return {
    score: totalScore,
    scoreLabel,
    isOpenNow,
    statusText,
    isClosingSoon,
    breakdown: {
      noise: noiseScore,
      wifi: wifiScore,
      outlets: outletScore,
      seats: seatScore,
    },
  };
}

/**
 * Filter spots by smart scenario.
 */
export function matchesSmartFilter(spot: StudySpotItem, filterId: SmartFilterId): boolean {
  if (filterId === "all") return true;

  if (filterId === "focus") {
    return spot.noiseLevel?.noiseCategory === "SILENT" || spot.noiseLevel?.noiseCategory === "QUIET";
  }

  if (filterId === "power") {
    const totalOutlets = spot.outlets?.reduce((acc, o) => acc + o.count, 0) || 0;
    return totalOutlets >= 15;
  }

  if (filterId === "coffee") {
    return spot.spotType === "cafe";
  }

  if (filterId === "fastWifi") {
    return (spot.wifiInfo?.speedMbps || 0) >= 100;
  }

  if (filterId === "openNow") {
    const status = getSpotOperatingStatus(spot.operatingHours);
    return status.isOpenNow;
  }

  return true;
}
