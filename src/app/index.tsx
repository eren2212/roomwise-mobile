import { AppText } from "@/components/AppText";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-blue-500">
    <View className="flex-1 items-center justify-center bg-blue-500 text-white">
      <AppText className="text-lg">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus libero cumque quas, facilis eum accusantium aliquam corporis fuga reprehenderit a.
      </AppText>
    </View>
    </SafeAreaView>
  );
}