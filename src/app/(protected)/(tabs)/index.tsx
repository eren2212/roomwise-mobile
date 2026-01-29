import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { useMatchingStore } from "@/stores/matchingStore";
import { SwipeAction } from "@/types/matching.types";
import SwipeCardStack from "@/components/matching/SwipeCardStack";
import ActionButtons from "@/components/matching/ActionButtons";
import LocationSelector from "@/components/matching/LocationSelector";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AppText } from "@/components/AppText";
import ProfileService from "@/services/profile.service";

export default function HomeScreen() {
  const { token } = useAuthStore();
  const { profile } = useProfileStore();
  const {
    cards,
    isLoading,
    isSwiping,
    showLocationModal,
    currentLocation,
    lastMatch,
    loadInitialCards,
    swipe,
    setShowLocationModal,
    searchWithNewLocation,
  } = useMatchingStore();

  const swipeCardRef = useRef<{
    swipeLeft: () => void;
    swipeRight: () => void;
  } | null>(null);

  // Load cards on mount
  useEffect(() => {
    console.log("🏠 [HOME] Component mounted");
    if (token) {
      console.log("🏠 [HOME] Token var, kartlar yükleniyor...");
      loadInitialCards(token);
    }
  }, [token]);

  // Reload cards when screen is focused (her tab'a girişte)
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("👁️ [HOME] Screen focused, kartlar yenileniyor...");
  //     if (token) {
  //       loadInitialCards(token);
  //     }
  //   }, [token]),
  // );

  // Check for new matches
  useEffect(() => {
    if (lastMatch?.isMatch) {
      Alert.alert(
        "🎉 Eşleşme!",
        "Yeni bir ev arkadaşı ile eşleştin! Sohbet başlatmak için eşleşmeler sekmesine git.",
        [{ text: "Harika!", style: "default" }],
      );
    }
  }, [lastMatch]);

  const handleSwipe = async (userId: string, action: SwipeAction) => {
    if (!token) return;
    try {
      await swipe(userId, action, token);
    } catch (error: any) {
      // Silently handle already swiped errors
      if (!error.response?.data?.message?.includes("zaten swipe")) {
        console.error("Swipe error:", error);
      }
    }
  };

  const handleButtonSwipe = async (action: SwipeAction) => {
    if (cards.length === 0 || !token) return;
    const topCard = cards[0];
    await handleSwipe(topCard.id, action);
  };

  const handleLocationSearch = async () => {
    if (!token) return;
    await searchWithNewLocation(token);
  };

  const firstName = profile?.full_name?.split(" ")[0] || "Kullanıcı";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 flex-row gap-2 items-center justify-between space-x-3">
        {/* Sol Kısım: Karşılama Metni */}
        <View className="flex-1">
          <AppText className="text-2xl font-bold text-gray-900">Keşfet</AppText>
          <AppText className="text-gray-500 text-xs" numberOfLines={1}>
            Merhaba, {firstName}
          </AppText>
        </View>

        {/* Orta Kısım: Konum Barı (Daha kompakt) */}
        <TouchableOpacity
          onPress={() => setShowLocationModal(true)}
          className="flex-[0.5] bg-card rounded-full px-3 py-2 flex-row items-center border border-black/10"
        >
          <FontAwesome name="map-pin" size={24} color="black" />
          <AppText
            className="flex-1 text-gray-700 font-medium text-xs ml-2"
            numberOfLines={1}
          >
            {currentLocation?.districtText || "Konum seç..."}
          </AppText>
          <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Sağ Kısım: Bildirim Butonu */}
        <TouchableOpacity
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-50"
          onPress={() => {
            /* Open notifications */
          }}
        >
          <Ionicons name="notifications-outline" size={22} color="black" />
          {/* Küçük bir bildirim noktası (Opsiyonel) */}
          <View className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </TouchableOpacity>
      </View>

      {/* Card Stack */}
      <View className="flex-1">
        <SwipeCardStack
          cards={cards}
          onSwipe={handleSwipe}
          isLoading={isLoading}
        />
      </View>

      {/* Action Buttons */}
      {cards.length > 0 && (
        <ActionButtons
          onDislike={() => handleButtonSwipe(SwipeAction.DISLIKE)}
          onSuperLike={() => handleButtonSwipe(SwipeAction.SUPERLIKE)}
          onLike={() => handleButtonSwipe(SwipeAction.LIKE)}
          disabled={isSwiping || isLoading}
        />
      )}

      {/* Location Selector Modal */}
      <LocationSelector
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSearch={handleLocationSearch}
      />
    </SafeAreaView>
  );
}
