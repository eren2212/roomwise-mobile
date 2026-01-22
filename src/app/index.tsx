import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-blue-500">
    <View className="flex-1 items-center justify-center bg-blue-500 text-white">
      <Text className="text-2xl font-bold text-white">Home</Text>
    </View>
    </SafeAreaView>
  );
}