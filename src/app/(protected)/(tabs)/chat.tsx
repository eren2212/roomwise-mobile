import React, { useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { ConversationItem } from "@/components/chat";
import type { Conversation } from "@/types/chat.types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { AppText } from "@/components/AppText";
import COLORS from "@/theme/color";

/**
 * Konuşmalar Listesi Ekranı
 * WhatsApp/Messenger tarzı modern tasarım
 */
export default function ConversationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    conversations,
    isLoading,
    error,
    fetchConversations,
    clearError,
    subscribeToConversations,
    unsubscribeFromConversations,
  } = useChatStore();

  const [refreshing, setRefreshing] = React.useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Konuşmaları yükle ve realtime'a bağlan
  useEffect(() => {
    fetchConversations();

    // Realtime subscription başlat
    channelRef.current = subscribeToConversations();

    // Cleanup
    return () => {
      if (channelRef.current) {
        unsubscribeFromConversations(channelRef.current);
      }
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  // Konuşmaya git
  const handleConversationPress = (conversation: Conversation) => {
    router.push(`/chat/${conversation.id}`);
  };

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const getAvatarUrl = (avatarUrl: string) => {
    if (avatarUrl) {
      return `${API_BASE_URL}/profiles/avatar/${avatarUrl}`;
    }
    return null;
  };

  // Boş durum
  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-24 h-24 rounded-full bg-indigo-100 items-center justify-center mb-6">
        <Ionicons name="chatbubbles-outline" size={48} color="#6366f1" />
      </View>
      <Text className="text-xl font-bold text-gray-800 text-center mb-2">
        Henüz mesajınız yok
      </Text>
      <Text className="text-base text-gray-500 text-center mb-6">
        Eşleştiğiniz kişilerle sohbet etmeye başlayın!
      </Text>
      <TouchableOpacity
        className="bg-indigo-600 px-6 py-3 rounded-full"
        onPress={() => router.push("/")}
      >
        <Text className="text-white font-semibold">Keşfet</Text>
      </TouchableOpacity>
    </View>
  );

  // Hata durumu
  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-6">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
      </View>
      <Text className="text-xl font-bold text-gray-800 text-center mb-2">
        Bir hata oluştu
      </Text>
      <Text className="text-base text-gray-500 text-center mb-6">{error}</Text>
      <TouchableOpacity
        className="bg-indigo-600 px-6 py-3 rounded-full"
        onPress={() => {
          clearError();
          fetchConversations();
        }}
      >
        <Text className="text-white font-semibold">Tekrar Dene</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Content */}
      {isLoading && conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error && conversations.length === 0 ? (
        renderErrorState()
      ) : conversations.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="px-5 py-4 bg-white border-b border-gray-100">
              <AppText className="text-2xl font-bold text-gray-900">
                Mesajlar
              </AppText>
              <AppText className="text-sm text-gray-500 mt-1">
                {conversations.length} konuşma
              </AppText>
            </View>
          }
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              currentUserId={user?.id || ""}
              onPress={() => handleConversationPress(item)}
            />
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6366f1"]}
              tintColor="#6366f1"
            />
          }
          ItemSeparatorComponent={() => null}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
