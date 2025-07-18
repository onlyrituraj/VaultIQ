import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import TransactionFilters from './components/TransactionFilters';
import SearchBar from './components/SearchBar';
import TransactionList from './components/TransactionList';
import AnalyticsPanel from './components/AnalyticsPanel';
import Icon from '../../components/AppIcon';
import transactionService from '../../utils/transactionService';

const TransactionHistoryAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFilters, setSavedFilters] = useState([]);
  const [activeView, setActiveView] = useState('list'); // 'list' or 'analytics'
  const [error, setError] = useState(null);

  // Load transactions from Supabase
  const loadTransactions = async (filters = {}) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await transactionService.getTransactions(filters);
      
      if (result?.success) {
        setTransactions(result.data || []);
        setFilteredTransactions(result.data || []);
      } else {
        setError(result?.error || 'Failed to load transactions');
      }
    } catch (error) {
      setError('Failed to load transactions. Please try again.');
      console.log('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (authLoading) return;
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      if (isMounted) {
        await loadTransactions();
        
        // Load saved filters from localStorage
        const saved = localStorage.getItem('VoltIQ_saved_filters');
        if (saved) {
          setSavedFilters(JSON.parse(saved));
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  const handleFiltersChange = async (filters) => {
    try {
      setError(null);
      
      // Convert filters to API format
      const apiFilters = {
        type: filters.transactionType !== 'all' ? filters.transactionType : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        dateFrom: filters.dateFrom ? new Date(filters.dateFrom).toISOString() : undefined,
        dateTo: filters.dateTo ? new Date(filters.dateTo + 'T23:59:59').toISOString() : undefined,
        minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
        maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined
      };

      // Remove undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(apiFilters).filter(([_, v]) => v !== undefined)
      );

      const result = await transactionService.getTransactions(cleanFilters);
      
      if (result?.success) {
        let filtered = result.data || [];

        // Apply client-side filters for fields not handled by API
        if (filters.asset) {
          filtered = filtered.filter(tx => 
            tx?.assets?.symbol?.toLowerCase()?.includes(filters.asset.toLowerCase())
          );
        }

        if (filters.walletAddress) {
          filtered = filtered.filter(tx => 
            tx?.from_address?.toLowerCase()?.includes(filters.walletAddress.toLowerCase()) ||
            tx?.to_address?.toLowerCase()?.includes(filters.walletAddress.toLowerCase())
          );
        }

        setFilteredTransactions(filtered);
      } else {
        setError(result?.error || 'Failed to filter transactions');
      }
    } catch (error) {
      setError('Failed to filter transactions. Please try again.');
      console.log('Error filtering transactions:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    try {
      setError(null);
      const result = await transactionService.searchTransactions(query);
      
      if (result?.success) {
        setFilteredTransactions(result.data || []);
      } else {
        setError(result?.error || 'Search failed');
      }
    } catch (error) {
      setError('Search failed. Please try again.');
      console.log('Error searching transactions:', error);
    }
  };

  const handleExport = (format) => {
    setIsLoading(true);
    
    // Simulate export process
    setTimeout(() => {
      const data = filteredTransactions.map(tx => ({
        Date: new Date(tx?.created_at).toLocaleDateString(),
        Type: tx?.type,
        Asset: tx?.assets?.symbol || 'Unknown',
        Amount: tx?.amount,
        'USD Value': tx?.total_value,
        'Gas Fee': tx?.gas_fee,
        'Gas Fee USD': tx?.gas_fee_usd,
        Hash: tx?.transaction_hash,
        Status: tx?.status
      }));

      if (format === 'csv') {
        const csv = [
          Object.keys(data[0] || {}).join(','),
          ...data.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      } else if (format === 'json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      } else if (format === 'pdf') {
        // Mock PDF export
        console.log('PDF export would be implemented here');
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleRefresh = async () => {
    await loadTransactions();
  };

  const handleSaveFilter = (name, filters) => {
    const newFilter = {
      id: Date.now().toString(),
      name,
      filters,
      createdAt: new Date().toISOString()
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem('VoltIQ_saved_filters', JSON.stringify(updatedFilters));
  };

  const handleLoadFilter = (savedFilter) => {
    handleFiltersChange(savedFilter.filters);
  };

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Show loading state
  if (authLoading || (isLoading && transactions.length === 0)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-text-primary">Loading transactions...</span>
        </div>
      </div>
    );
  }

  // Show preview mode for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center gap-2">
                <Icon name="Info" size={16} />
                <span className="font-medium">Preview Mode</span>
              </div>
              <p className="text-sm mt-1">
                Sign in to view your transaction history and analytics. This is a demo of the transaction system.
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="ArrowLeftRight" size={20} color="white" />
                </div>
                <h1 className="text-3xl font-bold text-text-primary">Transaction History & Analytics</h1>
              </div>
              <p className="text-text-secondary">
                Track and analyze your cryptocurrency transactions with comprehensive filtering and insights.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="ArrowLeftRight" size={20} color="white" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary">Transaction History & Analytics</h1>
            </div>
            <p className="text-text-secondary">
              Track and analyze your cryptocurrency transactions with comprehensive filtering and insights.
            </p>
          </div>

          {/* Mobile View Toggle */}
          <div className="lg:hidden mb-6">
            <div className="flex bg-surface border border-border rounded-lg p-1">
              <button
                onClick={() => setActiveView('list')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'list' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name="List" size={16} />
                Transactions
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'analytics' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name="BarChart3" size={16} />
                Analytics
              </button>
            </div>
          </div>

          {/* Filters */}
          <TransactionFilters
            onFiltersChange={handleFiltersChange}
            savedFilters={savedFilters}
            onSaveFilter={handleSaveFilter}
            onLoadFilter={handleLoadFilter}
          />

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            onExport={handleExport}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transaction List */}
            <div className={`lg:col-span-2 ${activeView === 'analytics' ? 'hidden lg:block' : ''}`}>
              <TransactionList
                transactions={filteredTransactions}
                onTransactionSelect={handleTransactionSelect}
                selectedTransaction={selectedTransaction}
              />
            </div>

            {/* Analytics Panel */}
            <div className={`lg:col-span-1 ${activeView === 'list' ? 'hidden lg:block' : ''}`}>
              <AnalyticsPanel
                transactions={filteredTransactions}
                selectedTransaction={selectedTransaction}
              />
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && transactions.length > 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-surface border border-border rounded-lg p-6 flex items-center gap-3">
                <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                <span className="text-text-primary">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistoryAnalytics;