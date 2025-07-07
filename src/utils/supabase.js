import { createClient } from '@supabase/supabase-js';

// Default demo configuration for when environment variables are not set
const DEFAULT_SUPABASE_URL = 'https://demo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'demo-key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Create Supabase client with error handling
let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'cryptofolio-web3'
      }
    }
  });
} catch (error) {
  console.warn('Supabase client creation failed, using mock client:', error);
  
  // Create a mock client for demo purposes
  supabase = {
    auth: {
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - authentication disabled' } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Demo mode - authentication disabled' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - authentication disabled' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Demo mode - database disabled' } }),
      update: () => ({ data: null, error: { message: 'Demo mode - database disabled' } }),
      delete: () => ({ data: null, error: { message: 'Demo mode - database disabled' } })
    }),
    channel: () => ({
      on: () => ({}),
      subscribe: () => ({})
    }),
    removeChannel: () => {}
  };
}

export { supabase };
export default supabase;