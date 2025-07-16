import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const HealthCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color = 'blue', 
  subtitle, 
  onPress,
  trend,
  trendValue 
}) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 border-green-300';
      case 'blue':
        return 'bg-blue-100 border-blue-300';
      case 'red':
        return 'bg-red-100 border-red-300';
      case 'orange':
        return 'bg-orange-100 border-orange-300';
      case 'purple':
        return 'bg-purple-100 border-purple-300';
      case 'pink':
        return 'bg-pink-100 border-pink-300';
      case 'gray':
        return 'bg-gray-100 border-gray-300';
      case 'teal':
        return 'bg-teal-100 border-teal-300';
      case 'indigo':
        return 'bg-indigo-100 border-indigo-300';
      case 'cyan':
        return 'bg-cyan-100 border-cyan-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return null;
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`p-4 rounded-xl border ${getColorClasses(color)} ${onPress ? 'active:scale-95' : ''}`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg">{icon}</Text>
        {trend && (
          <Text className="text-sm">{getTrendIcon(trend)}</Text>
        )}
      </View>
      
      <Text className="text-2xl font-bold text-black mb-1">
        {value}
        {unit && <Text className="text-lg text-gray-700"> {unit}</Text>}
      </Text>
      
      <Text className="text-sm font-medium text-black mb-1">{title}</Text>
      
      {subtitle && (
        <Text className="text-xs text-gray-700">{subtitle}</Text>
      )}
    </TouchableOpacity>
  );
};

export default HealthCard; 