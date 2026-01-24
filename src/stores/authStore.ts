import { create } from 'zustand';
import { AuthState, User, RegisterDto, LoginDto } from '../types/auth.types';
import authService from '../services/auth.service';

interface AuthStore extends AuthState {
  // Actions
  register: (data: RegisterDto) => Promise<void>;
  login: (data: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Register action
  register: async (data: RegisterDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      
      if (response.error) {
        set({ 
          error: response.error.message, 
          isLoading: false 
        });
        throw new Error(response.error.message);
      }
      console.log('response', response);
      console.log('response.data.session', response.data.session);
      console.log('response.data.user', response.data.user);
      if (response.data.session && response.data.user) {
        set({
          user: response.data.user,
          token: response.data.session.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
      else if (response.data.user && !response.data.session) {
        set({
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Kayıt olurken bir hata oluştu';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  // Login action
  login: async (data: LoginDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      
      if (response.error) {
        set({ 
          error: response.error.message, 
          isLoading: false 
        });
        throw new Error(response.error.message);
      }

      if (response.data.session && response.data.user) {
        set({
          user: response.data.user,
          token: response.data.session.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Giriş yaparken bir hata oluştu';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      // Service'i çağır
      const response = await authService.signInWithGoogle();

      // Hata varsa
      if (response.error) {
        set({ 
          error: response.error.message || 'Google girişi başarısız', 
          isLoading: false 
        });
        return; // Hata fırlatmıyoruz, sadece state güncelliyoruz
      }

      // Başarılıysa Store'u güncelle
      if (response.session && response.user) {
        set({
          user: response.user as User,
          token: response.session.access_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        console.log("Zustand güncellendi: Giriş Başarılı ✅");
      } else {
        // Kullanıcı iptal ettiyse loading'i kapat
        set({ isLoading: false });
      }

    } catch (error: any) {
      set({ 
        error: error.message || 'Google girişi sırasında hata', 
        isLoading: false 
      });
    }
  },

  // Logout action
  logout: async () => {
    const { token } = get();
    if (token) {
      try {
        await authService.logout(token);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // Set user
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  // Set token
  setToken: (token) => {
    set({ token });
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
