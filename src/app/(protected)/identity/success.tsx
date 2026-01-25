import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import COLORS from '@/theme/color';
import { useEffect } from 'react';

export default function VerificationSuccessScreen() {
  const { confidence, message } = useLocalSearchParams<{
    confidence: string;
    message: string;
  }>();

  const handleContinue = () => {
    // Profile sayfasına geri dön
    router.replace('/(protected)/(tabs)/profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        {/* Success Icon with Animation */}
        <View className="items-center mb-8">
          {/* Outer Circle - Animated Glow */}
          <View className="w-40 h-40 rounded-full bg-success/10 items-center justify-center">
            {/* Middle Circle */}
            <View className="w-32 h-32 rounded-full bg-success/20 items-center justify-center">
              {/* Inner Circle */}
              <View className="w-24 h-24 rounded-full bg-success items-center justify-center">
                <Ionicons name="checkmark" size={48} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </View>

        {/* Title */}
        <AppText className="text-3xl font-bold text-tint text-center mb-3">
          Doğrulama Başarılı
        </AppText>

        {/* Message */}
        <AppText className="text-base text-tertiary text-center mb-8">
          {message || 'Your identity has been confirmed. You can now access all features of the app.'}
        </AppText>

        {/* Confidence Score (if available) */}
        {confidence && parseFloat(confidence) > 0 && (
          <View className="bg-success/5 rounded-2xl p-4 mb-8">
            <View className="flex-row items-center justify-between mb-2">
              <AppText className="text-sm font-semibold text-tertiary">
                Eşleşme Güveni
              </AppText>
              <AppText className="text-xl font-bold text-success">
                {parseFloat(confidence).toFixed(1)}%
              </AppText>
            </View>
            {/* Progress Bar */}
            <View className="h-2 bg-quaternary rounded-full overflow-hidden">
              <View
                className="h-full bg-success rounded-full"
                style={{ width: `${parseFloat(confidence)}%` }}
              />
            </View>
          </View>
        )}

        {/* Features Unlocked */}
        <View className="bg-card rounded-2xl p-4 mb-8">
          <AppText className="text-sm font-bold text-primary mb-3">
            ✨ Kilitlemeye Başarılı
          </AppText>

          <View className="space-y-2">
            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-success/10 items-center justify-center mr-3">
                <Ionicons name="checkmark" size={14} color={COLORS.success} />
              </View>
              <AppText className="text-sm text-tertiary flex-1">
                Sınırsız mesaj gönderin
              </AppText>
            </View>

            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-success/10 items-center justify-center mr-3">
                <Ionicons name="checkmark" size={14} color={COLORS.success} />
              </View>
              <AppText className="text-sm text-tertiary flex-1">
                İlanları oluşturun ve katılın
              </AppText>
            </View>

            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-success/10 items-center justify-center mr-3">
                <Ionicons name="checkmark" size={14} color={COLORS.success} />
              </View>
              <AppText className="text-sm text-tertiary flex-1">
                Doğrulanmış kontrol işareti profilinizde görünür
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <View className="px-6 pb-8">
        <Button
          title="Devam Et"
          onPress={handleContinue}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}
