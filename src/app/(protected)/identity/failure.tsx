import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import COLORS from '@/theme/color';

export default function VerificationFailureScreen() {
  const { message, reasons } = useLocalSearchParams<{
    message: string;
    reasons: string;
  }>();

  // Parse reasons if they exist
  const failureReasons = reasons ? JSON.parse(reasons) : [];

  const handleTryAgain = () => {
    // Baştan başla - intro ekranına dön
    router.replace('/(protected)/identity/intro');
  };

  const handleContactSupport = () => {
    // TODO: Support sayfasına yönlendir veya email aç
    console.log('Contact support');
  };

  const handleClose = () => {
    router.replace('/(protected)/(tabs)/profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Close Button */}
      <View className="px-6 py-4 items-end">
        <TouchableOpacity
          onPress={handleClose}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6 justify-center">
        {/* Error Icon */}
        <View className="items-center mb-8">
          {/* Outer Circle */}
          <View className="w-40 h-40 rounded-full bg-error/10 items-center justify-center">
            {/* Middle Circle */}
            <View className="w-32 h-32 rounded-full bg-error/20 items-center justify-center">
              {/* Inner Circle with Blurred ID Card Icon */}
              <View className="w-24 h-24 rounded-full bg-card items-center justify-center relative">
                {/* Blurred ID Card */}
                <View className="absolute">
                  <Ionicons name="card-outline" size={40} color={COLORS.error} />
                </View>
                {/* Warning Triangle */}
                <View className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-error items-center justify-center border-2 border-background">
                  <Ionicons name="alert" size={20} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Title */}
        <AppText className="text-3xl font-bold text-tint text-center mb-3">
          Doğrulama Başarısız
        </AppText>

        {/* Message */}
        <AppText className="text-base text-tertiary text-center mb-8">
          {message ||
            "Kimliğinizi doğrulayamadık. Bu muhtemelen şu nedenlerle olabilir:"}
        </AppText>

        {/* Reasons */}
        {failureReasons.length > 0 && (
          <View className="bg-error/5 rounded-2xl p-4 mb-6">
            {failureReasons.map((reason: string, index: number) => (
              <View key={index} className="flex-row items-start mb-3 last:mb-0">
                <View className="w-5 h-5 rounded-full bg-error/20 items-center justify-center mr-3 mt-0.5">
                  <Ionicons name="close" size={12} color={COLORS.error} />
                </View>
                <AppText className="text-sm text-tertiary flex-1">{reason}</AppText>
              </View>
            ))}
          </View>
        )}

        {/* Tips for Success */}
        <View className="bg-card rounded-2xl p-4">
          <AppText className="text-sm font-bold text-primary mb-3">
            💡 Başarılı Doğrulama İçin İpucu
          </AppText>

          <View className="space-y-2">
            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-tint/10 items-center justify-center mr-3 mt-0.5">
                <Ionicons name="sunny-outline" size={14} color={COLORS.tint} />
              </View>
              <AppText className="text-sm text-tertiary flex-1">
                İyi aydınlatma kullanın
              </AppText>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-tint/10 items-center justify-center mr-3 mt-0.5">
                <Ionicons name="scan-outline" size={14} color={COLORS.tint} />
              </View>
              <AppText className="text-sm text-tertiary flex-1">
                Kimlik kartınızın tamamı görünüyor mu?
              </AppText>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-tint/10 items-center justify-center mr-3 mt-0.5">
                <Ionicons name="camera-outline" size={14} color={COLORS.tint} />
              </View>
              <AppText className="text-sm text-tertiary flex-1">
                Net ve bulanık olmayan fotoğraflar çekin
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="px-6 pb-8 space-y-3">
        {/* Try Again Button */}
        <Button title="Tekrar Dene" onPress={handleTryAgain} variant="primary" />

        {/* Contact Support Button */}
        <TouchableOpacity
          onPress={handleContactSupport}
          className="py-4 items-center"
          activeOpacity={0.7}
        >
          <AppText className="text-base font-bold text-tint">
            Destek Talebi Oluştur
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
