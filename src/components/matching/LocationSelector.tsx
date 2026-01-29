import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { useMatchingStore } from "../../stores/matchingStore";
import { useAuthStore } from "../../stores/authStore";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AppText } from "../AppText";
import COLORS from "@/theme/color";

interface LocationSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSearch: () => void;
}

export default function LocationSelector({
  visible,
  onClose,
  onSearch,
}: LocationSelectorProps) {
  const { token } = useAuthStore();
  const {
    cities,
    districts,
    selectedCity,
    selectedDistrict,
    isLoadingCities,
    isLoadingDistricts,
    isLoading,
    fetchCities,
    fetchDistricts,
    setSelectedCity,
    setSelectedDistrict,
  } = useMatchingStore();

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  // Fetch cities on mount
  useEffect(() => {
    if (visible && cities.length === 0) {
      fetchCities();
    }
  }, [visible]);

  // Fetch districts when city changes
  useEffect(() => {
    if (selectedCity) {
      fetchDistricts(selectedCity._id);
    }
  }, [selectedCity]);

  const handleSearch = () => {
    if (selectedCity && selectedDistrict) {
      onSearch();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <View className="w-10" />
          </View>

          <ScrollView className="flex-1 px-6">
            {/* Title */}
            <AppText className="text-3xl font-bold !text-indigo-600 mt-6">
              Nerede yaşamak{"\n"}istiyorsun?
            </AppText>
            <AppText className="text-gray-500 mt-2 mb-8">
              Tercih ettiğin konumu seç.
            </AppText>

            {/* City Selector */}
            <AppText className="text-xs font-semibold text-gray-400 tracking-wider mb-2">
              ŞEHİR
            </AppText>
            <View className="bg-gray-50 rounded-xl mb-6">
              {isLoadingCities ? (
                <View className="p-4 items-center">
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="p-2"
                >
                  {cities.map((city) => (
                    <TouchableOpacity
                      key={city._id}
                      onPress={() => setSelectedCity(city)}
                      className={`px-4 py-3 rounded-xl mr-2 ${
                        selectedCity?._id === city._id
                          ? "bg-indigo-600"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedCity?._id === city._id
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {city.city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* District Selector */}
            <AppText className="text-xs font-semibold text-gray-400 tracking-wider mb-2">
              İLÇE
            </AppText>
            <View className="bg-gray-50 rounded-xl min-h-[120px]">
              {!selectedCity ? (
                <View className="p-4 items-center justify-center h-[120px]">
                  <Text className="text-gray-400">Önce şehir seçin</Text>
                </View>
              ) : isLoadingDistricts ? (
                <View className="p-4 items-center justify-center h-[120px]">
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              ) : (
                <ScrollView
                  className="p-2 max-h-[200px]"
                  showsVerticalScrollIndicator={true}
                >
                  <View className="flex-row flex-wrap gap-2">
                    {districts.map((district) => (
                      <TouchableOpacity
                        key={district._id}
                        onPress={() => setSelectedDistrict(district)}
                        className={`px-4 py-2.5 rounded-xl ${
                          selectedDistrict?._id === district._id
                            ? "bg-indigo-600"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            selectedDistrict?._id === district._id
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {district.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            {/* Map Placeholder */}
            <View className="mt-6 h-40 bg-gray-100 rounded-2xl items-center justify-center overflow-hidden">
              <Feather name="map" size={24} color="black" />
              <Image source={require("../../../assets/images/image.png")} />
            </View>
          </ScrollView>

          {/* Search Button */}
          <View className="px-6 py-4 pb-8">
            <TouchableOpacity
              onPress={handleSearch}
              disabled={!selectedCity || !selectedDistrict || isLoading}
              className={`py-4 rounded-full flex-row items-center justify-center ${
                selectedCity && selectedDistrict && !isLoading
                  ? "bg-indigo-600"
                  : "bg-gray-300"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <AppText className="text-white font-bold text-lg mr-2">
                    Ev Arkadaşı Bul
                  </AppText>
                  <FontAwesome name="users" size={18} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
