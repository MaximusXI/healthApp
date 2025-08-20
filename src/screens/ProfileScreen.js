import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import healthService from '../services/healthService';
import { AuthContext } from '../services/AuthContext';

const ProfileScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [healthConnectStatus, setHealthConnectStatus] = useState('connected');
  const { logout, user } = useContext(AuthContext);

  // Format the member since date
  const getMemberSinceText = () => {
    if (!user || !user.metadata || !user.metadata.creationTime) {
      return 'Member since recently';
    }
    
    const creationDate = new Date(user.metadata.creationTime);
    const options = { year: 'numeric', month: 'long' };
    return `Member since ${creationDate.toLocaleDateString('en-US', options)}`;
  };

  // Get user display name or fallback
  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  // Get user email
  const getUserEmail = () => {
    return user?.email || 'No email available';
  };

  const handleDisconnectHealthConnect = async () => {
    try {
      await healthService.disconnect();
      setHealthConnectStatus('disconnected');
      Alert.alert('Success', 'Health Connect disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Health Connect:', error);
      Alert.alert('Error', 'Failed to disconnect Health Connect');
    }
  };

  const handleConnectHealthConnect = async () => {
    try {
      const initialized = await healthService.initialize();
      if (initialized) {
        const granted = await healthService.requestPermissions();
        if (granted) {
          setHealthConnectStatus('connected');
          Alert.alert('Success', 'Health Connect connected successfully');
        } else {
          Alert.alert('Permission Denied', 'Please grant permissions to use Health Connect');
        }
      } else {
        Alert.alert('Not Available', 'Health Connect is not available on this device');
      }
    } catch (error) {
      console.error('Error connecting Health Connect:', error);
      Alert.alert('Error', 'Failed to connect Health Connect');
    }
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will export all your health data in JSON format. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Data export completed') }
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This action cannot be undone. All your health data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'All data has been deleted')
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-blue-600 px-5 pt-12 pb-6 shadow-lg">
        <Text className="text-2xl font-bold text-white mb-2">Profile & Settings</Text>
        <Text className="text-indigo-100">Manage your account and preferences</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View className="bg-white rounded-xl p-4 mt-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Account Information</Text>
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium text-gray-800">{getUserDisplayName()}</Text>
              <Text className="text-sm text-gray-600">{getUserEmail()}</Text>
              <Text className="text-xs text-gray-500">{getMemberSinceText()}</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <Text className="text-indigo-700 font-medium text-center">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Health Connect Status */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Health Connect</Text>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">🔗</Text>
              <View>
                <Text className="text-sm font-medium text-gray-800">Connection Status</Text>
                <Text className={`text-xs ${
                  healthConnectStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {healthConnectStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={healthConnectStatus === 'connected' ? handleDisconnectHealthConnect : handleConnectHealthConnect}
              className={`px-4 py-2 rounded-lg ${
                healthConnectStatus === 'connected' 
                  ? 'bg-red-100 border border-red-200' 
                  : 'bg-green-100 border border-green-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                healthConnectStatus === 'connected' ? 'text-red-700' : 'text-green-700'
              }`}>
                {healthConnectStatus === 'connected' ? 'Disconnect' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-600">
            {healthConnectStatus === 'connected' 
              ? 'Your health data is being synced from Google Health Connect'
              : 'Connect to Google Health Connect to sync your health data'
            }
          </Text>
        </View>

        {/* Notifications */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Notifications</Text>
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">🔔</Text>
                <View>
                  <Text className="text-sm font-medium text-gray-800">Push Notifications</Text>
                  <Text className="text-xs text-gray-600">Receive health reminders and updates</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
                thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">📧</Text>
                <View>
                  <Text className="text-sm font-medium text-gray-800">Email Notifications</Text>
                  <Text className="text-xs text-gray-600">Weekly health reports and insights</Text>
                </View>
              </View>
              <Switch
                value={dataSharing}
                onValueChange={setDataSharing}
                trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
                thumbColor={dataSharing ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">App Settings</Text>
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">🌙</Text>
                <View>
                  <Text className="text-sm font-medium text-gray-800">Dark Mode</Text>
                  <Text className="text-xs text-gray-600">Switch to dark theme</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
                thumbColor={darkMode ? '#ffffff' : '#f3f4f6'}
              />
            </View>
            <TouchableOpacity className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">🔒</Text>
                <View>
                  <Text className="text-sm font-medium text-gray-800">Privacy Settings</Text>
                  <Text className="text-xs text-gray-600">Manage data sharing and privacy</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">🔄</Text>
                <View>
                  <Text className="text-sm font-medium text-gray-800">Sync Settings</Text>
                  <Text className="text-xs text-gray-600">Configure data synchronization</Text>
                </View>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Data Management</Text>
          <View className="space-y-3">
            <TouchableOpacity 
              onPress={handleExportData}
              className="flex-row items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <Text className="text-lg mr-3">📤</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-blue-800">Export Health Data</Text>
                <Text className="text-xs text-blue-600">Download your data as JSON file</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDeleteData}
              className="flex-row items-center p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <Text className="text-lg mr-3">🗑️</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-red-800">Delete All Data</Text>
                <Text className="text-xs text-red-600">Permanently remove all health data</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & About */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Support & About</Text>
          <View className="space-y-3">
            <TouchableOpacity className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">❓</Text>
                <Text className="text-sm font-medium text-gray-800">Help & Support</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">📋</Text>
                <Text className="text-sm font-medium text-gray-800">Terms of Service</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">🔒</Text>
                <Text className="text-sm font-medium text-gray-800">Privacy Policy</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <View className="flex-row items-center">
                <Text className="text-lg mr-3">ℹ️</Text>
                <Text className="text-sm font-medium text-gray-800">About HealthBridge</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-md border border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-lg mr-3">📱</Text>
              <View>
                <Text className="text-sm font-medium text-gray-800">App Version</Text>
                <Text className="text-xs text-gray-600">HealthBridge v1.0.0</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200">
              <Text className="text-indigo-700 text-xs font-medium">Check for Updates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={logout}
        className="bg-black rounded-lg py-3 px-8 items-center m-6">
      <Text className="text-white font-bold text-base">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen; 