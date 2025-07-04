import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ isOpen, onClose, filters, onFilterChange, onClearFilters }) => {
  const walletOptions = [
    { id: 'all', name: 'All Wallets', address: '' },
    { id: 'wallet1', name: 'Main Wallet', address: '0x742d35Cc6634C0532925a3b8D4' },
    { id: 'wallet2', name: 'Trading Wallet', address: '0x8f3CF7ad23Cd3CaDbD9735AFf958023239c6A063' },
    { id: 'wallet3', name: 'DeFi Wallet', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
  ];

  const assetTypes = [
    { id: 'all', name: 'All Assets' },
    { id: 'layer1', name: 'Layer 1 (BTC, ETH)' },
    { id: 'altcoins', name: 'Altcoins' },
    { id: 'defi', name: 'DeFi Tokens' },
    { id: 'stablecoins', name: 'Stablecoins' },
    { id: 'nft', name: 'NFT Collections' },
  ];

  const performanceRanges = [
    { id: 'all', name: 'All Performance' },
    { id: 'gainers', name: 'Gainers (>0%)' },
    { id: 'losers', name: 'Losers (<0%)' },
    { id: 'high_gainers', name: 'High Gainers (>10%)' },
    { id: 'high_losers', name: 'High Losers (<-10%)' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:relative lg:bg-transparent lg:inset-auto">
      <div className="fixed right-0 top-0 h-full w-80 bg-surface border-l border-border shadow-xl lg:relative lg:w-full lg:h-auto lg:shadow-none lg:border lg:rounded-lg animate-slide-down">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-8 h-8 p-0"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] lg:max-h-none">
          {/* Wallet Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Wallet Address
            </label>
            <div className="space-y-2">
              {walletOptions.map((wallet) => (
                <label key={wallet.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="wallet"
                    value={wallet.id}
                    checked={filters.wallet === wallet.id}
                    onChange={(e) => onFilterChange('wallet', e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary">{wallet.name}</div>
                    {wallet.address && (
                      <div className="text-xs text-text-secondary font-data truncate">
                        {wallet.address}...
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Asset Type Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Asset Type
            </label>
            <div className="space-y-2">
              {assetTypes.map((type) => (
                <label key={type.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="assetType"
                    value={type.id}
                    checked={filters.assetType === type.id}
                    onChange={(e) => onFilterChange('assetType', e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">{type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Performance Range Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              24h Performance
            </label>
            <div className="space-y-2">
              {performanceRanges.map((range) => (
                <label key={range.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="performance"
                    value={range.id}
                    checked={filters.performance === range.id}
                    onChange={(e) => onFilterChange('performance', e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">{range.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allocation Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Portfolio Allocation
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-secondary mb-1">
                  Minimum Allocation (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minAllocation}
                  onChange={(e) => onFilterChange('minAllocation', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">
                  Maximum Allocation (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxAllocation}
                  onChange={(e) => onFilterChange('maxAllocation', e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Value Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Holdings Value Range
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-secondary mb-1">
                  Minimum Value ($)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={filters.minValue}
                  onChange={(e) => onFilterChange('minValue', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">
                  Maximum Value ($)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={filters.maxValue}
                  onChange={(e) => onFilterChange('maxValue', e.target.value)}
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              onClick={onClose}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;