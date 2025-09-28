import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

// Import screens
import LoadingScreen from '../screens/common/LoadingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/main/HomeScreen';
import MenuScreen from '../screens/main/MenuScreen';
import MenuDetailScreen from '../screens/main/MenuDetailScreen';
import SubscriptionScreen from '../screens/main/SubscriptionScreen';
import SubscriptionDetailScreen from '../screens/main/SubscriptionDetailScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import PaymentScreen from '../screens/main/PaymentScreen';
import AddressBookScreen from '../screens/main/AddressBookScreen';
import AddAddressScreen from '../screens/main/AddAddressScreen';
import EditAddressScreen from '../screens/main/EditAddressScreen';
import TrackingScreen from '../screens/main/TrackingScreen';
import EnhancedTrackingScreen from '../screens/main/EnhancedTrackingScreen';
import RouteOptimizationScreen from '../screens/main/RouteOptimizationScreen';

// Navigation Types
import { RootStackParamList, MainTabParamList } from '../types';

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Subscription') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.BORDER,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: COLORS.WHITE,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen} 
        options={{ title: 'Menu' }}
      />
      <Tab.Screen 
        name="Subscription" 
        component={SubscriptionScreen} 
        options={{ title: 'Subscription' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: COLORS.WHITE,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Login' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Register' }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ title: 'Forgot Password' }}
      />
    </Stack.Navigator>
  );
};

// Main Stack Navigator
const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.PRIMARY,
        },
        headerTintColor: COLORS.WHITE,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MenuDetail" 
        component={MenuDetailScreen} 
        options={{ title: 'Meal Details' }}
      />
      <Stack.Screen 
        name="SubscriptionDetail" 
        component={SubscriptionDetailScreen} 
        options={{ title: 'Subscription Details' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: 'Payment' }}
      />
      <Stack.Screen 
        name="AddressBook" 
        component={AddressBookScreen} 
        options={{ title: 'Address Book' }}
      />
      <Stack.Screen 
        name="AddAddress" 
        component={AddAddressScreen} 
        options={{ title: 'Add Address' }}
      />
      <Stack.Screen 
        name="EditAddress" 
        component={EditAddressScreen} 
        options={{ title: 'Edit Address' }}
      />
      <Stack.Screen 
        name="Tracking" 
        component={TrackingScreen} 
        options={{ title: 'Track Delivery' }}
      />
      <Stack.Screen 
        name="EnhancedTracking" 
        component={EnhancedTrackingScreen} 
        options={{ title: 'Live Tracking' }}
      />
      <Stack.Screen 
        name="RouteOptimization" 
        component={RouteOptimizationScreen} 
        options={{ title: 'Route Optimization' }}
      />
    </Stack.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.isAuthenticated ? (
          <Stack.Screen name="Main" component={MainStackNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
