import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const RecommendationCard = ({ 
  title, 
  description, 
  icon, 
  priority = 'medium',
  category,
  actionable = false
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Priority';
    }
  };

  return (
    <TouchableOpacity 
      className={`rounded-xl p-4 mb-3 border ${getPriorityColor(priority)}`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        <Text className="text-2xl mr-3">{icon}</Text>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-semibold text-black">{title}</Text>
            <View className="bg-white px-2 py-1 rounded-full border border-gray-200">
              <Text className="text-xs font-medium text-gray-700">{getPriorityText(priority)}</Text>
            </View>
          </View>
          <Text className="text-sm text-gray-700 mb-3">{description}</Text>
          
          {actionable && (
            <View className="flex-row items-center">
              <Text className="text-xs text-blue-600 font-medium">Tap to learn more →</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecommendationCard; 