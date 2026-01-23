import React from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { ProgressBar } from '../../../components/ProgressBar';
import { useProfileStore } from '../../../stores/profileStore';
import { useAuthStore } from '../../../stores/authStore';
import { OccupationStatus } from '../../../types/profile.types';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingStep3() {
  const { formData, setFormData, createProfile, isLoading } = useProfileStore();
  const { token } = useAuthStore();

  const handleComplete = async () => {
    // Validations
    if (!formData.occupation_status) {
      Alert.alert('Uyarı', 'Lütfen bir seçenek seçin');
      return;
    }

    if (formData.occupation_status === OccupationStatus.STUDENT) {
      if (!formData.university.trim() || !formData.department.trim()) {
        Alert.alert('Uyarı', 'Lütfen üniversite ve bölüm bilgilerinizi girin');
        return;
      }
    } else {
      if (!formData.occupation.trim()) {
        Alert.alert('Uyarı', 'Lütfen meslek bilginizi girin');
        return;
      }
    }

    try {
      if (token) {
        await createProfile(token);
        Alert.alert('Başarılı', 'Profilin oluşturuldu! 🎉');
        // Preferences'a yönlendir
        router.replace('/(protected)/preferences/step1');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Profil oluşturulamadı');
    }
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
          <ProgressBar currentStep={3} totalSteps={3} />
          <AppText className="text-right text-xs text-secondary mt-2">
            Adım 3/3
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
          <AppText className="text-sm text-success font-semibold mb-2">
            PROFİL KURULUMU
          </AppText>
          <AppText className="text-3xl font-bold text-primary mb-2">
            Ne Yapıyorsun?
          </AppText>
        </View>

        {/* Occupation Status Selection */}
        <View className="mb-8">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setFormData('occupation_status', OccupationStatus.STUDENT)}
              className={`
                flex-1 rounded-2xl py-5 px-4
                border-2
                ${formData.occupation_status === OccupationStatus.STUDENT
                  ? 'bg-tint border-tint'
                  : 'bg-card border-quaternary'
                }
              `}
              activeOpacity={0.7}
            >
              <View className="items-center">
                <Ionicons 
                  name="school-outline" 
                  size={32} 
                  color={formData.occupation_status === OccupationStatus.STUDENT ? '#FFFFFF' : '#6F7684'} 
                />
                <AppText 
                  className={`text-base font-bold mt-2 ${
                    formData.occupation_status === OccupationStatus.STUDENT
                      ? 'text-white'
                      : 'text-secondary'
                  }`}
                >
                  Öğrenci
                </AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFormData('occupation_status', OccupationStatus.PROFESSIONAL)}
              className={`
                flex-1 rounded-2xl py-5 px-4
                border-2
                ${formData.occupation_status === OccupationStatus.PROFESSIONAL
                  ? 'bg-tint border-tint'
                  : 'bg-card border-quaternary'
                }
              `}
              activeOpacity={0.7}
            >
              <View className="items-center">
                <Ionicons 
                  name="briefcase-outline" 
                  size={32} 
                  color={formData.occupation_status === OccupationStatus.PROFESSIONAL ? '#FFFFFF' : '#6F7684'} 
                />
                <AppText 
                  className={`text-base font-bold mt-2 ${
                    formData.occupation_status === OccupationStatus.PROFESSIONAL
                      ? 'text-white'
                      : 'text-secondary'
                  }`}
                >
                  Profesyonel
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Student Fields */}
        {formData.occupation_status === OccupationStatus.STUDENT && (
          <>
            <View className="mb-4">
              <AppText className="text-sm font-semibold text-primary mb-2">
                Üniversite Adı
              </AppText>
              <Input
                placeholder="Ör: Stanford University"
                value={formData.university}
                onChangeText={(text) => setFormData('university', text)}
              />
            </View>

            <View className="mb-4">
              <AppText className="text-sm font-semibold text-primary mb-2">
                Bölüm
              </AppText>
              <Input
                placeholder="Ör: Computer Science"
                value={formData.department}
                onChangeText={(text) => setFormData('department', text)}
              />
            </View>
          </>
        )}

        {/* Professional Fields */}
        {formData.occupation_status === OccupationStatus.PROFESSIONAL && (
          <View className="mb-4">
            <AppText className="text-sm font-semibold text-primary mb-2">
              Meslek
            </AppText>
            <Input
              placeholder="Ör: Software Engineer"
              value={formData.occupation}
              onChangeText={(text) => setFormData('occupation', text)}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 pb-6 pt-4 bg-background border-t border-quaternary">
        <Button
          title="Profili Tamamla"
          onPress={handleComplete}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}
