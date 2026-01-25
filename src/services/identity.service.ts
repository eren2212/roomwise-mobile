import api from './api';
import {
  VerifyIdentityResponse,
  IdentityStatusResponse,
  ApiResponse,
  CapturedImage,
} from '../types/identity.types';

class IdentityService {
  /**
   * Kimlik doğrulama - selfie ve ID fotoğrafı gönder
   */
  async verifyIdentity(
    selfie: CapturedImage,
    idPhoto: CapturedImage,
    token: string,
  ): Promise<ApiResponse<VerifyIdentityResponse>> {
    try {
      const formData = new FormData();

      // Selfie ekle
      formData.append('selfie', {
        uri: selfie.uri,
        type: selfie.type,
        name: selfie.name,
      } as any);

      // ID Photo ekle
      formData.append('idPhoto', {
        uri: idPhoto.uri,
        type: idPhoto.type,
        name: idPhoto.name,
      } as any);

      const response = await api.post('/identity/verify', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        // 30 saniye timeout (AWS işlemi zaman alabilir)
        timeout: 30000,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Identity verification error:', error);

      // Backend'den gelen hata mesajını al
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Kimlik doğrulama başarısız oldu.';

      return {
        success: false,
        error: errorMessage,
        data: error.response?.data,
      };
    }
  }

  /**
   * Doğrulama durumunu kontrol et
   */
  async getVerificationStatus(
    token: string,
  ): Promise<ApiResponse<IdentityStatusResponse>> {
    try {
      const response = await api.get('/identity/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Get verification status error:', error);

      return {
        success: false,
        error: error.response?.data?.message || 'Durum alınamadı.',
      };
    }
  }
}

export default new IdentityService();
