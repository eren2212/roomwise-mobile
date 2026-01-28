import api from "./api";
import {
  Profile,
  CreateProfileDto,
  UpdateProfileDto,
  UpdatePreferencesDto,
  UserPreferences,
  QuestionCatalog,
  ProfileCompletionStatus,
  ApiResponse,
} from "../types/profile.types";

class ProfileService {
  // Profil oluştur (Tek seferde tüm bilgiler)
  async createProfile(
    data: CreateProfileDto,
    token: string,
  ): Promise<ApiResponse<Profile>> {
    const response = await api.post("/profiles", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Avatar yükle
  async uploadAvatar(
    file: File | Blob,
    token: string,
  ): Promise<ApiResponse<{ avatar_url: string }>> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/profiles/me/avatar", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
  // Avatarı getir
  async getAvatar(token: string): Promise<Buffer> {
    const profile = await this.getMyProfile(token);
    const filename = profile.data?.avatar_url;
    if (!filename) {
      throw new Error("Avatar bulunamadı");
    }
    const response = await api.get(`/profiles/me/avatar/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.buffer;
  }

  // Profili getir
  async getMyProfile(token: string): Promise<ApiResponse<Profile>> {
    const response = await api.get("/profiles/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Profili güncelle
  async updateProfile(
    data: UpdateProfileDto,
    token: string,
  ): Promise<ApiResponse<Profile>> {
    const response = await api.patch("/profiles/me", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Profil tamamlanma durumunu kontrol et
  async checkProfileCompletion(
    token: string,
  ): Promise<ApiResponse<ProfileCompletionStatus>> {
    const response = await api.get("/profiles/me/check-completion", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Soruları getir
  async getQuestions(token: string): Promise<ApiResponse<QuestionCatalog[]>> {
    const response = await api.get("/profiles/questions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Tercihleri getir
  async getPreferences(
    token: string,
  ): Promise<ApiResponse<UserPreferences | null>> {
    const response = await api.get("/profiles/preferences", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Tercihleri kaydet/güncelle
  async updatePreferences(
    data: UpdatePreferencesDto,
    token: string,
  ): Promise<ApiResponse<UserPreferences>> {
    const response = await api.put("/profiles/preferences", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Onboarding'i tamamla
  async completeOnboarding(token: string): Promise<ApiResponse<Profile>> {
    const response = await api.post(
      "/profiles/me/complete-onboarding",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  // Location güncelle (konum + tercih edilen ilçe)
  async updateLocation(
    districtText: string,
    lat: number,
    lon: number,
    token: string,
  ): Promise<ApiResponse<Profile>> {
    const response = await api.patch(
      "/profiles/location",
      {
        preferred_district_text: districtText,
        latitude: lat,
        longitude: lon,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  // Location getir
  async getLocation(token: string): Promise<ApiResponse<Location>> {
    const response = await api.get("/profiles/location", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Location Başarılı");
    return response.data;
  }
}

export default new ProfileService();
