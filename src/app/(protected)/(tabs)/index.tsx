import { useAuthStore } from '@/stores/authStore';
import { View, Text, Button } from 'react-native'

export default function HomeScreen() {

    const {logout} = useAuthStore();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>HomeScreen</Text>
      <Button title="Çıkış Yap" onPress={() => logout()} />
    </View>
  );
}