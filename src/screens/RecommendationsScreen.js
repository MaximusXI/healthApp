import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import RecommendationCard from '../components/RecommendationCard';
import healthService from '../services/healthService';
import aiService from '../services/aiService';

const RecommendationsScreen = () => {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const healthData = await healthService.fetchHealthData('7d');
      const aggregatedData = healthService.getAggregatedData(healthData);
      const aiRecommendations = await aiService.sendHealthDataToBackend(healthData, aggregatedData);
      setRecommendations(aiRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      Alert.alert('Error', 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  const categories = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'general', label: 'General', icon: '💡' },
    { key: 'nutrition', label: 'Nutrition', icon: '🍎' },
    { key: 'exercise', label: 'Exercise', icon: '🏃' },
    { key: 'sleep', label: 'Sleep', icon: '😴' },
    { key: 'goals', label: 'Goals', icon: '🎯' },
  ];

  const getFilteredRecommendations = () => {
    if (selectedCategory === 'all') {
      return recommendations;
    }
    return { [selectedCategory]: recommendations[selectedCategory] || [] };
  };

  const renderRecommendations = (category, items) => {
    if (!items) return null;

    // If items is an array, render as before
    if (Array.isArray(items)) {
      if (items.length === 0) return null;
      return (
        <View key={category} className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3 capitalize">
            {category === 'general' ? 'General Health' : category} Recommendations
          </Text>
          {items.map((rec, index) => (
            <RecommendationCard
              key={index}
              title={rec.title}
              description={rec.description}
              icon={rec.icon}
              priority={rec.priority}
              category={rec.category}
              actionable={rec.actionable}
            />
          ))}
        </View>
      );
    }

    // If items is an object, render its values (or entries)
    if (typeof items === 'object') {
      const objectValues = Object.values(items);
      if (objectValues.length === 0) return null;
      return (
        <View key={category} className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3 capitalize">
            {category === 'general' ? 'General Health' : category} Recommendations
          </Text>
          {objectValues.map((rec, index) => (
            <RecommendationCard
              key={index}
              title={rec.title}
              description={rec.description}
              icon={rec.icon}
              priority={rec.priority}
              category={rec.category}
              actionable={rec.actionable}
            />
          ))}
        </View>
      );
    }

    // Fallback for other types
    return null;
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-purple-600 px-5 pt-12 pb-6 shadow-lg">
        <Text className="text-2xl font-bold text-white mb-2">AI Recommendations</Text>
        <Text className="text-purple-100">Personalized health insights and advice</Text>
      </View>

      {/* Category Filter */}
      <View className="bg-white px-5 py-4 border-b border-gray-200 shadow-sm">
        <Text className="text-sm font-medium text-gray-700 mb-3">Filter by Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              className={`flex-row items-center px-4 py-2 rounded-full mr-3 border ${
                selectedCategory === category.key
                  ? 'bg-purple-600 border-purple-600'
                  : 'bg-gray-100 border-gray-200'
              }`}
            >
              <Text className="text-sm mr-1">{category.icon}</Text>
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === category.key ? 'text-white' : 'text-gray-700'
                }`}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-2xl mb-3">🤖</Text>
            <Text className="text-lg font-medium text-gray-800 mb-2">Analyzing Your Health Data</Text>
            <Text className="text-sm text-gray-600 text-center">
              Our AI is processing your health information to provide personalized recommendations
            </Text>
          </View>
        ) : Object.keys(recommendations).length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-4xl mb-3">💡</Text>
            <Text className="text-lg font-medium text-gray-800 mb-2">No Recommendations Yet</Text>
            <Text className="text-sm text-gray-600 text-center mb-4">
              Connect your health data to receive personalized AI recommendations
            </Text>
            <TouchableOpacity 
              onPress={fetchRecommendations}
              className="bg-purple-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">Refresh Recommendations</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-4">
            {Object.entries(getFilteredRecommendations()).map(([category, items]) =>
              renderRecommendations(category, items)
            )}
          </View>
        )}

        {/* Health Summary */}
        {Object.keys(recommendations).length > 0 && (
          <View className="bg-white rounded-xl p-4 mb-6 shadow-md border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Health Summary</Text>
            <View className="space-y-3">
              {recommendations.general && recommendations.general.length > 0 && (
                <View className="flex-row items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Text className="text-lg mr-3">📊</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-blue-800">Overall Health Status</Text>
                    <Text className="text-xs text-blue-600">
                      {recommendations.general.length} active recommendations
                    </Text>
                  </View>
                </View>
              )}
              
              {recommendations.goals && recommendations.goals.length > 0 && (
                <View className="flex-row items-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <Text className="text-lg mr-3">🎯</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-green-800">Active Goals</Text>
                    <Text className="text-xs text-green-600">
                      {recommendations.goals.length} goals in progress
                    </Text>
                  </View>
                </View>
              )}
              
              {recommendations.nutrition && recommendations.nutrition.length > 0 && (
                <View className="flex-row items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <Text className="text-lg mr-3">🍎</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-orange-800">Nutrition Insights</Text>
                    <Text className="text-xs text-orange-600">
                      {recommendations.nutrition.length} dietary recommendations
                    </Text>
                  </View>
                </View>
              )}
              
              {recommendations.exercise && recommendations.exercise.length > 0 && (
                <View className="flex-row items-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <Text className="text-lg mr-3">🏃</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-green-800">Fitness Recommendations</Text>
                    <Text className="text-xs text-green-600">
                      {recommendations.exercise.length} exercise suggestions
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* AI Information */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">About AI Recommendations</Text>
          <View className="space-y-3">
            <View className="flex-row items-start">
              <Text className="text-lg mr-3 mt-1">🤖</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800 mb-1">Powered by AI</Text>
                <Text className="text-xs text-gray-600">
                  Our advanced AI analyzes your health data to provide personalized recommendations
                </Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <Text className="text-lg mr-3 mt-1">🔒</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800 mb-1">Privacy First</Text>
                <Text className="text-xs text-gray-600">
                  Your health data is processed securely and never shared without your consent
                </Text>
              </View>
            </View>
            <View className="flex-row items-start">
              <Text className="text-lg mr-3 mt-1">📈</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800 mb-1">Continuous Learning</Text>
                <Text className="text-xs text-gray-600">
                  Recommendations improve over time as we learn more about your health patterns
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecommendationsScreen; 