import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../AppText";

interface AmenityChipProps {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function AmenityChip({
  id,
  label,
  icon,
  selected,
  onToggle,
}: AmenityChipProps) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(id)}
      className={`flex-row items-center px-4 py-2 rounded-full mr-2 mb-2 ${
        selected ? "bg-tint" : "bg-card border-2 border-quaternary"
      }`}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={16}
        color={selected ? "#FFFFFF" : "#5E43F3"}
        style={{ marginRight: 6 }}
      />
      <AppText
        className={`text-sm ${selected ? "text-white font-bold" : "text-primary"}`}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

// Kural chip'i (aynı görünüm, farklı renk)
export function RuleChip({
  id,
  label,
  icon,
  selected,
  onToggle,
}: AmenityChipProps) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(id)}
      className={`flex-row items-center px-4 py-2 rounded-full mr-2 mb-2 ${
        selected ? "bg-error" : "bg-card border-2 border-quaternary"
      }`}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={16}
        color={selected ? "#FFFFFF" : "#FF3B30"}
        style={{ marginRight: 6 }}
      />
      <AppText
        className={`text-sm ${selected ? "text-white font-bold" : "text-primary"}`}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
