import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { SwipeAction } from "../../types/matching.types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface ActionButtonsProps {
  onDislike: () => void;
  onSuperLike: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export default function ActionButtons({
  onDislike,
  onSuperLike,
  onLike,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <View className="flex-row items-center justify-center gap-4 py-4">
      {/* Dislike Button */}
      <TouchableOpacity
        onPress={onDislike}
        disabled={disabled}
        className={`w-16 h-16 rounded-full bg-white shadow-lg items-center justify-center border-2 border-red-100 ${disabled ? "opacity-50" : ""}`}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="close" size={24} color="black" />
      </TouchableOpacity>

      {/* Super Like / Quick Connect Button */}
      <TouchableOpacity
        onPress={onSuperLike}
        disabled={disabled}
        className={`w-20 h-20 rounded-full bg-indigo-600 shadow-xl items-center justify-center ${disabled ? "opacity-50" : ""}`}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="lightning-bolt-outline"
          size={24}
          color="orange"
        />
        <Text className="text-white text-xs font-semibold mt-0.5">Hızlı</Text>
      </TouchableOpacity>

      {/* Like Button */}
      <TouchableOpacity
        onPress={onLike}
        disabled={disabled}
        className={`w-16 h-16 rounded-full bg-white shadow-lg items-center justify-center border-2 border-indigo-100 ${disabled ? "opacity-50" : ""}`}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="heart" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}
