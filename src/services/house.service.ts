import api from "./api";
import {
  House,
  CreateHouseDto,
  UpdateHouseDto,
  HouseApiResponse,
  SelectedImage,
} from "../types/house.types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

class HouseService {
  /**
   * Ev ilanı oluştur (çoklu resim ile)
   */
  async createHouse(
    data: CreateHouseDto,
    images: SelectedImage[],
    token: string,
  ): Promise<HouseApiResponse<House>> {
    const formData = new FormData();

    // DTO alanlarını ekle
    formData.append("title", data.title);
    formData.append("rent_amount", String(data.rent_amount));

    if (data.description) formData.append("description", data.description);
    if (data.address) formData.append("address", data.address);
    if (data.city) formData.append("city", data.city);
    if (data.currency) formData.append("currency", data.currency);
    if (data.deposit_amount)
      formData.append("deposit_amount", String(data.deposit_amount));
    if (data.max_occupancy)
      formData.append("max_occupancy", String(data.max_occupancy));
    if (data.gender_preference)
      formData.append("gender_preference", data.gender_preference);
    if (data.latitude) formData.append("latitude", String(data.latitude));
    if (data.longitude) formData.append("longitude", String(data.longitude));

    // Array alanları JSON olarak
    if (data.rules && data.rules.length > 0) {
      formData.append("rules", JSON.stringify(data.rules));
    }
    if (data.amenities && data.amenities.length > 0) {
      formData.append("amenities", JSON.stringify(data.amenities));
    }

    // Resimleri ekle
    images.forEach((image) => {
      formData.append("photos", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: image.name || `photo_${Date.now()}.jpg`,
      } as any);
    });

    const response = await api.post("/houses", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  /**
   * Ev ilanını güncelle
   */
  async updateHouse(
    houseId: string,
    data: UpdateHouseDto,
    token: string,
  ): Promise<HouseApiResponse<House>> {
    const response = await api.patch(`/houses/${houseId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * Ev ilanını sil (soft delete)
   */
  async deleteHouse(
    houseId: string,
    token: string,
  ): Promise<HouseApiResponse<null>> {
    const response = await api.delete(`/houses/${houseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * Kullanıcının kendi ilanlarını getir
   */
  async getMyHouses(token: string): Promise<HouseApiResponse<House[]>> {
    const response = await api.get("/houses/me/listings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * Tek ev ilanını getir (public)
   */
  async getHouseById(houseId: string): Promise<HouseApiResponse<House>> {
    const response = await api.get(`/houses/${houseId}`);
    return response.data;
  }

  /**
   * Tüm aktif evleri getir (arama için)
   * Not: Backend'de henüz bu endpoint yok, eklenebilir
   * Şimdilik getMyHouses kullanılmayacak evleri döndürür
   */
  async getAllHouses(token: string): Promise<HouseApiResponse<House[]>> {
    // TODO: Backend'e GET /houses endpoint'i eklenince güncellenecek
    const response = await api.get("/houses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * Ev resminin URL'sini oluştur
   */
  getHouseImageUrl(houseId: string, filename: string): string {
    // photos array'inde sadece filename tutuluyor: {houseId}/{timestamp}-{index}.webp
    // API endpoint: /houses/images/:houseId/:filename
    return `${API_BASE_URL}/houses/images/${houseId}/${filename}`;
  }

  /**
   * Photos array'inden ilk resmin URL'sini al
   */
  getFirstImageUrl(house: House): string | null {
    if (!house.photos || house.photos.length === 0) return null;

    // photos[0] formatı: "{houseId}/{filename}" veya sadece "{filename}"
    const photoPath = house.photos[0];

    // Eğer full path ise (houseId/filename)
    if (photoPath.includes("/")) {
      const parts = photoPath.split("/");
      const houseId = parts[0];
      const filename = parts[1];
      return this.getHouseImageUrl(houseId, filename);
    }

    // Sadece filename ise
    return this.getHouseImageUrl(house.id, photoPath);
  }

  /**
   * Tüm resimlerin URL'lerini al
   */
  getAllImageUrls(house: House): string[] {
    if (!house.photos || house.photos.length === 0) return [];

    return house.photos.map((photoPath) => {
      if (photoPath.includes("/")) {
        const parts = photoPath.split("/");
        const houseId = parts[0];
        const filename = parts[1];
        return this.getHouseImageUrl(houseId, filename);
      }
      return this.getHouseImageUrl(house.id, photoPath);
    });
  }
}

export default new HouseService();
