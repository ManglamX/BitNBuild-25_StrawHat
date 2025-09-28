// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  spiceLevel: 'mild' | 'medium' | 'hot';
  allergies: string[];
  mealSize: 'small' | 'medium' | 'large';
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  planType: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  deliveryAddress: Address;
  mealPreferences: UserPreferences;
  nextBillingDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
}

// Menu Types
export interface Menu {
  id: string;
  date: string;
  vendorId: string;
  vendorName: string;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  imageUrl: string;
  ingredients: string[];
  nutritionalInfo: NutritionalInfo;
  isVegetarian: boolean;
  isVegan: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  allergens: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  subscriptionId?: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderDate: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  mealId: string;
  mealName: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

// Delivery Types
export interface Delivery {
  id: string;
  orderId: string;
  userId: string;
  deliveryPersonId: string;
  status: 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  deliveryAddress: Address;
  trackingInfo: TrackingInfo;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingInfo {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  route: {
    latitude: number;
    longitude: number;
  }[];
  estimatedTimeRemaining: number; // in minutes
  distanceRemaining: number; // in km
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: 'card' | 'upi' | 'netbanking' | 'wallet';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId?: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'delivery' | 'subscription' | 'payment' | 'promotion' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Menu: undefined;
  MenuDetail: { mealId: string };
  Subscription: undefined;
  SubscriptionDetail: { subscriptionId: string };
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
  Payment: undefined;
  AddressBook: undefined;
  AddAddress: undefined;
  EditAddress: { addressId: string };
  Tracking: { deliveryId: string };
  EnhancedTracking: { routeId: string };
  RouteOptimization: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Menu: undefined;
  Subscription: undefined;
  Profile: undefined;
};

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface AddressForm {
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Filter Types
export interface MealFilters {
  category?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  spiceLevel?: string;
  maxPrice?: number;
  minPrice?: number;
}

// Search Types
export interface SearchParams {
  query: string;
  filters?: MealFilters;
  sortBy?: 'price' | 'name' | 'rating';
  sortOrder?: 'asc' | 'desc';
}
