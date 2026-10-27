"use client";

import React, { useEffect, useRef, useState } from "react";
import { StudySpotItem } from "@/types/spot";
import { Navigation, Layers, Plus, Minus } from "lucide-react";

interface InteractiveMapProps {
  spots: StudySpotItem[];
  selectedSpot: StudySpotItem | null;
  onSelectSpot: (spot: StudySpotItem) => void;
  userLocation?: { lat: number; lng: number } | null;
}

// Astana center coordinates [lat, lng]
const ASTANA_COORDS: [number, number] = [51.0908, 71.4183];

// 100% Free, No-Registration Tile Layers for Kazakhstan
const TILE_LAYERS = {
  osm: {
    id: "osm",
    name: "Схема",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
      attribution: "",
    },
  },
  esri: {
    id: "esri",
    name: "Улицы",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxZoom: 19,
      attribution: "",
    },
  },
  satellite: {
    id: "satellite",
    name: "Спутник",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxZoom: 19,
      attribution: "",
    },
  },
};

type LayerKey = keyof typeof TILE_LAYERS;

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
  userLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const [activeLayer, setActiveLayer] = useState<LayerKey>("osm");

  // Initialize Leaflet Map with OpenStreetMap as default
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      // Create map
      const map = L.map(mapContainerRef.current, {
        center: ASTANA_COORDS,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      const defaultLayerConfig = TILE_LAYERS.osm;
      const tileLayer = L.tileLayer(
        defaultLayerConfig.url,
        defaultLayerConfig.options
      ).addTo(map);

      tileLayerRef.current = tileLayer;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Force size recalculation to prevent gray unloaded tiles
      setTimeout(() => {
        if (map && isMounted) {
          map.invalidateSize();
        }
      }, 150);

      setTimeout(() => {
        if (map && isMounted) {
          map.invalidateSize();
        }
      }, 600);

      renderMarkers(L, map, markersGroup, spots, selectedSpot);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Cycle through free tile layers (OSM -> Esri Street -> Satellite)
  const handleToggleLayer = async () => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const L = await import("leaflet");

    const layersList: LayerKey[] = ["osm", "esri", "satellite"];
    const nextIndex = (layersList.indexOf(activeLayer) + 1) % layersList.length;
    const nextKey = layersList[nextIndex];
    setActiveLayer(nextKey);

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const config = TILE_LAYERS[nextKey];
    const newLayer = L.tileLayer(config.url, config.options).addTo(
      mapInstanceRef.current
    );

    tileLayerRef.current = newLayer;
  };

  // Render Apple-styled HTML markers
  const renderMarkers = async (
    L: any,
    map: any,
    group: any,
    spotsList: StudySpotItem[],
    selected: StudySpotItem | null
  ) => {
    if (!group) return;
    group.clearLayers();

    spotsList.forEach((spot) => {
      const isSelected = selected?.id === spot.id;

      const colors: Record<string, string> = {
        library: "#007AFF",
        cafe: "#FF9500",
        studyRoom: "#AF52DE",
      };

      const icons: Record<string, string> = {
        library: "📚",
        cafe: "☕",
        studyRoom: "💻",
      };

      const markerColor = colors[spot.spotType] || "#007AFF";
      const iconEmoji = icons[spot.spotType] || "📍";

      // Seat availability color dot
      const avail = spot.seating?.availableSeats || 0;
      const total = spot.seating?.totalSeats || 1;
      const ratio = avail / total;
      const seatDotColor = ratio > 0.4 ? "#34C759" : ratio > 0.15 ? "#FF9500" : "#FF3B30";

      const html = `
        <div style="position: relative; cursor: pointer;">
          ${
            isSelected
              ? `<div style="position: absolute; inset: -6px; border-radius: 24px; background: rgba(0, 122, 255, 0.3); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ""
          }
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 5px 10px 5px 6px;
            background: ${isSelected ? "#007AFF" : "rgba(255, 255, 255, 0.96)"};
            color: ${isSelected ? "#FFFFFF" : "#1C1C1E"};
            border-radius: 22px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            border: 1px solid ${isSelected ? "#007AFF" : "rgba(60,60,67,0.12)"};
            white-space: nowrap;
            transform: scale(${isSelected ? 1.08 : 1});
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          ">
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: ${isSelected ? "rgba(255,255,255,0.25)" : markerColor};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
            ">${iconEmoji}</div>
            <span style="font-size: 11px; font-weight: 600; max-width: 95px; overflow: hidden; text-overflow: ellipsis;">
              ${spot.name.split(" ").slice(0, 2).join(" ")}
            </span>
            <div style="
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: ${seatDotColor};
              margin-left: -2px;
            " title="${avail} мест"></div>
            <span style="font-size: 10px; font-weight: 700; color: ${
              isSelected ? "#FFE57F" : "#FF9500"
            };">
              ★${spot.overallRating.toFixed(1)}
            </span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: "custom-leaflet-marker",
        iconSize: [124, 38],
        iconAnchor: [62, 19],
      });

      const marker = L.marker([spot.latitude, spot.longitude], {
        icon: customIcon,
      });

      marker.on("click", () => {
        onSelectSpot(spot);
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(10);
        }
      });

      group.addLayer(marker);
    });
  };

  // Re-render markers when spots or selectedSpot changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    import("leaflet").then((L) => {
      renderMarkers(
        L,
        mapInstanceRef.current,
        markersLayerRef.current,
        spots,
        selectedSpot
      );
    });
  }, [spots, selectedSpot]);

  // Center camera smoothly when selectedSpot changes
  useEffect(() => {
    if (selectedSpot && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedSpot.latitude, selectedSpot.longitude],
        16,
        { duration: 0.8, easeLinearity: 0.25 }
      );
    }
  }, [selectedSpot]);

  // Render user location marker (pulsing blue radar)
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;
    import("leaflet").then((L) => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userHtml = `
        <div style="position: relative; width: 22px; height: 22px;">
          <div style="position: absolute; inset: -8px; border-radius: 50%; background: rgba(0, 122, 255, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #007AFF; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userHtml,
        className: "user-location-marker",
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      }).addTo(mapInstanceRef.current);
    });
  }, [userLocation]);

  // Controls
  const handleCenterOnUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, {
        duration: 0.6,
      });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(ASTANA_COORDS, 14, { duration: 0.6 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="absolute inset-0 z-0 isolate overflow-hidden select-none">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Apple Controls (Top Right on desktop / mid on mobile) */}
      <div className="absolute right-4 md:right-6 top-28 md:top-24 z-20 flex flex-col space-y-2">
        {/* User Location Button */}
        <button
          onClick={handleCenterOnUser}
          title="Где я"
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-xl flex items-center justify-center shadow-apple-elevated border border-[rgba(60,60,67,0.08)] active:scale-90 hover:bg-white transition-all"
        >
          <Navigation className="w-5 h-5 text-[#007AFF]" />
        </button>

        {/* Free Map Layer Switcher: OSM / Esri / Satellite */}
        <button
          onClick={handleToggleLayer}
          title="Сменить слой карты"
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-xl flex items-center justify-center shadow-apple-elevated border border-[rgba(60,60,67,0.08)] active:scale-90 hover:bg-white transition-all"
        >
          <Layers className="w-5 h-5 text-[#007AFF]" />
        </button>

        {/* Zoom In / Out */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-xl shadow-apple-elevated border border-[rgba(60,60,67,0.08)] flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center text-[#1C1C1E] border-b border-[rgba(60,60,67,0.08)] active:bg-[#F2F2F7] hover:bg-[#F9F9FB] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center text-[#1C1C1E] active:bg-[#F2F2F7] hover:bg-[#F9F9FB] transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Layer Badge (placed safely in bottom right above tab bar) */}
      <div className="absolute right-4 bottom-24 md:bottom-6 z-20 pointer-events-none">
        <div className="px-3 py-1 bg-white/90 backdrop-blur-xl rounded-full text-[10px] font-semibold text-[#1C1C1E] shadow-apple border border-[rgba(60,60,67,0.08)] flex items-center space-x-1.5 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#34C759]" />
          <span>{TILE_LAYERS[activeLayer].name} • Астана</span>
        </div>
      </div>
    </div>
  );
};
