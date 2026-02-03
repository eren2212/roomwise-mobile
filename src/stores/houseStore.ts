import { create } from "zustand";
import {
  House,
  CreateHouseDto,
  UpdateHouseDto,
  SelectedImage,
} from "../types/house.types";
import houseService from "../services/house.service";

interface HouseState {
  // State
  myHouse: House | null;
  houses: House[];
  selectedHouse: House | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyHouse: (token: string) => Promise<void>;
  fetchHouses: (token: string) => Promise<void>;
  fetchHouseById: (houseId: string) => Promise<void>;
  createHouse: (
    data: CreateHouseDto,
    images: SelectedImage[],
    token: string,
  ) => Promise<House>;
  updateHouse: (
    houseId: string,
    data: UpdateHouseDto,
    token: string,
  ) => Promise<House>;
  deleteHouse: (houseId: string, token: string) => Promise<void>;
  setSelectedHouse: (house: House | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useHouseStore = create<HouseState>((set, get) => ({
  // Initial state
  myHouse: null,
  houses: [],
  selectedHouse: null,
  isLoading: false,
  error: null,

  // Kullanıcının evini getir
  fetchMyHouse: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await houseService.getMyHouses(token);
      // İlk aktif evi al (kullanıcının tek evi olmalı)
      const activeHouse = response.data.find((h) => h.is_active) || null;
      set({ myHouse: activeHouse, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Ev bilgisi alınamadı",
        isLoading: false,
      });
    }
  },

  // Tüm evleri getir (arama için)
  fetchHouses: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await houseService.getAllHouses(token);
      // Kendi evini filtrele
      const { myHouse } = get();
      const filteredHouses = myHouse
        ? response.data.filter((h) => h.id !== myHouse.id)
        : response.data;
      set({ houses: filteredHouses, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Evler alınamadı",
        isLoading: false,
      });
    }
  },

  // Tek evi getir
  fetchHouseById: async (houseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await houseService.getHouseById(houseId);
      set({ selectedHouse: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Ev detayı alınamadı",
        isLoading: false,
      });
    }
  },

  // Ev oluştur
  createHouse: async (
    data: CreateHouseDto,
    images: SelectedImage[],
    token: string,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await houseService.createHouse(data, images, token);
      set({ myHouse: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.message || "Ev oluşturulamadı",
        isLoading: false,
      });
      throw error;
    }
  },

  // Evi güncelle
  updateHouse: async (houseId: string, data: UpdateHouseDto, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await houseService.updateHouse(houseId, data, token);
      set({ myHouse: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.message || "Ev güncellenemedi",
        isLoading: false,
      });
      throw error;
    }
  },

  // Evi sil
  deleteHouse: async (houseId: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await houseService.deleteHouse(houseId, token);
      set({ myHouse: null, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Ev silinemedi",
        isLoading: false,
      });
      throw error;
    }
  },

  // Selected house set
  setSelectedHouse: (house: House | null) => {
    set({ selectedHouse: house });
  },

  // Hata temizle
  clearError: () => {
    set({ error: null });
  },

  // Reset store
  reset: () => {
    set({
      myHouse: null,
      houses: [],
      selectedHouse: null,
      isLoading: false,
      error: null,
    });
  },
}));
