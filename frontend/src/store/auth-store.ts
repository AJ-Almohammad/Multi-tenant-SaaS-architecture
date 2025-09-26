import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with real AWS Cognito integration
      const mockUser = {
        id: 'user-' + Date.now(),
        email,
        name: email.split('@')[0],
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, name: string, password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with real AWS Cognito integration
      set({ isLoading: false });
      alert('Registration would be handled by AWS Cognito');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },
}));
