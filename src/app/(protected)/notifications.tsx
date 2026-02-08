import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { useAuthStore } from "@/stores/authStore";
import { useHouseStore } from "@/stores/houseStore";
import { useRequestStore } from "@/stores/requestStore";
import COLORS from "@/theme/color";
import { HouseRequestWithProfile } from "@/types/request.types";

export default function NotificationsScreen() {
  const { token } = useAuthStore();
  const { myHouse } = useHouseStore();
  const { houseRequests, fetchRequestsForHouse, isLoading } = useRequestStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (token && myHouse?.id) {
      fetchRequestsForHouse(myHouse.id, token);
    }
  }, [token, myHouse?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (token && myHouse?.id) {
      await fetchRequestsForHouse(myHouse.id, token);
    }
    setRefreshing(false);
  };

  // Zaman farkını hesapla
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} sa önce`;
    return `${diffDays} gün önce`;
  };

  // Pending istekleri filtrele
  const pendingRequests = houseRequests.filter((r) => r.status === "pending");

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const getAvatarUrl = (avatarUrl: string) => {
    if (avatarUrl) {
      return `${API_BASE_URL}/profiles/avatar/${avatarUrl}`;
    }
    return null;
  };

  const renderRequestItem = (request: HouseRequestWithProfile) => {
    const profile = request.profiles;
    const fullName = [profile?.full_name].filter(Boolean).join(" ") || "Anonim";

    return (
      <TouchableOpacity
        key={request.id}
        onPress={() => router.push(`/(protected)/request-detail/${request.id}`)}
        className="bg-card rounded-2xl p-4 mb-3 flex-row items-center"
      >
        {/* Avatar */}
        <View className="relative">
          <View className="w-14 h-14 rounded-full bg-quaternary overflow-hidden items-center justify-center">
            {profile?.avatar_url ? (
              <Image
                source={{ uri: getAvatarUrl(profile.avatar_url)! }}
                className="w-full h-full"
              />
            ) : (
              <Ionicons name="person" size={28} color={COLORS.tint} />
            )}
          </View>
          {/* Badge */}
          <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-tint rounded-full items-center justify-center border-2 border-card">
            <Ionicons name="home" size={12} color="white" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <AppText className="font-bold text-primary">{fullName}</AppText>
            <AppText className="text-secondary ml-1">
              eve katılmak istiyor
            </AppText>
          </View>
          <AppText className="text-tint font-medium">{myHouse?.title}</AppText>
          <AppText className="text-secondary text-sm">
            {getTimeAgo(request.created_at)}
          </AppText>
        </View>

        {/* Unread indicator */}
        <View className="w-3 h-3 bg-tint rounded-full" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between border-b border-quaternary">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <AppText className="text-2xl font-bold text-primary">
            Bildirimler
          </AppText>
        </View>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && !refreshing ? (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : pendingRequests.length === 0 ? (
          <View className="items-center py-12">
            <View className="w-24 h-24 bg-card rounded-full items-center justify-center mb-4">
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#6F7684"
              />
            </View>
            <AppText className="text-xl font-bold text-primary mb-2">
              Bildirim Yok
            </AppText>
            <AppText className="text-secondary text-center">
              Henüz bekleyen istek bulunmuyor.
            </AppText>
          </View>
        ) : (
          <>
            {/* Section Title */}
            <AppText className="text-sm text-secondary font-bold tracking-wider mb-3">
              EV İSTEKLERİ ({pendingRequests.length})
            </AppText>

            {/* Request Items */}
            {pendingRequests.map(renderRequestItem)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
