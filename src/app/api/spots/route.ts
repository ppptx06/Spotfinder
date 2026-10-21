import { NextRequest, NextResponse } from "next/server";
import { MOCK_SPOTS } from "@/lib/mockData";
import { StudySpotItem } from "@/types/spot";

// In-memory data store for the runtime API
let spotsData: StudySpotItem[] = [...MOCK_SPOTS];

// Haversine formula for calculating distance between 2 coordinates in km
function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const noise = searchParams.get("noise");
  const minWifi = searchParams.get("minWifi");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  let result = [...spotsData];

  // 1. Filter by spot subtype
  if (type && type !== "all") {
    result = result.filter((s) => s.spotType === type);
  }

  // 2. Filter by noise category
  if (noise && noise !== "ALL") {
    result = result.filter((s) => s.noiseLevel?.noiseCategory === noise);
  }

  // 3. Filter by Wi-Fi speed
  if (minWifi) {
    const minSpeed = parseFloat(minWifi);
    if (!isNaN(minSpeed)) {
      result = result.filter((s) => (s.wifiInfo?.speedMbps || 0) >= minSpeed);
    }
  }

  // 4. Calculate distance if user lat/lng provided
  if (lat && lng) {
    const uLat = parseFloat(lat);
    const uLng = parseFloat(lng);
    if (!isNaN(uLat) && !isNaN(uLng)) {
      result = result.map((s) => ({
        ...s,
        distanceKm: calculateDistanceKm(uLat, uLng, s.latitude, s.longitude),
      }));
      // Sort by distance ascending
      result.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }
  }

  return NextResponse.json({
    success: true,
    count: result.length,
    spots: result,
  });
}

// Crowdsource update (e.g. updating available seats or reporting noise)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { spotId, availableSeats, noiseCategory } = body;

    const spotIndex = spotsData.findIndex((s) => s.id === spotId);
    if (spotIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Spot not found" },
        { status: 404 }
      );
    }

    if (availableSeats !== undefined && spotsData[spotIndex].seating) {
      spotsData[spotIndex].seating!.availableSeats = availableSeats;
    }

    if (noiseCategory && spotsData[spotIndex].noiseLevel) {
      spotsData[spotIndex].noiseLevel!.noiseCategory = noiseCategory;
    }

    return NextResponse.json({
      success: true,
      message: "Spot metrics updated successfully",
      spot: spotsData[spotIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }
}
