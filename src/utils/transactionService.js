import supabase from './supabase';

const transactionService = {
  // Get all transactions with filters
  getTransactions: async (filters = {}) => {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          assets (symbol, name, logo_url),
          portfolios (name)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.portfolioId) {
        query = query.eq('portfolio_id', filters.portfolioId);
      }

      if (filters.assetSymbol) {
        query = query.eq('assets.symbol', filters.assetSymbol);
      }

      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters.minAmount) {
        query = query.gte('total_value', filters.minAmount);
      }

      if (filters.maxAmount) {
        query = query.lte('total_value', filters.maxAmount);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
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

  // Get transaction by ID
  getTransaction: async (transactionId) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          assets (symbol, name, logo_url),
          portfolios (name)
        `)
        .eq('id', transactionId)
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
      return { success: false, error: 'Failed to load transaction' };
    }
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select(`
          *,
          assets (symbol, name, logo_url),
          portfolios (name)
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
      return { success: false, error: 'Failed to create transaction' };
    }
  },

  // Update transaction
  updateTransaction: async (transactionId, updates) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .select(`
          *,
          assets (symbol, name, logo_url),
          portfolios (name)
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
      return { success: false, error: 'Failed to update transaction' };
    }
  },

  // Delete transaction
  deleteTransaction: async (transactionId) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

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
      return { success: false, error: 'Failed to delete transaction' };
    }
  },

  // Get transaction analytics
  getTransactionAnalytics: async (filters = {}) => {
    try {
      // Get raw transaction data for analytics
      const transactionsResult = await this.getTransactions(filters);
      
      if (!transactionsResult.success) {
        return transactionsResult;
      }

      const transactions = transactionsResult.data;

      // Calculate analytics
      const analytics = {
        totalTransactions: transactions.length,
        totalVolume: transactions.reduce((sum, tx) => sum + parseFloat(tx.total_value || 0), 0),
        totalFees: transactions.reduce((sum, tx) => sum + parseFloat(tx.gas_fee_usd || 0), 0),
        totalProfitLoss: transactions.reduce((sum, tx) => sum + parseFloat(tx.profit_loss || 0), 0),
        
        // Transaction type breakdown
        typeBreakdown: transactions.reduce((acc, tx) => {
          acc[tx.type] = (acc[tx.type] || 0) + 1;
          return acc;
        }, {}),
        
        // Status breakdown
        statusBreakdown: transactions.reduce((acc, tx) => {
          acc[tx.status] = (acc[tx.status] || 0) + 1;
          return acc;
        }, {}),
        
        // Asset breakdown
        assetBreakdown: transactions.reduce((acc, tx) => {
          const symbol = tx.assets?.symbol || 'Unknown';
          acc[symbol] = (acc[symbol] || 0) + parseFloat(tx.total_value || 0);
          return acc;
        }, {}),
        
        // Recent activity (last 7 days)
        recentActivity: transactions.filter(tx => {
          const txDate = new Date(tx.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return txDate >= weekAgo;
        }).length
      };

      return { success: true, data: analytics };
    } catch (error) {
      return { success: false, error: 'Failed to calculate transaction analytics' };
    }
  },

  // Search transactions
  searchTransactions: async (query, filters = {}) => {
    try {
      let baseQuery = supabase
        .from('transactions')
        .select(`
          *,
          assets (symbol, name, logo_url),
          portfolios (name)
        `);

      // Apply search
      if (query) {
        baseQuery = baseQuery.or(`
          transaction_hash.ilike.%${query}%,
          notes.ilike.%${query}%,
          from_address.ilike.%${query}%,
          to_address.ilike.%${query}%
        `);
      }

      // Apply additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          baseQuery = baseQuery.eq(key, filters[key]);
        }
      });

      const { data, error } = await baseQuery
        .order('created_at', { ascending: false })
        .limit(50);

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
      return { success: false, error: 'Failed to search transactions' };
    }
  },

  // Subscribe to transaction changes
  subscribeToTransactionChanges: (callback) => {
    const channel = supabase
      .channel('transaction-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
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

export default transactionService;