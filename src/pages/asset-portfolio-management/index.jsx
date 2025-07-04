import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PortfolioSummary from './components/PortfolioSummary';
import AssetCard from './components/AssetCard';
import AssetTable from './components/AssetTable';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import ViewToggle from './components/ViewToggle';
import SortOptions from './components/SortOptions';
import BulkActions from './components/BulkActions';

const AssetPortfolioManagement = () => {
  const [currentView, setCurrentView] = useState('cards');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' });
  const [filters, setFilters] = useState({
    wallet: 'all',
    assetType: 'all',
    performance: 'all',
    minAllocation: '',
    maxAllocation: '',
    minValue: '',
    maxValue: ''
  });

  // Mock portfolio data
  const [portfolioData] = useState({
    totalValue: '$124,567.89',
    totalChange: {
      percentage: '+12.5%',
      value: '+$13,842.12',
      isPositive: true
    },
    dayChange: {
      percentage: '+5.2%',
      value: '+$6,234.12',
      isPositive: true
    },
    totalAssets: 12,
    walletCount: 3,
    bestPerformer: {
      symbol: 'SOL',
      change: '18.4%'
    },
    topHoldings: [
      { name: 'Bitcoin', symbol: 'BTC', percentage: 35.2, value: '$43,847.89' },
      { name: 'Ethereum', symbol: 'ETH', percentage: 28.7, value: '$35,734.12' },
      { name: 'Solana', symbol: 'SOL', percentage: 15.3, value: '$19,058.76' },
      { name: 'Cardano', symbol: 'ADA', percentage: 8.9, value: '$11,086.54' },
    ],
    allocation: [
      { category: 'Layer 1', percentage: 68 },
      { category: 'DeFi', percentage: 18 },
      { category: 'Stablecoins', percentage: 10 },
      { category: 'Others', percentage: 4 },
    ]
  });

  // Mock assets data
  const [assets, setAssets] = useState([
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=40&h=40&fit=crop&crop=center',
      currentPrice: '$43,247.89',
      change24h: 2.4,
      holdings: '1.0142 BTC',
      value: '$43,847.89',
      marketCap: '$847.2B',
      volume24h: '$28.4B',
      isWatchlisted: true,
      allocation: 35.2,
      type: 'layer1'
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=40&h=40&fit=crop&crop=center',
      currentPrice: '$2,547.32',
      change24h: 1.8,
      holdings: '14.032 ETH',
      value: '$35,734.12',
      marketCap: '$306.1B',
      volume24h: '$15.2B',
      isWatchlisted: true,
      allocation: 28.7,
      type: 'layer1'
    },
    {
      id: 'sol',
      symbol: 'SOL',
      name: 'Solana',
      icon: 'https://images.unsplash.com/photo-1640826787865-e1e2c7c8e8c8?w=40&h=40&fit=crop&crop=center',
      currentPrice: '$98.45',
      change24h: 18.4,
      holdings: '193.67 SOL',
      value: '$19,058.76',
      marketCap: '$42.8B',
      volume24h: '$2.1B',
      isWatchlisted: true,
      allocation: 15.3,
      type: 'layer1'
    },
    {
      id: 'ada',
      symbol: 'ADA',
      name: 'Cardano',
      icon: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=40&h=40&fit=crop&crop=center',
      currentPrice: '$0.4523',
      change24h: -3.2,
      holdings: '24,512 ADA',
      value: '$11,086.54',
      marketCap: '$15.9B',
      volume24h: '$847M',
      isWatchlisted: false,
      allocation: 8.9,
      type: 'layer1'
    },
    {
      id: 'dot',
      symbol: 'DOT',
      name: 'Polkadot',
      icon: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=40&h=40&fit=crop&crop=center',
      currentPrice: '$7.89',
      change24h: 5.7,
      holdings: '892.34 DOT',
      value: '$7,040.82',
      marketCap: '$9.2B',
      volume24h: '$234M',
      isWatchlisted: true,
      allocation: 5.7,
      type: 'layer1'
    },
    {
      id: 'avax',
      symbol: 'AVAX',
      name: 'Avalanche',
      icon: 'https://images.unsplash.com/photo-1640826787865-e1e2c7c8e8c8?w=40&h=40&fit=crop&crop=center',
      currentPrice: '$34.67',
      change24h: -1.4,
      holdings: '156.78 AVAX',
      value: '$5,436.21',
      marketCap: '$13.1B',
      volume24h: '$456M',
      isWatchlisted: false,
      allocation: 4.4,
      type: 'layer1'
    },
    {
      id: 'usdc',
      symbol: 'USDC',
      name: 'USD Coin',
      icon: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?w=40&h=40&fit=crop&crop=center',
      currentPrice: '$1.00',
      change24h: 0.0,
      holdings: '2,364.00 USDC',
      value: '$2,364.00',
      marketCap: '$24.8B',
      volume24h: '$3.2B',
      isWatchlisted: false,
      allocation: 1.9,
      type: 'stablecoin'
    }
  ]);

  // Filter and sort assets
  const filteredAndSortedAssets = React.useMemo(() => {
    let filtered = assets.filter(asset => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!asset.symbol.toLowerCase().includes(query) && 
            !asset.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Asset type filter
      if (filters.assetType !== 'all') {
        if (filters.assetType === 'layer1' && asset.type !== 'layer1') return false;
        if (filters.assetType === 'stablecoins' && asset.type !== 'stablecoin') return false;
        if (filters.assetType === 'defi' && asset.type !== 'defi') return false;
        if (filters.assetType === 'altcoins' && asset.type === 'layer1') return false;
      }

      // Performance filter
      if (filters.performance !== 'all') {
        if (filters.performance === 'gainers' && asset.change24h <= 0) return false;
        if (filters.performance === 'losers' && asset.change24h >= 0) return false;
        if (filters.performance === 'high_gainers' && asset.change24h <= 10) return false;
        if (filters.performance === 'high_losers' && asset.change24h >= -10) return false;
      }

      // Allocation filter
      if (filters.minAllocation && asset.allocation < parseFloat(filters.minAllocation)) return false;
      if (filters.maxAllocation && asset.allocation > parseFloat(filters.maxAllocation)) return false;

      // Value filter
      const numericValue = parseFloat(asset.value.replace(/[$,]/g, ''));
      if (filters.minValue && numericValue < parseFloat(filters.minValue)) return false;
      if (filters.maxValue && numericValue > parseFloat(filters.maxValue)) return false;

      return true;
    });

    // Sort assets
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'currentPrice':
          aValue = parseFloat(a.currentPrice.replace(/[$,]/g, ''));
          bValue = parseFloat(b.currentPrice.replace(/[$,]/g, ''));
          break;
        case 'change24h':
          aValue = a.change24h;
          bValue = b.change24h;
          break;
        case 'value':
          aValue = parseFloat(a.value.replace(/[$,]/g, ''));
          bValue = parseFloat(b.value.replace(/[$,]/g, ''));
          break;
        case 'marketCap':
          aValue = parseFloat(a.marketCap.replace(/[$,BM]/g, ''));
          bValue = parseFloat(b.marketCap.replace(/[$,BM]/g, ''));
          break;
        case 'volume24h':
          aValue = parseFloat(a.volume24h.replace(/[$,BM]/g, ''));
          bValue = parseFloat(b.volume24h.replace(/[$,BM]/g, ''));
          break;
        default:
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [assets, searchQuery, filters, sortConfig]);

  const handleRefresh = () => {
    console.log('Refreshing portfolio data...');
    // Simulate refresh with loading state
  };

  const handleBuySell = (assetId, action) => {
    console.log(`${action} action for asset:`, assetId);
    // Implement buy/sell simulation
  };

  const handleAddToWatchlist = (assetId) => {
    setAssets(prev => prev.map(asset => 
      asset.id === assetId 
        ? { ...asset, isWatchlisted: !asset.isWatchlisted }
        : asset
    ));
  };

  const handleViewDetails = (assetId) => {
    console.log('View details for asset:', assetId);
    // Navigate to asset details or open modal
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      wallet: 'all',
      assetType: 'all',
      performance: 'all',
      minAllocation: '',
      maxAllocation: '',
      minValue: '',
      maxValue: ''
    });
  };

  const handleAssetSelection = (assetId) => {
    setSelectedAssets(prev => 
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleClearSelection = () => {
    setSelectedAssets([]);
  };

  const handleRebalance = (selectedAssetIds) => {
    console.log('Rebalancing assets:', selectedAssetIds);
    // Implement rebalancing logic
  };

  const handleExport = (selectedAssetIds, format) => {
    console.log(`Exporting ${selectedAssetIds.length} assets as ${format}`);
    // Implement export functionality
  };

  // Responsive view switching
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCurrentView('table');
      } else {
        setCurrentView('cards');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 lg:pb-6">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary font-heading">
              Asset Portfolio Management
            </h1>
            <p className="text-text-secondary mt-1">
              Track, analyze, and manage your cryptocurrency holdings
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2"
            >
              <Icon name="Filter" size={16} />
              <span className="hidden sm:inline">Filters</span>
              {Object.values(filters).some(value => value && value !== 'all') && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
            
            <ViewToggle 
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary 
          portfolioData={portfolioData}
          onRefresh={handleRefresh}
        />

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <SortOptions 
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            
            <Button
              variant="primary"
              className="flex items-center gap-2"
            >
              <Icon name="Plus" size={16} />
              <span className="hidden sm:inline">Add Asset</span>
            </Button>
          </div>
        </div>

        {/* Assets Display */}
        <div className="mb-6">
          {currentView === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedAssets.map((asset) => (
                <div key={asset.id} className="relative">
                  {selectedAssets.length > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => handleAssetSelection(asset.id)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                    </div>
                  )}
                  <AssetCard
                    asset={asset}
                    onBuySell={handleBuySell}
                    onAddToWatchlist={handleAddToWatchlist}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          ) : (
            <AssetTable
              assets={filteredAndSortedAssets}
              onBuySell={handleBuySell}
              onAddToWatchlist={handleAddToWatchlist}
              onViewDetails={handleViewDetails}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          )}

          {filteredAndSortedAssets.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Search" size={32} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No assets found</h3>
              <p className="text-text-secondary">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Bulk Selection Toggle */}
        {selectedAssets.length === 0 && (
          <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40">
            <Button
              variant="primary"
              onClick={() => setSelectedAssets(['btc'])}
              className="w-12 h-12 rounded-full p-0 shadow-lg"
            >
              <Icon name="CheckSquare" size={20} />
            </Button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedAssets={selectedAssets}
        onClearSelection={handleClearSelection}
        onRebalance={handleRebalance}
        onExport={handleExport}
      />
    </div>
  );
};

export default AssetPortfolioManagement;