import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import MetricsScreen from '../screens/MetricsScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import FitbitScreen from '../screens/FitbitScreen';
import { AuthContext } from '../services/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SignInStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') iconName = '🏠';
        else if (route.name === 'Metrics') iconName = '📊';
        else if (route.name === 'Recommendations') iconName = '💡';
        else if (route.name === 'Profile') iconName = '👤';
        return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
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
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard' }} />
    <Tab.Screen name="Metrics" component={MetricsScreen} options={{ tabBarLabel: 'Metrics' }} />
    <Tab.Screen name="Recommendations" component={RecommendationsScreen} options={{ tabBarLabel: 'AI Insights' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
  </Tab.Navigator>
);

const SignOutStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
  </Stack.Navigator>
);

// After login: show FitbitScreen first if not connected; else show tabs
const AuthedFlow = () => {
  const { fitbitConnected } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!fitbitConnected ? (
        <Stack.Screen name="Fitbit" component={FitbitScreen} />
      ) : (
        <Stack.Screen name="Tabs" component={SignInStack} />
      )}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext); // user is null if not signed in
  // Optional splash/loader while Firebase resolves auth state
  if (loading) return null;
  return (
    <NavigationContainer>
      {user ? <AuthedFlow /> : <SignOutStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;