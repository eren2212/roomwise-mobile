import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { Redirect, Stack, useSegments, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { AppText } from "@/components/AppText";
import COLORS from "@/theme/color";

export default function ProtectedLayout() {
  const { isAuthenticated, token } = useAuthStore();
  const { checkCompletion } = useProfileStore();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!isAuthenticated || !token) {
        setIsChecking(false);
        return;
      }

      try {
        const status = await checkCompletion(token);

        // Eğer kullanıcı zaten onboarding/preferences sayfasındaysa redirect yapma
        const inOnboarding = segments.includes("onboarding");
        const inPreferences = segments.includes("preferences");

        if (inOnboarding || inPreferences) {
          setIsChecking(false);
          setShouldRedirect(false);
          return;
        }

        // Profil yok - onboarding'e yönlendir
        if (!status.hasProfile) {
          router.replace("/(protected)/onboarding/step1");
        }
        // Profil var ama tercihler yok - preferences'a yönlendir
        else if (!status.hasPreferences || !status.onboardingComplete) {
          router.replace("/(protected)/preferences/step1");
        }
        // Her şey tamam - kontrol etme artık
        else {
          setShouldRedirect(false);
        }
      } catch (error) {
        console.error("Profil kontrolü hatası:", error);
        // Hata olursa onboarding'e yönlendir (güvenli taraf)
        router.replace("/(protected)/onboarding/step1");
      } finally {
        setIsChecking(false);
      }
    };

    checkProfileStatus();
  }, [isAuthenticated, token]);

  // Auth kontrolü
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signin" />;
  }

  // Profil kontrolü yapılıyor
  if (isChecking) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}
