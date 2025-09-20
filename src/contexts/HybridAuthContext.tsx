'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { apiClient } from '@/lib/api';

/**
 * Hybrid Authentication Context
 * 
 * This context provides both Firebase authentication (for Gmail/Google) and 
 * custom backend authentication (for manual signup/login) with email verification.
 * 
 * Features:
 * - Firebase Authentication with Gmail/Google
 * - Manual authentication with email verification
 * - Automatic token verification and user state management
 * - User profile management
 * - Email verification and password reset
 * - Integration with backend API for user data
 */

/**
 * User interface definition
 * Represents the structure of user data throughout the application
 */
interface User {
  _id?: string;
  uid?: string;
  name: string;
  email: string;
  role?: 'Buyer' | 'Seller';
  emailVerified: boolean;
  profile?: {
    company?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication context type definition
 * Defines the shape of the authentication context value
 */
interface HybridAuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  authType: 'firebase' | 'manual' | null;
  
  // Manual authentication methods
  registerManual: (userData: { name: string; email: string; password: string; confirmPassword: string; role: 'Buyer' | 'Seller' }) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  loginManual: (email: string, password: string) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
  completeRegistration: (role: 'Buyer' | 'Seller', profileData?: any) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  
  // Firebase authentication methods
  loginWithGoogle: () => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  registerWithGoogle: (role: 'Buyer' | 'Seller', profileData?: any) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  
  // Common methods
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
}

const HybridAuthContext = createContext<HybridAuthContextType | undefined>(undefined);

/**
 * Hybrid Authentication Provider Component
 * 
 * Provides both Firebase and manual authentication state and methods to all child components.
 * Manages user session, token validation, and authentication operations.
 */
export function HybridAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authType, setAuthType] = useState<'firebase' | 'manual' | null>(null);
  const router = useRouter();

  // Refs to prevent infinite loops
  const hasCheckedBackendRef = useRef(false);
  const lastFirebaseUidRef = useRef<string | null>(null);

  /**
   * Initialize authentication state on component mount
   * Listens to Firebase auth state changes and checks for existing sessions
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      if (firebaseUser) {
        console.log('Firebase user:', firebaseUser.email, firebaseUser.uid);
        setFirebaseUser(firebaseUser);
        setIsEmailVerified(firebaseUser.emailVerified);
        setAuthType('firebase');
        
        // Only check backend once per Firebase user to prevent infinite loops
        if (firebaseUser.uid !== lastFirebaseUidRef.current) {
          lastFirebaseUidRef.current = firebaseUser.uid;
          hasCheckedBackendRef.current = false;
        }
        
        if (!hasCheckedBackendRef.current) {
          hasCheckedBackendRef.current = true;
          
          try {
            console.log('Checking existing user in backend...');
            const response = await apiClient.getCurrentUser();
            console.log('getCurrentUser response:', response);
            if (response.success && response.data) {
              // Existing user - set user data
              console.log('Existing user found:', response.data.user);
              setUser(response.data.user);
            } else {
              // New user - don't set user here, let register/login methods handle it
              console.log('New user (not found in backend)');
              setUser(null);
            }
          } catch (error) {
            // User not found - this is expected for new users
            console.log('Error checking user in backend:', error);
            setUser(null);
          }
        }
      } else {
        // Check for manual authentication token
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const response = await apiClient.getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data.user);
              setAuthType('manual');
              setIsEmailVerified(response.data.user.emailVerified);
            } else {
              // Invalid token, remove it
              localStorage.removeItem('authToken');
              setUser(null);
              setAuthType(null);
            }
          } catch (error) {
            // Invalid token, remove it
            localStorage.removeItem('authToken');
            setUser(null);
            setAuthType(null);
          }
        } else {
          setFirebaseUser(null);
          setUser(null);
          setIsEmailVerified(false);
          setAuthType(null);
        }
        hasCheckedBackendRef.current = false;
        lastFirebaseUidRef.current = null;
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Manual registration with email verification
   */
  const registerManual = async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string;
    role: 'Buyer' | 'Seller';
  }): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      const response = await apiClient.registerManual(userData);
      
      if (response.success) {
        return { 
          success: true, 
          message: 'Account created successfully! Please check your email to verify your account.' 
        };
      } else {
        return { 
          success: false, 
          message: response.message,
          errors: response.errors 
        };
      }
    } catch (error: any) {
      console.error('Manual registration failed:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  /**
   * Manual login with email and password
   */
  const loginManual = async (email: string, password: string): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      const response = await apiClient.loginManual(email, password);
      
      if (response.success && response.data?.token) {
        // Store JWT token
        localStorage.setItem('authToken', response.data.token);
        
        // Set user data
        setUser(response.data.user);
        setAuthType('manual');
        setIsEmailVerified(response.data.user.emailVerified);
        
        return { success: true, message: 'Successfully signed in' };
      } else {
        return { 
          success: false, 
          message: response.message,
          errors: response.errors 
        };
      }
    } catch (error: any) {
      console.error('Manual login failed:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  /**
   * Verify email with token
   */
  const verifyEmail = async (token: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.verifyEmail(token);
      
      if (response.success) {
        // Store JWT token if provided (for manual signup users)
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        // Update user data
        if (response.data?.user) {
          setUser(response.data.user);
          setAuthType('manual');
        } else if (user) {
          setUser({ ...user, emailVerified: true });
        }
        
        return { success: true, message: 'Email verified successfully!' };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Email verification failed:', error);
      return { 
        success: false, 
        message: error.message || 'Email verification failed. Please try again.' 
      };
    }
  };

  /**
   * Complete registration with role (after email verification)
   */
  const completeRegistration = async (role: 'Buyer' | 'Seller', profileData?: any): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      const response = await apiClient.completeRegistration(role, profileData);
      
      if (response.success && response.data?.token) {
        // Store JWT token if provided
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        // Update user data
        setUser(response.data.user);
        setAuthType('manual');
        
        return { success: true, message: 'Registration completed successfully!' };
      } else {
        return { 
          success: false, 
          message: response.message,
          errors: response.errors 
        };
      }
    } catch (error: any) {
      console.error('Complete registration failed:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to complete registration. Please try again.' 
      };
    }
  };

  /**
   * Resend verification email
   */
  const resendVerificationEmail = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.resendVerificationEmail(email);
      
      if (response.success) {
        return { success: true, message: 'Verification email sent successfully!' };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Resend verification email failed:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to resend verification email. Please try again.' 
      };
    }
  };

  /**
   * Authenticate user with Google
   */
  const loginWithGoogle = async (): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Check if user exists in backend
      try {
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          // Existing user - set user data
          setUser(response.data.user);
          setAuthType('manual'); // Use manual auth type for unified JWT system
          return { success: true, message: 'Successfully signed in with Google' };
        }
      } catch (error) {
        // User not found - new user
        console.log('New Google user detected');
      }
      
      // For new users, we'll handle role selection in the component
      return { success: true, message: 'New user - role selection needed' };
    } catch (error: any) {
      console.error('Google login failed:', error);
      let message = 'Google login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          message = 'Login popup was closed. Please try again.';
          break;
        case 'auth/popup-blocked':
          message = 'Login popup was blocked. Please allow popups and try again.';
          break;
        case 'auth/cancelled-popup-request':
          message = 'Login was cancelled. Please try again.';
          break;
      }
      
      return { 
        success: false, 
        message 
      };
    }
  };

  /**
   * Register with Google (create new user with role)
   */
  const registerWithGoogle = async (role: 'Buyer' | 'Seller', profileData?: any): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      console.log('Starting Google registration for role:', role);
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      console.log('Firebase user from popup:', firebaseUser.email, firebaseUser.uid);
      
      // Register user in backend with role
      console.log('Calling registerFirebase...');
      const response = await apiClient.registerFirebase(firebaseUser, role, profileData);
      console.log('registerFirebase response:', response);
      
      if (response.success && response.data?.token) {
        // Store JWT token (unified authentication)
        localStorage.setItem('authToken', response.data.token);
        
        // Set user data
        setUser(response.data.user);
        setAuthType('manual'); // Use manual auth type for unified JWT system
        
        return { success: true, message: 'Account created successfully with Google' };
      } else {
        return { 
          success: false, 
          message: response.message,
          errors: response.errors 
        };
      }
    } catch (error: any) {
      console.error('Google registration failed:', error);
      return { 
        success: false, 
        message: error.message || 'Google registration failed. Please try again.' 
      };
    }
  };

  /**
   * Log out the current user
   */
  const logout = async (): Promise<void> => {
    try {
      // Clear manual auth token
      localStorage.removeItem('authToken');
      
      // Sign out from Firebase if logged in with Firebase
      if (authType === 'firebase') {
        await signOut(auth);
      }
      
      // Clear all state
      setUser(null);
      setFirebaseUser(null);
      setIsEmailVerified(false);
      setAuthType(null);
      
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Update user profile information
   */
  const updateUser = async (userData: any): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      const response = await apiClient.updateProfile(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      return { 
        success: false, 
        message: response.message,
        errors: response.errors 
      };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { 
        success: false, 
        message: 'Profile update failed. Please try again.' 
      };
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Try Firebase password reset first
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        message: 'Password reset email sent! Please check your inbox.' 
      };
    } catch (error: any) {
      console.error('Password reset failed:', error);
      let message = 'Failed to send password reset email.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
      }
      
      return { 
        success: false, 
        message 
      };
    }
  };

  /**
   * Refresh user data from backend
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: HybridAuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isEmailVerified,
    authType,
    registerManual,
    loginManual,
    verifyEmail,
    completeRegistration,
    resendVerificationEmail,
    loginWithGoogle,
    registerWithGoogle,
    logout,
    updateUser,
    resetPassword,
    refreshUser
  };

  return (
    <HybridAuthContext.Provider value={value}>
      {children}
    </HybridAuthContext.Provider>
  );
}

/**
 * Custom hook to access hybrid authentication context
 * 
 * @returns {HybridAuthContextType} Hybrid authentication context value
 * @throws {Error} If used outside of HybridAuthProvider
 */
export function useHybridAuth() {
  const context = useContext(HybridAuthContext);
  if (context === undefined) {
    throw new Error('useHybridAuth must be used within a HybridAuthProvider');
  }
  return context;
}
