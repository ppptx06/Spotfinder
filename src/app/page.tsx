"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Header } from "@/components/apple/Header";
import { TabBar, TabType } from "@/components/apple/TabBar";
import { SegmentedControl } from "@/components/apple/SegmentedControl";
import { BottomSheet } from "@/components/apple/BottomSheet";
import { SpotCard } from "@/components/spots/SpotCard";
import { SpotDetailModal } from "@/components/spots/SpotDetailModal";
import { FilterModal, FilterState } from "@/components/apple/FilterModal";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { UserProfileView } from "@/components/profile/UserProfileView";
import { SavedSpotsView } from "@/components/saved/SavedSpotsView";
import { AdminManagementView } from "@/components/admin/AdminManagementView";
import { AuthModal } from "@/components/auth/AuthModal";
import { MOCK_SPOTS } from "@/lib/mockData";
import { StudySpotItem } from "@/types/spot";
import { BookOpen, Coffee, Presentation, LayoutGrid } from "lucide-react";
import {
  getSeatingOverrides,
  updateSeating,
  getBookmarks,
  toggleBookmark,
} from "@/lib/storage";
import { Language, getLanguage, setLanguage, useTranslation } from "@/lib/i18n";
import { getCurrentUser, AuthUser } from "@/lib/auth";

// Haversine formula to calculate distance in km
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function Home() {
  const [spots, setSpots] = useState<StudySpotItem[]>(MOCK_SPOTS);
  const [currentTab, setCurrentTab] = useState<TabType>("explore");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<StudySpotItem | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [, setBookmarkVersion] = useState(0);

  // Active Language State
  const [lang, setLangState] = useState<Language>("ru");
  const t = useTranslation(lang);

  // Active User State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Load language and auth on mount
  useEffect(() => {
    setLangState(getLanguage());
    setCurrentUser(getCurrentUser());

    const handleLangChange = () => setLangState(getLanguage());
    const handleAuthChange = () => setCurrentUser(getCurrentUser());

    window.addEventListener("language-changed", handleLangChange);
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("language-changed", handleLangChange);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  // Fetch spots from real SQLite Database via API
  useEffect(() => {
    async function loadSpotsFromDb() {
      try {
        const res = await fetch("/api/spots");
        if (res.ok) {
          const dbSpots = await res.json();
          if (Array.isArray(dbSpots) && dbSpots.length > 0) {
            setSpots(dbSpots);
          }
        }
      } catch (err) {
        console.warn("Using fallback spots data:", err);
      }
    }
    loadSpotsFromDb();
  }, []);

  // Request browser geolocation for distance calculation and radar
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Recalculate distance for all spots
          setSpots((prev) =>
            prev.map((s) => ({
              ...s,
              distanceKm: calculateDistance(
                latitude,
                longitude,
                s.latitude,
                s.longitude
              ),
            }))
          );
        },
        () => {
          // Fallback to AITU Expo coordinates if permission denied
          setUserLocation({ lat: 51.0908, lng: 71.4183 });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Handle phone hardware back button navigation between tabs
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.tab) {
        setCurrentTab(e.state.tab);
      } else {
        setCurrentTab("explore");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === "filters") {
      setIsFilterModalOpen(true);
      return;
    }
    if (typeof window !== "undefined") {
      window.history.pushState({ tab }, "");
    }
    setCurrentTab(tab);
  }, []);

  // Toggle bookmark handler with re-render trigger
  const handleToggleBookmark = useCallback((spotId: number) => {
    toggleBookmark(spotId);
    setBookmarkVersion((v) => v + 1);
  }, []);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    noiseCategory: "ALL",
    minWifiSpeed: 0,
    outletsRequired: false,
    freeOnly: false,
  });

  const resetFilters = () => {
    setFilters({
      noiseCategory: "ALL",
      minWifiSpeed: 0,
      outletsRequired: false,
      freeOnly: false,
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.noiseCategory !== "ALL") count++;
    if (filters.minWifiSpeed > 0) count++;
    if (filters.outletsRequired) count++;
    if (filters.freeOnly) count++;
    return count;
  }, [filters]);

  // Filtered Spots Logic
  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(query);
        const matchesAddress = spot.address.toLowerCase().includes(query);
        const matchesAffiliation =
          spot.library?.campusAffiliation?.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesAffiliation) return false;
      }

      // 2. Type Filter
      if (selectedType !== "all" && spot.spotType !== selectedType) {
        return false;
      }

      // 3. Noise Filter
      if (filters.noiseCategory !== "ALL") {
        if (spot.noiseLevel?.noiseCategory !== filters.noiseCategory)
          return false;
      }

      // 4. Wi-Fi Speed Filter
      if (filters.minWifiSpeed > 0) {
        if ((spot.wifiInfo?.speedMbps || 0) < filters.minWifiSpeed)
          return false;
      }

      // 5. Outlets Filter
      if (filters.outletsRequired) {
        const outletCount =
          spot.outlets?.reduce((acc, o) => acc + o.count, 0) || 0;
        if (outletCount < 10) return false;
      }

      // 6. Free Only
      if (filters.freeOnly) {
        if (spot.spotType === "cafe" && spot.cafe?.minOrderRequired)
          return false;
        if (
          spot.spotType === "studyRoom" &&
          spot.studyRoom &&
          spot.studyRoom.hourlyRate > 0
        )
          return false;
      }

      return true;
    });
  }, [spots, searchQuery, selectedType, filters]);

  // Crowdsourcing Update Handler with DB sync
  const handleUpdateSeats = (spotId: number, delta: number) => {
    setSpots((prev) =>
      prev.map((s) => {
        if (s.id === spotId && s.seating) {
          const newAvail = Math.max(
            0,
            Math.min(s.seating.totalSeats, s.seating.availableSeats + delta)
          );
          updateSeating(spotId, newAvail);
          return {
            ...s,
            seating: {
              ...s.seating,
              availableSeats: newAvail,
            },
          };
        }
        return s;
      })
    );
  };

  // Spot added via Admin Panel
  const handleSpotCreated = (newSpot: StudySpotItem) => {
    setSpots((prev) => [newSpot, ...prev]);
  };

  // Spot deleted via Admin Panel
  const handleSpotDeleted = (spotId: number) => {
    setSpots((prev) => prev.filter((s) => s.id !== spotId));
    if (selectedSpot?.id === spotId) {
      setSelectedSpot(null);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#F2F2F7]">
      {/* 1. Header (Floating iOS Search Bar) */}
      {currentTab === "explore" && (
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenFilters={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
          lang={lang}
        />
      )}

      {/* 2. Free Leaflet / OpenStreetMap Vector Map */}
      <InteractiveMap
        spots={filteredSpots}
        selectedSpot={selectedSpot}
        onSelectSpot={(spot) => setSelectedSpot(spot)}
        userLocation={userLocation}
      />

      {/* 3. Bottom Sheet with Spot Cards */}
      {currentTab === "explore" && (
        <BottomSheet
          headerContent={
            <div className="space-y-2">
              <SegmentedControl
                value={selectedType}
                onChange={setSelectedType}
                options={[
                  {
                    value: "all",
                    label: t("catAll"),
                    icon: <LayoutGrid className="w-3.5 h-3.5" />,
                  },
                  {
                    value: "library",
                    label: t("catLibraries"),
                    icon: <BookOpen className="w-3.5 h-3.5" />,
                  },
                  {
                    value: "cafe",
                    label: t("catCafes"),
                    icon: <Coffee className="w-3.5 h-3.5" />,
                  },
                  {
                    value: "studyRoom",
                    label: t("catCoworkings"),
                    icon: <Presentation className="w-3.5 h-3.5" />,
                  },
                ]}
              />
              <div className="flex items-center justify-between text-xs text-[#8E8E93] px-1">
                <span>
                  {t("spotsFound")}{" "}
                  <strong className="text-[#1C1C1E]">
                    {filteredSpots.length}
                  </strong>
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[#007AFF] font-semibold"
                  >
                    {t("reset")} ({activeFilterCount})
                  </button>
                )}
              </div>
            </div>
          }
        >
          {filteredSpots.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8E8E93] space-y-1">
              <p className="font-semibold text-[#1C1C1E] text-sm">
                {t("nothingFound")}
              </p>
              <p>{t("nothingFoundHint")}</p>
            </div>
          ) : (
            filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onSelect={(s) => setSelectedSpot(s)}
                isSelected={selectedSpot?.id === spot.id}
                onToggleBookmark={handleToggleBookmark}
                lang={lang}
              />
            ))
          )}
        </BottomSheet>
      )}

      {/* 4. Tab Views: Saved, Profile, Admin */}
      {currentTab === "saved" && (
        <SavedSpotsView
          spots={spots}
          onSelectSpot={(s) => setSelectedSpot(s)}
          onBack={() => setCurrentTab("explore")}
          lang={lang}
        />
      )}

      {currentTab === "profile" && (
        <UserProfileView
          onBack={() => setCurrentTab("explore")}
          lang={lang}
          onLanguageChange={(newLang) => {
            setLangState(newLang);
            setLanguage(newLang);
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenAdmin={() => setCurrentTab("admin")}
        />
      )}

      {currentTab === "admin" && (
        <AdminManagementView
          spots={spots}
          onBack={() => setCurrentTab("explore")}
          onSpotCreated={handleSpotCreated}
          onSpotDeleted={handleSpotDeleted}
          lang={lang}
        />
      )}

      {/* 5. Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen || currentTab === "filters"}
        onClose={() => {
          setIsFilterModalOpen(false);
          if (currentTab === "filters") setCurrentTab("explore");
        }}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        lang={lang}
      />

      {/* 6. Spot Detail Sheet Modal */}
      {selectedSpot && (
        <SpotDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          onUpdateSeats={handleUpdateSeats}
          onToggleBookmark={handleToggleBookmark}
          lang={lang}
        />
      )}

      {/* 7. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
        lang={lang}
      />

      {/* 8. Apple Translucent Tab Bar */}
      <TabBar
        currentTab={currentTab}
        onChangeTab={handleTabChange}
        lang={lang}
        isAdmin={currentUser?.isAdmin}
      />
    </main>
  );
}
