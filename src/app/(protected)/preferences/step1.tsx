import React, { useEffect } from 'react';
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
export default function PreferencesStep1() {
  const { questions, preferencesData, setPreferencesData, fetchQuestions, isLoading } = useProfileStore();
  const { token } = useAuthStore();

  // İlk 4 soru (ID 1-4)
  const step1Questions = questions.slice(0, 4);

  useEffect(() => {
    if (token && questions.length === 0) {
      fetchQuestions(token);
    }
  }, [token]);

  const handleContinue = () => {
    // İlk 4 sorunun hepsine cevap verilmiş mi kontrol et
    const allAnswered = step1Questions.every((q) => 
      preferencesData[q.target_column as keyof typeof preferencesData]
    );

    if (!allAnswered) {
      Alert.alert('Uyarı', 'Lütfen tüm soruları cevaplayın');
      return;
    }

    router.push('/(protected)/preferences/step2');
  };

  const handleOptionSelect = (target_column: string, value: string) => {
    setPreferencesData(target_column, value);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <AppText className="text-secondary">Sorular yükleniyor...</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View className="mt-4 mb-6">
          <ProgressBar currentStep={1} totalSteps={2} />
          <AppText className="text-right text-xs text-secondary mt-2">
            Adım 1/2
          </AppText>
        </View>

        {/* Header */}
        <View className="mb-8">
          <AppText className="text-sm text-success font-semibold mb-2">
            TERCİHLER
          </AppText>
          <AppText className="text-3xl font-bold text-primary mb-2">
            Yaşam Tarzın
          </AppText>
          <AppText className="text-base text-secondary">
            En uygun ev arkadaşını bulmak için birkaç soru
          </AppText>
        </View>

        {/* Questions */}
        {step1Questions.map((question) => (
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
          title="Devam Et"
          onPress={handleContinue}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}
