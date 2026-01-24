import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from "@/components/AppText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/stores/authStore";
import authService from '@/services/auth.service';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { loginWithGoogle,register, isLoading, error, clearError } = useAuthStore();

  // Form validasyonu
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    


    if (!email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!email.includes('@')) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Kayıt ol
  const handleSignUp = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({email,password});


      Alert.alert(
        'Başarılı!', 
        'Hesabınız oluşturuldu. Lütfen e-postanızı doğrulayın.',
        [
          {
            text: 'Tamam',
            onPress: () => router.push('/(auth)/signin'),
          }
        ]
      );
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Kayıt olurken bir hata oluştu');
    } finally {
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Form Container */}
          <View className="flex-1 bg-card mx-6 rounded-3xl p-6 my-6">
            {/* Başlık */}
            <AppText className="text-3xl font-bold text-tint text-center mb-8">
              Hesap Oluştur
            </AppText>
            {/* University Email Input */}
            <View className="mb-4">
              <AppText className="text-sm font-medium text-primary mb-2">
                E-posta
              </AppText>
              <Input
                icon="mail-outline"
                placeholder="example@gmail.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <AppText className="text-xs text-error mt-1 ml-1">
                  {errors.email}
                </AppText>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <AppText className="text-sm font-medium text-primary mb-2">
                Şifre
              </AppText>
              <Input
                icon="lock-closed-outline"
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                error={errors.password}
                isPassword
                autoCapitalize="none"
              />
              {errors.password && (
                <AppText className="text-xs text-error mt-1 ml-1">
                  {errors.password}
                </AppText>
              )}
            </View>

            {/* Divider - OR */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-quaternary" />
              <AppText className="mx-4 text-sm text-tertiary">
                VEYA
              </AppText>
              <View className="flex-1 h-[1px] bg-quaternary" />
            </View>

            {/* Google Sign In Button */}
            <Button
              title="Google ile Devam Et"
              onPress={() => loginWithGoogle()}
              variant="google"
              icon="logo-google"
              className="mb-4"
            />

            {/* Sign Up Button */}
            <Button
              title="Kayıt Ol"
              onPress={handleSignUp}
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
              className="mb-6"
            />

            {/* Already have account - Sign In Link */}
            <View className="flex-row items-center justify-center">
              <AppText className="text-sm text-secondary">
                Zaten hesabın var mı?{' '}
              </AppText>
              <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
                <AppText className="text-sm font-bold text-tint">
                  Giriş Yap
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
              <View className="mt-4 p-3 bg-error/10 rounded-xl">
                <AppText className="text-sm text-error text-center">
                  {error}
                </AppText>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
