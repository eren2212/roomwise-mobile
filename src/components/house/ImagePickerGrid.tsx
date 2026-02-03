import React from "react";
import { View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../AppText";
import { SelectedImage } from "@/types/house.types";

interface ImagePickerGridProps {
  images: SelectedImage[];
  onImagesChange: (images: SelectedImage[]) => void;
  maxImages?: number;
}

export function ImagePickerGrid({
  images,
  onImagesChange,
  maxImages = 10,
}: ImagePickerGridProps) {
  const pickImages = async () => {
    // İzin kontrolü
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("İzin Gerekli", "Resim seçmek için galeri izni gereklidir.");
      return;
    }

    // Resim seç
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages - images.length,
    });

    if (!result.canceled && result.assets) {
      const newImages: SelectedImage[] = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      }));

      onImagesChange([...images, ...newImages].slice(0, maxImages));
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <View className="w-full">
      {/* Seçilen resimler */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          {images.map((image, index) => (
            <View key={index} className="mr-3 relative">
              <Image
                source={{ uri: image.uri }}
                className="w-24 h-24 rounded-xl"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-error w-6 h-6 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={14} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Resim ekle butonu */}
      {images.length < maxImages && (
        <TouchableOpacity
          onPress={pickImages}
          className="w-full h-40 border-2 border-dashed border-quaternary rounded-2xl items-center justify-center bg-card"
          activeOpacity={0.7}
        >
          <View className="w-16 h-16 rounded-full bg-success/20 items-center justify-center mb-3">
            <Ionicons name="camera" size={32} color="#69F0AE" />
          </View>
          <AppText className="text-primary font-bold text-base">
            Ev Fotoğrafları Yükle
          </AppText>
          <AppText className="text-secondary text-sm mt-1">
            Galeriden seçmek için dokunun
          </AppText>
          <AppText className="text-tertiary text-xs mt-2">
            {images.length}/{maxImages} fotoğraf seçildi
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}
