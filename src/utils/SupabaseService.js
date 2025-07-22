import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './auth/config.js';

// Initialize Supabase clientasd
const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

/**
 * Login with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Supabase auth response
 */
const loginWithEmailPassword = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging in with email and password:', error.message);
    throw error;
  }
};

/**
 * Get environment-aware redirect URL
 * @returns {string} - The appropriate redirect URL based on environment
 */
const getRedirectUrl = () => {
  // Check if we're in development environment
  const isDev = __DEV__ || process.env.NODE_ENV === 'development';
  
  // For web environments, check the current hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('dev.fixmymind.org')) {
      return 'https://dev.fixmymind.org/redirect';
    }
    if (hostname.includes('fixmymind.org')) {
      return 'https://fixmymind.org/redirect';
    }
  }
  
  // Default based on development flag
  return isDev ? 'https://dev.fixmymind.org/redirect' : 'https://fixmymind.org/redirect';
};

/**
 * Login with Google OAuth
 * @returns {Promise} - Supabase auth response
 */
const loginWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging in with Google:', error.message);
    throw error;
  }
};

/**
 * Sign up with Google OAuth
 * @returns {Promise} - Supabase auth response
 */
const signUpWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up with Google:', error.message);
    throw error;
  }
};

/**
 * Login with Facebook OAuth
 * @returns {Promise} - Supabase auth response
 */
const loginWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging in with Facebook:', error.message);
    throw error;
  }
};

/**
 * Sign up with Facebook OAuth
 * @returns {Promise} - Supabase auth response
 */
const signUpWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up with Facebook:', error.message);
    throw error;
  }
};

/**
 * Login with phone number
 * @param {string} phone - User's phone number
 * @returns {Promise} - Supabase auth response
 */
const loginWithPhone = async (phone) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging in with phone:', error.message);
    throw error;
  }
};

/**
 * Sign up with phone number
 * @param {string} phone - User's phone number
 * @returns {Promise} - Supabase auth response
 */
const signUpWithPhone = async (phone) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up with phone:', error.message);
    throw error;
  }
};

/**
 * Sign up with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Supabase auth response
 */
const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise} - Supabase auth response
 */
const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging out:', error.message);
    throw error;
  }
};

/**
 * Get the current session
 * @returns {Promise} - Supabase session
 */
const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
};

/**
 * Get the current user
 * @returns {Promise} - Supabase user
 */
const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting user:', error.message);
    return null;
  }
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} - Unsubscribe function
 */
const onAuthStateChange = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return data.subscription.unsubscribe;
};

export {
  supabase,
  loginWithEmailPassword,
  loginWithGoogle,
  signUpWithGoogle,
  loginWithFacebook,
  signUpWithFacebook,
  loginWithPhone,
  signUpWithPhone,
  signUp,
  logout,
  getSession,
  getUser,
  onAuthStateChange
};
