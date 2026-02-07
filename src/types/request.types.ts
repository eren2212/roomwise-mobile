/**
 * Ev isteği tipi
 */
export interface HouseRequest {
  id: string;
  house_id: string;
  user_id: string;
  status: "pending" | "verified" | "rejected";
  message: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Profil bilgileri ile zenginleştirilmiş istek
 */
export interface HouseRequestWithProfile extends HouseRequest {
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    birth_date: string | null;
    occupation: string | null;
    gender: string | null;
    verification_status: string;
  };
  houses?: {
    id: string;
    title: string;
    owner_id: string;
  };
}

/**
 * İstek oluşturma DTO
 */
export interface CreateRequestDto {
  house_id: string;
  message?: string;
}

/**
 * API Response tipi
 */
export interface RequestApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
