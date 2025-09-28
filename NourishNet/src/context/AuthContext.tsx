import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types';
import authService from '../services/authService';

// Auth State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_UPDATE_USER'; payload: User };

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Auth Context Interface
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to get user data' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Not authenticated' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication check failed' });
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.login({ email, password });
      
      if (response.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, phone: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authService.register({ name, email, password, phone });
      
      if (response.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.log('Logout error:', error);
      // Still logout locally even if server call fails
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await authService.updateProfile(userData);
      
      if (response.success && response.data) {
        dispatch({ type: 'AUTH_UPDATE_USER', payload: response.data });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  // Context value
  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateUser,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
