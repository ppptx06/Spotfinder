export type UserType = "STUDENT" | "REMOTE_WORKER" | "HIGH_SCHOOL_STUDENT" | "ADMIN";

export type OutletAvailability = "NONE" | "FEW" | "ABUNDANT";
export type NoiseCategory = "SILENT" | "QUIET" | "LIVELY";

export interface LibraryData {
  silentStudyArea: boolean;
  bookReservation: boolean;
  publicAccess: boolean;
  floorCount: number;
  campusAffiliation?: string | null;
}

export interface CafeData {
  outletAvailability: OutletAvailability;
  avgCoffeePrice?: number | null;
  minOrderRequired: boolean;
  hasFoodMenu: boolean;
}

export interface StudyRoomData {
  maxCapacity: number;
  reservationPolicy?: string | null;
  hasWhiteboard: boolean;
  hasProjector: boolean;
  hourlyRate: number;
}

export interface WifiInfoData {
  speedMbps?: number | null;
  securityType?: string | null;
  qualityRating?: number | null;
  isFree: boolean;
}

export interface OutletData {
  id: number;
  type: string;
  count: number;
  accessible: boolean;
  isWorking: boolean;
}

export interface SeatingData {
  availableSeats: number;
  totalSeats: number;
  comfortLevel?: string | null;
}

export interface NoiseLevelData {
  decibelLevel?: number | null;
  noiseCategory: NoiseCategory;
}

export interface ReviewData {
  id: number;
  authorName: string;
  comment?: string | null;
  rating: number;
  timestamp: string;
}

export type SpotType = "library" | "cafe" | "studyRoom";

export interface StudySpotItem {
  id: number;
  name: string;
  address: string;
  operatingHours?: string | null;
  latitude: number;
  longitude: number;
  overallRating: number;
  imageUrl?: string | null;
  spotType: SpotType;
  distanceKm?: number;
  library?: LibraryData;
  cafe?: CafeData;
  studyRoom?: StudyRoomData;
  wifiInfo?: WifiInfoData;
  outlets?: OutletData[];
  seating?: SeatingData;
  noiseLevel?: NoiseLevelData;
  reviews?: ReviewData[];
}
