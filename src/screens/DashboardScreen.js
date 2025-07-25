import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import HealthCard from '../components/HealthCard';
import ProgressBar from '../components/ProgressBar';
import healthService from '../services/healthService';
import aiService from '../services/aiService';
import healthSync from '../services/healthSync';

const DashboardScreen = ({ navigation }) => {
  const [healthData, setHealthData] = useState({});
  const [aggregatedData, setAggregatedData] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [healthConnectAvailable, setHealthConnectAvailable] = useState(true);

  healthSync();

  useEffect(() => {
    initializeHealthConnect();
  }, []);

  const initializeHealthConnect = async () => {
    try {
      const initialized = await healthService.initialize();
      setHealthConnectAvailable(initialized);
      
      if (initialized) {
        await requestPermissions();
      } else {
        console.log('Health Connect not available, using mock data');
        // Still fetch data even if Health Connect is not available
        fetchHealthData();
      }
    } catch (error) {
      console.error('Initialization error:', error);
      setHealthConnectAvailable(false);
      // Still fetch data even if there's an error
      fetchHealthData();
    }
  };

  const requestPermissions = async () => {
    try {
      const granted = await healthService.requestPermissions();
      setPermissionsGranted(granted);
      if (granted) {
        fetchHealthData();
      } else {
        console.log('Permissions not granted, using mock data');
        fetchHealthData();
      }
    } catch (error) {
      console.error('Permission request error:', error);
      setPermissionsGranted(false);
      // Still fetch data even if permissions fail
      fetchHealthData();
    }
  };

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const data = await healthService.fetchHealthData('24h');
      setHealthData(data);
      console.log('HealthData is:');
      console.log(data);
      const aggregated = healthService.getAggregatedData(data);
      setAggregatedData(aggregated);
      console.log('The aggregated health data is:');
      console.log(aggregated);
      
      // Get AI recommendations
      const aiRecommendations = await aiService.sendHealthDataToBackend(data, aggregated);
      setRecommendations(aiRecommendations);
    } catch (error) {
      console.error('Error fetching health data:', error);
      // Don't show alert for mock data errors
      if (healthConnectAvailable) {
        Alert.alert('Error', 'Failed to fetch health data. Using demo data instead.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHealthData();
    setRefreshing(false);
  };

  const getHealthScore = () => {
    if (!aggregatedData.steps && !aggregatedData.heartRate && !aggregatedData.sleep) {
      return 75; // Default score for mock data
    }

    let score = 0;
    let factors = 0;

    // Steps score (0-40 points)
    if (aggregatedData.steps) {
      const stepPercentage = Math.min((aggregatedData.steps.total / 10000) * 100, 100);
      score += (stepPercentage / 100) * 40;
      factors++;
    }

    // Heart rate score (0-30 points)
    if (aggregatedData.heartRate) {
      const hr = aggregatedData.heartRate.average;
      if (hr >= 60 && hr <= 100) {
        score += 30;
      } else if (hr >= 50 && hr <= 110) {
        score += 20;
      } else {
        score += 10;
      }
      factors++;
    }

    // Sleep score (0-30 points)
    if (aggregatedData.sleep) {
      const sleepHours = aggregatedData.sleep.averageHours;
      if (sleepHours >= 7 && sleepHours <= 9) {
        score += 30;
      } else if (sleepHours >= 6 && sleepHours <= 10) {
        score += 20;
      } else {
        score += 10;
      }
      factors++;
    }

    return factors > 0 ? Math.round(score / factors) : 75;
  };

  const healthScore = getHealthScore();

  return (
    <View className="flex-1 bg-white">
      <View className="bg-blue-600 px-5 pt-12 pb-6 shadow-lg">
        <Text className="text-2xl font-bold text-white mb-2">Health Dashboard</Text>
        <Text className="text-blue-100">
          {healthConnectAvailable ? 'Your health overview' : 'Demo mode - using sample data'}
        </Text>
        {!healthConnectAvailable && (
          <Text className="text-blue-200 text-xs mt-1">
            Install Google Health Connect for real data
          </Text>
        )}
      </View>

      <ScrollView 
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Health Score */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4 mt-4 shadow-md border border-gray-300">
          <Text className="text-lg font-semibold text-black mb-3">Health Score</Text>
          <View className="flex-row items-center justify-center mb-3">
            <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mr-4">
              <Text className="text-2xl font-bold text-blue-600">{healthScore}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-black mb-1">Overall Health</Text>
              <Text className="text-xs text-gray-700">
                {healthScore >= 80 ? 'Excellent' : 
                 healthScore >= 60 ? 'Good' : 
                 healthScore >= 40 ? 'Fair' : 'Needs Improvement'}
              </Text>
            </View>
          </View>
          <ProgressBar 
            current={healthScore} 
            target={100} 
            title="Health Score" 
            unit="points" 
            color="blue"
            showPercentage={false}
          />
        </View>

        {/* Quick Stats */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-black mb-3">Today's Stats</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Steps"
                value={aggregatedData.steps?.total || 0}
                unit="steps"
                icon="👟"
                color="green"
                subtitle="Daily goal: 10,000"
                trend={aggregatedData.steps?.total > 8000 ? 'up' : 'down'}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Heart Rate"
                value={aggregatedData.heartRate?.latest || '--'}
                unit="BPM"
                icon="❤️"
                color="red"
                subtitle={`Avg: ${aggregatedData.heartRate?.average || '--'} BPM`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Calories"
                value={aggregatedData.calories?.total || 0}
                unit="kcal"
                icon="🔥"
                color="orange"
                subtitle="Active calories burned"
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Sleep"
                value={aggregatedData.sleep?.averageHours || '--'}
                unit="hrs"
                icon="😴"
                color="purple"
                subtitle={`${aggregatedData.sleep?.sessions || 0} sessions`}
              />
            </View>
          </View>
        </View>

        {/* Goals Progress */}
        {recommendations.goals && recommendations.goals.length > 0 && (
          <View className="bg-gray-50 rounded-xl p-4 mb-4 shadow-md border border-gray-300">
            <Text className="text-lg font-semibold text-black mb-3">Goals Progress</Text>
            {recommendations.goals.map((goal, index) => (
              <ProgressBar
                key={index}
                current={goal.current}
                target={goal.target}
                title={goal.title}
                unit={goal.unit}
                color={index % 2 === 0 ? 'blue' : 'green'}
              />
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4 shadow-md border border-gray-300">
          <Text className="text-lg font-semibold text-black mb-3">Quick Actions</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity 
              onPress={() => navigation.navigate('Metrics')}
              className="flex-1 bg-blue-100 rounded-lg p-3 mr-2 items-center border border-blue-300"
            >
              <Text className="text-2xl mb-1">📊</Text>
              <Text className="text-sm font-medium text-blue-800">View Metrics</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Recommendations')}
              className="flex-1 bg-green-100 rounded-lg p-3 ml-2 items-center border border-green-300"
            >
              <Text className="text-2xl mb-1">💡</Text>
              <Text className="text-sm font-medium text-green-800">AI Insights</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Recommendations */}
        {recommendations.general && recommendations.general.length > 0 && (
          <View className="bg-gray-50 rounded-xl p-4 mb-6 shadow-md border border-gray-300">
            <Text className="text-lg font-semibold text-black mb-3">Recent Insights</Text>
            {recommendations.general.slice(0, 2).map((rec, index) => (
              <View key={index} className="flex-row items-center mb-2 p-2 bg-white rounded-lg border border-gray-200">
                <Text className="text-lg mr-3">{rec.icon}</Text>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-black">{rec.title}</Text>
                  <Text className="text-xs text-gray-700">{rec.description}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Recommendations')}
              className="mt-2"
            >
              <Text className="text-blue-600 text-sm font-medium text-center">
                View All Recommendations →
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DashboardScreen; 