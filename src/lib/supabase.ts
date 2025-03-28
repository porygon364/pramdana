import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Initializing Supabase client with URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          const value = localStorage.getItem(key);
          console.log(`Getting item from storage: ${key}`);
          return value;
        } catch (error) {
          console.error('Error accessing localStorage:', error)
          return null
        }
      },
      setItem: (key, value) => {
        try {
          console.log(`Setting item in storage: ${key}`);
          localStorage.setItem(key, value)
        } catch (error) {
          console.error('Error setting localStorage:', error)
        }
      },
      removeItem: (key) => {
        try {
          console.log(`Removing item from storage: ${key}`);
          localStorage.removeItem(key)
        } catch (error) {
          console.error('Error removing from localStorage:', error)
        }
      }
    }
  }
})

// Test the connection
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
}); 