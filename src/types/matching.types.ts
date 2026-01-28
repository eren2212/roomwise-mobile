// Matching Types

export enum SwipeAction {
  LIKE = "like",
  DISLIKE = "dislike",
  SUPERLIKE = "superlike",
}

// Potansiyel eşleşme adayı
export interface PotentialMatch {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  occupation: string | null;
  university: string | null;
  department: string | null;
  occupation_status: string | null;
  match_score: number; // Backend'den gelen uyumluluk skoru (0-100)
}

// Swipe DTO
export interface SwipeDto {
  swipedUserId: string;
  action: SwipeAction;
  houseId?: string;
}

// Swipe Response
export interface SwipeResponse {
  swipe: {
    id: string;
    swiper_id: string;
    swiped_id: string;
    action: SwipeAction;
    created_at: string;
  };
  isMatch: boolean;
  match: {
    id: string;
    user1_id: string;
    user2_id: string;
    created_at: string;
  } | null;
}

// Match
export interface Match {
  matchId: string;
  createdAt: string;
  houseId: string | null;
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    occupation: string | null;
    university: string | null;
  };
}

// Location API Types (Turkey Geolocation)
export interface City {
  _id: number;
  city: string;
}

export interface District {
  _id: number;
  name: string;
}

export interface DistrictDetail {
  town: string;
  lat: number;
  lon: number;
}

export interface ProfileLocation {
  latitude: number;
  longitude: number;
  districtText: string;
}
