import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

class AuthService {
  private baseURL = API_BASE_URL;

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);
      }

      return data;
    } catch (error) {
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);
      }

      return data;
    } catch (error) {
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (token) {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      // Clear stored tokens
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!token) {
        return null;
      }

      const response = await fetch(`${this.baseURL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      }

      return null;
    } catch (error) {
      console.log('Get current user error:', error);
      return null;
    }
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const newToken = data.data.token;
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        return newToken;
      }

      return null;
    } catch (error) {
      console.log('Refresh token error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      return token !== null;
    } catch (error) {
      return false;
    }
  }

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      return null;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  // Update profile
  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; message: string; data?: User }> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check your internet connection.');
    }
  }
}

export default new AuthService();
