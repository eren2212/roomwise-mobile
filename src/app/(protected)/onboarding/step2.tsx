import React, { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { ProgressBar } from '../../../components/ProgressBar';
import { GenderButton } from '../../../components/GenderButton';
import { useProfileStore } from '../../../stores/profileStore';
import { Gender } from '../../../types/profile.types';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingStep2() {
  const { formData, setFormData, isLoading } = useProfileStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  
    if (!selectedDate) return;
  
    const fixedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
  
    const yyyyMMdd = fixedDate.toLocaleDateString('en-CA');
  
    setTempDate(fixedDate);
    setFormData('birth_date', yyyyMMdd);
  };
  

  const handleContinue = () => {
    if (!formData.birth_date) {
      Alert.alert('Uyarı', 'Lütfen doğum tarihinizi seçin');
      return;
    }

    if (!formData.gender) {
      Alert.alert('Uyarı', 'Lütfen cinsiyetinizi seçin');
      return;
    }

    router.push('/(protected)/onboarding/step3');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View className="mt-4 mb-6">
          <ProgressBar currentStep={2} totalSteps={3} />
          <AppText className="text-right text-xs text-secondary mt-2">
            Adım 2/3
          </AppText>
        </View>

        {/* Back Button */}
        <TouchableOpacity 
          onPress={handleBack}
          className="flex-row items-center mb-4"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#12121E" />
          <AppText className="text-base text-primary ml-1">Geri</AppText>
        </TouchableOpacity>

        {/* Header */}
        <View className="mb-8">
          <AppText className="text-3xl font-bold text-primary mb-2">
            Seni Tanıyalım
          </AppText>
          <AppText className="text-base text-secondary">
            Kendinden biraz bahset, en iyi eşleşmeyi bulalım
          </AppText>
        </View>

        {/* Age Range / Birth Date */}
        <View className="mb-8">
          <AppText className="text-sm font-semibold text-primary mb-3">
            Doğum Tarihi
          </AppText>
          
          <TouchableOpacity
            onPress={() => setShowDatePicker(!showDatePicker )}
            className="bg-card border-2 border-quaternary rounded-2xl py-4 px-6"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <AppText className={formData.birth_date ? 'text-primary' : 'text-tertiary'}>
                {formData.birth_date || 'Tarih Seç'}
              </AppText>
              <Ionicons name="calendar-outline" size={24} color="#6F7684" />
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1950, 0, 1)}
              locale="tr-TR"
            />
          )}
        </View>

        {/* Gender */}
        <View className="mb-8">
          <AppText className="text-sm font-semibold text-primary mb-3">
            Cinsiyet (Opsiyonel)
          </AppText>

          <View className="flex-row flex-wrap -mx-1">
            <GenderButton
              gender={Gender.FEMALE}
              label="Kadın"
              icon="woman-outline"
              isSelected={formData.gender === Gender.FEMALE}
              onPress={() => setFormData('gender', Gender.FEMALE)}
            />
            <GenderButton
              gender={Gender.MALE}
              label="Erkek"
              icon="man-outline"
              isSelected={formData.gender === Gender.MALE}
              onPress={() => setFormData('gender', Gender.MALE)}
            />
          </View>

          <View className="flex-row flex-wrap -mx-1 mt-3">
            <GenderButton
              gender={Gender.NON_BINARY}
              label="Diğer"
              icon="transgender-outline"
              isSelected={formData.gender === Gender.NON_BINARY}
              onPress={() => setFormData('gender', Gender.NON_BINARY)}
            />
            <GenderButton
              gender={Gender.PREFER_NOT_TO_SAY}
              label="Belirtmek İstemiyorum"
              icon="help-circle-outline"
              isSelected={formData.gender === Gender.PREFER_NOT_TO_SAY}
              onPress={() => setFormData('gender', Gender.PREFER_NOT_TO_SAY)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 pb-6 pt-4 bg-background border-t border-quaternary">
        <Button
          title="Devam Et"
          onPress={handleContinue}
          loading={isLoading}
          disabled={!formData.birth_date || !formData.gender}
        />
      </View>
    </SafeAreaView>
  );
}
