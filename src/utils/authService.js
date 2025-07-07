import supabase from './supabase';

const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      // Check if we're in demo mode
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { 
          success: false, 
          error: 'Demo mode - Please configure Supabase to enable authentication' 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Please check your Supabase configuration.' 
        };
      }
      return { success: false, error: 'Something went wrong during login. Please try again.' };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { 
          success: false, 
          error: 'Demo mode - Please configure Supabase to enable authentication' 
        };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/wallet-connection`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Something went wrong with Google sign-in. Please try again.' };
    }
  },

  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { 
          success: false, 
          error: 'Demo mode - Please configure Supabase to enable authentication' 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            role: userData?.role || 'standard'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Something went wrong during signup. Please try again.' };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Something went wrong during logout. Please try again.' };
    }
  },

  // Get current session
  getSession: async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { success: true, data: { session: null } };
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get session' };
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { success: true, data: null };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to load user profile' };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { success: false, error: 'Demo mode - database operations disabled' };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || 
          import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co') {
        return { success: false, error: 'Demo mode - password reset disabled' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Something went wrong sending reset email. Please try again.' };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    try {
      return supabase.auth.onAuthStateChange(callback);
    } catch (error) {
      console.log('Auth state change listener error:', error);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

export default authService;