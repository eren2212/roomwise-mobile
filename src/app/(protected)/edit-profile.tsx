import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppText } from '@/components/AppText'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { Gender, OccupationStatus } from '@/types/profile.types'
import DateTimePicker from '@react-native-community/datetimepicker'
import COLORS from '@/theme/color'
import { Input } from '@/components/Input'
import { AvatarPicker } from '@/components/AvatarPicker'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export default function EditProfileScreen() {
  const { token } = useAuthStore()
  const { profile, updateProfile, uploadAvatar, isLoading } = useProfileStore()

  // Form state
  const [bio, setBio] = useState(profile?.bio || '')
  const [birthDate, setBirthDate] = useState(
    profile?.birth_date ? new Date(profile.birth_date) : new Date()
  )
  const [gender, setGender] = useState<Gender | null>(profile?.gender || null)
  const [occupationStatus, setOccupationStatus] = useState<OccupationStatus | null>(
    profile?.occupation_status || null
  )
  const [university, setUniversity] = useState(profile?.university || '')
  const [department, setDepartment] = useState(profile?.department || '')
  const [occupation, setOccupation] = useState(profile?.occupation || '')

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Avatar URL
  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return `${API_BASE_URL}/profiles/avatar/${profile.avatar_url}`
    }
    return null
  }

  // Check for changes
  useEffect(() => {
    const changed =
      bio !== (profile?.bio || '') ||
      birthDate.toISOString().split('T')[0] !== (profile?.birth_date?.split('T')[0] || '') ||
      gender !== profile?.gender ||
      occupationStatus !== profile?.occupation_status ||
      (occupationStatus === OccupationStatus.STUDENT &&
        (university !== (profile?.university || '') ||
          department !== (profile?.department || ''))) ||
      (occupationStatus === OccupationStatus.PROFESSIONAL &&
        occupation !== (profile?.occupation || ''))

    setHasChanges(changed)
  }, [bio, birthDate, gender, occupationStatus, university, department, occupation, profile])

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setBirthDate(selectedDate)
    }
  }

  const handleAvatarSelect = async (uri: string, file: any) => {
    setIsUploadingAvatar(true)
    try {
      await uploadAvatar(file, token!)
      Alert.alert('Başarılı', 'Profil fotoğrafı güncellendi')
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Fotoğraf yüklenirken bir hata oluştu')
    } finally {
      setIsUploadingAvatar(false)
    }
  }
  // Handle save
  const handleSave = async () => {
    // Validation
    if (!gender) {
      Alert.alert('Hata', 'Lütfen cinsiyetinizi seçin')
      return
    }

    if (!occupationStatus) {
      Alert.alert('Hata', 'Lütfen meslek durumunuzu seçin')
      return
    }

    if (occupationStatus === OccupationStatus.STUDENT) {
      if (!university.trim() || !department.trim()) {
        Alert.alert('Hata', 'Lütfen üniversite ve bölüm bilgilerinizi girin')
        return
      }
    } else if (occupationStatus === OccupationStatus.PROFESSIONAL) {
      if (!occupation.trim()) {
        Alert.alert('Hata', 'Lütfen meslek bilginizi girin')
        return
      }
    }

    try {
      setIsSaving(true)

      const updateData: any = {
        bio: bio.trim(),
        birth_date: birthDate.toISOString().split('T')[0],
        gender,
        occupation_status: occupationStatus,
      }

      // Add occupation-specific fields
      if (occupationStatus === OccupationStatus.STUDENT) {
        updateData.university = university.trim()
        updateData.department = department.trim()
      } else {
        updateData.occupation = occupation.trim()
      }

      await updateProfile(updateData, token!)

      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi', [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ])
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Profil güncellenirken bir hata oluştu')
    } finally {
      setIsSaving(false)
    }
  }

  const genderLabels = {
    [Gender.MALE]: 'Erkek',
    [Gender.FEMALE]: 'Kadın',
    [Gender.NON_BINARY]: 'Diğer',
    [Gender.PREFER_NOT_TO_SAY]: 'Belirtmek İstemiyorum',
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-quaternary/30">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <AppText className="text-xl font-bold text-primary">Profili Düzenle</AppText>

        <TouchableOpacity
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
          className={`px-4 py-2 rounded-lg ${hasChanges && !isSaving ? 'bg-tint' : 'bg-quaternary'}`}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <AppText className={`font-bold ${hasChanges ? 'text-white' : 'text-tertiary'}`}>
              Kaydet
            </AppText>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View className="py-8">
          <AvatarPicker
            avatarUrl={getAvatarUrl() || undefined}
            onAvatarSelect={handleAvatarSelect}
            loading={isUploadingAvatar}
          />
        </View>

        <View className="px-6">
          {/* Full Name (Read Only) */}
          <View className="mb-6">
            <AppText className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
              AD SOYAD
            </AppText>
            <View className="bg-card rounded-2xl px-4 py-4 border-2 border-quaternary">
              <AppText className="text-base text-primary">{profile?.full_name || 'Kullanıcı'}</AppText>
            </View>
          </View>

          {/* Bio */}
          <View className="mb-6">
            <AppText className="text-sm font-semibold  mb-2 uppercase tracking-wider">
              HAKKIMDA
            </AppText>
            <Input
              value={bio}
              onChangeText={setBio}
              placeholder="Kendiniz hakkında birkaç cümle yazın..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              maxLength={200}
              textAlignVertical="top"
              className="min-h-[100px] "
            />
            <AppText className="text-xs text-tertiary mt-1 text-right">
              {bio.length}/200
            </AppText>
          </View>

          {/* Birth Date */}
          <View className="mb-6">
            <AppText className="text-sm font-semibold  mb-2 uppercase tracking-wider">
              DOĞUM TARİHİ
            </AppText>
            <TouchableOpacity
              onPress={() => setShowDatePicker(!showDatePicker)}
              className="bg-card rounded-2xl px-4 py-4 border-2 border-quaternary flex-row items-center justify-between"
            >
              <AppText className="text-base text-primary">
                {birthDate.toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </AppText>
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1950, 0, 1)}
                locale="tr-TR"
              />
            )}
          </View>

          {/* Gender */}
          <View className="mb-6">
            <AppText className="text-sm font-semibold text-tertiary mb-3 uppercase tracking-wider">
              CİNSİYET
            </AppText>
            <View className="flex-row flex-wrap gap-3">
              {Object.values(Gender).map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  className={`flex-1 min-w-[45%] py-4 rounded-2xl border-2 ${
                    gender === g
                      ? 'bg-tint/10 border-tint'
                      : 'bg-card border-quaternary/30'
                  }`}
                >
                  <AppText
                    className={`text-center font-semibold ${
                      gender === g ? 'text-tint' : 'text-tertiary'
                    }`}
                  >
                    {genderLabels[g]}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Occupation Status */}
          <View className="mb-6">
            <AppText className="text-sm font-semibold text-tertiary mb-3 uppercase tracking-wider">
              MESLEK DURUMU
            </AppText>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setOccupationStatus(OccupationStatus.STUDENT)}
                className={`flex-1 py-4 rounded-2xl border-2 ${
                  occupationStatus === OccupationStatus.STUDENT
                    ? 'bg-tint border-tint'
                    : 'bg-card border-quaternary/30'
                }`}
              >
                <View className="items-center">
                  <Ionicons
                    name="school"
                    size={24}
                    color={
                      occupationStatus === OccupationStatus.STUDENT ? '#FFFFFF' : COLORS.tertiary
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <AppText
                    className={`font-semibold ${
                      occupationStatus === OccupationStatus.STUDENT ? 'text-white' : 'text-tertiary'
                    }`}
                  >
                    Öğrenci
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setOccupationStatus(OccupationStatus.PROFESSIONAL)}
                className={`flex-1 py-4 rounded-2xl border-2 ${
                  occupationStatus === OccupationStatus.PROFESSIONAL
                    ? 'bg-tint border-tint'
                    : 'bg-card border-quaternary/30'
                }`}
              >
                <View className="items-center">
                  <Ionicons
                    name="briefcase"
                    size={24}
                    color={
                      occupationStatus === OccupationStatus.PROFESSIONAL
                        ? '#FFFFFF'
                        : COLORS.tertiary
                    }
                    style={{ marginBottom: 8 }}
                  />
                  <AppText
                    className={`font-semibold ${
                      occupationStatus === OccupationStatus.PROFESSIONAL
                        ? 'text-white'
                        : 'text-tertiary'
                    }`}
                  >
                    Profesyonel
                  </AppText>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Student Fields */}
          {occupationStatus === OccupationStatus.STUDENT && (
            <>
              <View className="mb-6">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="school-outline" size={16} color={COLORS.tint} />
                  <AppText className="text-sm font-semibold text-tertiary ml-2 uppercase tracking-wider">
                    ÜNİVERSİTE
                  </AppText>
                </View>
                <Input
                  value={university}
                  onChangeText={setUniversity}
                  placeholder="Üniversite adı"
                  placeholderTextColor="#9CA3AF"
                  className="p-1"
                />
              </View>

              <View className="mb-6">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="book-outline" size={16} color={COLORS.tint} />
                  <AppText className="text-sm font-semibold text-tertiary ml-2 uppercase tracking-wider">
                    BÖLÜM
                  </AppText>
                </View>
                <Input
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="Bölüm adı"
                  placeholderTextColor="#9CA3AF"
                  className="p-1"
                />
              </View>
            </>
          )}

          {/* Professional Fields */}
          {occupationStatus === OccupationStatus.PROFESSIONAL && (
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="briefcase-outline" size={16} color={COLORS.tint} />
                <AppText className="text-sm font-semibold text-tertiary ml-2 uppercase tracking-wider">
                  MESLEK
                </AppText>
              </View>
              <Input
                value={occupation}
                onChangeText={setOccupation}
                placeholder="Meslek / Pozisyon"
                placeholderTextColor="#9CA3AF"
                className="p-1"
              />
            </View>
          )}
        </View>

        {/* Bottom Padding */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  )
}
