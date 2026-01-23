import React from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { ProgressBar } from '../../../components/ProgressBar';
import { OptionButton } from '../../../components/OptionButton';
import { useProfileStore } from '../../../stores/profileStore';
import { useAuthStore } from '../../../stores/authStore';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Icons from '@expo/vector-icons/Ionicons';

export default function PreferencesStep2() {
  const { 
    questions, 
    preferencesData, 
    setPreferencesData, 
    savePreferences, 
    completeOnboarding,
    isLoading 
  } = useProfileStore();
  const { token } = useAuthStore();

  // Son 4 soru (ID 5-8)
  const step2Questions = questions.slice(4, 8);

  const handleComplete = async () => {
    // Son 4 sorunun hepsine cevap verilmiş mi kontrol et
    const allAnswered = step2Questions.every((q) => 
      preferencesData[q.target_column as keyof typeof preferencesData]
    );

    if (!allAnswered) {
      Alert.alert('Uyarı', 'Lütfen tüm soruları cevaplayın');
      return;
    }

    try {
      if (token) {
        // Tercihleri kaydet
        await savePreferences(token);
        
        // Onboarding'i tamamla
        await completeOnboarding(token);

        Alert.alert(
          'Tebrikler! 🎉',
          'Profilin hazır! Şimdi ev arkadaşını bulabilirsin.',
          [
            {
              text: 'Başla',
              onPress: () => router.replace('/(protected)/(tabs)'),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Tercihler kaydedilemedi');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleOptionSelect = (target_column: string, value: string) => {
    setPreferencesData(target_column, value);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View className="mt-4 mb-6">
          <ProgressBar currentStep={2} totalSteps={2} />
          <AppText className="text-right text-xs text-secondary mt-2">
            Adım 2/2
          </AppText>
        </View>

        {/* Back Button */}
        <TouchableOpacity 
          onPress={handleBack}
          className="flex-row items-center mb-4"
          activeOpacity={0.7}
        >
          <Icons name="chevron-back" size={24} color="#12121E" />
          <AppText className="text-base text-primary ml-1">Geri</AppText>
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-8">
          <AppText className="text-sm text-success font-semibold mb-2">
            TERCİHLER
          </AppText>
          <AppText className="text-3xl font-bold text-primary mb-2">
            Son Birkaç Soru
          </AppText>
          <AppText className="text-base text-secondary">
            Neredeyse bitti! Hadi tamamlayalım.
          </AppText>
        </View>

        {/* Questions */}
        {step2Questions.map((question) => (
          <View key={question.id} className="mb-8">
            <View className="flex-row items-center mb-4">
              <FontAwesome6 
                name={question.icon_name as any || 'help-circle-outline'} 
                size={24} 
                color="#2C0FBD" 
              />
              <AppText className="text-lg font-bold text-primary ml-3 flex-1">
                {question.question_text}
              </AppText>
            </View>

            {question.options.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                value={option.value}
                isSelected={
                  preferencesData[question.target_column as keyof typeof preferencesData] === option.value
                }
                onPress={() => handleOptionSelect(question.target_column, option.value)}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 pb-6 pt-4 bg-background border-t border-quaternary">
        <Button
          title="Tamamla 🎉"
          onPress={handleComplete}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}
