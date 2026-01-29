import React from "react";
import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SwipeCard from "./SwipeCard";
import { PotentialMatch, SwipeAction } from "../../types/matching.types";
import COLORS from "@/theme/color";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SwipeCardStackProps {
  cards: PotentialMatch[];
  onSwipe: (userId: string, action: SwipeAction) => void;
  isLoading: boolean;
}

export default function SwipeCardStack({
  cards,
  onSwipe,
  isLoading,
}: SwipeCardStackProps) {
  console.log(
    "🎴 [STACK] Rendering - cards count:",
    cards?.length || 0,
    ", isLoading:",
    isLoading,
  );
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-6xl mb-4 p-1">🏠</Text>
        <Text className="text-2xl font-bold text-gray-800 text-center">
          Şimdilik bu kadar!
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Seçtiğin bölgede şu an için başka ev arkadaşı adayı yok. Daha sonra
          tekrar kontrol et veya farklı bir konum dene.
        </Text>
      </View>
    );
  }

  const handleSwipe = (userId: string, action: SwipeAction) => {
    onSwipe(userId, action);
  };

  return (
    <GestureHandlerRootView className="flex-1 mt-8 ">
      <View
        className="flex-1 items-center justify-start"
        style={{ minHeight: SCREEN_HEIGHT * 0.65 }}
      >
        {/* Render cards in reverse order so first card is on top */}
        {cards
          .slice(0, 3)
          .reverse()
          .map((card, index, arr) => {
            const isFirst = index === arr.length - 1;
            const scale = 1 - (arr.length - 1 - index) * 0.05;
            const translateY = (arr.length - 1 - index) * 10;

            return (
              <View
                key={card.id}
                style={{
                  position: "absolute",
                  width: "100%",
                  transform: [{ scale }, { translateY }],
                  opacity: isFirst ? 1 : 0.9,
                }}
              >
                <SwipeCard
                  card={card}
                  onSwipe={(action) => handleSwipe(card.id, action)}
                  isFirst={isFirst}
                />
              </View>
            );
          })}
      </View>
    </GestureHandlerRootView>
  );
}
