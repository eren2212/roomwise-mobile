// Kayıt olma için gerekli veriler
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

// Giriş yapma için gerekli veriler
export interface LoginDto {
  email: string;
  password: string;
}

// Kullanıcı bilgileri
export interface User {
  id: string;
  email: string;
  fullName?: string;
  created_at?: string;
}

// Auth response - Backend'den dönen cevap
export interface AuthResponse {
  data: {
    user: User | null;
    session: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
    } | null;
  };
  error: {
    message: string;
  } | null;
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
