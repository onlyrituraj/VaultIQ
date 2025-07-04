import supabase from './supabase';

const assetService = {
  // Get all assets
  getAssets: async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('market_cap', { ascending: false });

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
      return { success: false, error: 'Failed to load assets' };
    }
  },

  // Get asset by symbol
  getAssetBySymbol: async (symbol) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('symbol', symbol)
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
      return { success: false, error: 'Failed to load asset' };
    }
  },

  // Update asset data (market prices, etc.)
  updateAsset: async (assetId, updates) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update({
          ...updates,
          last_updated: new Date().toISOString()
        })
        .eq('id', assetId)
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
      return { success: false, error: 'Failed to update asset' };
    }
  },

  // Get top performing assets
  getTopPerformingAssets: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('change_percent_24h', { ascending: false })
        .limit(limit);

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
      return { success: false, error: 'Failed to load top performing assets' };
    }
  },

  // Search assets
  searchAssets: async (query) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .or(`symbol.ilike.%${query}%,name.ilike.%${query}%`)
        .order('market_cap', { ascending: false })
        .limit(20);

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
      return { success: false, error: 'Failed to search assets' };
    }
  },

  // Subscribe to asset price changes
  subscribeToAssetChanges: (callback) => {
    const channel = supabase
      .channel('asset-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assets'
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

export default assetService;