import { useAuthStore } from "@/stores/authStore";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {

  const {isAuthenticated} = useAuthStore();
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signup" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}