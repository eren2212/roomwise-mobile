import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { Ionicons } from '@expo/vector-icons';
import { Gender } from '../types/profile.types';

interface GenderButtonProps {
  gender: Gender;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isSelected: boolean;
  onPress: () => void;
}

export function GenderButton({ 
  gender, 
  label, 
  icon, 
  isSelected, 
  onPress 
}: GenderButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        flex-1 rounded-2xl py-4 px-4 mx-1
        border-2 
        ${isSelected 
          ? 'bg-success/10 border-success' 
          : 'bg-card border-quaternary'
        }
      `}
      activeOpacity={0.7}
    >
      <View className="items-center">
        <Ionicons 
          name={icon} 
          size={32} 
          color={isSelected ? '#69F0AE' : '#6F7684'} 
        />
        <AppText 
          className={`text-xs mt-2 text-center ${
            isSelected ? 'text-success font-bold' : 'text-secondary'
          }`}
        >
          {label}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
