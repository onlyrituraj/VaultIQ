import supabase from './supabase';

const portfolioService = {
  // Get user's portfolios
  getPortfolios: async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios').select(`*,portfolio_assets (*,assets (*))`).order('created_at', { ascending: false });

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
      return { success: false, error: 'Failed to load portfolios' };
    }
  },

  // Get portfolio by ID
  getPortfolio: async (portfolioId) => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          portfolio_assets (
            *,
            assets (*)
          )
        `)
        .eq('id', portfolioId)
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
      return { success: false, error: 'Failed to load portfolio' };
    }
  },

  // Get portfolio assets with current market data
  getPortfolioAssets: async (portfolioId) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select(`
          *,
          assets (*)
        `)
        .eq('portfolio_id', portfolioId)
        .order('current_value', { ascending: false });

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
      return { success: false, error: 'Failed to load portfolio assets' };
    }
  },

  // Update portfolio asset
  updatePortfolioAsset: async (assetId, updates) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
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
      return { success: false, error: 'Failed to update portfolio asset' };
    }
  },

  // Get recent transactions
  getRecentTransactions: async (portfolioId = null, limit = 10) => {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          assets (symbol, name, logo_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (portfolioId) {
        query = query.eq('portfolio_id', portfolioId);
      }

      const { data, error } = await query;

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
      return { success: false, error: 'Failed to load transactions' };
    }
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
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
      return { success: false, error: 'Failed to create transaction' };
    }
  },

  // Subscribe to portfolio changes
  subscribeToPortfolioChanges: (portfolioId, callback) => {
    const channel = supabase
      .channel('portfolio-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolios',
          filter: `id=eq.${portfolioId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_assets',
          filter: `portfolio_id=eq.${portfolioId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `portfolio_id=eq.${portfolioId}`
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

export default portfolioService;