import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { AmenityChip, RuleChip } from "@/components/house";
import { useAuthStore } from "@/stores/authStore";
import { useHouseStore } from "@/stores/houseStore";
import {
  UpdateHouseDto,
  GenderPreference,
  HOUSE_RULES,
  AMENITIES,
  GENDER_OPTIONS,
} from "@/types/house.types";
import COLORS from "@/theme/color";

export default function EditHouseScreen() {
  const { token } = useAuthStore();
  const { myHouse, updateHouse, deleteHouse, isLoading, fetchMyHouse } =
    useHouseStore();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [maxOccupancy, setMaxOccupancy] = useState("3");
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [genderPreference, setGenderPreference] = useState<GenderPreference>(
    GenderPreference.PREFER_NOT_TO_SAY,
  );

  // Mevcut verileri yükle
  useEffect(() => {
    if (myHouse) {
      setTitle(myHouse.title);
      setDescription(myHouse.description || "");
      setAddress(myHouse.address || "");
      setCity(myHouse.city || "");
      setRentAmount(String(myHouse.rent_amount));
      setDepositAmount(
        myHouse.deposit_amount ? String(myHouse.deposit_amount) : "",
      );
      setMaxOccupancy(String(myHouse.max_occupancy || 3));
      setSelectedRules(myHouse.rules || []);
      setSelectedAmenities(myHouse.amenities || []);
      setGenderPreference(
        myHouse.gender_preference || GenderPreference.PREFER_NOT_TO_SAY,
      );
    }
  }, [myHouse]);

  const toggleRule = (id: string) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleUpdate = async () => {
    if (!myHouse) return;

    if (!title.trim()) {
      Alert.alert("Hata", "İlan başlığı zorunludur");
      return;
    }

    if (!rentAmount || Number(rentAmount) <= 0) {
      Alert.alert("Hata", "Geçerli bir kira tutarı girin");
      return;
    }

    const data: UpdateHouseDto = {
      title: title.trim(),
      description: description.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim(),
      rent_amount: Number(rentAmount),
      deposit_amount: depositAmount ? Number(depositAmount) : undefined,
      max_occupancy: Number(maxOccupancy) || 3,
      rules: selectedRules.length > 0 ? selectedRules : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      gender_preference: genderPreference,
    };

    try {
      await updateHouse(myHouse.id, data, token!);
      Alert.alert("Başarılı", "Ev ilanınız güncellendi!", [
        { text: "Tamam", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Hata", error.message || "İlan güncellenemedi");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "İlanı Sil",
      "Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            if (!myHouse) return;
            try {
              await deleteHouse(myHouse.id, token!);
              Alert.alert("Başarılı", "Ev ilanınız silindi", [
                { text: "Tamam", onPress: () => router.back() },
              ]);
            } catch (error: any) {
              Alert.alert("Hata", error.message || "İlan silinemedi");
            }
          },
        },
      ],
    );
  };

  if (!myHouse) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-quaternary">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#12121E" />
          </TouchableOpacity>
          <AppText className="text-xl font-bold text-primary ml-4">
            İlanı Düzenle
          </AppText>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Başlık */}
        <View className="mt-4">
          <AppText className="text-base font-bold text-primary mb-2">
            İlan Başlığı *
          </AppText>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Örn: Merkeze Yakın 2+1 Daire"
            placeholderTextColor="#12121E4D"
            className="bg-card border-2 border-quaternary rounded-2xl px-4 py-3 text-primary font-ozel"
          />
        </View>

        {/* Açıklama */}
        <View className="mt-4">
          <AppText className="text-base font-bold text-primary mb-2">
            Açıklama
          </AppText>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Eviniz hakkında detaylı bilgi verin"
            placeholderTextColor="#12121E4D"
            multiline
            numberOfLines={4}
            className="bg-card border-2 border-quaternary rounded-2xl px-4 py-3 text-primary font-ozel min-h-[100px]"
            textAlignVertical="top"
          />
        </View>

        {/* Fiyat */}
        <View className="mt-4 flex-row">
          <View className="flex-1 mr-2">
            <AppText className="text-base font-bold text-primary mb-2">
              Aylık Kira *
            </AppText>
            <View className="flex-row items-center bg-card border-2 border-quaternary rounded-2xl px-4 py-3">
              <AppText className="text-tint font-bold mr-2">₺</AppText>
              <TextInput
                value={rentAmount}
                onChangeText={setRentAmount}
                placeholder="0"
                placeholderTextColor="#12121E4D"
                keyboardType="numeric"
                className="flex-1 text-primary font-ozel"
              />
              <AppText className="text-secondary">/ay</AppText>
            </View>
          </View>
          <View className="flex-1 ml-2">
            <AppText className="text-base font-bold text-primary mb-2">
              Depozito
            </AppText>
            <View className="flex-row items-center bg-card border-2 border-quaternary rounded-2xl px-4 py-3">
              <AppText className="text-tint font-bold mr-2">₺</AppText>
              <TextInput
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder="0"
                placeholderTextColor="#12121E4D"
                keyboardType="numeric"
                className="flex-1 text-primary font-ozel"
              />
            </View>
          </View>
        </View>

        {/* Adres */}
        <View className="mt-4">
          <AppText className="text-base font-bold text-primary mb-2">
            Adres
          </AppText>
          <View className="flex-row items-center bg-card border-2 border-quaternary rounded-2xl px-4 py-3">
            <Ionicons name="location" size={20} color="#5E43F3" />
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Mahalle, cadde, numara..."
              placeholderTextColor="#12121E4D"
              className="flex-1 ml-2 text-primary font-ozel"
            />
          </View>
        </View>

        {/* Şehir */}
        <View className="mt-4">
          <AppText className="text-base font-bold text-primary mb-2">
            Şehir
          </AppText>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Şehir"
            placeholderTextColor="#12121E4D"
            className="bg-card border-2 border-quaternary rounded-2xl px-4 py-3 text-primary font-ozel"
          />
        </View>

        {/* Maksimum Kişi */}
        <View className="mt-4">
          <AppText className="text-base font-bold text-primary mb-2">
            Maksimum Kişi Sayısı
          </AppText>
          <View className="flex-row items-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => setMaxOccupancy(String(num))}
                className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                  maxOccupancy === String(num)
                    ? "bg-tint"
                    : "bg-card border-2 border-quaternary"
                }`}
              >
                <AppText
                  className={`font-bold ${
                    maxOccupancy === String(num) ? "text-white" : "text-primary"
                  }`}
                >
                  {num}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cinsiyet Tercihi */}
        <View className="mt-6">
          <AppText className="text-base font-bold text-primary mb-3">
            Ev Arkadaşı Tercihi
          </AppText>
          <View className="flex-row flex-wrap">
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setGenderPreference(option.value)}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                  genderPreference === option.value
                    ? "bg-tint"
                    : "bg-card border-2 border-quaternary"
                }`}
              >
                <AppText
                  className={`text-sm ${
                    genderPreference === option.value
                      ? "text-white font-bold"
                      : "text-primary"
                  }`}
                >
                  {option.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ev Kuralları */}
        <View className="mt-6">
          <AppText className="text-base font-bold text-primary mb-3">
            Ev Kuralları
          </AppText>
          <View className="flex-row flex-wrap">
            {HOUSE_RULES.map((rule) => (
              <RuleChip
                key={rule.id}
                id={rule.id}
                label={rule.label}
                icon={rule.icon as any}
                selected={selectedRules.includes(rule.id)}
                onToggle={toggleRule}
              />
            ))}
          </View>
        </View>

        {/* Olanaklar */}
        <View className="mt-6">
          <AppText className="text-base font-bold text-primary mb-3">
            Ev Olanakları
          </AppText>
          <View className="flex-row flex-wrap">
            {AMENITIES.map((amenity) => (
              <AmenityChip
                key={amenity.id}
                id={amenity.id}
                label={amenity.label}
                icon={amenity.icon as any}
                selected={selectedAmenities.includes(amenity.id)}
                onToggle={toggleAmenity}
              />
            ))}
          </View>
        </View>

        {/* Buttons */}
        <View className="mt-8 mb-8">
          <Button
            title="Değişiklikleri Kaydet"
            onPress={handleUpdate}
            loading={isLoading}
            disabled={!title || !rentAmount}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
