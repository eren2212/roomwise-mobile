import { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import COLORS from '@/theme/color';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/stores/authStore';
import identityService from '@/services/identity.service';
import { CapturedImage } from '@/types/identity.types';

export default function TakeSelfieScreen() {
  const { idPhotoUri } = useLocalSearchParams<{ idPhotoUri: string }>();
  const { token } = useAuthStore();

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Kamera izni kontrolü
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // ID fotoğrafı kontrolü
  useEffect(() => {
    if (!idPhotoUri) {
      Alert.alert('Hata', 'Kimlik kartı fotoğrafı bulunamadı.');
      router.back();
    }
  }, [idPhotoUri]);

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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
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

  const handleSubmit = async () => {
    if (!capturedPhoto || !idPhotoUri || !token) return;

    try {
      setIsVerifying(true);

      // Prepare image data
      const selfieImage: CapturedImage = {
        uri: capturedPhoto,
        type: 'image/jpeg',
        name: `selfie-${Date.now()}.jpg`,
      };

      const idPhotoImage: CapturedImage = {
        uri: idPhotoUri,
        type: 'image/jpeg',
        name: `id-${Date.now()}.jpg`,
      };

      // Call verification API
      const response = await identityService.verifyIdentity(
        selfieImage,
        idPhotoImage,
        token,
      );

      if (response.success && response.data) {
        // Başarılı veya başarısız sonuç ekranına yönlendir
        if (response.data.verificationStatus === 'verified') {
          router.replace({
            pathname: '/(protected)/identity/success',
            params: {
              confidence: response.data.confidence?.toString() || '0',
              message: response.data.message,
            },
          });
        } else {
          router.replace({
            pathname: '/(protected)/identity/failure',
            params: {
              message: response.data.message,
              reasons: JSON.stringify([
                'Fotoğraf çok bulanık',
                'Kimlik kartınızın tamamı görünüyor mu?',
                'Aydınlatma yeterli mi?',
              ]),
            },
          });
        }
      } else {
        // API hatası
        Alert.alert(
          'Doğrulama Başarısız',
          response.error || 'Bir hata oluştu. Lütfen tekrar deneyin.',
        );
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Hata', 'Doğrulama işlemi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setIsVerifying(false);
    }
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
          Selfie çekmek için kamera erişimine izin vermeniz gerekiyor.
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
            disabled={isVerifying}
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
            <View className="bg-card rounded-full overflow-hidden shadow-lg aspect-square">
              <Image
                source={{ uri: capturedPhoto }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Tips */}
            <View className="mt-6 bg-tint/5 rounded-2xl p-4">
              <View className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <AppText className="text-sm text-tertiary ml-3 flex-1">
                  Yüzünüz net bir şekilde görünüyor mu?
                </AppText>
              </View>
              <View className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <AppText className="text-sm text-tertiary ml-3 flex-1">
                  Aydınlatma yeterli mi?
                </AppText>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <AppText className="text-sm text-tertiary ml-3 flex-1">
                  Gözlük veya aksesuar yok mu?
                </AppText>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            title={isVerifying ? 'Doğrulanıyor...' : 'Doğrulamayı Tamamla'}
            onPress={handleSubmit}
            variant="primary"
            loading={isVerifying}
            disabled={isVerifying}
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
            Selfie Çek
          </AppText>
          <View className="w-7" />
        </View>
      </View>

      {/* Camera */}
      <View className="flex-1">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="front"
        >
          {/* Camera Overlay */}
          <View className="flex-1 justify-center items-center px-6">
            {/* Circular Frame Guide */}
            <View className="w-72 h-72 rounded-full border-4 border-white bg-transparent" />

            {/* Instructions */}
            <View className="absolute bottom-40 left-0 right-0 px-6">
              <View className="bg-black/60 rounded-2xl p-4">
                <AppText className="text-white text-center text-sm font-semibold">
                  Yüzünüzü daire içine yerleştirin
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
