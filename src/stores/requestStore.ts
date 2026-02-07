import { create } from "zustand";
import { HouseRequestWithProfile } from "../types/request.types";
import requestService from "../services/request.service";

interface RequestState {
  // State
  houseRequests: HouseRequestWithProfile[];
  selectedRequest: HouseRequestWithProfile | null;
  pendingCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRequestsForHouse: (houseId: string, token: string) => Promise<void>;
  fetchPendingCount: (token: string) => Promise<void>;
  fetchRequestById: (requestId: string, token: string) => Promise<void>;
  sendRequest: (
    houseId: string,
    message: string,
    token: string,
  ) => Promise<void>;
  updateRequestStatus: (
    requestId: string,
    status: "verified" | "rejected",
    token: string,
  ) => Promise<void>;
  setSelectedRequest: (request: HouseRequestWithProfile | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useRequestStore = create<RequestState>((set, get) => ({
  // Initial state
  houseRequests: [],
  selectedRequest: null,
  pendingCount: 0,
  isLoading: false,
  error: null,

  // Eve gelen istekleri getir
  fetchRequestsForHouse: async (houseId: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestService.getRequestsForHouse(houseId, token);
      set({ houseRequests: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "İstekler getirilemedi",
        isLoading: false,
      });
    }
  },

  // Bekleyen istek sayısını getir
  fetchPendingCount: async (token: string) => {
    try {
      const response = await requestService.getPendingRequestCount(token);
      set({ pendingCount: response.data.count });
    } catch (error: any) {
      // Hata olsa bile sayıyı 0 yap
      set({ pendingCount: 0 });
    }
  },

  // İstek detayını getir
  fetchRequestById: async (requestId: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestService.getRequestById(requestId, token);
      set({ selectedRequest: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "İstek detayı getirilemedi",
        isLoading: false,
      });
    }
  },

  // İstek gönder
  sendRequest: async (houseId: string, message: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      await requestService.createRequest({ house_id: houseId, message }, token);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "İstek gönderilemedi",
        isLoading: false,
      });
      throw error;
    }
  },

  // İstek durumunu güncelle
  updateRequestStatus: async (
    requestId: string,
    status: "verified" | "rejected",
    token: string,
  ) => {
    set({ isLoading: true, error: null });
    try {
      await requestService.updateRequestStatus(requestId, status, token);

      // Listeyi ve pending count'u güncelle
      const { houseRequests, pendingCount } = get();
      const updatedRequests = houseRequests.map((req) =>
        req.id === requestId ? { ...req, status } : req,
      );

      set({
        houseRequests: updatedRequests,
        pendingCount: Math.max(0, pendingCount - 1),
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "İstek güncellenemedi",
        isLoading: false,
      });
      throw error;
    }
  },

  // Seçili istek set et
  setSelectedRequest: (request: HouseRequestWithProfile | null) => {
    set({ selectedRequest: request });
  },

  // Hata temizle
  clearError: () => {
    set({ error: null });
  },

  // Reset store
  reset: () => {
    set({
      houseRequests: [],
      selectedRequest: null,
      pendingCount: 0,
      isLoading: false,
      error: null,
    });
  },
}));
