// Ev İlanı Tipleri

// Cinsiyet tercihi enum
export enum GenderPreference {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non_binary",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

// Ev entity'si (backend'den gelen)
export interface House {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  address: string | null;
  city: string;
  rent_amount: number;
  currency: string;
  deposit_amount: number | null;
  photos: string[] | null;
  rules: string[] | null;
  max_occupancy: number;
  amenities: string[] | null;
  score: number;
  gender_preference: GenderPreference;
  location: unknown | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Ev üyesi tipi
export interface HouseMember {
  id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

// Kullanıcının aktif ev üyeliği
export interface MyMembership {
  house: House;
  members: HouseMember[];
  currentUserId: string;
}

// Ev oluşturma DTO
export interface CreateHouseDto {
  title: string;
  description?: string;
  address?: string;
  city?: string;
  rent_amount: number;
  currency?: string;
  deposit_amount?: number;
  rules?: string[];
  max_occupancy?: number;
  amenities?: string[];
  gender_preference?: GenderPreference;
  latitude?: number;
  longitude?: number;
}

// Ev güncelleme DTO (tüm alanlar opsiyonel)
export interface UpdateHouseDto extends Partial<CreateHouseDto> {}

// API response tipi
export interface HouseApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Resim seçici için tip
export interface SelectedImage {
  uri: string;
  type: string;
  name: string;
}

// Ev kuralları seçenekleri
export const HOUSE_RULES = [
  { id: "no_smoking", label: "Sigara İçilmez", icon: "ban" },
  { id: "no_pets", label: "Evcil Hayvan Yasak", icon: "paw" },
  { id: "quiet_hours", label: "Sessiz Saatler", icon: "moon" },
  { id: "no_guests", label: "Misafir Yasak", icon: "people" },
  { id: "tidy", label: "Düzenli", icon: "sparkles" },
  { id: "no_parties", label: "Parti Yasak", icon: "musical-notes" },
];

// Olanaklar seçenekleri
export const AMENITIES = [
  { id: "wifi", label: "WiFi", icon: "wifi" },
  { id: "ac", label: "Klima", icon: "snow" },
  { id: "washer", label: "Çamaşır Makinesi", icon: "water" },
  { id: "fridge", label: "Buzdolabı", icon: "cube" },
  { id: "balcony", label: "Balkon", icon: "sunny" },
  { id: "parking", label: "Otopark", icon: "car" },
  { id: "furnished", label: "Eşyalı", icon: "bed" },
  { id: "heating", label: "Isıtma", icon: "flame" },
];

// Cinsiyet tercihi seçenekleri
export const GENDER_OPTIONS = [
  { value: GenderPreference.PREFER_NOT_TO_SAY, label: "Fark Etmez" },
  { value: GenderPreference.FEMALE, label: "Sadece Kadın" },
  { value: GenderPreference.MALE, label: "Sadece Erkek" },
];
