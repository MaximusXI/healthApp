import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Lock, Eye, EyeOff } from "lucide-react-native";

const PasswordInput = ({ value, onChangeText }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 mb-4">
      <Lock size={20} color="#9ca3af" />
      <TextInput
        className="flex-1 text-base text-gray-700 ml-2"
        placeholder="Password"
        placeholderTextColor="#6b7280"
        secureTextEntry={!passwordVisible}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
        {passwordVisible ? (
          <Eye size={20} color="#6b7280" />
        ) : (
          <EyeOff size={20} color="#6b7280" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
