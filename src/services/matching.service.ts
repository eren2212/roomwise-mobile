import api from './api';
import { PotentialMatch, SwipeDto, SwipeResponse, Match } from '../types/matching.types';

class MatchingService {
  // Potansiyel adayları getir
  async getPotentialMatches(
    lat: number,
    lng: number,
    radius: number = 50,
    token: string
  ): Promise<PotentialMatch[]> {
    try {
      const response = await api.get('/matches/potential', {
        params: { lat, lng, rad: radius },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Potansiyel eşleşmeler alınırken hata:', error);
      throw error;
    }
  }

  // Swipe yap
  async swipe(
    swipeDto: SwipeDto,
    token: string
  ): Promise<SwipeResponse> {
    try {
      const response = await api.post('/matches/swipe', swipeDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Swipe işlemi sırasında hata:', error);
      throw error;
    }
  }

  // Eşleşmeleri getir
  async getMyMatches(token: string): Promise<Match[]> {
    try {
      const response = await api.get('/matches', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Eşleşmeler alınırken hata:', error);
      throw error;
    }
  }

  // Tek eşleşme detayı
  async getMatchDetail(matchId: string, token: string) {
    try {
      const response = await api.get(`/matches/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Eşleşme detayı alınırken hata:', error);
      throw error;
    }
  }
}

export default new MatchingService();
