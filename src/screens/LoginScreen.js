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
  Alert,
} from 'react-native';
import { AuthContext } from '../services/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Mail } from 'lucide-react-native';
import PasswordInput from '../utils/PasswordInput';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
