import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { ImageCarousel } from "@/components/house";
import { useHouseStore } from "@/stores/houseStore";
import { useAuthStore } from "@/stores/authStore";
import houseService from "@/services/house.service";
import { HOUSE_RULES, AMENITIES } from "@/types/house.types";
import COLORS from "@/theme/color";

export default function HouseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, user } = useAuthStore();
  const { selectedHouse, fetchHouseById, isLoading } = useHouseStore();

  useEffect(() => {
    if (id) {
      fetchHouseById(id);
    }
  }, [id]);

  if (isLoading || !selectedHouse) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const imageUrls = houseService.getAllImageUrls(selectedHouse);
  const isOwner = user?.id === selectedHouse.owner_id;

  // Kural ve olanak bilgilerini al
  const getRuleInfo = (ruleId: string) =>
    HOUSE_RULES.find((r) => r.id === ruleId);
  const getAmenityInfo = (amenityId: string) =>
    AMENITIES.find((a) => a.id === amenityId);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header - Üst kısım (resim üzerinde) */}
        <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-row">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/30 items-center justify-center mr-2">
              <Ionicons name="share-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/30 items-center justify-center">
              <Ionicons name="heart-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resim Carousel */}
        <ImageCarousel
          images={imageUrls}
          height={320}
          showPrice
          price={selectedHouse.rent_amount}
        />

        {/* Content */}
        <View className="px-4 pt-4 pb-6 bg-background rounded-t-3xl -mt-6">
          {/* Başlık ve Match */}
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <AppText className="text-2xl font-bold text-primary">
                {selectedHouse.title}
              </AppText>
              <View className="flex-row items-center mt-1">
                <Ionicons name="location" size={16} color="#6F7684" />
                <AppText className="text-secondary ml-1">
                  {selectedHouse.city}
                  {selectedHouse.address && `, ${selectedHouse.address}`}
                </AppText>
              </View>
            </View>
            {!isOwner && (
              <View className="bg-success/20 px-3 py-2 rounded-full flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#00C853" />
                <AppText className="text-success font-bold ml-1">
                  %94 Eşleşme
                </AppText>
              </View>
            )}
          </View>

          {/* Info Cards */}
          <View className="flex-row mt-6 justify-between">
            <View className="flex-1 bg-card rounded-2xl p-4 items-center mr-2">
              <Ionicons name="resize-outline" size={28} color="#5E43F3" />
              <AppText className="text-primary font-bold mt-2">
                {selectedHouse.max_occupancy || 3} Kişilik
              </AppText>
            </View>
            <View className="flex-1 bg-card rounded-2xl p-4 items-center mx-2">
              <Ionicons name="people-outline" size={28} color="#5E43F3" />
              <AppText className="text-primary font-bold mt-2">
                {selectedHouse.max_occupancy} Kişi
              </AppText>
            </View>
            <View className="flex-1 bg-card rounded-2xl p-4 items-center ml-2">
              <Ionicons name="home-outline" size={28} color="#5E43F3" />
              <AppText className="text-primary font-bold mt-2">
                Paylaşımlı
              </AppText>
            </View>
          </View>

          {/* Ev Kuralları */}
          {selectedHouse.rules && selectedHouse.rules.length > 0 && (
            <View className="mt-6">
              <View className="flex-row justify-between items-center mb-3">
                <AppText className="text-lg font-bold text-primary">
                  Ev Kuralları
                </AppText>
                <TouchableOpacity>
                  <AppText className="text-tint">Tümünü Gör</AppText>
                </TouchableOpacity>
              </View>
              <View className="flex-row">
                {selectedHouse.rules.slice(0, 4).map((ruleId, index) => {
                  const rule = getRuleInfo(ruleId);
                  if (!rule) return null;
                  return (
                    <View key={index} className="items-center mr-6">
                      <View className="w-14 h-14 bg-card rounded-2xl items-center justify-center">
                        <Ionicons
                          name={rule.icon as any}
                          size={24}
                          color="#FF3B30"
                        />
                      </View>
                      <AppText className="text-xs text-secondary mt-2 text-center">
                        {rule.label}
                      </AppText>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Olanaklar */}
          {selectedHouse.amenities && selectedHouse.amenities.length > 0 && (
            <View className="mt-6">
              <AppText className="text-lg font-bold text-primary mb-3">
                Olanaklar
              </AppText>
              <View className="flex-row flex-wrap">
                {selectedHouse.amenities.map((amenityId, index) => {
                  const amenity = getAmenityInfo(amenityId);
                  if (!amenity) return null;
                  return (
                    <View
                      key={index}
                      className="flex-row items-center bg-card px-3 py-2 rounded-full mr-2 mb-2"
                    >
                      <Ionicons
                        name={amenity.icon as any}
                        size={16}
                        color="#5E43F3"
                      />
                      <AppText className="text-primary text-sm ml-2">
                        {amenity.label}
                      </AppText>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Açıklama */}
          {selectedHouse.description && (
            <View className="mt-6">
              <AppText className="text-lg font-bold text-primary mb-2">
                Yer Hakkında
              </AppText>
              <AppText className="text-secondary leading-6">
                {selectedHouse.description}
              </AppText>
            </View>
          )}

          {/* Fiyat Bilgisi */}
          <View className="mt-6 bg-card rounded-2xl p-4">
            <View className="flex-row justify-between items-center">
              <AppText className="text-secondary">Aylık Kira</AppText>
              <AppText className="text-xl font-bold text-tint">
                ₺{selectedHouse.rent_amount.toLocaleString()}
              </AppText>
            </View>
            {selectedHouse.deposit_amount && (
              <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-quaternary">
                <AppText className="text-secondary">Depozito</AppText>
                <AppText className="text-primary font-bold">
                  ₺{selectedHouse.deposit_amount.toLocaleString()}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      {!isOwner && (
        <View className="px-4 py-4 border-t border-quaternary bg-background">
          <Button
            title="İletişime Geç"
            onPress={() => {
              // TODO: Chat başlatma işlemi
            }}
            icon="send"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
