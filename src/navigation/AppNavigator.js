import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import DashboardScreen from '../screens/DashboardScreen';
import MetricsScreen from '../screens/MetricsScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? '🏠' : '🏠';
            } else if (route.name === 'Metrics') {
              iconName = focused ? '📊' : '📊';
            } else if (route.name === 'Recommendations') {
              iconName = focused ? '💡' : '💡';
            } else if (route.name === 'Profile') {
              iconName = focused ? '👤' : '👤';
            }

            return (
              <Text style={{ fontSize: size, color: color }}>
                {iconName}
              </Text>
            );
          },
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tab.Screen 
          name="Metrics" 
          component={MetricsScreen}
          options={{
            tabBarLabel: 'Metrics',
          }}
        />
        <Tab.Screen 
          name="Recommendations" 
          component={RecommendationsScreen}
          options={{
            tabBarLabel: 'AI Insights',
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 