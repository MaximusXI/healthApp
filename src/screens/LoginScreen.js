import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,ScrollView
} from 'react-native';
import { AuthContext } from '../services/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Mail } from 'lucide-react-native';
import PasswordInput from '../utils/PasswordInput';
import { fitbitAuthConfig } from '../utils/authConfig';
import { authorize } from 'react-native-app-auth';
import { fetchFitbitData } from '../utils/fitbit';
import { revoke } from 'react-native-app-auth';



const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await authorize({
        ...fitbitAuthConfig,
        additionalParameters: {
          prompt: 'login' // Force login every time
        }
      });
      console.log('Access Token:', result.accessToken);
      console.log('Refresh Token:', result.refreshToken);
      console.log('Token Type:', result.tokenType);
      console.log('Expires At:', result.expiresAt);
      console.log('Scope:', result.scope);
      console.log('State:', result.state);
      console.log('Id Token:', result.idToken);
      console.log('Authorization Code:', result.authorizationCode);

      if (result?.accessToken) {
        const metrics = await fetchFitbitData(result.accessToken);
        console.log('Fitbit Data:', metrics);
        setData(metrics);
      }
      // await revoke(fitbitAuthConfig, {
      //   tokenToRevoke: result.accessToken,
      //   sendClientId: true,
      // });
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (data?.accessToken) {
        await revoke(fitbitAuthConfig, {
          tokenToRevoke: data.accessToken,
          sendClientId: true
        });
      }
      setData(null);
      Alert.alert('Logged Out', 'You have been logged out from Fitbit.');
    } catch (e) {
      console.error('Logout error:', e);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-blue-600"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <View className="flex-1 bg-blue-600 justify-center">
        {/* Header */}
        <View className="items-center mt-8 mb-5">
          <Text className="text-white text-2xl font-bold">Sign in to Your Account</Text>
        </View>

        {/* Form Section */}
        <View className="flex-1 justify-center bg-white rounded-t-[30px] p-5">
          {/* Email Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 mb-4">
            <Mail size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 text-base text-gray-700 ml-2"
              placeholder="Email address"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <PasswordInput value={password} onChangeText={setPassword} />

          {/* Error Message */}
          {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-black rounded-lg py-3 px-8 mb-3 w-full items-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Navigation */}
          <Text className="text-center text-gray-500 mt-4">
            Don't have an account?{' '}
            <Text
              className="text-blue-600 font-bold"
              onPress={() => navigation.navigate('Signup')}
            >
              Sign Up now
            </Text>
          </Text>
          {data && (
  <ScrollView className="mt-6 max-h-[300px] bg-gray-100 p-4 rounded-lg">
    <Text className="text-gray-800 font-semibold mb-2">Profile:</Text>
    <Text className="text-xs text-gray-700 mb-2">
      {JSON.stringify(data.profile, null, 2)}
    </Text>

    <Text className="text-gray-800 font-semibold mb-2">Steps:</Text>
    <Text className="text-xs text-gray-700 mb-2">
      {JSON.stringify(data.steps, null, 2)}
    </Text>

    <Text className="text-gray-800 font-semibold mb-2">Heart:</Text>
    <Text className="text-xs text-gray-700 mb-2">
      {JSON.stringify(data.heart, null, 2)}
    </Text>

    <Text className="text-gray-800 font-semibold mb-2">Sleep (minutes asleep):</Text>
    <Text className="text-xs text-gray-700">
      {JSON.stringify(data.sleep, null, 2)}
    </Text>
  </ScrollView>
  
)}
<TouchableOpacity
  onPress={handleLogout}
  className="bg-red-600 rounded-lg py-3 px-8 mt-4 w-full items-center"
>
  <Text className="text-white font-bold text-base">Logout from Fitbit</Text>
</TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
