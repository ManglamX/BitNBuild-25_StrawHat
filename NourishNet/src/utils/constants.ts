// API Configuration
// Platform-aware API base URL so web, Android emulator and local dev work without manual edits.
// - web: uses the current page hostname (works with Expo web / dev server)
// - android emulator: uses 10.0.2.2 which maps to host machine
// - default/ios/simulators: use localhost
import { Platform } from 'react-native';

function detectApiBase(): string {
  const port = 5000;

  try {
    if (Platform.OS === 'web') {
      // window.location.hostname will be 127.0.0.1 or localhost or your machine IP when served
      const host = (typeof window !== 'undefined' && window.location && window.location.hostname)
        ? window.location.hostname
        : 'localhost';
      return `http://${host}:${port}/api/v1`;
    }

    if (Platform.OS === 'android') {
      // Android emulator (AVD) maps host machine's localhost to 10.0.2.2
      // Note: physical Android devices must use the machine IP instead (see README / notes)
      return `http://10.0.2.2:${port}/api/v1`;
    }

    // Fallback for iOS simulator and native runs on desktop dev machine
    return `http://localhost:${port}/api/v1`;
  } catch (e) {
    return `http://localhost:${port}/api/v1`;
  }
}

export const API_BASE_URL = detectApiBase(); // Flask backend URL

// App Configuration
export const APP_NAME = 'NourishNet';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  NOTIFICATION_SETTINGS: 'notification_settings',
  CART_ITEMS: 'cart_items',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    PROFILE: '/auth/profile',
  },
  USER: {
    PROFILE: '/user/profile',
    ADDRESSES: '/user/addresses',
    PREFERENCES: '/user/preferences',
  },
  SUBSCRIPTION: {
    LIST: '/subscriptions',
    CREATE: '/subscriptions',
    UPDATE: '/subscriptions',
    CANCEL: '/subscriptions',
    PAUSE: '/subscriptions',
    RESUME: '/subscriptions',
  },
  MENU: {
    DAILY: '/menu/daily',
    WEEKLY: '/menu/weekly',
    MEAL_DETAIL: '/menu/meal',
  },
  ORDER: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: '/orders',
    CANCEL: '/orders',
  },
  DELIVERY: {
    TRACK: '/delivery/track',
    HISTORY: '/delivery/history',
  },
  PAYMENT: {
    CREATE: '/payment/create',
    VERIFY: '/payment/verify',
    METHODS: '/payment/methods',
  },
  NOTIFICATION: {
    LIST: '/notifications',
    MARK_READ: '/notifications/read',
    SETTINGS: '/notifications/settings',
  },
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  DAILY: {
    id: 'daily',
    name: 'Daily Plan',
    description: 'Order meals day by day',
    price: 150,
    currency: 'INR',
    features: ['Flexible ordering', 'Daily menu selection', 'Free delivery'],
  },
  WEEKLY: {
    id: 'weekly',
    name: 'Weekly Plan',
    description: '7-day meal subscription',
    price: 900,
    currency: 'INR',
    features: ['7 days of meals', '10% discount', 'Priority delivery', 'Menu customization'],
  },
  MONTHLY: {
    id: 'monthly',
    name: 'Monthly Plan',
    description: '30-day meal subscription',
    price: 3500,
    currency: 'INR',
    features: ['30 days of meals', '20% discount', 'Priority delivery', 'Full menu customization', 'Free pause/resume'],
  },
} as const;

// Meal Categories
export const MEAL_CATEGORIES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
} as const;

// Delivery Status
export const DELIVERY_STATUS = {
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  DELIVERY: 'delivery',
  SUBSCRIPTION: 'subscription',
  PAYMENT: 'payment',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
} as const;

// Colors
export const COLORS = {
  PRIMARY: '#2E7D32',
  PRIMARY_DARK: '#1B5E20',
  PRIMARY_LIGHT: '#4CAF50',
  SECONDARY: '#FF6F00',
  SECONDARY_DARK: '#E65100',
  SECONDARY_LIGHT: '#FF9800',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#9E9E9E',
  GRAY_LIGHT: '#F5F5F5',
  GRAY_DARK: '#424242',
  BACKGROUND: '#FAFAFA',
  SURFACE: '#FFFFFF',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  BORDER: '#E0E0E0',
} as const;

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

// Font Sizes
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 50,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 28.6139, // Delhi
  DEFAULT_LONGITUDE: 77.2090,
  DEFAULT_ZOOM: 15,
  DELIVERY_RADIUS: 10, // km
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  PERMISSION_ERROR: 'Permission denied.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized access.',
  FORBIDDEN: 'Access forbidden.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  SUBSCRIPTION_CREATED: 'Subscription created successfully!',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  PAYMENT_SUCCESS: 'Payment successful!',
  ADDRESS_ADDED: 'Address added successfully!',
  ADDRESS_UPDATED: 'Address updated successfully!',
} as const;
