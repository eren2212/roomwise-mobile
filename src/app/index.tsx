import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  // Authenticated ise protected'a, değilse auth'a yönlendir
  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Redirect href="/(auth)/signin" />;
}
