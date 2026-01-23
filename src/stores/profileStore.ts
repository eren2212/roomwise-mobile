import { create } from 'zustand';
import {
  Profile,
  CreateProfileDto,
  UpdatePreferencesDto,
  UserPreferences,
  QuestionCatalog,
  Gender,
  OccupationStatus,
} from '../types/profile.types';
import profileService from '../services/profile.service';

interface ProfileState {
  // Data
  profile: Profile | null;
  preferences: UserPreferences | null;
  questions: QuestionCatalog[];
  
  // Form Data (Step by step topluyoruz)
  formData: {
    full_name: string;
    avatar_url: string;
    birth_date: string;
    gender: Gender | null;
    occupation_status: OccupationStatus | null;
    university: string;
    department: string;
    occupation: string;
  };
  
  // Preferences Form Data
  preferencesData: Partial<UpdatePreferencesDto>;
  
  // Loading & Error
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFormData: (key: string, value: any) => void;
  setPreferencesData: (key: string, value: any) => void;
  resetFormData: () => void;
  
  // API Actions
  uploadAvatar: (file: File | Blob, token: string) => Promise<string>;
  createProfile: (token: string) => Promise<void>;
  fetchProfile: (token: string) => Promise<void>;
  checkCompletion: (token: string) => Promise<any>;
  fetchQuestions: (token: string) => Promise<void>;
  savePreferences: (token: string) => Promise<void>;
  completeOnboarding: (token: string) => Promise<void>;
  
  setProfile: (profile: Profile | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const initialFormData = {
  full_name: '',
  avatar_url: '',
  birth_date: '',
  gender: null,
  occupation_status: null,
  university: '',
  department: '',
  occupation: '',
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  // Initial state
  profile: null,
  preferences: null,
  questions: [],
  formData: initialFormData,
  preferencesData: {},
  isLoading: false,
  error: null,

  // Set form data
  setFormData: (key, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    }));
  },

  // Set preferences data
  setPreferencesData: (key, value) => {
    set((state) => ({
      preferencesData: {
        ...state.preferencesData,
        [key]: value,
      },
    }));
  },

  // Reset form data
  resetFormData: () => {
    set({ formData: initialFormData });
  },

  // Upload avatar
  uploadAvatar: async (file, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileService.uploadAvatar(file, token);
      const avatarUrl = response.data.avatar_url;
      
      // Form data'ya kaydet
      set((state) => ({
        formData: {
          ...state.formData,
          avatar_url: avatarUrl,
        },
        isLoading: false,
      }));
      
      return avatarUrl;
    } catch (error: any) {
      const errorMessage = error.message || 'Avatar yüklenirken hata oluştu';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Create profile
  createProfile: async (token) => {
    const { formData } = get();
    set({ isLoading: true, error: null });
    
    try {
      // DTO hazırla
      const dto: CreateProfileDto = {
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        gender: formData.gender!,
        occupation_status: formData.occupation_status!,
      };

      // Opsiyonel alanlar
      if (formData.avatar_url) dto.avatar_url = formData.avatar_url;

      // Occupation durumuna göre
      if (formData.occupation_status === OccupationStatus.STUDENT) {
        dto.university = formData.university;
        dto.department = formData.department;
      } else {
        dto.occupation = formData.occupation;
      }

      const response = await profileService.createProfile(dto, token);
      
      set({
        profile: response.data,
        isLoading: false,
        error: null,
      });

      // Form data'yı temizle
      get().resetFormData();
    } catch (error: any) {
      const errorMessage = error.message || 'Profil oluşturulurken hata oluştu';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Fetch profile
  fetchProfile: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileService.getMyProfile(token);
      set({
        profile: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Check completion
  checkCompletion: async (token) => {
    try {
      const response = await profileService.checkProfileCompletion(token);
      return response.data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  // Fetch questions
  fetchQuestions: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileService.getQuestions(token);
      set({
        questions: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Save preferences
  savePreferences: async (token) => {
    const { preferencesData } = get();
    set({ isLoading: true, error: null });
    
    try {
      const response = await profileService.updatePreferences(preferencesData, token);
      set({
        preferences: response.data,
        isLoading: false,
        preferencesData: {}, // Reset
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Tercihler kaydedilirken hata oluştu';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Complete onboarding
  completeOnboarding: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileService.completeOnboarding(token);
      set({
        profile: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Set profile
  setProfile: (profile) => {
    set({ profile });
  },

  // Set error
  setError: (error) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
