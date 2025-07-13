import { createClient } from '@supabase/supabase-js';

// Use the same Supabase instance as other RepSpheres apps
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cbopynuvhcymbumjnvay.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3B5bnV2aGN5bWJ1bWpudmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTUxNzMsImV4cCI6MjA1OTU3MTE3M30.UZElMkoHugIt984RtYWyfrRuv2rB67opQdCrFVPCfzU';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'repspheres-auth',
    cookieOptions: {
      domain: '.repspheres.com',
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    },
    ...(typeof window !== 'undefined' && window.location.hostname === 'localhost' && {
      cookieOptions: {
        domain: 'localhost',
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24 * 7
      }
    })
  },
});

// Allowed user emails - restrict to specific users only
const ALLOWED_USERS = [
  'jasonwilliamgolden@gmail.com', // Primary user
  'jgolden@bowerycreativeagency.com', // Alternative email
  // Add more allowed emails here if needed
];

// Admin users who can access admin features
const ADMIN_USERS = [
  'jasonwilliamgolden@gmail.com',
  'jgolden@bowerycreativeagency.com',
];

// Helper to get the current app URL for redirects
export const getAppUrl = () => {
  if (typeof window === 'undefined') return '';
  
  // In production, use the actual domain
  if (window.location.hostname !== 'localhost') {
    return window.location.origin;
  }
  
  // In development, use localhost
  return 'http://localhost:5173';
};

// Get redirect URL for OAuth
export const getRedirectUrl = (returnPath?: string) => {
  const baseUrl = getAppUrl();
  return returnPath ? `${baseUrl}${returnPath}` : `${baseUrl}/auth/callback`;
};

// Check if user is allowed to access the system
export const isUserAllowed = (email: string | undefined): boolean => {
  if (!email) return false;
  return ALLOWED_USERS.includes(email.toLowerCase());
};

// Check if user is an admin
export const isUserAdmin = (email: string | undefined): boolean => {
  if (!email) return false;
  return ADMIN_USERS.includes(email.toLowerCase());
};

// Auth helpers with user restrictions
export const signInWithGoogle = async () => {
  const redirectUrl = getRedirectUrl();
  console.log('Google OAuth redirect URL:', redirectUrl);
  
  const result = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  console.log('Google OAuth result:', result);
  return result;
};

export const signInWithFacebook = async () => {
  const redirectUrl = getRedirectUrl();
  console.log('Facebook OAuth redirect URL:', redirectUrl);
  
  const result = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: redirectUrl
    }
  });
  
  console.log('Facebook OAuth result:', result);
  return result;
};

export const signInWithEmail = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithEmail = (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signOut = () => {
  return supabase.auth.signOut();
};