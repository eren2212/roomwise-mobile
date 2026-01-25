import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import COLORS from '@/theme/color';

export default function VerifyIdentityIntro() {
  const handleStartVerification = () => {
    router.push('/(protected)/identity/scan-id');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header with Back Button */}
      <View className="px-6 py-4">
        <TouchableOpacity
          onPress={handleGoBack}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 justify-between pb-8">
        {/* Top Section */}
        <View className="flex-1 justify-center">
          {/* Card Container */}
          <View className="bg-card rounded-3xl p-6 shadow-sm">
            {/* Gradient Bar */}
            <View className="h-1 bg-gradient-to-r from-tint to-linear1 rounded-full mb-8" />

            {/* Title */}
            <AppText className="text-3xl font-bold text-tint text-center mb-3">
              Kimliğinizi Doğrulayın
            </AppText>

            {/* Subtitle */}
            <AppText className="text-sm text-tertiary text-center mb-10">
              Uygulamanıza başlamak için birkaç hızlı adım
            </AppText>

            {/* Steps */}
            <View className="space-y-6">
              {/* Step 1 */}
              <View className="flex-row items-start">
                {/* Icon Container */}
                <View className="w-14 h-14 rounded-2xl bg-tint/10 items-center justify-center mr-4">
                  <Ionicons name="card-outline" size={28} color={COLORS.tint} />
                </View>

                {/* Step Content */}
                <View className="flex-1">
                  <AppText className="text-lg font-bold text-tint mb-1">
                    1. Kimlik Kartınızı Tarayın
                  </AppText>
                  <AppText className="text-sm text-tertiary">
                    TC Kimlik Kartı, Pasaport veya Lisans
                  </AppText>
                </View>
              </View>

              {/* Dotted Line */}
              <View className="ml-7 h-8 w-0.5 border-l-2 border-dotted border-quaternary" />

              {/* Step 2 */}
              <View className="flex-row items-start">
                {/* Icon Container */}
                <View className="w-14 h-14 rounded-2xl bg-linear1/10 items-center justify-center mr-4">
                  <Ionicons name="person-outline" size={28} color={COLORS.linear1} />
                </View>

                {/* Step Content */}
                <View className="flex-1">
                  <AppText className="text-lg font-bold text-tint mb-1">
                    2. Yüzünüzü Çekin
                  </AppText>
                  <AppText className="text-sm text-tertiary">
                    Yüzünüzün tamamı görünüyor mu?
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View className="space-y-4">
          {/* Security Badge */}
          <View className="flex-row items-center justify-center mb-2">
            <Ionicons name="lock-closed" size={16} color={COLORS.tertiary} />
            <AppText className="text-xs font-semibold text-tertiary ml-2 tracking-wider">
              BANK-GRADE GÜVENLİK
            </AppText>
          </View>

          {/* Start Button */}
          <Button
            title="Start Verification"
            onPress={handleStartVerification}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
