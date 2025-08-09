import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { AuthContext } from '../services/AuthContext';
import { authorizeFitbit } from '../utils/fitbitUtil';

const BULLETS = [
  'Sync steps, heart rate, and sleep automatically.',
  'Only the metrics you consent to will be read.',
  'You can disconnect Fitbit anytime from Profile.',
  'The first sync may take a few seconds.',
  'We never post to your Fitbit account.',
];

const FitbitScreen = () => {
  const { setFitbitConnected } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleConnectFitbit = async () => {
    try {
      setLoading(true);
      // forceLogin: true during testing so that always see Fitbit auth screen
      await authorizeFitbit({ forceLogin: true });
      setFitbitConnected(true);
      Alert.alert('Connected', 'Fitbit connection successful!');
    } catch (e) {
      console.warn('Fitbit connect error:', e);
      Alert.alert('Connection failed', e?.message || 'Could not connect to Fitbit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-blue-600"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <View className="flex-1 bg-blue-600">
        <View className="items-center mt-8 mb-5">
          <Text className="text-white text-2xl font-bold">Connect your Fitbit</Text>
          <Text className="text-white/80 mt-2">One step before you start</Text>
        </View>

        <View className="flex-1 bg-white rounded-t-[30px] p-5">
          <Text className="text-lg font-semibold mb-3">How to use the app</Text>

          <ScrollView className="mb-6" contentContainerStyle={{ paddingBottom: 16 }}>
            {BULLETS.map((b, i) => (
              <View key={i} className="flex-row mb-3">
                <Text className="text-blue-600 mr-2">•</Text>
                <Text className="text-gray-700 flex-1">{b}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={handleConnectFitbit}
            disabled={loading}
            className="bg-black rounded-lg py-3 px-8 w-full items-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Connect with Fitbit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FitbitScreen;
