import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { HouseCard } from "@/components/house";
import { useAuthStore } from "@/stores/authStore";
import { useHouseStore } from "@/stores/houseStore";
import { House } from "@/types/house.types";
import COLORS from "@/theme/color";

export default function SearchScreen() {
  const { token } = useAuthStore();
  const { houses, fetchHouses, isLoading, myHouse, fetchMyHouse } =
    useHouseStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      fetchHouses(token);
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (token) {
      await fetchHouses(token);
    }
    setRefreshing(false);
  };

  const toggleFavorite = (houseId: string) => {
    setFavorites((prev) =>
      prev.includes(houseId)
        ? prev.filter((id) => id !== houseId)
        : [...prev, houseId],
    );
  };

  // Filtreleme - kendi evini çıkar ve arama yap
  const filteredHouses = houses.filter((house) => {
    // Kendi evini gösterme
    if (myHouse && house.id === myHouse.id) return false;

    // Arama filtresi
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        house.title.toLowerCase().includes(query) ||
        house.city.toLowerCase().includes(query) ||
        (house.description && house.description.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const navigateToDetail = (house: House) => {
    router.push(`/(protected)/house/${house.id}`);
  };

  const renderHouseItem = ({ item }: { item: House }) => (
    <HouseCard
      house={item}
      onPress={() => navigateToDetail(item)}
      onFavorite={() => toggleFavorite(item.id)}
      isFavorite={favorites.includes(item.id)}
    />
  );

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="search-outline" size={64} color="#12121E4D" />
      <AppText className="text-secondary mt-4 text-center">
        {searchQuery
          ? "Aramanızla eşleşen ev bulunamadı"
          : "Henüz yayınlanmış ev ilanı yok"}
      </AppText>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Search Header */}
      <View className="px-4 pt-2 pb-4">
        {/* Search Input */}
        <View className="flex-row items-center bg-card border-2 border-quaternary rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#5E43F3" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Konum veya isim ara..."
            placeholderTextColor="#12121E4D"
            className="flex-1 ml-3 text-primary font-ozel"
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={22} color="#12121E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Header */}
      <View className="flex-row justify-between items-center px-4 mb-3">
        <AppText className="text-xs font-bold text-secondary tracking-widest">
          EN İYİ EŞLEŞMELERİN
        </AppText>
        <TouchableOpacity>
          <AppText className="text-tint font-bold">Tümünü Gör</AppText>
        </TouchableOpacity>
      </View>

      {/* Houses List */}
      <FlatList
        data={filteredHouses}
        keyExtractor={(item) => item.id}
        renderItem={renderHouseItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
