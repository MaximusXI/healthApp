import React from 'react';
import { View, Text } from 'react-native';

const ProgressBar = ({ 
  current, 
  target, 
  title, 
  unit, 
  color = 'blue',
  showPercentage = true 
}) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'red':
        return 'bg-red-500';
      case 'orange':
        return 'bg-orange-500';
      case 'purple':
        return 'bg-purple-500';
      case 'pink':
        return 'bg-pink-500';
      case 'gray':
        return 'bg-gray-500';
      case 'teal':
        return 'bg-teal-500';
      case 'indigo':
        return 'bg-indigo-500';
      case 'cyan':
        return 'bg-cyan-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getBackgroundColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100';
      case 'green':
        return 'bg-green-100';
      case 'red':
        return 'bg-red-100';
      case 'purple':
        return 'bg-purple-100';
      case 'orange':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <View className="mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-medium text-black">{title}</Text>
        <Text className="text-sm text-black">
          {current}{unit && ` ${unit}`} / {target}{unit && ` ${unit}`}
          {showPercentage && ` (${Math.round(percentage)}%)`}
        </Text>
      </View>
      
      <View className={`h-2 rounded-full ${getBackgroundColor(color)} overflow-hidden`}>
        <View 
          className={`h-full rounded-full ${getColorClasses(color)}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
};

export default ProgressBar; 