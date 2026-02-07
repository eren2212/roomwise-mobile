import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/stores/authStore";
import { useHouseStore } from "@/stores/houseStore";
import { useRequestStore } from "@/stores/requestStore";

// Mock data - Split Bills
const MOCK_BILLS = [
  {
    id: "1",
    name: "Elektrik",
    dueIn: 2,
    amount: 450,
    paid: false,
    icon: "flash",
  },
  {
    id: "2",
    name: "İnternet",
    paidBy: "Ahmet",
    amount: 280,
    paid: true,
    icon: "wifi",
  },
];

// Mock data - Roommates
const MOCK_ROOMMATES = [
  { id: "1", name: "Sen", avatar: null, isYou: true },
  { id: "2", name: "Can", avatar: null },
];

export default function HomeScreen() {
  const { token } = useAuthStore();
  const { myHouse, fetchMyHouse, isLoading } = useHouseStore();
  const { pendingCount, fetchPendingCount } = useRequestStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchMyHouse(token);
      fetchPendingCount(token);
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (token) {
      await Promise.all([fetchMyHouse(token), fetchPendingCount(token)]);
    }
    setRefreshing(false);
  };

  // Ev yoksa - İlan oluştur ekranı
  if (!myHouse && !isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-32 h-32 bg-tint/10 rounded-full items-center justify-center mb-6">
            <Ionicons name="home-outline" size={64} color="#5E43F3" />
          </View>
          <AppText className="text-2xl font-bold text-primary text-center mb-2">
            Henüz Bir Eviniz Yok
          </AppText>
          <AppText className="text-secondary text-center mb-8">
            Ev arkadaşı bulmak için önce evinizi yayınlayın veya mevcut bir eve
            katılın.
          </AppText>
          <Button
            title="İlan Oluştur"
            onPress={() => router.push("/(protected)/house/create-house")}
            icon="add-circle-outline"
          />
          <TouchableOpacity className="mt-4">
            <AppText className="text-tint font-bold">
              Mevcut Evleri Keşfet →
            </AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Ev varsa - Dashboard
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-2 pb-4 flex-row justify-between items-start">
          <View>
            <AppText className="text-3xl font-black text-tint">Evim</AppText>
            <AppText className="text-secondary">Ev Yönetim Paneli</AppText>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/(protected)/house/edit-house")}
              className="w-10 h-10 bg-card rounded-full items-center justify-center mr-2"
            >
              <Ionicons name="settings-outline" size={22} color="#12121E" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(protected)/notifications")}
              className="w-10 h-10 bg-card rounded-full items-center justify-center relative"
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#12121E"
              />
              {/* Badge */}
              {pendingCount > 0 && (
                <View className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-error rounded-full items-center justify-center px-1">
                  <AppText className="text-white text-xs font-bold">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* House Health Score */}
        <View className="mx-4 bg-card rounded-3xl p-6 shadow-sm">
          <AppText className="text-center text-secondary font-bold tracking-widest text-xs">
            EV SAĞLIK PUANI
          </AppText>
          <View className="items-center mt-4">
            <View className="w-36 h-36 rounded-full border-8 border-success/20 items-center justify-center">
              <View className="w-28 h-28 rounded-full border-8 border-success items-center justify-center">
                <AppText className="text-5xl font-black text-success">
                  8.5
                </AppText>
                <AppText className="text-secondary">/10</AppText>
              </View>
            </View>
          </View>
          <AppText className="text-center text-secondary mt-4">
            Harikasın! Ev işlerini düzenli yapıyorsun.
          </AppText>
        </View>

        {/* Split Bills */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center mb-3">
            <AppText className="text-lg font-bold text-primary">
              Fatura Paylaşımı
            </AppText>
            <TouchableOpacity>
              <AppText className="text-tint font-bold">Tümü</AppText>
            </TouchableOpacity>
          </View>

          {MOCK_BILLS.map((bill) => (
            <View
              key={bill.id}
              className="bg-card rounded-2xl p-4 mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    bill.paid ? "bg-success/20" : "bg-error/20"
                  }`}
                >
                  <Ionicons
                    name={bill.icon as any}
                    size={24}
                    color={bill.paid ? "#00C853" : "#FF3B30"}
                  />
                </View>
                <View className="ml-3">
                  <AppText className="font-bold text-primary">
                    {bill.name}
                  </AppText>
                  <AppText className="text-sm text-secondary">
                    {bill.paid
                      ? `${bill.paidBy} tarafından ödendi`
                      : `${bill.dueIn} gün içinde`}
                  </AppText>
                </View>
              </View>
              <View className="items-end">
                <AppText className="font-bold text-primary">
                  ₺{bill.amount}
                </AppText>
                <AppText
                  className={`text-sm font-bold ${
                    bill.paid ? "text-success" : "text-error"
                  }`}
                >
                  {bill.paid ? "Ödendi ✓" : "Ödenmedi"}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Roommates */}
        <View className="mt-4 px-4 pb-8">
          <AppText className="text-lg font-bold text-primary mb-3">
            Ev Arkadaşları
          </AppText>
          <View className="flex-row">
            {MOCK_ROOMMATES.map((roommate) => (
              <View key={roommate.id} className="items-center mr-4">
                <View
                  className={`w-14 h-14 rounded-full items-center justify-center ${
                    roommate.isYou
                      ? "bg-tint"
                      : "bg-card border-2 border-quaternary"
                  }`}
                >
                  <Ionicons
                    name="person"
                    size={24}
                    color={roommate.isYou ? "#FFFFFF" : "#5E43F3"}
                  />
                </View>
                <AppText className="text-sm text-secondary mt-1">
                  {roommate.name}
                </AppText>
              </View>
            ))}
            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full border-2 border-dashed border-quaternary items-center justify-center">
                <Ionicons name="add" size={24} color="#12121E4D" />
              </View>
              <AppText className="text-sm text-tertiary mt-1">Davet</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Add Expense Button */}
        <View className="absolute bottom-24 right-4">
          <TouchableOpacity className="bg-[#FF6B6B] px-4 py-3 rounded-full flex-row items-center shadow-lg">
            <Ionicons name="add" size={20} color="white" />
            <AppText className="text-white font-bold ml-2">
              Hızlı Masraf
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
