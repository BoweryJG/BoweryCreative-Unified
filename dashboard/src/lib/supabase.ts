import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('=== SUPABASE CONFIGURATION ===');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseAnonKey.length);
console.log('Key prefix:', supabaseAnonKey.substring(0, 50));
console.log('Key suffix:', supabaseAnonKey.substring(supabaseAnonKey.length - 20));
console.log('==============================');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});