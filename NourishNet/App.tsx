import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor={COLORS.PRIMARY} />
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
