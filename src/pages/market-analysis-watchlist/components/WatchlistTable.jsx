import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const WatchlistTable = ({ assets, onRemove, onAddToPortfolio, onSetAlert, onSort, sortConfig }) => {
  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    }
    if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-muted" />;
    }
    return sortConfig.direction === 'asc' ? 
      <Icon name="ArrowUp" size={14} className="text-primary" /> : 
      <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-text-secondary">Asset</th>
              <th 
                className="text-right p-4 text-sm font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => onSort('current_price')}
              >
                <div className="flex items-center justify-end gap-1">
                  Price
                  {getSortIcon('current_price')}
                </div>
              </th>
              <th 
                className="text-right p-4 text-sm font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => onSort('price_change_percentage_24h')}
              >
                <div className="flex items-center justify-end gap-1">
                  24h Change
                  {getSortIcon('price_change_percentage_24h')}
                </div>
              </th>
              <th 
                className="text-right p-4 text-sm font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => onSort('market_cap')}
              >
                <div className="flex items-center justify-end gap-1">
                  Market Cap
                  {getSortIcon('market_cap')}
                </div>
              </th>
              <th 
                className="text-right p-4 text-sm font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                onClick={() => onSort('total_volume')}
              >
                <div className="flex items-center justify-end gap-1">
                  Volume (24h)
                  {getSortIcon('total_volume')}
                </div>
              </th>
              <th className="text-center p-4 text-sm font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-b border-border hover:bg-surface-secondary transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-secondary">
                      <Image 
                        src={asset.image} 
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{asset.symbol.toUpperCase()}</div>
                      <div className="text-sm text-text-secondary">{asset.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right font-data font-semibold">
                  {formatPrice(asset.current_price)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Icon 
                      name={asset.price_change_percentage_24h >= 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      color={asset.price_change_percentage_24h >= 0 ? "var(--color-success)" : "var(--color-error)"} 
                    />
                    <span className={`font-medium ${
                      asset.price_change_percentage_24h >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      {asset.price_change_percentage_24h >= 0 ? '+' : ''}{asset.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right font-data">
                  {formatMarketCap(asset.market_cap)}
                </td>
                <td className="p-4 text-right font-data">
                  {formatVolume(asset.total_volume)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddToPortfolio(asset)}
                      iconName="Plus"
                      iconSize={14}
                    >
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSetAlert(asset)}
                      iconName="Bell"
                      iconSize={14}
                    >
                      Alert
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(asset.id)}
                      className="text-text-muted hover:text-error"
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchlistTable;