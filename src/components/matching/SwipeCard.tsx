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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface SwipeCardProps {
  card: PotentialMatch;
  onSwipe: (action: SwipeAction) => void;
  isFirst: boolean;
}

// Calculate age from birth_date
const calculateAge = (birthDate: string | null): number | null => {
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

// Get lifestyle tags from preferences (placeholder - would need to fetch preferences)
const getLifestyleTags = (card: PotentialMatch): string[] => {
  const tags: string[] = [];
  // These would ideally come from user preferences
  // For now, using occupation_status as a tag
  if (card.occupation_status === "student") tags.push("🎓 Öğrenci");
  if (card.occupation_status === "professional") tags.push("💼 Çalışan");
  return tags;
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

  const age = calculateAge(card.bio); // Note: bio is used as placeholder, should use birth_date
  const tags = getLifestyleTags(card);
  const avatarUrl = card.avatar_url
    ? `${process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.35:3000"}/profiles/avatar/${card.avatar_url}`
    : null;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[cardStyle]}
        className={`absolute w-full ${isFirst ? "z-10" : "z-0"}`}
      >
        <View
          className="mx-6 rounded-3xl overflow-hidden bg-white shadow-2xl"
          style={{ height: SCREEN_HEIGHT * 0.55 }}
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
              className="absolute top-20 left-6 border-4 border-green-500 rounded-xl px-4 py-2 rotate-[-20deg]"
            >
              <Text className="text-green-500 text-2xl font-bold">BEĞEN</Text>
            </Animated.View>

            {/* Dislike Indicator */}
            <Animated.View
              style={dislikeOpacity}
              className="absolute top-20 right-6 border-4 border-red-500 rounded-xl px-4 py-2 rotate-[20deg]"
            >
              <Text className="text-red-500 text-2xl font-bold">GEÇÇ</Text>
            </Animated.View>

            {/* Name & Info */}
            <View className="absolute bottom-4 left-4 right-4">
              <AppText className="text-white text-3xl font-bold">
                {card.full_name || "İsimsiz"}
                {age ? `, ${age}` : ""}
              </AppText>
              {(card.university || card.occupation) && (
                <View className="flex-row items-center mt-1">
                  <AppText className="text-white/90 text-base">
                    {card.occupation_status === "student" ? (
                      <View className="flex-row items-center">
                        <FontAwesome
                          name="university"
                          size={22}
                          color="white"
                        />
                        <View className="flex-col items-start">
                          <AppText className="text-white/90 text-base ml-2 p-2">
                            {card.university || ""}{" "}
                          </AppText>
                          <AppText className="text-white/90 text-base ml-2 p-2">
                            {card.department || ""}
                          </AppText>
                        </View>
                      </View>
                    ) : (
                      <>
                        <MaterialIcons name="work" size={16} color="white" />
                        <AppText className="text-white/90 text-base ml-2">
                          {card.occupation || ""}
                        </AppText>
                      </>
                    )}
                  </AppText>
                </View>
              )}
            </View>

            {/* Info Button */}
            <View className="absolute bottom-4 right-4 w-10 h-10 bg-gray-800/50 rounded-full items-center justify-center">
              <Ionicons name="information" size={24} color="white" />
            </View>
          </View>
        </View>

        {/* Lifestyle Tags Section */}
        <View className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-lg">
          <AppText className="text-gray-500 text-xs font-semibold mb-2 tracking-wider">
            YAŞAM TARZI
          </AppText>
          <View className="flex-row flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <View
                  key={index}
                  className="bg-gray-100 rounded-full px-3 py-1.5"
                >
                  <AppText className="text-gray-700 text-sm">{tag}</AppText>
                </View>
              ))
            ) : (
              <View className="bg-indigo-50 rounded-full px-3 py-1.5">
                <AppText className="text-indigo-600 text-sm">
                  <FontAwesome name="home" size={24} color="black" /> Ev
                  Arkadaşı Arıyor
                </AppText>
              </View>
            )}
          </View>

          {/* Bio Preview */}
          {card.bio && (
            <AppText
              className="text-gray-600 text-sm mt-3 leading-5"
              numberOfLines={2}
            >
              {card.bio}
            </AppText>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
