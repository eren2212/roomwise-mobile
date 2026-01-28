import { create } from "zustand";
import matchingService from "../services/matching.service";
import locationService from "../services/location.service";
import profileService from "../services/profile.service";
import {
  PotentialMatch,
  SwipeAction,
  SwipeDto,
  Match,
  City,
  District,
  DistrictDetail,
  ProfileLocation,
} from "../types/matching.types";

interface MatchingState {
  // Data
  potentialMatches: PotentialMatch[];
  myMatches: Match[];
  currentIndex: number;

  // Location data
  cities: City[];
  districts: District[];
  selectedCity: City | null;
  selectedDistrict: District | null;
  selectedLocation: DistrictDetail | null;

  // Loading & Error
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Actions - Location
  fetchCities: () => Promise<void>;
  fetchDistricts: (id: number) => Promise<void>;
  selectCity: (city: City) => void;
  selectDistrict: (district: District, token?: string) => Promise<void>;

  // Actions - Matching
  fetchPotentialMatches: (token: string) => Promise<void>;
  fetchDefaultLocation: (token: string) => Promise<void>;
  swipeCard: (
    action: SwipeAction,
    userId: string,
    token: string,
  ) => Promise<boolean>;
  fetchMyMatches: (token: string) => Promise<void>;

  // Helpers
  nextCard: () => void;
  removeCurrentCard: () => void;
  resetMatches: () => void;
  clearError: () => void;
}

export const useMatchingStore = create<MatchingState>((set, get) => ({
  // Initial State
  potentialMatches: [],
  myMatches: [],
  currentIndex: 0,
  cities: [],
  districts: [],
  selectedCity: null,
  selectedDistrict: null,
  selectedLocation: null,
  isLoading: false,
  isFetching: false,
  error: null,

  // Fetch cities
  fetchCities: async () => {
    set({ isLoading: true, error: null });
    try {
      const cities = await locationService.getCities();
      set({ cities, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch districts
  fetchDistricts: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const districts = await locationService.getDistricts(id);
      set({ districts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Select city
  selectCity: (city: City) => {
    set({ selectedCity: city, selectedDistrict: null, districts: [] });
  },

  // Select district and fetch coordinates + save to profile
  selectDistrict: async (district: District, token?: string) => {
    set({ isLoading: true, error: null, selectedDistrict: district });
    try {
      const districtDetail = await locationService.getDistrictDetail(
        district._id,
      );

      // Profilde location'ı güncelle (opsiyonel - token varsa)
      if (token) {
        try {
          await profileService.updateLocation(
            districtDetail.town,
            districtDetail.lat,
            districtDetail.lon,
            token,
          );
        } catch (updateError) {
          console.warn("Location profilde güncellenemedi:", updateError);
          // Devam et, critical değil
        }
      }

      set({
        selectedLocation: districtDetail,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch potential matches
  fetchPotentialMatches: async (token: string) => {
    const { selectedLocation } = get();

    if (!selectedLocation) {
      set({ error: "Lütfen önce konum seçin" });
      return;
    }

    set({ isFetching: true, error: null });
    try {
      const matches = await matchingService.getPotentialMatches(
        selectedLocation.lat,
        selectedLocation.lon,
        50, // 50km radius
        token,
      );

      set({
        potentialMatches: matches,
        currentIndex: 0,
        isFetching: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Eşleşmeler yüklenemedi",
        isFetching: false,
      });
    }
  },

  // --- YENİ VE DÜZELTİLMİŞ fetchDefaultLocation ---
  fetchDefaultLocation: async (token: string) => {
    // 1. Yükleniyor durumuna al
    set({ isFetching: true, error: null });

    try {
      // Servisten gelen veri direkt objenin kendisi: { latitude, longitude, districtText }
      // 'as ProfileLocation' veya 'any' diyerek TS'i rahatlatabilirsin servis tipin tam değilse.
      const location = (await profileService.getLocation(token)) as any;

      // Veri kontrolü (location.data YOK, direkt location var)
      if (!location || !location.latitude || !location.longitude) {
        set({
          error:
            "Profilinizde kayıtlı konum bulunamadı. Lütfen manuel seçim yapın.",
          isFetching: false,
        });
        return;
      }

      console.log("Default konum bulundu:", location.districtText);

      // 2. Bu koordinatlarla eşleşmeleri getir
      const matches = await matchingService.getPotentialMatches(
        location.latitude, // <-- .data yok, direkt erişiyoruz
        location.longitude, // <-- .data yok, direkt erişiyoruz
        50, // 50km radius
        token,
      );

      // 3. State'i güncelle
      set({
        potentialMatches: matches,
        currentIndex: 0,
        isFetching: false,
        // İstersen UI'da "Şu anki konum: Bozüyük" yazsın diye selectedLocation'ı da fake bir objeyle doldurabilirsin:
        selectedLocation: {
          lat: location.latitude,
          lon: location.longitude,
          town: location.districtText,
          // id ve city eksik olduğu için burası type hatası verebilir,
          // şimdilik sadece match getirmek yeterli.
        } as any,
      });
    } catch (error: any) {
      console.error("Default location error:", error);
      set({
        error: error.message || "Konum veya eşleşmeler alınamadı",
        isFetching: false,
      });
    }
  },

  // Swipe card
  swipeCard: async (action: SwipeAction, userId: string, token: string) => {
    try {
      const swipeDto: SwipeDto = {
        swipedUserId: userId,
        action,
      };

      const response = await matchingService.swipe(swipeDto, token);

      // Swipe başarılı! Şimdi bu kartı array'den SİL
      get().removeCurrentCard();

      // Eşleşme olduysa true döndür
      return response.isMatch;
    } catch (error: any) {
      // Duplicate swipe hatası gelirse de kartı sil (zaten swipe yapmışız demek)
      if (
        error.message?.includes("zaten swipe yaptın") ||
        error.status === 400
      ) {
        get().removeCurrentCard();
      }
      set({ error: error.message });
      return false;
    }
  },

  // Fetch my matches
  fetchMyMatches: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const matches = await matchingService.getMyMatches(token);
      set({ myMatches: matches, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Next card (index artır)
  nextCard: () => {
    const { currentIndex, potentialMatches } = get();
    if (currentIndex < potentialMatches.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  // Remove current card (swipe yapıldıktan sonra kartı sil)
  removeCurrentCard: () => {
    const { potentialMatches, currentIndex } = get();

    // Mevcut kartı array'den çıkar
    const newMatches = potentialMatches.filter(
      (_, index) => index !== currentIndex,
    );

    // Index'i düzelt (eğer son kartı sildiyse index'i azalt)
    const newIndex =
      currentIndex >= newMatches.length
        ? Math.max(0, newMatches.length - 1)
        : currentIndex;

    set({
      potentialMatches: newMatches,
      currentIndex: newIndex,
    });
  },

  // Reset matches
  resetMatches: () => {
    set({
      potentialMatches: [],
      currentIndex: 0,
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
