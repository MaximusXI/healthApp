import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import HealthCard from '../components/HealthCard';
import ProgressBar from '../components/ProgressBar';
import healthService from '../services/healthService';

const MetricsScreen = () => {
  const [healthData, setHealthData] = useState({});
  const [aggregatedData, setAggregatedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  useEffect(() => {
    fetchHealthData();
  }, [selectedPeriod]);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      const data = await healthService.fetchHealthData(selectedPeriod);
      setHealthData(data);
      console.log('Collected health data in metrics screen', data);
      
      const aggregated = healthService.getAggregatedData(data);
      setAggregatedData(aggregated);
    } catch (error) {
      console.error('Error fetching health data:', error);
      Alert.alert('Error', 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHealthData();
    setRefreshing(false);
  };

  const periods = [
    { key: '24h', label: '24 Hours' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-blue-600 px-5 pt-12 pb-6 shadow-lg">
        <Text className="text-2xl font-bold text-white mb-2">Health Metrics</Text>
        <Text className="text-green-100">Detailed health data and trends</Text>
      </View>

      {/* Period Selector */}
      <View className="bg-white px-5 py-4 border-b border-gray-200 shadow-sm">
        <Text className="text-sm font-medium text-gray-700 mb-3">Time Period</Text>
        <View className="flex-row">
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              onPress={() => setSelectedPeriod(period.key)}
              className={`flex-1 py-2 px-3 rounded-lg mr-2 ${
                selectedPeriod === period.key
                  ? 'bg-green-600 border border-green-600'
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              <Text
                className={`text-sm font-medium text-center ${
                  selectedPeriod === period.key ? 'text-white' : 'text-gray-700'
                }`}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Activity Metrics */}
        <View className="mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Activity</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Steps"
                value={aggregatedData.steps?.total || 0}
                unit="steps"
                icon="👟"
                color="gray"
                subtitle={`Avg: ${aggregatedData.steps?.average || 0}/day`}
                trend={aggregatedData.steps?.total > 8000 ? 'up' : 'down'}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Distance"
                value={aggregatedData.distance?.total || 0}
                unit="meters"
                icon="🚶"
                color="gray"
                subtitle={`Avg: ${aggregatedData.distance?.average || 0}m/day`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Calories"
                value={aggregatedData.calories?.total || 0}
                unit="kcal"
                icon="🔥"
                color="gray"
                subtitle={`Avg: ${aggregatedData.calories?.average || 0} kcal/day`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Active Time"
                value={aggregatedData.activeTime?.total || 0}
                unit="min"
                icon="⏱️"
                color="gray"
                subtitle={`Avg: ${aggregatedData.activeTime?.average || 0} min/day`}
              />
            </View>
          </View>
        </View>

        {/* Vital Signs */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Vital Signs</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Heart Rate"
                value={aggregatedData.heartRate?.latest || '--'}
                unit="BPM"
                icon="❤️"
                color="gray"
                subtitle={`Avg: ${aggregatedData.heartRate?.average || '--'} BPM`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Blood Pressure"
                value={aggregatedData.bloodPressure?.latest || '--'}
                unit="mmHg"
                icon="🩺"
                color="gray"
                subtitle={`Avg: ${aggregatedData.bloodPressure?.average || '--'}`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Weight"
                value={aggregatedData.weight?.latest || '--'}
                unit="kg"
                icon="⚖️"
                color="gray"
                subtitle={`Change: ${aggregatedData.weight?.change || '--'} kg`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="BMI"
                value={aggregatedData.bmi?.latest || '--'}
                unit=""
                icon="📏"
                color="gray"
                subtitle={`Category: ${aggregatedData.bmi?.category || '--'}`}
              />
            </View>
          </View>
        </View>

        {/* Sleep Analysis */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Sleep Analysis</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Sleep Duration"
                value={aggregatedData.sleep?.averageHours || '--'}
                unit="hrs"
                icon="😴"
                color="gray"
                subtitle={`${aggregatedData.sleep?.sessions || 0} sessions`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Sleep Quality"
                value={aggregatedData.sleep?.quality || '--'}
                unit="%"
                icon="🌙"
                color="gray"
                subtitle="Deep sleep percentage"
              />
            </View>
          </View>
          {aggregatedData.sleep && (
            <View className="mt-3">
              <ProgressBar
                current={aggregatedData.sleep.averageHours || 0}
                target={8}
                title="Sleep Goal (8 hours)"
                unit="hours"
                color="gray"
              />
            </View>
          )}
        </View>

        {/* Nutrition */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Nutrition</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Water Intake"
                value={aggregatedData.water?.average || 0}
                unit="ml"
                icon="💧"
                color="gray"
                subtitle={`Goal: ${aggregatedData.water?.goal || 2000}ml`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Calories Consumed"
                value={aggregatedData.nutrition?.calories || 0}
                unit="kcal"
                icon="🍽️"
                color="gray"
                subtitle={`Goal: ${aggregatedData.nutrition?.calorieGoal || 2000} kcal`}
              />
            </View>
          </View>
          {aggregatedData.water && (
            <View className="mt-3">
              <ProgressBar
                current={aggregatedData.water.total || 0}
                target={aggregatedData.water.goal || 2000}
                title="Daily Water Goal"
                unit="ml"
                color="gray"
              />
            </View>
          )}
        </View>

        {/* Exercise */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Exercise</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-3">
              <HealthCard
                title="Workouts"
                value={aggregatedData.exercise?.sessions || 0}
                unit=""
                icon="🏃"
                color="gray"
                subtitle={`${aggregatedData.exercise?.totalDuration || 0} min total`}
              />
            </View>
            <View className="w-[48%] mb-3">
              <HealthCard
                title="VO2 Max"
                value={aggregatedData.vo2Max?.latest || '--'}
                unit="ml/kg/min"
                icon="🫁"
                color="gray"
                subtitle={`Fitness level: ${aggregatedData.vo2Max?.level || '--'}`}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MetricsScreen; 