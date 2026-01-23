import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { AvatarPicker } from '../../../components/AvatarPicker';
import { ProgressBar } from '../../../components/ProgressBar';
import { useProfileStore } from '../../../stores/profileStore';
import { useAuthStore } from '../../../stores/authStore';

export default function OnboardingStep1() {
  const { formData, setFormData, uploadAvatar, isLoading } = useProfileStore();
  const { token } = useAuthStore();
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarSelect = async (uri: string, file: any) => {
    setAvatarFile(file);
    setUploadingAvatar(true);

    try {
      if (token) {
        const avatarUrl = await uploadAvatar(file, token);
        Alert.alert('Başarılı', 'Profil fotoğrafı yüklendi!');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Fotoğraf yüklenemedi');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleContinue = () => {
    if (!formData.full_name.trim()) {
      Alert.alert('Uyarı', 'Lütfen adınızı ve soyadınızı girin');
      return;
    }

    router.push('/(protected)/onboarding/step2');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Bar */}
          <View className="mt-4 mb-6">
            <ProgressBar currentStep={1} totalSteps={3} />
            <AppText className="text-right text-xs text-secondary mt-2">
              Adım 1/3
            </AppText>
          </View>

          {/* Header */}
          <View className="mb-8">
            <AppText className="text-3xl font-bold text-primary mb-2">
              Profil Oluştur
            </AppText>
            <AppText className="text-base text-secondary">
              Kendini tanıt, en iyi eşleşmeyi bulalım
            </AppText>
          </View>

          {/* Avatar Picker */}
          <AvatarPicker 
            avatarUrl={formData.avatar_url}
            onAvatarSelect={handleAvatarSelect}
            loading={uploadingAvatar}
          />

          {/* Full Name Input */}
          <View className="mb-6">
            <AppText className="text-sm font-semibold text-primary mb-2">
              Ad Soyad
            </AppText>
            <Input
              placeholder="Ör: Eren Yılmaz"
              value={formData.full_name}
              onChangeText={(text) => setFormData('full_name', text)}
              autoCapitalize="words"
            />
          </View>

          {/* Spacer */}
          <View className="flex-1" />
        </ScrollView>

        {/* Bottom Button */}
        <View className="px-6 pb-6 pt-4 bg-background border-t border-quaternary">
          <Button
            title="Devam Et"
            onPress={handleContinue}
            loading={isLoading}
            disabled={!formData.full_name.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
