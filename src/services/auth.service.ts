import api from './api';
import { RegisterDto, LoginDto, AuthResponse } from '../types/auth.types';
import { supabase } from '@/lib/supabase'; // Yolun doğru olduğundan emin ol
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native'; // Alert importunu ekledik

// Tarayıcı oturumunu yönetmek için gerekli
WebBrowser.maybeCompleteAuthSession();

class AuthService {
  /**
   * Yeni kullanıcı kaydı oluştur
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        email: data.email,
        password: data.password,
      });
      console.log('Register successful', response.data);
      return response.data;
    } catch (error: any) {
      console.log('Register error:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı girişi yap (Email/Şifre)
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      });
      console.log('Login successful', response.data);
      return response.data;
    } catch (error: any) {
      console.log('Login error:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı çıkışı yap
   */
  async logout(token: string): Promise<void> {
    try {
      // Body kısmına boş obje {} koyduk ki 400 hatası almayalım
      await api.post(
        '/auth/logout',
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Logout successful');
    } catch (error: any) {
      console.log('Logout error:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı profilini getir
   */
  async getProfile(token: string) {
    try {
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Google ile giriş (Zustand uyumlu return)
   */
  async signInWithGoogle() {
    try {
      const redirectUrl = makeRedirectUri({
        path: 'auth/callback',
      });

      console.log('KOPYALANACAK URL:', redirectUrl); // <--- Bunu Supabase'e eklediğinden emin ol!

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success' && result.url) {
          const params = this.extractParamsFromUrl(result.url);

          if (params.access_token && params.refresh_token) {
            // 1. Session'ı Supabase'e kaydet
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });

            if (sessionError) throw sessionError;

            // 2. Zustand için veriyi hazırla
            // Session oluştuğu an user bilgisi de sessionData içinde gelir
            return {
              user: sessionData.user,
              session: sessionData.session,
              error: null
            };
          }
        }
      }
      
      // Kullanıcı tarayıcıyı kapattıysa veya hata olduysa
      return { user: null, session: null, error: { message: 'Giriş iptal edildi' } };

    } catch (error: any) {
      console.log('Google Auth Error:', error);
      return { user: null, session: null, error };
    }
  }

  private extractParamsFromUrl(url: string): Record<string, string> {
    const params: Record<string, string> = {};
    const queryString = url.split('#')[1] || url.split('?')[1];
    if (queryString) {
      queryString.split('&').forEach((param) => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
      });
    }
    return params;
  }
}

export default new AuthService();