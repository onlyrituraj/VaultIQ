import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import PortfolioSummaryCard from './components/PortfolioSummaryCard';
import AssetAllocationChart from './components/AssetAllocationChart';
import TopPerformingAssets from './components/TopPerformingAssets';
import RecentTransactions from './components/RecentTransactions';
import PriceAlertsPanel from './components/PriceAlertsPanel';
import QuickActionsFAB from './components/QuickActionsFAB';
import NavigationTabs from './components/NavigationTabs';
import PerformanceChart from './components/PerformanceChart';
import Icon from '../../components/AppIcon';
import portfolioService from '../../utils/portfolioService';
import assetService from '../../utils/assetService';
import alertService from '../../utils/alertService';

const PortfolioDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedWidgets, setExpandedWidgets] = useState({});

  // Initialize state with safe defaults to prevent null errors
  const [portfolioData, setPortfolioData] = useState({
    totalValue: '0.00',
    change24h: 0,
    changeValue: '0.00'
  });
  const [allocationData, setAllocationData] = useState([]);
  const [topAssets, setTopAssets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time subscriptions
  const [portfolioChannel, setPortfolioChannel] = useState(null);
  const [assetChannel, setAssetChannel] = useState(null);
  const [alertChannel, setAlertChannel] = useState(null);

  // Load portfolio data with comprehensive error handling
  const loadPortfolioData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Load portfolios with error handling
      try {
        const portfoliosResult = await portfolioService.getPortfolios();
        if (portfoliosResult?.success && portfoliosResult?.data?.length > 0) {
          const portfolio = portfoliosResult.data[0]; // Use first portfolio
          
          setPortfolioData({
            totalValue: portfolio?.total_value?.toFixed(2) || '0.00',
            change24h: portfolio?.total_change_percent_24h || 0,
            changeValue: portfolio?.total_change_24h?.toFixed(2) || '0.00'
          });

          // Transform portfolio assets to allocation data
          if (portfolio?.portfolio_assets?.length > 0) {
            const allocation = portfolio.portfolio_assets.map(asset => ({
              name: asset?.assets?.symbol || 'Unknown',
              value: parseFloat(asset?.current_value || 0),
              percentage: parseFloat(asset?.current_value || 0) / parseFloat(portfolio?.total_value || 1) * 100
            }));
            setAllocationData(allocation);
          }
        } else {
          // No portfolios found - set safe defaults
          setPortfolioData({
            totalValue: '0.00',
            change24h: 0,
            changeValue: '0.00'
          });
          setAllocationData([]);
        }
      } catch (portfolioError) {
        console.log('Error loading portfolios:', portfolioError);
        // Keep default values, don't crash
      }

      // Load top performing assets with error handling
      try {
        const topAssetsResult = await assetService.getTopPerformingAssets(6);
        if (topAssetsResult?.success && topAssetsResult?.data) {
          const formattedAssets = topAssetsResult.data.map(asset => ({
            symbol: asset?.symbol || '',
            name: asset?.name || '',
            price: parseFloat(asset?.current_price || 0),
            change: parseFloat(asset?.change_percent_24h || 0),
            logo: asset?.logo_url || ''
          }));
          setTopAssets(formattedAssets);
        }
      } catch (assetsError) {
        console.log('Error loading top assets:', assetsError);
        // Keep empty array, don't crash
      }

      // Load recent transactions with error handling
      try {
        const transactionsResult = await portfolioService.getRecentTransactions(null, 6);
        if (transactionsResult?.success && transactionsResult?.data) {
          const formattedTransactions = transactionsResult.data.map(tx => ({
            id: tx?.id,
            type: tx?.type,
            asset: { 
              symbol: tx?.assets?.symbol || '', 
              logo: tx?.assets?.logo_url || '' 
            },
            amount: parseFloat(tx?.amount || 0),
            value: parseFloat(tx?.total_value || 0),
            timestamp: new Date(tx?.created_at)
          }));
          setRecentTransactions(formattedTransactions);
        }
      } catch (transactionsError) {
        console.log('Error loading transactions:', transactionsError);
        // Keep empty array, don't crash
      }

      // Load price alerts with error handling
      try {
        const alertsResult = await alertService.getPriceAlerts();
        if (alertsResult?.success && alertsResult?.data) {
          const formattedAlerts = alertsResult.data.map(alert => ({
            id: alert?.id,
            asset: { 
              symbol: alert?.assets?.symbol || '', 
              logo: alert?.assets?.logo_url || '' 
            },
            condition: alert?.condition,
            price: parseFloat(alert?.target_price || 0),
            currentPrice: parseFloat(alert?.assets?.current_price || 0),
            enabled: alert?.is_enabled || false
          }));
          setPriceAlerts(formattedAlerts);
        }
      } catch (alertsError) {
        console.log('Error loading alerts:', alertsError);
        // Keep empty array, don't crash
      }

      // Generate performance data (mock for now - would come from historical data)
      const currentValue = parseFloat(portfolioData?.totalValue?.replace(',', '') || 0);
      const mockPerformance = [
        { date: 'Jan 1', value: Math.max(currentValue * 0.8, 98234) },
        { date: 'Jan 8', value: Math.max(currentValue * 0.85, 105678) },
        { date: 'Jan 15', value: Math.max(currentValue * 0.9, 112345) },
        { date: 'Jan 22', value: Math.max(currentValue * 0.87, 108901) },
        { date: 'Jan 29', value: Math.max(currentValue * 0.95, 118567) },
        { date: 'Feb 5', value: currentValue || 124567 },
        { date: 'Feb 12', value: Math.max(currentValue * 1.02, 127890) },
        { date: 'Feb 19', value: Math.max(currentValue * 0.98, 122456) },
        { date: 'Feb 26', value: currentValue || 124567 }
      ];
      setPerformanceData(mockPerformance);

    } catch (error) {
      console.log('Error loading portfolio data:', error);
      setError('Unable to load portfolio data. This might be because the database tables haven\'t been set up yet. Please check the setup instructions.');
      
      // Set safe defaults even on error
      setPortfolioData({
        totalValue: '0.00',
        change24h: 0,
        changeValue: '0.00'
      });
      setAllocationData([]);
      setTopAssets([]);
      setRecentTransactions([]);
      setPriceAlerts([]);
      setPerformanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscriptions with error handling
  const setupSubscriptions = () => {
    if (!user?.id) return;

    try {
      // Subscribe to portfolio changes
      const portfolioSub = portfolioService.subscribeToPortfolioChanges(
        userProfile?.id,
        () => {
          loadPortfolioData();
        }
      );
      setPortfolioChannel(portfolioSub);
    } catch (error) {
      console.log('Error setting up portfolio subscription:', error);
    }

    try {
      // Subscribe to asset changes
      const assetSub = assetService.subscribeToAssetChanges(() => {
        loadPortfolioData();
      });
      setAssetChannel(assetSub);
    } catch (error) {
      console.log('Error setting up asset subscription:', error);
    }

    try {
      // Subscribe to alert changes
      const alertSub = alertService.subscribeToAlertChanges(() => {
        loadPortfolioData();
      });
      setAlertChannel(alertSub);
    } catch (error) {
      console.log('Error setting up alert subscription:', error);
    }
  };

  // Cleanup subscriptions
  const cleanupSubscriptions = () => {
    try {
      if (portfolioChannel) {
        portfolioService.unsubscribeFromChanges(portfolioChannel);
      }
      if (assetChannel) {
        assetService.unsubscribeFromChanges(assetChannel);
      }
      if (alertChannel) {
        alertService.unsubscribeFromChanges(alertChannel);
      }
    } catch (error) {
      console.log('Error cleaning up subscriptions:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (authLoading) return;
      
      if (!user) {
        // Preview mode - show demo message
        setLoading(false);
        return;
      }

      if (isMounted) {
        await loadPortfolioData();
        setupSubscriptions();
      }
    };

    initializeData();

    return () => {
      isMounted = false;
      cleanupSubscriptions();
    };
  }, [user, userProfile, authLoading]);

  const handleCurrencyToggle = (currency) => {
    console.log('Currency changed to:', currency);
  };

  const handleWidgetToggle = (widgetName) => {
    setExpandedWidgets(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }));
  };

  const handleAddAlert = async (alertData) => {
    try {
      const result = await alertService.createPriceAlert({
        ...alertData,
        user_id: user?.id
      });
      
      if (result?.success) {
        setPriceAlerts(prev => [...prev, {
          id: result.data.id,
          asset: alertData.asset,
          condition: alertData.condition,
          price: alertData.price,
          currentPrice: alertData.currentPrice,
          enabled: true
        }]);
      }
    } catch (error) {
      console.log('Error adding alert:', error);
    }
  };

  const handleRemoveAlert = async (alertId) => {
    try {
      const result = await alertService.deletePriceAlert(alertId);
      
      if (result?.success) {
        setPriceAlerts(prev => prev.filter(alert => alert.id !== alertId));
      }
    } catch (error) {
      console.log('Error removing alert:', error);
    }
  };

  const handleAddTransaction = () => {
    navigate('/transaction-history-analytics');
  };

  const handleConnectWallet = () => {
    navigate('/authentication-wallet-connection');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPortfolioData();
    setIsRefreshing(false);
  };

  // Pull-to-refresh functionality
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let isRefreshTriggered = false;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 100 && window.scrollY === 0 && !isRefreshTriggered) {
        isRefreshTriggered = true;
        handleRefresh();
      }
    };

    const handleTouchEnd = () => {
      isRefreshTriggered = false;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-text-primary">Loading portfolio...</span>
        </div>
      </div>
    );
  }

  // Show preview mode for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center gap-2">
                <Icon name="Info" size={16} />
                <span className="font-medium">Preview Mode</span>
              </div>
              <p className="text-sm mt-1">
                Sign in to view your personal portfolio data. This is a demo of the portfolio dashboard.
              </p>
            </div>
            
            {/* Demo content for preview mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <PortfolioSummaryCard 
                  portfolioData={{
                    totalValue: '124,567.89',
                    change24h: 5.2,
                    changeValue: '6,234.56'
                  }}
                  onCurrencyToggle={handleCurrencyToggle}
                />
              </div>
              <div className="lg:col-span-1">
                <AssetAllocationChart 
                  data={[
                    { name: 'BTC', value: 50000, percentage: 40 },
                    { name: 'ETH', value: 30000, percentage: 24 },
                    { name: 'SOL', value: 20000, percentage: 16 },
                    { name: 'ADA', value: 15000, percentage: 12 },
                    { name: 'Others', value: 9567.89, percentage: 8 }
                  ]}
                  isExpanded={expandedWidgets.allocation}
                  onToggleExpand={() => handleWidgetToggle('allocation')}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state with database setup instructions
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                <span className="font-medium">Database Setup Required</span>
              </div>
              <p className="text-sm mt-1">{error}</p>
              <div className="mt-3 text-sm">
                <p className="font-medium">To fix this issue:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
                  <li>Select your project and open the SQL Editor</li>
                  <li>Copy the migration SQL from <code>supabase/migrations/20241216120000_cryptofolio_portfolio_management.sql</code></li>
                  <li>Paste and run the SQL to create the required tables</li>
                </ol>
              </div>
              <button 
                onClick={handleRefresh}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Try Again After Setup
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <PortfolioSummaryCard 
          portfolioData={portfolioData}
          onCurrencyToggle={handleCurrencyToggle}
        />
      </div>
      <div className="lg:col-span-1">
        <AssetAllocationChart 
          data={allocationData}
          isExpanded={expandedWidgets.allocation}
          onToggleExpand={() => handleWidgetToggle('allocation')}
        />
      </div>
      <div className="lg:col-span-1">
        <TopPerformingAssets 
          assets={topAssets}
          isExpanded={expandedWidgets.topAssets}
          onToggleExpand={() => handleWidgetToggle('topAssets')}
        />
      </div>
      <div className="lg:col-span-1">
        <RecentTransactions 
          transactions={recentTransactions}
          isExpanded={expandedWidgets.transactions}
          onToggleExpand={() => handleWidgetToggle('transactions')}
        />
      </div>
      <div className="xl:col-span-1">
        <PriceAlertsPanel 
          alerts={priceAlerts}
          isExpanded={expandedWidgets.alerts}
          onToggleExpand={() => handleWidgetToggle('alerts')}
          onAddAlert={handleAddAlert}
          onRemoveAlert={handleRemoveAlert}
        />
      </div>
    </div>
  );

  const renderAssetsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AssetAllocationChart 
        data={allocationData}
        isExpanded={true}
        onToggleExpand={() => handleWidgetToggle('allocation')}
      />
      <TopPerformingAssets 
        assets={topAssets}
        isExpanded={true}
        onToggleExpand={() => handleWidgetToggle('topAssets')}
      />
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <PerformanceChart 
        data={performanceData}
        isExpanded={expandedWidgets.performance}
        onToggleExpand={() => handleWidgetToggle('performance')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPerformingAssets 
          assets={topAssets}
          isExpanded={expandedWidgets.topAssets}
          onToggleExpand={() => handleWidgetToggle('topAssets')}
        />
        <RecentTransactions 
          transactions={recentTransactions}
          isExpanded={expandedWidgets.transactions}
          onToggleExpand={() => handleWidgetToggle('transactions')}
        />
      </div>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PriceAlertsPanel 
        alerts={priceAlerts}
        isExpanded={true}
        onToggleExpand={() => handleWidgetToggle('alerts')}
        onAddAlert={handleAddAlert}
        onRemoveAlert={handleRemoveAlert}
      />
      <TopPerformingAssets 
        assets={topAssets}
        isExpanded={expandedWidgets.topAssets}
        onToggleExpand={() => handleWidgetToggle('topAssets')}
      />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'assets':
        return renderAssetsTab();
      case 'performance':
        return renderPerformanceTab();
      case 'alerts':
        return renderAlertsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Refresh Indicator */}
          {isRefreshing && (
            <div className="fixed top-16 left-0 right-0 bg-primary text-white text-center py-2 z-50">
              <div className="flex items-center justify-center gap-2">
                <Icon name="RefreshCw" size={16} className="animate-spin" />
                <span className="text-sm">Refreshing portfolio data...</span>
              </div>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
              Portfolio Dashboard
            </h1>
            <p className="text-text-secondary">
              Monitor your cryptocurrency investments and track performance
            </p>
          </div>

          {/* Navigation Tabs */}
          <NavigationTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          <div className="transition-all duration-300">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* Quick Actions FAB */}
      <QuickActionsFAB 
        onAddTransaction={handleAddTransaction}
        onConnectWallet={handleConnectWallet}
      />
    </div>
  );
};

export default PortfolioDashboard;