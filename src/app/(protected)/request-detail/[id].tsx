import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { useAuthStore } from "@/stores/authStore";
import { useHouseStore } from "@/stores/houseStore";
import { useRequestStore } from "@/stores/requestStore";
import COLORS from "@/theme/color";

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuthStore();
  const { myHouse } = useHouseStore();
  const { selectedRequest, fetchRequestById, updateRequestStatus, isLoading } =
    useRequestStore();

  useEffect(() => {
    if (id && token) {
      fetchRequestById(id, token);
    }
  }, [id, token]);

  // Yaşı hesapla
  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Tarihi formatla
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Belirtilmedi";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // İstek durumunu güncelle
  const handleUpdateStatus = async (status: "verified" | "rejected") => {
    if (!id || !token) return;

    const action = status === "verified" ? "onaylamak" : "reddetmek";
    Alert.alert("Onayla", `Bu isteği ${action} istediğinize emin misiniz?`, [
      { text: "İptal", style: "cancel" },
      {
        text: status === "verified" ? "Onayla" : "Reddet",
        style: status === "rejected" ? "destructive" : "default",
        onPress: async () => {
          try {
            await updateRequestStatus(id, status, token);
            Alert.alert(
              "Başarılı",
              status === "verified"
                ? "İstek onaylandı. Kullanıcı artık ev arkadaşınız!"
                : "İstek reddedildi.",
              [{ text: "Tamam", onPress: () => router.back() }],
            );
          } catch (error: any) {
            Alert.alert("Hata", error.message || "İşlem başarısız");
          }
        },
      },
    ]);
  };

  if (isLoading || !selectedRequest) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const profile = selectedRequest.profiles;
  const fullName = [profile?.full_name].filter(Boolean).join(" ") || "Anonim";
  const age = calculateAge(profile?.birth_date);
  const isVerified = profile?.verification_status === "verified";
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return `${API_BASE_URL}/profiles/avatar/${profile.avatar_url}`;
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-center relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <AppText className="text-xl font-bold text-tint">
          Katılma İsteği
        </AppText>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Section */}
        <View className="items-center px-6 pt-4">
          {/* Avatar */}
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-4 border-tint/20 overflow-hidden bg-card items-center justify-center">
              {getAvatarUrl() ? (
                <Image
                  source={{ uri: getAvatarUrl()! }}
                  className="w-full h-full"
                />
              ) : (
                <Ionicons name="person" size={56} color={COLORS.tint} />
              )}
            </View>
            {/* Verification Badge */}
            {isVerified && (
              <View className="absolute bottom-1 right-1 w-8 h-8 bg-success rounded-full items-center justify-center border-2 border-background">
                <Ionicons name="checkmark" size={20} color="white" />
              </View>
            )}
          </View>

          {/* Name */}
          <AppText className="text-2xl font-bold text-primary mt-4">
            {fullName}
          </AppText>

          {/* Info Line */}
          <View className="flex-row items-center mt-2">
            {profile?.occupation && (
              <>
                <Ionicons name="briefcase-outline" size={16} color="#6F7684" />
                <AppText className="text-secondary ml-1">
                  {profile.occupation}
                </AppText>
              </>
            )}
            {age && (
              <AppText className="text-secondary ml-2">• {age} yaşında</AppText>
            )}
            {profile?.gender && (
              <AppText className="text-secondary ml-2">
                • {profile.gender === "male" ? "Erkek" : "Kadın"}
              </AppText>
            )}
          </View>

          {/* Wants to join */}
          <AppText className="text-secondary mt-2">
            katılmak istiyor:{" "}
            <AppText className="text-primary font-bold">
              {myHouse?.title}
            </AppText>
          </AppText>
        </View>

        {/* Message Box */}
        {selectedRequest.message && (
          <View className="mx-6 mt-6 bg-card rounded-2xl p-5 relative">
            <View className="absolute -top-2 right-4">
              <Ionicons name="chatbox" size={24} color={COLORS.tint} />
            </View>
            <AppText className="text-primary italic leading-6">
              "{selectedRequest.message}"
            </AppText>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-quaternary px-4 py-4 pb-8 flex-row items-center">
        {/* Message Button */}
        <TouchableOpacity className="w-14 h-14 bg-card rounded-2xl items-center justify-center border border-quaternary mr-3">
          <Ionicons
            name="chatbubble-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {/* Decline Button */}
        <TouchableOpacity
          onPress={() => handleUpdateStatus("rejected")}
          className="flex-1 bg-error/10 rounded-2xl py-4 flex-row items-center justify-center mr-3"
        >
          <Ionicons name="close" size={20} color="#FF3B30" />
          <AppText className="text-error font-bold ml-2">Reddet</AppText>
        </TouchableOpacity>

        {/* Accept Button */}
        <TouchableOpacity
          onPress={() => handleUpdateStatus("verified")}
          className="flex-1 bg-success rounded-2xl py-4 flex-row items-center justify-center"
        >
          <Ionicons name="checkmark" size={20} color="white" />
          <AppText className="text-white font-bold ml-2">Onayla</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
