import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppText } from '@/components/AppText'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { useEffect } from 'react'
import { router } from 'expo-router'
import COLORS from '@/theme/color'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export default function ProfileScreen() {
    const { user, token, logout } = useAuthStore()
    const { profile, fetchProfile, isLoading } = useProfileStore()

    useEffect(() => {
        if (token) {
            loadProfile()
        }
    }, [token])

    const loadProfile = async () => {
        try {
            await fetchProfile(token!)
        } catch (error) {
            console.error('Profil yüklenirken hata:', error)
        }
    }

    // Avatar URL'ini oluştur
    const getAvatarUrl = () => {
        if (profile?.avatar_url) {
            return `${API_BASE_URL}/profiles/avatar/${profile.avatar_url}`
        }
        return null
    }

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Çıkış yapmak istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                { 
                    text: 'Çıkış Yap', 
                    style: 'destructive',
                    onPress: async () => {
                        await logout()
                        router.replace('/(auth)/signin')
                    }
                }
            ]
        )
    }

    const handleDeleteAccount = () => {
        Alert.alert(
            'Hesabı Sil',
            'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
            [
                { text: 'İptal', style: 'cancel' },
                { 
                    text: 'Sil', 
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Hesap silme işlemi
                        console.log('Hesap silme işlemi')
                    }
                }
            ]
        )
    }

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2C0FBD" />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <AppText className="text-2xl font-bold text-primary">Ayarlar</AppText>
                </View>

                {/* Profile Card */}
                <View className="items-center mb-8">
                    {/* Avatar */}
                    <View className="relative mb-4 border-2 border-tint/10 rounded-full p-0.5">
                        <View className="w-28 h-28 rounded-full bg-quaternary items-center justify-center overflow-hidden">
                            {getAvatarUrl() ? (
                                <Image 
                                    source={{ uri: getAvatarUrl()! }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <Ionicons name="person" size={40} color="#9CA3AF" />
                            )}
                        </View>
                        {/* Verified Badge */}
                        {profile?.is_verified && (
                            <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-tint items-center justify-center border-2 border-background">
                                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                            </View>
                        )}
                    </View>

                    {/* Name */}
                    <AppText className="text-xl font-bold text-primary mb-1">
                        {profile?.full_name || 'Kullanıcı'}
                    </AppText>

                    {/* Verification Status */}
                 {
                    profile?.is_verified ? (
                        <View className="flex-row items-center bg-success/10 px-3 py-1 rounded-2xl">
                            <View className="w-2 h-2 rounded-full bg-success mr-2" />
                            <AppText className="text-xs font-semibold text-success">
                                DOĞRULANMIŞ DURUM: AKTİF
                            </AppText>
                        </View>
                    ) : (
                        <View className="flex-row items-center bg-error/10 px-3 py-1 rounded-2xl">
                            <View className="w-2 h-2 rounded-full bg-error mr-2" />
                            <AppText className="text-xs font-semibold text-error">
                                DOĞRULANMIŞ DURUM: PASİF
                            </AppText>
                        </View>
                    )}
                </View>

                {/* Menu Items */}
                <View className="px-6">
                    {/* Identity Verification - Only show if not verified */}
                    {!profile?.is_verified && (
                        <TouchableOpacity 
                            className="flex-row items-center bg-tint rounded-2xl p-4 mb-3"
                            activeOpacity={0.7}
                            onPress={() => router.push('/(protected)/identity/intro')}
                        >
                            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mr-4">
                                <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                            </View>
                            <View className="flex-1">
                                <AppText className="text-base font-bold text-white mb-1">
                                    Kimliğini Doğrula
                                </AppText>
                                <AppText className="text-xs text-white/80">
                                    Tüm özelliklere erişim için gerekli
                                </AppText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}

                    {/* Edit Profile */}
                    <TouchableOpacity 
                        className="flex-row items-center bg-card rounded-2xl p-4 mb-3"
                        activeOpacity={0.7}
                        onPress={() => router.push('/(protected)/edit-profile')}
                    >
                        <View className="w-12 h-12 rounded-2xl bg-linear1/10 items-center justify-center mr-4">
                            <Ionicons name="pencil" size={20} color={COLORS.tint} />
                        </View>
                        <View className="flex-1">
                            <AppText className="text-base font-bold text-primary mb-1">
                                Profili Düzenle
                            </AppText>
                            <AppText className="text-xs text-tertiary">
                                Kişisel bilgiler & ev arkadaşı bilgileri
                            </AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Notification Preferences */}
                    <TouchableOpacity 
                        className="flex-row items-center bg-card rounded-2xl p-4 mb-3"
                        activeOpacity={0.7}
                        onPress={() => {
                            // TODO: Navigate to notifications
                            console.log('Bildirim tercihleri')
                        }}
                    >
                        <View className="w-12 h-12 rounded-2xl bg-linear1/10 items-center justify-center mr-4">
                            <Ionicons name="notifications" size={20} color={COLORS.linear1} />
                        </View>
                        <View className="flex-1">
                            <AppText className="text-base font-bold text-primary mb-1">
                                Bildirim Tercihleri
                            </AppText>
                            <AppText className="text-xs text-tertiary">
                                Eşleşmeler, mesajlar & uyarılar
                            </AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Privacy & Blocked Users */}
                    <TouchableOpacity 
                        className="flex-row items-center bg-card rounded-2xl p-4 mb-3"
                        activeOpacity={0.7}
                        onPress={() => {
                            // TODO: Navigate to privacy
                            console.log('Gizlilik & Engellenen Kullanıcılar')
                        }}
                    >
                        <View className="w-12 h-12 rounded-2xl bg-linear1/10 items-center justify-center mr-4">
                            <Ionicons name="shield-checkmark" size={20} color={COLORS.linear1} />
                        </View>
                        <View className="flex-1 ">
                            <AppText className="text-base font-bold  text-primary mb-1" 
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            >
                                Gizlilik & Engellenen Kullanıcılar
                            </AppText>
                            <AppText className="text-xs text-tertiary">
                                Görünürlüğü yönet & güvenlik
                            </AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Danger Zone */}
                    <View className="mt-6 mb-4">
                        <AppText className="text-sm font-bold text-tertiary mb-3">
                            TEHLİKE BÖLGESİ
                        </AppText>

                        {/* Delete Account */}
                        <TouchableOpacity 
                            className="flex-row items-center bg-error/10 rounded-2xl p-4"
                            activeOpacity={0.7}
                            onPress={handleDeleteAccount}
                        >
                            <View className="w-12 h-12 rounded-2xl bg-card items-center justify-center mr-4">
                                <Ionicons name="trash" size={20} color="#EF4444" />
                            </View>
                            <View className="flex-1">
                                <AppText className=" mb-1 ">
                                    Hesabı Sil
                                </AppText>
                                <AppText className="text-xs text-error">
                                    Verilerinizi kalıcı olarak kaldırın
                                </AppText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity 
                        className="bg-card border-2 border-quaternary rounded-2xl py-4 px-6 mb-8"
                        activeOpacity={0.7}
                        onPress={handleLogout}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                            <AppText className="text-base font-bold text-error ml-2">
                                Çıkış Yap
                            </AppText>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}