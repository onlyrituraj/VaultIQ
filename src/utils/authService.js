import supabase from "./supabase";

const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Sign in error:", error);
      if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("AuthRetryableFetchError")
      ) {
        return {
          success: false,
          error:
            "Cannot connect to authentication service. Please check your internet connection.",
        };
      }
      return {
        success: false,
        error: "Something went wrong during login. Please try again.",
      };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/portfolio-dashboard`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Google sign in error:", error);
      return {
        success: false,
        error: "Something went wrong with Google sign-in. Please try again.",
      };
    }
  },

  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || userData?.full_name || "",
            role: userData?.role || "standard",
            wallet_address: userData?.walletAddress || null,
            preferred_currency: userData?.preferredCurrency || "USD",
            notification_preferences: userData?.notificationPreferences || {
              email: true,
              push: false,
              price_alerts: true,
              portfolio_updates: true,
            },
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // If signup was successful and user is confirmed, create user profile
      if (data.user && !error) {
        try {
          await this.createUserProfile(data.user.id, {
            email: data.user.email,
            full_name: userData?.fullName || userData?.full_name || "",
            wallet_address: userData?.walletAddress || null,
            preferred_currency: userData?.preferredCurrency || "USD",
            notification_preferences: userData?.notificationPreferences || {
              email: true,
              push: false,
              price_alerts: true,
              portfolio_updates: true,
            },
          });
        } catch (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't fail signup if profile creation fails
        }
      }

      return { success: true, data };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        error: "Something went wrong during signup. Please try again.",
      };
    }
  },

  // Create user profile
  createUserProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: userId,
            email: profileData.email,
            full_name: profileData.full_name || "",
            wallet_address: profileData.wallet_address,
            preferred_currency: profileData.preferred_currency || "USD",
            notification_preferences: profileData.notification_preferences || {
              email: true,
              push: false,
              price_alerts: true,
              portfolio_updates: true,
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Create profile error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Create profile error:", error);
      return { success: false, error: "Failed to create user profile" };
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
      console.error("Sign out error:", error);
      return {
        success: false,
        error: "Something went wrong during logout. Please try again.",
      };
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Get session error:", error);
      return { success: false, error: "Failed to get session" };
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If profile doesn't exist, try to create one
        if (error.code === "PGRST116") {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const createResult = await this.createUserProfile(
              userData.user.id,
              {
                email: userData.user.email,
                full_name: userData.user.user_metadata?.full_name || "",
                wallet_address: null,
                preferred_currency: "USD",
              }
            );
            return createResult;
          }
        }
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Get user profile error:", error);
      return { success: false, error: "Failed to load user profile" };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("user_profiles")
        .update(updateData)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: "Failed to update profile" };
    }
  },

  // Add or update wallet address
  updateWalletAddress: async (
    userId,
    walletAddress,
    walletType = "metamask"
  ) => {
    try {
      const updates = {
        wallet_address: walletAddress,
        wallet_type: walletType,
        wallet_connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Update wallet error:", error);
      return { success: false, error: "Failed to update wallet information" };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        error: "Something went wrong sending reset email. Please try again.",
      };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    try {
      return supabase.auth.onAuthStateChange(callback);
    } catch (error) {
      console.error("Auth state change listener error:", error);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: { user } };
    } catch (error) {
      console.error("Get current user error:", error);
      return { success: false, error: "Failed to get current user" };
    }
  },
};

export default authService;
