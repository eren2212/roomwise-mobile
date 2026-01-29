import { create } from "zustand";
import {
  PotentialMatch,
  SwipeAction,
  SwipeResponse,
  City,
  District,
  DistrictDetail,
} from "../types/matching.types";
import matchingService from "../services/matching.service";
import profileService from "../services/profile.service";
import locationService from "../services/location.service";

interface MatchingState {
  // Data
  cards: PotentialMatch[];
  cities: City[];
  districts: District[];

  // Current Location
  selectedCity: City | null;
  selectedDistrict: District | null;
  currentLocation: {
    lat: number;
    lng: number;
    districtText: string;
  } | null;

  // UI State
  isLoading: boolean;
  isLoadingCities: boolean;
  isLoadingDistricts: boolean;
  isSwiping: boolean;
  showLocationModal: boolean;
  error: string | null;

  // Match Result
  lastMatch: SwipeResponse | null;

  // Actions
  setShowLocationModal: (show: boolean) => void;
  setSelectedCity: (city: City | null) => void;
  setSelectedDistrict: (district: District | null) => void;
  clearError: () => void;
  removeTopCard: () => void;

  // API Actions
  loadInitialCards: (token: string) => Promise<void>;
  fetchCardsWithLocation: (
    lat: number,
    lng: number,
    token: string,
  ) => Promise<void>;
  searchWithNewLocation: (token: string) => Promise<void>;
  swipe: (
    userId: string,
    action: SwipeAction,
    token: string,
  ) => Promise<SwipeResponse>;
  fetchCities: () => Promise<void>;
  fetchDistricts: (cityId: number) => Promise<void>;
}

export const useMatchingStore = create<MatchingState>((set, get) => ({
  // Initial state
  cards: [],
  cities: [],
  districts: [],
  selectedCity: null,
  selectedDistrict: null,
  currentLocation: null,
  isLoading: false,
  isLoadingCities: false,
  isLoadingDistricts: false,
  isSwiping: false,
  showLocationModal: false,
  error: null,
  lastMatch: null,

  // Simple setters
  setShowLocationModal: (show) => set({ showLocationModal: show }),
  setSelectedCity: (city) =>
    set({ selectedCity: city, selectedDistrict: null, districts: [] }),
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  clearError: () => set({ error: null }),
  removeTopCard: () => set((state) => ({ cards: state.cards.slice(1) })),

  // Load initial cards using user's saved location
  loadInitialCards: async (token) => {
    set({ isLoading: true, error: null });
    try {
      // First, get user's saved location
      const locationResponse = await profileService.getLocation(token);
      if (locationResponse) {
        const { latitude, longitude, districtText } = locationResponse;

        set({
          currentLocation: {
            lat: latitude,
            lng: longitude,
            districtText: districtText || "",
          },
        });

        // Fetch cards with that location
        const cards = await matchingService.getPotentialMatches(
          latitude,
          longitude,
          50,
          token,
        );
        set({ cards, isLoading: false });
      } else {
        // No location saved, show location selector
        set({ isLoading: false, showLocationModal: true });
      }
    } catch (error: any) {
      // No location found, show location selector
      set({ isLoading: false, showLocationModal: true });
    }
  },

  // Fetch cards with specific coordinates
  fetchCardsWithLocation: async (lat, lng, token) => {
    set({ isLoading: true, error: null });
    try {
      const cards = await matchingService.getPotentialMatches(
        lat,
        lng,
        50,
        token,
      );
      set({ cards, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Kartlar yüklenemedi", isLoading: false });
    }
  },

  // Search with newly selected location (update + fetch)
  searchWithNewLocation: async (token) => {
    const { selectedCity, selectedDistrict } = get();

    if (!selectedCity || !selectedDistrict) {
      set({ error: "Lütfen şehir ve ilçe seçin" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Get district coordinates
      const districtDetail = await locationService.getDistrictDetail(
        selectedDistrict._id,
      );
      const districtText = selectedDistrict.name;

      // Update user's location in database
      await profileService.updateLocation(
        districtText,
        districtDetail.lat,
        districtDetail.lon,
        token,
      );

      // Update local state
      set({
        currentLocation: {
          lat: districtDetail.lat,
          lng: districtDetail.lon,
          districtText,
        },
        showLocationModal: false,
      });

      // Fetch cards with new location
      const cards = await matchingService.getPotentialMatches(
        districtDetail.lat,
        districtDetail.lon,
        50,
        token,
      );
      set({ cards, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Konum güncellenemedi", isLoading: false });
    }
  },

  // Swipe action
  swipe: async (userId, action, token) => {
    set({ isSwiping: true, error: null });
    try {
      const response = await matchingService.swipe(
        { swipedUserId: userId, action },
        token,
      );

      set({ lastMatch: response, isSwiping: false });

      // Remove the swiped card from the stack
      get().removeTopCard();

      return response;
    } catch (error: any) {
      // If already swiped, just remove the card without showing error
      if (error.response?.data?.message?.includes("zaten swipe")) {
        get().removeTopCard();
      } else {
        set({
          error: error.message || "Swipe işlemi başarısız",
          isSwiping: false,
        });
      }
      throw error;
    }
  },

  // Fetch cities
  fetchCities: async () => {
    set({ isLoadingCities: true });
    try {
      const cities = await locationService.getCities();
      set({ cities, isLoadingCities: false });
    } catch (error: any) {
      set({
        error: error.message || "Şehirler yüklenemedi",
        isLoadingCities: false,
      });
    }
  },

  // Fetch districts for a city
  fetchDistricts: async (cityId) => {
    set({ isLoadingDistricts: true, districts: [] });
    try {
      const districts = await locationService.getDistricts(cityId);
      set({ districts, isLoadingDistricts: false });
    } catch (error: any) {
      set({
        error: error.message || "İlçeler yüklenemedi",
        isLoadingDistricts: false,
      });
    }
  },
}));
