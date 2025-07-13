import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fiozmyoedptukpkzuhqm.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
});

// Allowed user emails - restrict to specific users only
const ALLOWED_USERS = [
  'jasonwilliamgolden@gmail.com', // Primary user
  'jgolden@bowerycreativeagency.com', // Alternative email
  // Add more allowed emails here if needed
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