import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Animated,
  Modal,
} from "react-native";
import { AppText } from "@/components/AppText";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { useMatchingStore } from "@/stores/matchingStore";
import { VerificationBlocker } from "@/components/VerificationBlocker";
import { LocationPicker } from "@/components/LocationPicker";
import { SwipeCard } from "@/components/SwipeCard";
import { SwipeAction } from "@/types/matching.types";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.3;

export default function HomeScreen() {
  const { token } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const {
    potentialMatches,
    currentIndex,
    isFetching,
    selectedLocation,
    fetchPotentialMatches,
    swipeCard,
  } = useMatchingStore();

  const [translateX] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(0));
  const [rotate] = useState(new Animated.Value(0));
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Profil yükle
  useEffect(() => {
    if (token && !profile) {
      fetchProfile(token);
    }
  }, [token]);

  // Doğrulama kontrolü
  const isVerified = profile?.verification_status === "verified";

  // Swipe animasyonu
  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true },
  );

  const handleGestureEnd = async ({ nativeEvent }: any) => {
    const { translationX, velocityX } = nativeEvent;

    // Like (sağa)
    if (translationX > SWIPE_THRESHOLD || velocityX > 500) {
      animateSwipe(width * 1.5);
      await performSwipe(SwipeAction.LIKE);
    }
    // Dislike (sola)
    else if (translationX < -SWIPE_THRESHOLD || velocityX < -500) {
      animateSwipe(-width * 1.5);
      await performSwipe(SwipeAction.DISLIKE);
    }
    // Geri dön
    else {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const animateSwipe = (toValue: number) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      translateX.setValue(0);
      translateY.setValue(0);
    });
  };

  const performSwipe = async (action: SwipeAction) => {
    if (!token) return;

    const currentMatch = potentialMatches[currentIndex];
    if (!currentMatch) return;

    const isMatch = await swipeCard(action, currentMatch.id, token);

    if (isMatch) {
      Alert.alert("🎉 Eşleşme!", `${currentMatch.full_name} ile eşleştiniz!`);
    }
  };

  const handleLocationSelected = async () => {
    if (token) {
      await fetchPotentialMatches(token);
      setShowLocationModal(false);
    }
  };

  // Manuel butonlar
  const handleManualSwipe = async (action: SwipeAction) => {
    if (action === SwipeAction.LIKE) {
      animateSwipe(width * 1.5);
    } else {
      animateSwipe(-width * 1.5);
    }
    await performSwipe(action);
  };

  // Doğrulanmamışsa blocker göster
  if (!isVerified) {
    return <VerificationBlocker />;
  }

  // Mevcut kart
  const currentMatch = potentialMatches[currentIndex];

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-card pt-14 pb-4 px-6 flex-row justify-between items-center">
          <View className="flex-1">
            <AppText className="text-3xl font-bold mb-1">Keşfet</AppText>
            <AppText className="text-sm text-gray-500">
              Merhaba, {profile?.full_name?.split(" ")[0] || ""}
            </AppText>
          </View>

          {/* Icons */}
          <View className="flex-row gap-3">
            {/* Map/Location Icon */}
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              className="bg-gray-100 rounded-full w-12 h-12 items-center justify-center"
              activeOpacity={0.7}
            >
              <Feather name="map-pin" size={24} color="black" />
            </TouchableOpacity>

            {/* Notification Icon */}
            <TouchableOpacity
              className="bg-gray-100 rounded-full w-12 h-12 items-center justify-center relative"
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={24} color="black" />
              {/* Red dot for notifications */}
              <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Modal */}
        <Modal
          visible={showLocationModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLocationModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View
              className="bg-white rounded-t-3xl pt-6 pb-8"
              style={{ minHeight: "50%" }}
            >
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setShowLocationModal(false)}
                className="absolute top-4 right-6 bg-gray-100 rounded-full w-10 h-10 items-center justify-center z-10"
              >
                <AppText className="text-xl">✕</AppText>
              </TouchableOpacity>

              {/* Location Picker */}
              <LocationPicker
                onLocationSelected={handleLocationSelected}
                token={token || ""}
              />
            </View>
          </View>
        </Modal>

        {/* Content */}
        {isFetching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2C0FBD" />
            <AppText className="text-gray-600 mt-4">
              Eşleşmeler yükleniyor...
            </AppText>
          </View>
        ) : !selectedLocation ? (
          <View className="flex-1 justify-center items-center px-8 ">
            <View className="bg-white rounded-full w-32 h-32 items-center justify-center mb-6 shadow-lg">
              <FontAwesome5 name="map-pin" size={24} color="black" />
            </View>
            <AppText className="text-2xl font-bold text-center mb-3">
              Konum Seç
            </AppText>
            <AppText className="text-gray-500 text-center mb-6">
              Bir şehir ve ilçe seçerek yakınınızdaki odanoktaları bulun
            </AppText>
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              className="bg-[#2C0FBD] rounded-full py-4 px-8"
              activeOpacity={0.8}
            >
              <AppText className="text-white font-semibold">Konum Seç</AppText>
            </TouchableOpacity>
          </View>
        ) : potentialMatches.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <View className="bg-white rounded-full w-32 h-32 items-center justify-center mb-6 shadow-lg">
              <AppText className="text-6xl">😔</AppText>
            </View>
            <AppText className="text-2xl font-bold text-center mb-3">
              Hiç Bir Eşleşme Bulunamadı
            </AppText>
            <AppText className="text-gray-500 text-center mb-6">
              Bu alanda hiç bir eşleşme bulunamadı. Farklı bir konum ile tekrar
              deneyin!
            </AppText>
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              className="bg-[#2C0FBD] rounded-full py-4 px-8"
              activeOpacity={0.8}
            >
              <AppText className="text-white font-semibold">
                Konum Değiştir
              </AppText>
            </TouchableOpacity>
          </View>
        ) : currentIndex >= potentialMatches.length ? (
          <View className="flex-1 justify-center items-center px-8 ">
            <View className="bg-white rounded-full w-32 h-32 items-center justify-center mb-6 shadow-lg">
              <AppText className="text-6xl">🎉</AppText>
            </View>
            <AppText className="text-2xl font-bold text-center mb-3">
              Tüm Eşleşmeler Görüldü!
            </AppText>
            <AppText className="text-gray-500 text-center mb-6">
              Bu alanda tüm eşleşmeleri gördünüz. Farklı bir konum ile yeni
              eşleşmeler bulun
            </AppText>
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              className="bg-[#2C0FBD] rounded-full py-4 px-8"
              activeOpacity={0.8}
            >
              <AppText className="text-white font-semibold">
                Konum Değiştir
              </AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Card Stack */}
            <View className="flex-1 items-center justify-center">
              <PanGestureHandler
                onGestureEvent={handleGesture}
                onHandlerStateChange={handleGestureEnd}
              >
                <Animated.View
                  style={{
                    transform: [
                      { translateX },
                      { translateY },
                      {
                        rotate: translateX.interpolate({
                          inputRange: [-width, width],
                          outputRange: ["-30deg", "30deg"],
                        }),
                      },
                    ],
                  }}
                >
                  <SwipeCard match={currentMatch} />
                </Animated.View>
              </PanGestureHandler>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center items-center pb-32 px-8 gap-6">
              {/* Dislike */}
              <TouchableOpacity
                onPress={() => handleManualSwipe(SwipeAction.DISLIKE)}
                className="bg-white rounded-full w-16 h-16 items-center justify-center shadow-xl"
                style={{
                  shadowColor: "#FF3B30",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 8,
                }}
                activeOpacity={0.7}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>

              {/* Superlike */}
              <TouchableOpacity
                onPress={() => handleManualSwipe(SwipeAction.SUPERLIKE)}
                className="bg-[#2C0FBD] rounded-full w-20 h-20 items-center justify-center shadow-xl"
                style={{
                  shadowColor: "#2C0FBD",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 10,
                }}
                activeOpacity={0.7}
              >
                <Fontisto name="star" size={32} color="yellow" />
              </TouchableOpacity>

              {/* Like */}
              <TouchableOpacity
                onPress={() => handleManualSwipe(SwipeAction.LIKE)}
                className="bg-white rounded-full w-16 h-16 items-center justify-center shadow-xl"
                style={{
                  shadowColor: "#00C853",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 8,
                }}
                activeOpacity={0.7}
              >
                <AntDesign name="heart" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
