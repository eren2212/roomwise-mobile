import React from "react";
import { View, Text, Image } from "react-native";
import type { Message } from "../../types/chat.types";
import { AppText } from "../AppText";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

/**
 * Mesaj balonu komponenti
 * WhatsApp/Messenger tarzı modern tasarım
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = false,
}) => {
  // Zamanı formatla
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const getAvatarUrl = () => {
    if (message.profiles?.avatar_url) {
      return `${API_BASE_URL}/profiles/avatar/${message.profiles.avatar_url}`;
    }
    return null;
  };

  return (
    <View
      className={`flex-row mb-2 px-4 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {/* Sol taraf avatar (gelen mesajlar için) */}
      {!isOwn && showAvatar && (
        <View className="mr-2">
          {message.profiles?.avatar_url ? (
            <Image
              source={{ uri: getAvatarUrl()! }}
              className="w-8 h-8 rounded-full bg-gray-200"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 items-center justify-center">
              <AppText className="text-white text-xs font-bold">
                {message.profiles?.full_name?.charAt(0).toUpperCase() || "?"}
              </AppText>
            </View>
          )}
        </View>
      )}

      {/* Mesaj balonu */}
      <View
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isOwn
            ? "bg-indigo-600 rounded-br-md"
            : "bg-white border border-gray-100 rounded-bl-md shadow-sm"
        }`}
      >
        {/* Gönderen ismi (grup sohbetlerinde) */}
        {!isOwn && message.profiles?.full_name && (
          <AppText className="text-xs font-semibold text-indigo-600 mb-1">
            {message.profiles.full_name}
          </AppText>
        )}

        {/* Mesaj içeriği */}
        {message.message_type === "text" && (
          <AppText
            className={`text-base ${isOwn ? "text-white" : "text-gray-800"}`}
          >
            {message.content}
          </AppText>
        )}

        {message.message_type === "image" && (
          <View className="rounded-xl overflow-hidden">
            <Image
              source={{ uri: message.content || "" }}
              className="w-48 h-48"
              resizeMode="cover"
            />
          </View>
        )}

        {message.message_type === "location" && (
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-2">
              <AppText>📍</AppText>
            </View>
            <AppText
              className={`text-sm ${isOwn ? "text-white" : "text-gray-600"}`}
            >
              Konum paylaşıldı
            </AppText>
          </View>
        )}

        {message.message_type === "system" && (
          <AppText className="text-sm text-gray-500 italic text-center">
            {message.content}
          </AppText>
        )}

        {/* Zaman */}
        <View
          className={`flex-row items-center mt-1 ${isOwn ? "justify-end" : "justify-start"}`}
        >
          <Text
            className={`text-[10px] ${isOwn ? "text-indigo-200" : "text-gray-400"}`}
          >
            {formatTime(message.created_at)}
          </Text>
          {/* Okundu tikki (kendi mesajlarımız için) */}
          {isOwn && <Text className="text-indigo-200 text-xs ml-1">✓✓</Text>}
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
