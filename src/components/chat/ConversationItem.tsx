import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type {
  Conversation,
  ConversationParticipant,
} from "../../types/chat.types";
import { AppText } from "../AppText";

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
  onPress: () => void;
}

/**
 * Konuşma listesi item komponenti
 * WhatsApp/Messenger tarzı modern tasarım
 */
export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
  onPress,
}) => {
  // Karşı tarafın profilini bul (direct konuşmalarda)
  const otherParticipant = conversation.conversation_participants.find(
    (p: ConversationParticipant) => p.user_id !== currentUserId,
  );

  // Kullanıcının son okuma zamanı
  const currentUserParticipant = conversation.conversation_participants.find(
    (p: ConversationParticipant) => p.user_id === currentUserId,
  );

  // Okunmamış mesaj var mı?
  const hasUnread =
    conversation.last_message_at &&
    currentUserParticipant?.last_read_at &&
    new Date(conversation.last_message_at) >
      new Date(currentUserParticipant.last_read_at) &&
    conversation.last_message_sender_id !== currentUserId;

  // Son mesaj zamanını formatla
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Dün";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("tr-TR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const displayName =
    conversation.type === "group"
      ? "Grup Sohbeti"
      : otherParticipant?.profiles?.full_name || "Bilinmeyen Kullanıcı";

  const avatarUrl = otherParticipant?.profiles?.avatar_url;

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const getAvatarUrl = () => {
    if (avatarUrl) {
      return `${API_BASE_URL}/profiles/avatar/${avatarUrl}`;
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
    >
      {/* Avatar */}
      <View className="relative">
        {avatarUrl && displayName !== "Grup Sohbeti" ? (
          <Image
            source={{ uri: getAvatarUrl()! }}
            className="w-14 h-14 rounded-full bg-gray-200"
          />
        ) : (
          <View className="w-14 h-14 rounded-full bg-gradient-to-br bg-secondary items-center justify-center">
            <Text className="text-white text-xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {/* Online indicator (placeholder) */}
        <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </View>

      {/* İçerik */}
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center">
          <AppText
            className={`text-base ${hasUnread ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}
            numberOfLines={1}
          >
            {displayName}
          </AppText>
          <AppText
            className={`text-xs ${hasUnread ? "text-indigo-600 font-semibold" : "text-gray-500"}`}
          >
            {formatTime(conversation.last_message_at)}
          </AppText>
        </View>

        <View className="flex-row justify-between items-center mt-1">
          <View className="flex-row items-center flex-1 mr-2">
            {/* Gönderen kendimiz mi? */}
            {conversation.last_message_sender_id === currentUserId && (
              <Ionicons
                name="checkmark-done"
                size={16}
                color={hasUnread ? "#6366f1" : "#9ca3af"}
                style={{ marginRight: 4 }}
              />
            )}
            <AppText
              className={`text-sm ${hasUnread ? "text-gray-800 font-medium" : "text-gray-500"}`}
              numberOfLines={1}
            >
              {conversation.last_message_content || "Henüz mesaj yok"}
            </AppText>
          </View>

          {/* Okunmamış badge */}
          {hasUnread && (
            <View className="min-w-[20px] h-5 px-1.5 bg-indigo-600 rounded-full items-center justify-center">
              <AppText className="text-white text-xs font-bold">1</AppText>
            </View>
          )}
        </View>
      </View>

      {/* Sağ ok */}
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );
};

export default ConversationItem;
