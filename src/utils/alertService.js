import supabase from './supabase';

const alertService = {
  // Get user's price alerts
  getPriceAlerts: async () => {
    try {
      const { data, error } = await supabase
        .from('price_alerts').select(`*,assets (symbol, name, logo_url, current_price)`).order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load price alerts' };
    }
  },

  // Create new price alert
  createPriceAlert: async (alertData) => {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .insert([alertData])
        .select(`
          *,
          assets (symbol, name, logo_url, current_price)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to create price alert' };
    }
  },

  // Update price alert
  updatePriceAlert: async (alertId, updates) => {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select(`
          *,
          assets (symbol, name, logo_url, current_price)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to update price alert' };
    }
  },

  // Delete price alert
  deletePriceAlert: async (alertId) => {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to delete price alert' };
    }
  },

  // Toggle alert enabled status
  toggleAlert: async (alertId, isEnabled) => {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .update({ 
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to toggle alert' };
    }
  },

  // Subscribe to alert changes
  subscribeToAlertChanges: (callback) => {
    const channel = supabase
      .channel('alert-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'price_alerts'
        },
        callback
      )
      .subscribe();

    return channel;
  },

  // Unsubscribe from changes
  unsubscribeFromChanges: (channel) => {
    return supabase.removeChannel(channel);
  }
};

export default alertService;