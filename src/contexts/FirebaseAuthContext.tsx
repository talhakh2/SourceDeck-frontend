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
 * Firebase Authentication Context
 * 
 * This context provides Firebase authentication state management for the entire application.
 * It handles user login, registration, logout, and profile updates using Firebase Auth
 * with Gmail/Google authentication support.
 * 
 * Features:
 * - Firebase Authentication with Gmail/Google
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
  uid: string;
  name: string;
  email: string;
      role: 'buyer' | 'seller';
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
interface FirebaseAuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  completeUserSetup: (role: 'buyer' | 'seller', profileData?: any) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  register: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<{ success: boolean; errors?: any[]; message?: string }>;
  sendVerificationEmail: () => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

/**
 * Firebase Authentication Provider Component
 * 
 * Provides Firebase authentication state and methods to all child components.
 * Manages user session, token validation, and authentication operations.
 */
export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();

  // Refs to prevent infinite loops
  const hasCheckedBackendRef = useRef(false);
  const lastFirebaseUidRef = useRef<string | null>(null);

  /**
   * Initialize authentication state on component mount
   * Listens to Firebase auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        setIsEmailVerified(firebaseUser.emailVerified);
        
        // Only check backend once per Firebase user to prevent infinite loops
        if (firebaseUser.uid !== lastFirebaseUidRef.current) {
          lastFirebaseUidRef.current = firebaseUser.uid;
          hasCheckedBackendRef.current = false;
        }
        
        if (!hasCheckedBackendRef.current) {
          hasCheckedBackendRef.current = true;
          
          try {
            const response = await apiClient.getCurrentUser();
            if (response.success && response.data) {
              // Existing user - set user data
              setUser(response.data.user);
            } else {
              // New user - don't set user here, let register/login methods handle it
              setUser(null);
            }
          } catch (error) {
            // User not found - this is expected for new users
            console.log('User not found in backend (expected for new users)');
            setUser(null);
          }
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setIsEmailVerified(false);
        hasCheckedBackendRef.current = false;
        lastFirebaseUidRef.current = null;
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array to prevent infinite loops

  /**
   * Get user data from backend or create new user
   */
  const getOrCreateUser = async (firebaseUser: FirebaseUser, roleData?: { role: 'buyer' | 'seller', profile?: any }): Promise<User> => {
    try {
      // Try to get existing user
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        return response.data.user;
      }
    } catch (error) {
      console.log('User not found in backend, creating new user');
    }

    // Create new user in backend
    const userData = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      role: roleData?.role || 'buyer' as const,
      emailVerified: firebaseUser.emailVerified,
      profile: {
        avatar: firebaseUser.photoURL || undefined,
        ...roleData?.profile
      }
    };

    const response = await apiClient.createUser(userData);
    if (response.success && response.data) {
      return response.data.user;
    }

    throw new Error('Failed to create user');
  };

  /**
   * Authenticate user with email and password
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (!firebaseUser.emailVerified) {
        return {
          success: false,
          message: 'Please verify your email before logging in. Check your inbox for a verification email.'
        };
      }

      // Get user data from backend
      try {
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          // Existing user - set user data
          setUser(response.data.user);
          return { success: true, message: 'Successfully signed in' };
        }
      } catch (error) {
        // User not found - this shouldn't happen for email/password login
        console.error('User not found in backend after login:', error);
        return { success: false, message: 'User account not found. Please contact support.' };
      }
      
      return { success: false, message: 'Failed to retrieve user data' };
    } catch (error: any) {
      console.error('Login failed:', error);
      let message = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please try again later.';
          break;
      }
      
      return { 
        success: false, 
        message 
      };
    }
  };

  /**
   * Authenticate user with Google
   */
  const loginWithGoogle = async (role?: 'buyer' | 'seller'): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Check if user exists in backend
      try {
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          // Existing user - set user data
          setUser(response.data.user);
          return { success: true, message: 'Successfully signed in with Google' };
        }
      } catch (error) {
        // User not found - new user
        console.log('New Google user detected');
      }
      
      // For new users, if role is provided, create user immediately
      if (role) {
        try {
          const userData = await getOrCreateUser(firebaseUser, { role });
          setUser(userData);
          return { success: true, message: 'Account created successfully with Google' };
        } catch (error) {
          console.error('Error creating user with role:', error);
          return { success: false, message: 'Failed to create account. Please try again.' };
        }
      }
      
      // For new users without role, we'll handle role selection in the component
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
   * Complete user setup with role selection (for new Google users)
   */
  const completeUserSetup = async (role: 'buyer' | 'seller', profileData?: any): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    if (!firebaseUser) {
      return { success: false, message: 'No authenticated user found' };
    }

    try {
      const userData = await getOrCreateUser(firebaseUser, { role, profile: profileData });
      setUser(userData);
      return { success: true, message: 'Account setup completed successfully' };
    } catch (error: any) {
      console.error('Error completing user setup:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to complete account setup' 
      };
    }
  };

  /**
   * Register a new user account
   */
  const register = async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role?: 'buyer' | 'seller';
    profile?: any;
  }): Promise<{ success: boolean; errors?: any[]; message?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      // Update Firebase user profile
      await updateProfile(firebaseUser, {
        displayName: userData.name
      });

      // Send email verification first
      await sendEmailVerification(firebaseUser);

      // If role is provided, create user in backend immediately
      if (userData.role) {
        try {
          const backendUser = await getOrCreateUser(firebaseUser, { 
            role: userData.role, 
            profile: userData.profile 
          });
          setUser(backendUser);
        } catch (error) {
          console.error('Error creating user in backend:', error);
          // Continue with registration even if backend creation fails
        }
      }

      return { 
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.'
      };
    } catch (error: any) {
      console.error('Registration failed:', error);
      let message = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak. Please choose a stronger password.';
          break;
      }
      
      return { 
        success: false, 
        message 
      };
    }
  };

  /**
   * Log out the current user
   */
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      setIsEmailVerified(false);
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
   * Send email verification
   */
  const sendVerificationEmail = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      if (firebaseUser) {
        await sendEmailVerification(firebaseUser);
        return { 
          success: true, 
          message: 'Verification email sent! Please check your inbox.' 
        };
      }
      return { 
        success: false, 
        message: 'No user logged in.' 
      };
    } catch (error) {
      console.error('Send verification email failed:', error);
      return { 
        success: false, 
        message: 'Failed to send verification email. Please try again.' 
      };
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
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
    if (firebaseUser) {
      try {
        const userData = await getOrCreateUser(firebaseUser);
        setUser(userData);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const value: FirebaseAuthContextType = {
    user,
    firebaseUser,
    isLoading,
    isEmailVerified,
    login,
    loginWithGoogle,
    completeUserSetup,
    register,
    logout,
    updateUser,
    sendVerificationEmail,
    resetPassword,
    refreshUser
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

/**
 * Custom hook to access Firebase authentication context
 * 
 * @returns {FirebaseAuthContextType} Firebase authentication context value
 * @throws {Error} If used outside of FirebaseAuthProvider
 */
export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}
