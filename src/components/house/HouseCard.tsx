import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../AppText";
import { House } from "@/types/house.types";
import houseService from "@/services/house.service";
import { BlurView } from "expo-blur";

interface HouseCardProps {
  house: House;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function HouseCard({
  house,
  onPress,
  onFavorite,
  isFavorite = false,
}: HouseCardProps) {
  const imageUrl = houseService.getFirstImageUrl(house);

  // Amenity ikonları (ilk 4)
  const amenityIcons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    wifi: "wifi",
    ac: "snow",
    washer: "water",
    furnished: "bed",
    balcony: "sunny",
    parking: "car",
  };

  const displayAmenities = (house.amenities || []).slice(0, 4);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-card rounded-2xl mb-4 overflow-hidden shadow-sm"
      activeOpacity={0.8}
    >
      <View className="flex-row p-3">
        {/* Sol: Resim */}
        <View className="w-24 h-24 rounded-xl overflow-hidden bg-quaternary">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="home-outline" size={32} color="#12121E4D" />
            </View>
          )}
        </View>

        {/* Sağ: Bilgiler */}
        <View className="flex-1 ml-3 justify-between">
          {/* Fiyat ve Favoriler */}
          <View className="flex-row justify-between items-start">
            <View>
              <AppText className="text-lg font-bold text-tint ">
                ₺{house.rent_amount.toLocaleString()}/ay
              </AppText>
              <AppText className="text-sm text-secondary">{house.city}</AppText>
            </View>
            {onFavorite && (
              <TouchableOpacity onPress={onFavorite}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={22}
                  color={isFavorite ? "#FF3B30" : "#12121E4D"}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Açıklama */}
          <AppText className="text-sm text-primary mt-1" numberOfLines={2}>
            {house.description || house.title}
          </AppText>

          {/* Olanaklar */}
          <View className="flex-row mt-2">
            {displayAmenities.map((amenity, index) => {
              const iconName = amenityIcons[amenity] || "checkmark";
              return (
                <View key={index} className="mr-3">
                  <Ionicons name={iconName} size={16} color="#5E43F3" />
                </View>
              );
            })}
            {house.max_occupancy && (
              <View className="flex-row items-center">
                <Ionicons name="people" size={16} color="#5E43F3" />
                <AppText className="text-xs text-secondary ml-1">
                  {house.max_occupancy}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
