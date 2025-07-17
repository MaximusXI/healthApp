import React from 'react';
import "./global.css"
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/services/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
