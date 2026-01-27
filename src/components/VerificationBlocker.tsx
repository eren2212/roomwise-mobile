import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/components/AppText';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export const VerificationBlocker = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Gradient Background */}
      <LinearGradient
        colors={['#2C0FBD', '#3D22D6']}
        className="absolute top-0 left-0 right-0 h-2/5"
      />

      {/* Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Icon */}
        <View className="bg-white rounded-full w-36 h-36 items-center justify-center mb-8 shadow-2xl">
          <View className="bg-[#2C0FBD]/10 rounded-full w-28 h-28 items-center justify-center">
            <AppText className="text-7xl">🛡️</AppText>
          </View>
        </View>

        {/* Başlık */}
        <AppText className="text-3xl font-bold text-center mb-3">
          Doğrulama Yapınız
        </AppText>

        {/* Açıklama */}
        <AppText className="text-base text-gray-600 text-center mb-10 px-4 leading-6">
          Herkes için güvenli bir topluluk için, potansiyel odasıcılarla bağlantı kurmak için doğrulanmış bir hesaba ihtiyacınız var. 
          Doğrulama yapmak yalnızca birkaç dakika sürer!
        </AppText>

        {/* Main Button */}
        <TouchableOpacity
          onPress={() => router.push('/(protected)/identity/intro')}
          className="bg-[#2C0FBD] rounded-full py-5 px-12 w-full items-center shadow-lg mb-4"
          activeOpacity={0.8}
        >
          <AppText className="text-white text-lg font-bold">
            Hesabımı Doğrula
          </AppText>
        </TouchableOpacity>

        {/* Secondary Button */}
        <TouchableOpacity
          onPress={() => {}}
          className="py-4"
          activeOpacity={0.7}
        >
          <AppText className="text-gray-500 text-base">
            Belki Daha Sonra
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
