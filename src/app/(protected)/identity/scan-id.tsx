import { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import COLORS from '@/theme/color';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function ScanIDScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Kamera izni kontrolü
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (photo) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Hata', 'Fotoğraf çekilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 2],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Hata', 'Fotoğraf seçilemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleContinue = () => {
    if (!capturedPhoto) return;

    // Fotoğrafı state'e kaydet (veya AsyncStorage kullan)
    // Şimdilik router params ile gönderelim
    router.push({
      pathname: '/(protected)/identity/take-selfie',
      params: { idPhotoUri: capturedPhoto },
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  // İzin verilmemişse
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="camera-outline" size={64} color={COLORS.tertiary} />
        <AppText className="text-lg text-center text-tertiary mt-4">
          Kamera hazırlanıyor...
        </AppText>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="camera-off-outline" size={64} color={COLORS.error} />
        <AppText className="text-lg font-bold text-center text-primary mt-4 mb-2">
          Kamera İzni Gerekli
        </AppText>
        <AppText className="text-sm text-center text-tertiary mb-6">
          Kimlik kartınızı taramak için kamera erişimine izin vermeniz gerekiyor.
        </AppText>
        <Button title="İzin Ver" onPress={requestPermission} variant="primary" />
      </SafeAreaView>
    );
  }

  // Fotoğraf çekildiyse preview göster
  if (capturedPhoto) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleRetake}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            <AppText className="text-base font-semibold text-primary ml-2">
              Tekrar Çek
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Preview */}
        <View className="flex-1 px-6 justify-between pb-8">
          {/* Image Preview */}
          <View className="flex-1 justify-center">
            <View className="bg-card rounded-3xl overflow-hidden shadow-lg">
              <Image
                source={{ uri: capturedPhoto }}
                className="w-full aspect-[3/2]"
                resizeMode="cover"
              />
            </View>

            {/* Tips */}
            <View className="mt-6 bg-tint/5 rounded-2xl p-4">
              <View className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <AppText className="text-sm text-tertiary ml-3 flex-1">
                  Kimlik kartınızın tamamı görünüyor mu?
                </AppText>
              </View>
              <View className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <AppText className="text-sm text-tertiary ml-3 flex-1">
                  Yazılar net bir şekilde okunabiliyor mu?
                </AppText>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <AppText className="text-sm text-tertiary ml-3 flex-1">
                  Fotoğrafta parlaklık yok mu?
                </AppText>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <Button
            title="Devam Et"
            onPress={handleContinue}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  // Kamera ekranı
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 px-6 py-4 bg-background/80">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
            <Ionicons name="close" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <AppText className="text-base font-bold text-primary">
            Kimlik Kartını Tara
          </AppText>
          <View className="w-7" />
        </View>
      </View>

      {/* Camera */}
      <View className="flex-1">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        >
          {/* Camera Overlay */}
          <View className="flex-1 justify-center items-center px-6">
            {/* Frame Guide */}
            <View className="w-full aspect-[3/2] border-4 border-white rounded-2xl bg-transparent" />

            {/* Instructions */}
            <View className="absolute bottom-40 left-0 right-0 px-6">
              <View className="bg-black/60 rounded-2xl p-4">
                <AppText className="text-white text-center text-sm font-semibold">
                  Kimlik kartınızı çerçeve içine yerleştirin
                </AppText>
              </View>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Bottom Controls */}
      <View className="absolute bottom-0 left-0 right-0 bg-background/80 px-6 py-6">
        <View className="flex-row items-center justify-between">
          {/* Gallery Button */}
          <TouchableOpacity
            onPress={handlePickFromGallery}
            className="w-14 h-14 rounded-full bg-card items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="images-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Capture Button */}
          <TouchableOpacity
            onPress={handleTakePhoto}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full bg-white border-4 border-tint items-center justify-center"
            activeOpacity={0.7}
          >
            {isProcessing ? (
              <View className="w-16 h-16 rounded-full bg-tint/50" />
            ) : (
              <View className="w-16 h-16 rounded-full bg-tint" />
            )}
          </TouchableOpacity>

          {/* Placeholder for symmetry */}
          <View className="w-14 h-14" />
        </View>
      </View>
    </SafeAreaView>
  );
}
