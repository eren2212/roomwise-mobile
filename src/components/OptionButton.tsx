import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { Ionicons } from '@expo/vector-icons';

interface OptionButtonProps {
  label: string;
  value: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function OptionButton({ 
  label, 
  value, 
  isSelected, 
  onPress,
  icon 
}: OptionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        w-full rounded-2xl py-4 px-6 mb-3
        border-2 
        ${isSelected 
          ? 'bg-success/10 border-success' 
          : 'bg-card border-quaternary'
        }
      `}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {icon && (
            <Ionicons 
              name={icon} 
              size={24} 
              color={isSelected ? '#69F0AE' : '#6F7684'} 
              style={{ marginRight: 12 }}
            />
          )}
          <AppText 
            className={`text-base ${isSelected ? 'text-success font-bold' : 'text-primary'}`}
          >
            {label}
          </AppText>
        </View>
        
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#69F0AE" />
        )}
      </View>
    </TouchableOpacity>
  );
}
