import React, { useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { AppText } from '@/components/AppText';
import { useMatchingStore } from '@/stores/matchingStore';
import { City, District } from '@/types/matching.types';

interface LocationPickerProps {
  onLocationSelected: () => void;
  token?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelected, token }) => {
  const {
    cities,
    districts,
    selectedCity,
    selectedDistrict,
    isLoading,
    fetchCities,
    fetchDistricts,
    selectCity,
    selectDistrict,
  } = useMatchingStore();

  const [showCityModal, setShowCityModal] = React.useState(false);
  const [showDistrictModal, setShowDistrictModal] = React.useState(false);

  // İlk yüklemede şehirleri getir
  useEffect(() => {
    if (cities.length === 0) {
      fetchCities();
    }
  }, []);

  // Şehir seçildiğinde ilçeleri getir
  const handleCitySelect = async (city: City) => {
    selectCity(city);
    setShowCityModal(false);
    await fetchDistricts(city._id);
  };

  // İlçe seçildiğinde koordinatları al ve profilde kaydet
  const handleDistrictSelect = async (district: District) => {
    await selectDistrict(district, token); // Token'ı geçtik
    setShowDistrictModal(false);
    onLocationSelected();
  };

  return (
    <View className="mx-4 mb-4">
      {/* Başlık */}
      <AppText className="text-2xl font-bold mb-4">
        Nerede aramak istersin?
      </AppText>

      <View className="flex-row gap-3">
        {/* Şehir Seç */}
        <TouchableOpacity
          onPress={() => setShowCityModal(true)}
          className="flex-1 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
          activeOpacity={0.7}
        >
          <AppText className="text-xs text-gray-500 mb-1">ŞEHİR</AppText>
          <AppText className="text-base font-semibold">
            {selectedCity ? selectedCity.city : 'Seç'}
          </AppText>
          <AppText className="text-2xl mt-1">📍</AppText>
        </TouchableOpacity>

        {/* İlçe Seç */}
        <TouchableOpacity
          onPress={() => selectedCity && setShowDistrictModal(true)}
          disabled={!selectedCity}
          className={`flex-1 rounded-2xl p-4 border shadow-sm ${
            selectedCity 
              ? 'bg-white border-gray-200' 
              : 'bg-gray-50 border-gray-100 opacity-50'
          }`}
          activeOpacity={0.7}
        >
          <AppText className="text-xs text-gray-500 mb-1">İLÇE</AppText>
          <AppText className={`text-base font-semibold ${!selectedCity && 'text-gray-400'}`}>
            {selectedDistrict ? selectedDistrict.name : 'Seç'}
          </AppText>
          <AppText className="text-2xl mt-1">🏘️</AppText>
        </TouchableOpacity>
      </View>

      {/* Şehir Modal */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl h-4/5">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
              <AppText className="text-2xl font-bold">Şehir Seç</AppText>
              <TouchableOpacity 
                onPress={() => setShowCityModal(false)}
                className="bg-gray-100 rounded-full w-10 h-10 items-center justify-center"
              >
                <AppText className="text-xl">✕</AppText>
              </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView className="flex-1 px-4 pt-2">
              {cities.map((city) => (
                <TouchableOpacity
                  key={city._id}
                  onPress={() => handleCitySelect(city)}
                  className="bg-gray-50 rounded-xl p-4 mb-2 border border-gray-100"
                  activeOpacity={0.7}
                >
                  <AppText className="text-base font-medium">{city.city}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* İlçe Modal */}
      <Modal
        visible={showDistrictModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDistrictModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl h-4/5">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
              <AppText className="text-2xl font-bold">İlçe Seç</AppText>
              <TouchableOpacity 
                onPress={() => setShowDistrictModal(false)}
                className="bg-gray-100 rounded-full w-10 h-10 items-center justify-center"
              >
                <AppText className="text-xl">✕</AppText>
              </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView className="flex-1 px-4 pt-2">
              {isLoading ? (
                <View className="p-8">
                  <AppText className="text-gray-500 text-center">Yükleniyor...</AppText>
                </View>
              ) : districts.length === 0 ? (
                <View className="p-8">
                  <AppText className="text-gray-500 text-center">İlçe bulunamadı</AppText>
                </View>
              ) : (
                districts.map((district) => (
                  <TouchableOpacity
                    key={district._id}
                    onPress={() => handleDistrictSelect(district)}
                    className="bg-gray-50 rounded-xl p-4 mb-2 border border-gray-100"
                    activeOpacity={0.7}
                  >
                    <AppText className="text-base font-medium">{district.name}</AppText>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
