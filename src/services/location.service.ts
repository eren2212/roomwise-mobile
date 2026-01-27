import axios from 'axios';
import { City, District, DistrictDetail } from '../types/matching.types';

const LOCATION_API_BASE = 'https://turkey-geolocation-rest-api.vercel.app';

class LocationService {
  // Tüm şehirleri getir
  async getCities(): Promise<City[]> {
    try {
      const response = await axios.get(`${LOCATION_API_BASE}/cities`);
      
      // API response: { status: true, data: [{ _id: 1, city: "Adana" }] }
      return response.data.data.map((city: any) => ({
        _id: city._id,
        city: city.city,
      }));
    } catch (error) {
      console.error('Şehirler alınırken hata:', error);
      throw new Error('Şehirler yüklenemedi');
    }
  }

  // Şehrin ilçelerini getir
  async getDistricts(id: number): Promise<District[]> {
    try {
      const response = await axios.get(
        `${LOCATION_API_BASE}/cities/${id}?fields=city,towns`
      );
      
      // API response: { status: true, data: [{ city: "...", towns: [{_id, name}] }] }
      const towns = response.data.data[0]?.towns || [];
      return towns.map((town: any) => ({
        _id: town._id,
        name: town.name,
      }));
    } catch (error) {
      console.error('İlçeler alınırken hata:', error);
      throw new Error('İlçeler yüklenemedi');
    }
  }

  // İlçe detaylarını getir (koordinatlar)
  async getDistrictDetail(townId: number): Promise<DistrictDetail> {
    try {
      const response = await axios.get(
        `${LOCATION_API_BASE}/towns/${townId}?fields=town,lat,lon`
      );
      
      // API response: { status: true, data: [{ town: "...", lat: ..., lon: ... }] }
      const data = response.data.data[0];
      return {
        town: data.town,
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
      };
    } catch (error) {
      console.error('İlçe detayı alınırken hata:', error);
      throw new Error('İlçe bilgisi yüklenemedi');
    }
  }
}

export default new LocationService();
