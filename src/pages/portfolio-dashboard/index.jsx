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

  // State for real data from Supabase
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    change24h: 0,
    changeValue: 0
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

  // Load portfolio data
  const loadPortfolioData = async () => {
    if (!user?.id) return;

    try {
      setError(null);

      // Load portfolios
      const portfoliosResult = await portfolioService.getPortfolios();
      if (portfoliosResult?.success && portfoliosResult?.data?.length > 0) {
        const portfolio = portfoliosResult.data[0]; // Use first portfolio

        setPortfolioData({
          totalValue: parseFloat(portfolio?.total_value || 0),
          change24h: parseFloat(portfolio?.total_change_percent_24h || 0),
          changeValue: parseFloat(portfolio?.total_change_24h || 0)
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
        // No portfolios found - set default empty portfolio data
        setPortfolioData({
          totalValue: 0,
          change24h: 0,
          changeValue: 0
        });
        setAllocationData([]);
      }

      // Load top performing assets
      const topAssetsResult = await assetService.getTopPerformingAssets(6);
      if (topAssetsResult?.success) {
        const formattedAssets = topAssetsResult.data.map(asset => ({
          symbol: asset?.symbol || '',
          name: asset?.name || '',
          price: parseFloat(asset?.current_price || 0),
          change: parseFloat(asset?.change_percent_24h || 0),
          logo: asset?.logo_url || ''
        }));
        setTopAssets(formattedAssets);
      }

      // Load recent transactions
      const transactionsResult = await portfolioService.getRecentTransactions(null, 6);
      if (transactionsResult?.success) {
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

      // Load price alerts
      const alertsResult = await alertService.getPriceAlerts();
      if (alertsResult?.success) {
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

      // Generate performance data (mock for now - would come from historical data)
      const currentValue = portfolioData?.totalValue || 124567;
      const mockPerformance = [
        { date: 'Jan 1', value: 98234 },
        { date: 'Jan 8', value: 105678 },
        { date: 'Jan 15', value: 112345 },
        { date: 'Jan 22', value: 108901 },
        { date: 'Jan 29', value: 118567 },
        { date: 'Feb 5', value: currentValue },
        { date: 'Feb 12', value: 127890 },
        { date: 'Feb 19', value: 122456 },
        { date: 'Feb 26', value: currentValue }
      ];
      setPerformanceData(mockPerformance);

    } catch (error) {
      setError('Failed to load portfolio data. Please try again.');
      console.log('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscriptions
  const setupSubscriptions = () => {
    if (!user?.id) return;

    // Subscribe to portfolio changes
    const portfolioSub = portfolioService.subscribeToPortfolioChanges(
      userProfile?.id,
      () => {
        loadPortfolioData();
      }
    );
    setPortfolioChannel(portfolioSub);

    // Subscribe to asset changes
    const assetSub = assetService.subscribeToAssetChanges(() => {
      loadPortfolioData();
    });
    setAssetChannel(assetSub);

    // Subscribe to alert changes
    const alertSub = alertService.subscribeToAlertChanges(() => {
      loadPortfolioData();
    });
    setAlertChannel(alertSub);
  };

  // Cleanup subscriptions
  const cleanupSubscriptions = () => {
    if (portfolioChannel) {
      portfolioService.unsubscribeFromChanges(portfolioChannel);
    }
    if (assetChannel) {
      assetService.unsubscribeFromChanges(assetChannel);
    }
    if (alertChannel) {
      alertService.unsubscribeFromChanges(alertChannel);
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
            {/* ... rest of preview content ... */}
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          loading={loading}
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