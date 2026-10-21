// Type-safe localStorage manager for SpotFinder PWA
// All data persists across page reloads

const isBrowser = typeof window !== "undefined";

// --- Bookmarks (Saved Spots) ---
const BOOKMARKS_KEY = "spotfinder_bookmarks";

export function getBookmarks(): number[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(spotId: number): boolean {
  const current = getBookmarks();
  const index = current.indexOf(spotId);
  if (index >= 0) {
    current.splice(index, 1);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(current));
    return false; // removed
  } else {
    current.push(spotId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(current));
    return true; // added
  }
}

export function isBookmarked(spotId: number): boolean {
  return getBookmarks().includes(spotId);
}

// --- Custom Reviews ---
import { ReviewData } from "@/types/spot";

const REVIEWS_KEY = "spotfinder_reviews";

export function getCustomReviews(): Record<number, ReviewData[]> {
  if (!isBrowser) return {};
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function addReview(spotId: number, review: ReviewData): void {
  const all = getCustomReviews();
  if (!all[spotId]) all[spotId] = [];
  all[spotId].push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
}

// --- Seating Overrides ---
const SEATING_KEY = "spotfinder_seating";

export function getSeatingOverrides(): Record<number, number> {
  if (!isBrowser) return {};
  try {
    const raw = localStorage.getItem(SEATING_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateSeating(spotId: number, availableSeats: number): void {
  const all = getSeatingOverrides();
  all[spotId] = availableSeats;
  localStorage.setItem(SEATING_KEY, JSON.stringify(all));
}

// --- 2GIS API Key ---
const DGIS_KEY = "spotfinder_2gis_key";

export function get2GISKey(): string {
  if (!isBrowser) return "";
  return localStorage.getItem(DGIS_KEY) || "";
}

export function set2GISKey(key: string): void {
  if (!isBrowser) return;
  localStorage.setItem(DGIS_KEY, key);
}

// --- User Profile ---
const PROFILE_KEY = "spotfinder_profile";

export interface UserProfile {
  name: string;
  email: string;
  role: "STUDENT" | "REMOTE_WORKER" | "HIGH_SCHOOL_STUDENT";
  university?: string;
  major?: string;
  language: "kk" | "ru" | "en";
}

export function getUserProfile(): UserProfile {
  if (!isBrowser) {
    return { name: "Ибрахим Нұрғали", email: "i_nurgali@astanait.edu.kz", role: "STUDENT", university: "Astana IT University", major: "Software Engineering (SE-2610)", language: "ru" };
  }
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { name: "Ибрахим Нұрғали", email: "i_nurgali@astanait.edu.kz", role: "STUDENT", university: "Astana IT University", major: "Software Engineering (SE-2610)", language: "ru" };
}

export function saveUserProfile(profile: UserProfile): void {
  if (!isBrowser) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
