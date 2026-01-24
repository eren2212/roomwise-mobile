import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppText } from '@/components/AppText'

export default function SearchScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 items-center justify-center">
                <AppText>SearchScreen</AppText>
            </View>
        </SafeAreaView>
    )
}