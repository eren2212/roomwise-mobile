import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { PotentialMatch, SwipeAction } from "../../types/matching.types";
import { AppText } from "../AppText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import COLORS from "@/theme/color";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface SwipeCardProps {
  card: PotentialMatch;
  onSwipe: (action: SwipeAction) => void;
  isFirst: boolean;
}

// Calculate age from birth_date
const calculateAge = (birthDate: Date | null): number | null => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default function SwipeCard({ card, onSwipe, isFirst }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const handleSwipeComplete = (action: SwipeAction) => {
    onSwipe(action);
  };

  const panGesture = Gesture.Pan()
    .enabled(isFirst)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotation.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-15, 0, 15],
        Extrapolation.CLAMP,
      );
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe Right - Like
        translateX.value = withTiming(
          SCREEN_WIDTH * 1.5,
          { duration: 300 },
          () => {
            runOnJS(handleSwipeComplete)(SwipeAction.LIKE);
          },
        );
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe Left - Dislike
        translateX.value = withTiming(
          -SCREEN_WIDTH * 1.5,
          { duration: 300 },
          () => {
            runOnJS(handleSwipeComplete)(SwipeAction.DISLIKE);
          },
        );
      } else {
        // Spring back to center
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
        rotation.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const dislikeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));
  const getAcronym = (text: string | null) => {
    if (!text) return "";
    return text
      .split(" ") // Boşluklardan ayır
      .filter((word) => word) // Gereksiz boşlukları temizle
      .map((word) => word[0]) // Her kelimenin ilk harfini al
      .join("") // Birleştir
      .toUpperCase(); // Hepsini büyük harf yap
  };
  const age = calculateAge(card.birth_date);
  const avatarUrl = card.avatar_url
    ? `${process.env.EXPO_PUBLIC_API_URL}/profiles/avatar/${card.avatar_url}`
    : null;

  // Preferences'tan ilk 3-4 tanesini göster (kart çok kalabalık olmasın)
  const displayPreferences = card.preferences?.slice(0, 4) || [];

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[cardStyle]}
        className={`absolute w-full ${isFirst ? "z-10" : "z-0"} `}
      >
        <View
          className="mx-12 rounded-3xl overflow-hidden bg-card shadow-lg border border-gray-200 "
          style={{ height: SCREEN_HEIGHT * 0.7 }}
        >
          {/* Profile Image */}
          <View className="flex-1 relative">
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-gray-200 items-center justify-center">
                <Feather name="user" size={24} color="black" />
              </View>
            )}

            {/* Gradient Overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              className="absolute bottom-0 left-0 right-0 h-40"
            />

            {/* Match Score Badge */}
            <BlurView
              intensity={70}
              tint="light"
              className="absolute top-4 right-4  px-3 py-1 flex-row items-center"
              style={{
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: 10,
              }}
            >
              <MaterialCommunityIcons
                name="lightning-bolt-outline"
                size={24}
                color="orange"
              />

              <Text className="text-indigo-600 font-bold flex-row items-center">
                {card.match_score}% Eşleşme
              </Text>
            </BlurView>

            {/* Like Indicator */}
            <Animated.View
              style={likeOpacity}
              className="absolute top-20 left-6 bg-card rounded-xl px-4 py-2 rotate-[-20deg]"
            >
              <Text className="text-success  text-2xl font-bold">BEĞEN</Text>
            </Animated.View>

            {/* Dislike Indicator */}
            <Animated.View
              style={dislikeOpacity}
              className="absolute top-20 right-6 bg-card rounded-xl px-4 py-2 rotate-[20deg]"
            >
              <Text className="text-error text-2xl font-bold">GEÇ</Text>
            </Animated.View>

            {/* Name & Info */}
            <View className="absolute bottom-4 left-4 right-4">
              <Text className="text-white text-3xl font-bold">
                {card.full_name ? card.full_name.split(" ")[0] : "İsimsiz"}
                {age ? `, ${age}` : ""}
              </Text>
              {(card.university || card.occupation) && (
                <View className="flex-row items-center mt-1">
                  <AppText className="text-white/90 text-base">
                    {card.occupation_status === "student" ? (
                      <View className="flex-row items-center">
                        <Ionicons name="school" size={24} color="white" />
                        <View className="flex-row items-center">
                          <AppText className="text-white text-2xl ml p-2">
                            {getAcronym(card.university)}@
                          </AppText>
                          <AppText className="text-white text-2xl">
                            {getAcronym(card.department)}
                          </AppText>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-row items-center">
                        <MaterialIcons name="work" size={16} color="white" />
                        <AppText className="text-white/90 text-base ml-2">
                          {card.occupation || ""}
                        </AppText>
                      </View>
                    )}
                  </AppText>
                </View>
              )}
            </View>

            {/* Info Button */}
            <View className="absolute bottom-4 right-4 w-12 h-12 bg-gray-800/20 rounded-full items-center justify-center">
              <Ionicons
                name="information-circle-sharp"
                size={26}
                color="white"
              />
            </View>
          </View>
          {/* Lifestyle Tags Section */}
          <View className="mx-4 mt-1 rounded-2xl p-4 shadow-lg h-2/5">
            <AppText className="text-gray-500 text-xs font-semibold mb-2 tracking-wider">
              YAŞAM TARZI
            </AppText>

            {/* Preferences from API */}
            <View className="flex-row flex-wrap justify-around gap-2">
              {displayPreferences.length > 0 ? (
                displayPreferences.map((pref, index) => (
                  <View
                    key={index}
                    className="bg-success/10 rounded-full px-3 py-2 flex-row items-center justify-center gap-1.5"
                  >
                    <FontAwesome6
                      name={pref.icon}
                      size={14}
                      color={COLORS.success}
                    />
                    <AppText className=" text-sm font-medium">
                      {pref.label}
                    </AppText>
                  </View>
                ))
              ) : (
                <View className="bg-gray-100 rounded-full px-3 py-2 flex-row items-center gap-1.5">
                  <MaterialCommunityIcons
                    name="home"
                    size={14}
                    color="#6B7280"
                  />
                  <AppText className="text-gray-600 text-sm">
                    Ev Arkadaşı Arıyor
                  </AppText>
                </View>
              )}
            </View>

            <View className="border-t border-gray-300 mt-4  h-1 "></View>

            <View className="flex-row items-center justify-between mt-4">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="attach-money" size={24} color="black" />
                <AppText className=" text-xl font-semibold tracking-wider p-2">
                  Bütçe
                </AppText>
              </View>
              <AppText className="text-xl font-semibold tracking-wider p-2">
                12000 TL
              </AppText>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
