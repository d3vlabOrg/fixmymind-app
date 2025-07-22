// src/context/SupabaseAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  loginWithEmailPassword,
  loginWithGoogle,
  loginWithPhone,
  signUp,
  logout as supabaseLogout,
  getUser,
  onAuthStateChange
} from '../utils/SupabaseService';

// Create the context
const SupabaseAuthContext = createContext();

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to validate user uid
  const validateUserAccess = async (data) => {
    const allowedUid = "1785dd9e-38b3-4fce-a2eb-8f468b1dac2b";
    if (data.user && data.user.id !== allowedUid) {
      // Sign out the user immediately
      await supabaseLogout();
      throw new Error("under development, please check later");
    }
    return data;
  };

  // Initialize auth state
  useEffect(() => {
    // Get the current user when the component mounts
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await getUser();
        if (currentUser) {
          // Validate user access for existing sessions
          try {
            await validateUserAccess({ user: currentUser });
            setUser(currentUser);
          } catch (error) {
            console.error('User access validation failed during initialization:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          await validateUserAccess({ user: session.user });
          setUser(session.user);
        } catch (error) {
          console.error('User access validation failed during sign in:', error);
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'USER_UPDATED' && session?.user) {
        try {
          await validateUserAccess({ user: session.user });
          setUser(session.user);
        } catch (error) {
          console.error('User access validation failed during user update:', error);
          setUser(null);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await loginWithEmailPassword(email, password);
      const validatedData = await validateUserAccess(data);
      setUser(validatedData.user);
      return validatedData;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const register = async (email, password) => {
    try {
      setLoading(true);
      const data = await signUp(email, password);
      const validatedData = await validateUserAccess(data);
      setUser(validatedData.user);
      return validatedData;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogleAuth = async () => {
    try {
      setLoading(true);
      const data = await loginWithGoogle();
      const validatedData = await validateUserAccess(data);
      return validatedData;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with phone
  const loginWithPhoneAuth = async (phone) => {
    try {
      setLoading(true);
      const data = await loginWithPhone(phone);
      const validatedData = await validateUserAccess(data);
      return validatedData;
    } catch (error) {
      console.error('Error logging in with phone:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await supabaseLogout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle: loginWithGoogleAuth,
    loginWithPhone: loginWithPhoneAuth,
    supabase
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

// Custom hook to use the Supabase auth context
export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};