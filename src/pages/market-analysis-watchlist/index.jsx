import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import WatchlistCard from './components/WatchlistCard';
import WatchlistTable from './components/WatchlistTable';
import TrendingCard from './components/TrendingCard';
import MarketOverviewCard from './components/MarketOverviewCard';
import PriceChart from './components/PriceChart';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';

const MarketAnalysisWatchlist = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
  const [selectedAssetForChart, setSelectedAssetForChart] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Mock data for watchlist
  const [watchlistAssets, setWatchlistAssets] = useState([
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=40&h=40&fit=crop&crop=center',
      current_price: 43250.00,
      price_change_percentage_24h: 2.45,
      market_cap: 847000000000,
      total_volume: 28500000000
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=40&h=40&fit=crop&crop=center',
      current_price: 2650.00,
      price_change_percentage_24h: -1.23,
      market_cap: 318000000000,
      total_volume: 15200000000
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=40&h=40&fit=crop&crop=center',
      current_price: 0.485,
      price_change_percentage_24h: 3.67,
      market_cap: 17200000000,
      total_volume: 890000000
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=40&h=40&fit=crop&crop=center',
      current_price: 98.50,
      price_change_percentage_24h: 5.12,
      market_cap: 42800000000,
      total_volume: 2100000000
    }
  ]);

  // Mock trending assets
  const trendingAssets = [
    {
      id: 'polygon',
      symbol: 'matic',
      name: 'Polygon',
      image: 'https://images.unsplash.com/photo-1640826844110-c7c7d4b8b6b8?w=40&h=40&fit=crop&crop=center',
      current_price: 0.875,
      price_change_percentage_24h: 12.34,
      market_cap: 8100000000,
      trending_rank: 1
    },
    {
      id: 'chainlink',
      symbol: 'link',
      name: 'Chainlink',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=40&h=40&fit=crop&crop=center',
      current_price: 14.25,
      price_change_percentage_24h: 8.76,
      market_cap: 8400000000,
      trending_rank: 2
    },
    {
      id: 'avalanche',
      symbol: 'avax',
      name: 'Avalanche',
      image: 'https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=40&h=40&fit=crop&crop=center',
      current_price: 36.80,
      price_change_percentage_24h: 6.45,
      market_cap: 13500000000,
      trending_rank: 3
    },
    {
      id: 'polkadot',
      symbol: 'dot',
      name: 'Polkadot',
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=40&h=40&fit=crop&crop=center',
      current_price: 7.25,
      price_change_percentage_24h: 4.23,
      market_cap: 9200000000,
      trending_rank: 4
    }
  ];

  // Mock market overview data
  const marketOverview = {
    totalMarketCap: '$1.68T',
    totalMarketCapChange: 2.34,
    totalMarketCapChangeValue: '$38.2B',
    totalVolume: '$89.5B',
    totalVolumeChange: -5.67,
    totalVolumeChangeValue: '-$5.4B',
    btcDominance: '52.3%',
    btcDominanceChange: 0.45,
    fearGreedIndex: 68,
    fearGreedLabel: 'Greed'
  };

  // Mock chart data
  const generateChartData = (timeframe) => {
    const now = new Date();
    const data = [];
    let intervals, intervalMs;

    switch (timeframe) {
      case '1H':
        intervals = 60;
        intervalMs = 60 * 1000; // 1 minute
        break;
      case '24H':
        intervals = 24;
        intervalMs = 60 * 60 * 1000; // 1 hour
        break;
      case '7D':
        intervals = 7;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '30D':
        intervals = 30;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      default:
        intervals = 24;
        intervalMs = 60 * 60 * 1000;
    }

    let basePrice = selectedAssetForChart?.current_price || 43250;
    
    for (let i = intervals; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * intervalMs));
      const volatility = 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility;
      basePrice = basePrice * (1 + change);
      
      data.push({
        timestamp: timestamp.getTime(),
        price: Math.max(basePrice, 0.01)
      });
    }

    return data;
  };

  const [chartData, setChartData] = useState([]);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    marketCap: 'all',
    priceChange: 'all',
    volumeMin: '',
    volumeMax: '',
    category: 'all'
  });

  const timeframes = ['1H', '24H', '7D', '30D'];

  useEffect(() => {
    if (selectedAssetForChart) {
      setChartData(generateChartData(selectedTimeframe));
    }
  }, [selectedAssetForChart, selectedTimeframe]);

  useEffect(() => {
    // Set default chart asset to Bitcoin
    if (watchlistAssets.length > 0 && !selectedAssetForChart) {
      setSelectedAssetForChart(watchlistAssets[0]);
    }
  }, [watchlistAssets]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  const handleAssetSelect = (asset) => {
    setSelectedAssetForChart(asset);
  };

  const handleRemoveFromWatchlist = (assetId) => {
    setWatchlistAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  const handleAddToWatchlist = (asset) => {
    const exists = watchlistAssets.find(item => item.id === asset.id);
    if (!exists) {
      setWatchlistAssets(prev => [...prev, asset]);
    }
  };

  const handleAddToPortfolio = (asset) => {
    console.log('Adding to portfolio:', asset);
    // This would typically navigate to portfolio or open a modal
  };

  const handleSetAlert = (asset) => {
    console.log('Setting alert for:', asset);
    // This would typically open an alert configuration modal
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      marketCap: 'all',
      priceChange: 'all',
      volumeMin: '',
      volumeMax: '',
      category: 'all'
    });
  };

  const getSortedAssets = (assets) => {
    if (!sortConfig.key) return assets;

    return [...assets].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedWatchlistAssets = getSortedAssets(watchlistAssets);

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary font-heading">Market Analysis</h1>
            <p className="text-text-secondary mt-1">Track markets and manage your watchlist</p>
          </div>
          
          <div className="flex items-center gap-4">
            <SearchBar 
              onAddToWatchlist={handleAddToWatchlist}
              onAddToPortfolio={handleAddToPortfolio}
            />
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex space-x-1 bg-surface-secondary rounded-lg p-1">
            {[
              { id: 'watchlist', label: 'Watchlist', icon: 'Eye' },
              { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
              { id: 'overview', label: 'Market Overview', icon: 'BarChart3' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {activeTab === 'watchlist' && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'card' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleViewModeChange('card')}
                className="hidden lg:flex"
              >
                <Icon name="Grid3X3" size={16} />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleViewModeChange('table')}
                className="hidden lg:flex"
              >
                <Icon name="List" size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            {/* Price Chart */}
            {selectedAssetForChart && (
              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-secondary">
                      <img 
                        src={selectedAssetForChart.image} 
                        alt={selectedAssetForChart.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {selectedAssetForChart.symbol.toUpperCase()} Price Chart
                      </h3>
                      <p className="text-sm text-text-secondary">{selectedAssetForChart.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {timeframes.map((timeframe) => (
                      <Button
                        key={timeframe}
                        variant={selectedTimeframe === timeframe ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleTimeframeChange(timeframe)}
                      >
                        {timeframe}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <PriceChart 
                  data={chartData} 
                  timeframe={selectedTimeframe}
                  color={selectedAssetForChart.price_change_percentage_24h >= 0 ? "var(--color-success)" : "var(--color-error)"}
                />
              </div>
            )}

            {/* Watchlist Assets */}
            {watchlistAssets.length > 0 ? (
              <div>
                {viewMode === 'card' || window.innerWidth < 1024 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sortedWatchlistAssets.map((asset) => (
                      <div key={asset.id} onClick={() => handleAssetSelect(asset)} className="cursor-pointer">
                        <WatchlistCard
                          asset={asset}
                          onRemove={handleRemoveFromWatchlist}
                          onAddToPortfolio={handleAddToPortfolio}
                          onSetAlert={handleSetAlert}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <WatchlistTable
                    assets={sortedWatchlistAssets}
                    onRemove={handleRemoveFromWatchlist}
                    onAddToPortfolio={handleAddToPortfolio}
                    onSetAlert={handleSetAlert}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />
                )}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-lg p-12 text-center">
                <Icon name="Eye" size={48} className="mx-auto mb-4 text-text-muted" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">Your watchlist is empty</h3>
                <p className="text-text-secondary mb-4">Search and add cryptocurrencies to track their performance</p>
                <Button variant="primary" iconName="Plus">
                  Add Assets
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {trendingAssets.map((asset) => (
                <TrendingCard
                  key={asset.id}
                  asset={asset}
                  onAddToWatchlist={handleAddToWatchlist}
                  onAddToPortfolio={handleAddToPortfolio}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MarketOverviewCard
                title="Total Market Cap"
                value={marketOverview.totalMarketCap}
                change={marketOverview.totalMarketCapChange}
                changeValue={marketOverview.totalMarketCapChangeValue}
                icon="DollarSign"
                color="primary"
              />
              <MarketOverviewCard
                title="24h Volume"
                value={marketOverview.totalVolume}
                change={marketOverview.totalVolumeChange}
                changeValue={marketOverview.totalVolumeChangeValue}
                icon="BarChart3"
                color="secondary"
              />
              <MarketOverviewCard
                title="BTC Dominance"
                value={marketOverview.btcDominance}
                change={marketOverview.btcDominanceChange}
                icon="PieChart"
                color="warning"
              />
              <MarketOverviewCard
                title="Fear & Greed Index"
                value={`${marketOverview.fearGreedIndex} - ${marketOverview.fearGreedLabel}`}
                icon="Activity"
                color={marketOverview.fearGreedIndex > 50 ? "success" : "error"}
              />
            </div>

            {/* Market Sectors */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Sector Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'DeFi', change: 5.67, color: 'success' },
                  { name: 'Layer 1', change: 2.34, color: 'success' },
                  { name: 'Layer 2', change: 8.91, color: 'success' },
                  { name: 'Meme Coins', change: -3.45, color: 'error' },
                  { name: 'Gaming', change: 1.23, color: 'success' },
                  { name: 'NFT', change: -1.78, color: 'error' }
                ].map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                    <span className="font-medium text-text-primary">{sector.name}</span>
                    <div className="flex items-center gap-1">
                      <Icon 
                        name={sector.change >= 0 ? "TrendingUp" : "TrendingDown"} 
                        size={14} 
                        color={sector.change >= 0 ? "var(--color-success)" : "var(--color-error)"} 
                      />
                      <span className={`text-sm font-medium ${
                        sector.change >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketAnalysisWatchlist;