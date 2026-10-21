"use client";

import React, { useState, useMemo } from "react";
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
import { MOCK_SPOTS } from "@/lib/mockData";
import { StudySpotItem, SpotType } from "@/types/spot";
import { BookOpen, Coffee, Presentation, LayoutGrid } from "lucide-react";

export default function Home() {
  const [spots, setSpots] = useState<StudySpotItem[]>(MOCK_SPOTS);
  const [currentTab, setCurrentTab] = useState<TabType>("explore");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<StudySpotItem | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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
        const matchesAffiliation = spot.library?.campusAffiliation?.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesAffiliation) return false;
      }

      // 2. Type Filter
      if (selectedType !== "all" && spot.spotType !== selectedType) {
        return false;
      }

      // 3. Noise Filter
      if (filters.noiseCategory !== "ALL") {
        if (spot.noiseLevel?.noiseCategory !== filters.noiseCategory) return false;
      }

      // 4. Wi-Fi Speed Filter
      if (filters.minWifiSpeed > 0) {
        if ((spot.wifiInfo?.speedMbps || 0) < filters.minWifiSpeed) return false;
      }

      // 5. Outlets Filter
      if (filters.outletsRequired) {
        const outletCount = spot.outlets?.reduce((acc, o) => acc + o.count, 0) || 0;
        if (outletCount < 10) return false;
      }

      // 6. Free Only
      if (filters.freeOnly) {
        if (spot.spotType === "cafe" && spot.cafe?.minOrderRequired) return false;
        if (spot.spotType === "studyRoom" && spot.studyRoom && spot.studyRoom.hourlyRate > 0) return false;
      }

      return true;
    });
  }, [spots, searchQuery, selectedType, filters]);

  // Crowdsourcing Update Handler
  const handleUpdateSeats = (spotId: number, delta: number) => {
    setSpots((prev) =>
      prev.map((s) => {
        if (s.id === spotId && s.seating) {
          const newAvail = Math.max(0, Math.min(s.seating.totalSeats, s.seating.availableSeats + delta));
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

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* 1. Header (Floating iOS Search Bar) */}
      {currentTab === "explore" && (
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenFilters={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      )}

      {/* 2. Interactive Map (Background Canvas) */}
      <InteractiveMap
        spots={filteredSpots}
        selectedSpot={selectedSpot}
        onSelectSpot={(spot) => setSelectedSpot(spot)}
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
                  { value: "all", label: "Все", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                  { value: "library", label: "Библиотеки", icon: <BookOpen className="w-3.5 h-3.5" /> },
                  { value: "cafe", label: "Кафе", icon: <Coffee className="w-3.5 h-3.5" /> },
                  { value: "studyRoom", label: "Коворкинги", icon: <Presentation className="w-3.5 h-3.5" /> },
                ]}
              />
              <div className="flex items-center justify-between text-xs text-apple-gray1 px-1">
                <span>Найдено спотов: <strong className="text-black dark:text-white">{filteredSpots.length}</strong></span>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-apple-blue font-semibold">
                    Сбросить фильтры ({activeFilterCount})
                  </button>
                )}
              </div>
            </div>
          }
        >
          {filteredSpots.length === 0 ? (
            <div className="p-8 text-center text-xs text-apple-gray1 space-y-1">
              <p className="font-semibold text-black dark:text-white text-sm">Ничего не найдено</p>
              <p>Попробуйте ослабить фильтры по шуму или скорости Wi-Fi</p>
            </div>
          ) : (
            filteredSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onSelect={(s) => setSelectedSpot(s)}
                isSelected={selectedSpot?.id === spot.id}
              />
            ))
          )}
        </BottomSheet>
      )}

      {/* 4. Tab Views (Saved & Profile) */}
      {currentTab === "saved" && (
        <SavedSpotsView
          spots={spots}
          onSelectSpot={(s) => setSelectedSpot(s)}
        />
      )}

      {currentTab === "profile" && (
        <UserProfileView />
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
      />

      {/* 6. Spot Detail Sheet Modal */}
      {selectedSpot && (
        <SpotDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          onUpdateSeats={handleUpdateSeats}
        />
      )}

      {/* 7. Apple Translucent Tab Bar */}
      <TabBar
        currentTab={currentTab}
        onChangeTab={(tab) => {
          if (tab === "filters") {
            setIsFilterModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
      />
    </main>
  );
}
