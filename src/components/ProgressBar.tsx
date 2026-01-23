import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="w-full h-1 bg-quaternary rounded-full overflow-hidden">
      <View 
        style={{ width: `${progress}%` }}
        className="h-full bg-success rounded-full"
      />
    </View>
  );
}
