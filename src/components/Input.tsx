import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  error?: string;
}

export function Input({ 
  icon, 
  isPassword = false, 
  error,
  className = '',
  ...props 
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full">
      <View 
        className={`flex-row items-center bg-card border-2 ${
          error ? 'border-error' : 'border-quaternary'
        } rounded-2xl px-4 py-3`}
      >
        {/* Sol taraf icon */}
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color="#5E43F3" 
            style={{ marginRight: 12 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          className={`flex-1 font-ozel text-base text-primary ${className}`}
          placeholderTextColor="#12121E4D"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />

        {/* Şifre göster/gizle butonu */}
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            className="ml-2"
          >
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#5E43F3" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
