import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AppText } from './AppText';

interface AvatarPickerProps {
  avatarUrl?: string;
  onAvatarSelect: (uri: string, file: any) => void;
  loading?: boolean;
}

export function AvatarPicker({ avatarUrl, onAvatarSelect, loading = false }: AvatarPickerProps) {
  const [localUri, setLocalUri] = useState<string | undefined>(avatarUrl);

  const pickImage = async () => {
    // İzin iste
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gerekiyor.');
      return;
    }

    // Fotoğraf seç
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setLocalUri(uri);
      
      // File objesi oluştur (fetch ile blob)
      const response = await fetch(uri);
      const blob = await response.blob();
      
      onAvatarSelect(uri, blob);
    }
  };

  return (
    <View className="items-center mb-6">
      <TouchableOpacity
        onPress={pickImage}
        disabled={loading}
        className="relative"
        activeOpacity={0.7}
      >
        {/* Avatar Container */}
        <View className="w-32 h-32 rounded-full bg-card border-4 border-quaternary overflow-hidden items-center justify-center">
          {loading ? (
            <ActivityIndicator size="large" color="#69F0AE" />
          ) : localUri ? (
            <Image 
              source={{ uri: localUri }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="camera" size={48} color="#6F7684" />
          )}
        </View>

        {/* Plus Button */}
        <View className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-success items-center justify-center border-4 border-background">
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <AppText className="text-sm text-secondary mt-3">
        Fotoğraf Yükle
      </AppText>
    </View>
  );
}
