import axios from 'axios';

// API Base URL - Geliştirme ortamı için
// Production'da bu URL değiştirilmeli
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 saniye timeout
});

// Request interceptor - Her istekte token ekle
api.interceptors.request.use(
  (config) => {
    // Token'ı authStore'dan alıp header'a ekleyebiliriz
    // Şimdilik boş bırakıyoruz, zustand store hazır olunca ekleyeceğiz
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hataları yönet
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Network hatası
    if (!error.response) {
      console.error('Ağ hatası:', error.message);
      return Promise.reject({
        message: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
      });
    }

    // Server hatası
    const errorMessage = error.response?.data?.message || 'Bir hata oluştu';
    console.error('API Hatası:', errorMessage);
    
    return Promise.reject({
      status: error.response.status,
      message: errorMessage,
      data: error.response.data,
    });
  }
);

export default api;
