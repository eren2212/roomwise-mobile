import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { MessageBubble } from "@/components/chat";
import type { Message, ConversationParticipant } from "@/types/chat.types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { AppText } from "@/components/AppText";
import { Input } from "@/components/Input";
import COLORS from "@/theme/color";

/**
 * Chat Ekranı
 * WhatsApp/Messenger tarzı modern tasarım
 * Realtime mesaj alımı ile
 */
export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    messages,
    conversations,
    isLoading,
    fetchMessages,
    sendMessage,
    markAsRead,
    subscribeToMessages,
    unsubscribeFromMessages,
    setActiveConversation,
  } = useChatStore();

  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Konuşma bilgisini bul
  const conversation = conversations.find((c) => c.id === conversationId);

  // Karşı tarafın profilini bul
  const otherParticipant = conversation?.conversation_participants.find(
    (p: ConversationParticipant) => p.user_id !== user?.id,
  );

  // Mesajları yükle ve realtime'a bağlan
  useEffect(() => {
    if (!conversationId) return;

    setActiveConversation(conversationId);
    fetchMessages(conversationId);
    markAsRead(conversationId);

    // Realtime subscription
    channelRef.current = subscribeToMessages(conversationId);

    return () => {
      if (channelRef.current) {
        unsubscribeFromMessages(channelRef.current);
      }
      setActiveConversation(null);
    };
  }, [conversationId]);

  // Mesaj gönder
  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !conversationId || isSending) return;

    const messageContent = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      await sendMessage(conversationId, messageContent, "text");
    } catch (error) {
      console.error("Mesaj gönderilemedi:", error);
      setInputText(messageContent); // Hata durumunda geri yükle
    } finally {
      setIsSending(false);
    }
  }, [inputText, conversationId, sendMessage, isSending]);

  // Mesaj render
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.sender_id === user?.id;
    const showAvatar =
      !isOwn &&
      (index === messages.length - 1 ||
        messages[index + 1]?.sender_id !== item.sender_id);

    return (
      <MessageBubble message={item} isOwn={isOwn} showAvatar={showAvatar} />
    );
  };

  const displayName =
    conversation?.type === "group"
      ? "Grup Sohbeti"
      : otherParticipant?.profiles?.full_name || "Sohbet";
  const avatarUrl = otherParticipant?.profiles?.avatar_url;
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const getAvatarUrl = () => {
    if (avatarUrl) {
      return `${API_BASE_URL}/profiles/avatar/${avatarUrl}`;
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center flex-1 ml-2">
          {avatarUrl && displayName !== "Grup Sohbeti" ? (
            <Image
              source={{ uri: getAvatarUrl()! }}
              className="w-10 h-10 rounded-full bg-gray-200"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-gradient-to-br bg-secondary items-center justify-center">
              <AppText className="text-white font-bold">
                {displayName.charAt(0).toUpperCase()}
              </AppText>
            </View>
          )}
          <View className="ml-3">
            <AppText className="text-base font-semibold text-gray-900">
              {displayName}
            </AppText>
            <AppText className="text-xs text-green-500">Çevrimiçi</AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Messages + Input */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {isLoading && messages.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            inverted
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <View className="w-20 h-20 rounded-full bg-indigo-100 items-center justify-center mb-4">
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={40}
                    color="#6366f1"
                  />
                </View>
                <AppText className="text-gray-500 text-center">
                  Henüz mesaj yok{"\n"}İlk mesajı siz gönderin!
                </AppText>
              </View>
            }
          />
        )}

        {/* Input */}
        <View className="flex-row  px-4 py-3 bg-white border-t border-gray-100 justify-center items-center">
          {/* Attachment */}
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="add-circle-outline" size={28} color="#6366f1" />
          </TouchableOpacity>

          {/* Text Input */}
          <View className="flex-1 mx-2 rounded-3xl px-4 py-2 min-h-[44px] max-h-[120px]">
            <Input
              value={inputText}
              onChangeText={setInputText}
              placeholder="Mesaj yazın..."
              placeholderTextColor="#9ca3af"
              multiline
              className="text-base text-gray-800"
              style={{ maxHeight: 100 }}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              inputText.trim() && !isSending ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
