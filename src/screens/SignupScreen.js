import React, { useState,useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Mail, User } from "lucide-react-native";
import { AuthContext } from "../services/AuthContext";
import PasswordInput from "../utils/PasswordInput";
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const { createUserWithEmailAndPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(email, password);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use. Try logging in.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }
      Alert.alert("Signup Failed", errorMessage);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-blue-600"
      style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
    >
      <View className="flex-1 bg-blue-600 justify-center">
        {/* Header */}
        <View className="items-center mt-8 mb-5">
          <Text className="text-white text-2xl font-bold">Create Your Account</Text>
        </View>

        {/* Form Section */}
        <View className="flex-1 justify-center bg-white rounded-t-[30px] p-5">
          {/* Name Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 mb-4">
            <User size={20} color="#9ca3af" className="mr-2" />
            <TextInput
              className="flex-1 text-base text-gray-700"
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email Input */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 mb-4">
            <Mail size={20} color="#9ca3af" className="mr-2" />
            <TextInput
              className="flex-1 text-base text-gray-700"
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

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            className="bg-black rounded-lg py-3 px-8 mb-3 w-full items-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <Text className="text-center text-gray-500 mt-4">
            You already have an account?{" "}
            <Text
              className="text-blue-600 font-bold"
              onPress={() => navigation.navigate("Login")}
            >
              Log in now
            </Text>
          </Text>
        </View>

        {/* Terms & Conditions */}
        <Text className="mt-5 px-3 text-center text-xs text-gray-300">
          By registering, you agree with the{" "}
          <Text className="font-bold text-black">Terms & Conditions</Text> of the App
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;
