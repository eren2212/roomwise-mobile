import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '@/components/AppText';
import { PotentialMatch } from '@/types/matching.types';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface SwipeCardProps {
  match: PotentialMatch;
}

const { width, height } = Dimensions.get('window');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.65;

export const SwipeCard: React.FC<SwipeCardProps> = ({ match }) => {
  const {
    full_name,
    avatar_url,
    bio,
    occupation,
    university,
    department,
    occupation_status,
    match_score,
  } = match;

  // Placeholder image
  const imageUrl = avatar_url || 'https://via.placeholder.com/400x600?text=No+Image';

  // Match score color
  const getMatchColor = () => {
    if (match_score >= 80) return 'bg-green-500';
    if (match_score >= 60) return 'bg-[#69F0AE]';
    return 'bg-orange-500';
  };
  
  const getAvatarUrl = () => {
    if (avatar_url) {
        return `${API_BASE_URL}/profiles/avatar/${avatar_url}`
    }
    return null
}

  return (
    <View
      className="rounded-3xl overflow-hidden shadow-2xl bg-white"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      }}
    >
      {/* Resim */}
      <Image
        source={{ uri: getAvatarUrl() || '' }}
        className="w-full h-full"
        resizeMode="cover"
      />

      {/* Top Badge - Match Score */}
      <View className="absolute top-4 right-6">
        <View className={`${getMatchColor()} rounded-2xl px-4 py-2 shadow-lg`}>
          <AppText className="text-white text-sm font-bold">
            {match_score}% Match
          </AppText>
        </View>
      </View>

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        className="absolute bottom-0 left-0 right-0 h-2/5"
      />

      {/* Info Section */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6">
        {/* Name & Age */}
        <AppText className="text-white text-3xl font-bold mb-2">
          {full_name || 'İsimsiz'}
        </AppText>

        {/* Occupation / University */}
        {occupation_status === 'student' ? (
          <View className="flex-row items-center mb-2 bg-white/10 rounded-2xl p-2 backdrop-blur-md">
            <AppText className="text-white/90 text-base">
            <FontAwesome5 name="university" size={24} color="white" /> {university && department ? `${university} - ${department}` : university || 'Üniversite bilgisi yok'}
            </AppText>
          </View>
        ) : (
          <View className="flex-row items-center mb-2">
            <AppText className="text-white/90 text-base">
            <MaterialIcons name="work" size={24} color="white" /> {occupation || 'Meslek bilgisi yok'}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};
