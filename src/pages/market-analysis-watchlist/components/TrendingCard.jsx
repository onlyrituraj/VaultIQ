import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TrendingCard = ({ asset, onAddToWatchlist, onAddToPortfolio }) => {
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

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-secondary">
            <Image 
              src={asset.image} 
              alt={asset.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{asset.symbol.toUpperCase()}</h3>
            <p className="text-sm text-text-secondary">{asset.name}</p>
          </div>
        </div>
        {asset.trending_rank && (
          <div className="bg-primary-100 text-primary px-2 py-1 rounded-full text-xs font-medium">
            #{asset.trending_rank}
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Price</span>
          <span className="font-semibold font-data">{formatPrice(asset.current_price)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">24h Change</span>
          <div className="flex items-center gap-1">
            <Icon 
              name={asset.price_change_percentage_24h >= 0 ? "TrendingUp" : "TrendingDown"} 
              size={14} 
              color={asset.price_change_percentage_24h >= 0 ? "var(--color-success)" : "var(--color-error)"} 
            />
            <span className={`text-sm font-medium ${
              asset.price_change_percentage_24h >= 0 ? 'text-success' : 'text-error'
            }`}>
              {asset.price_change_percentage_24h >= 0 ? '+' : ''}{asset.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Market Cap</span>
          <span className="text-sm font-data">{formatMarketCap(asset.market_cap)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddToWatchlist(asset)}
          className="flex-1"
          iconName="Eye"
          iconSize={14}
        >
          Watch
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddToPortfolio(asset)}
          className="flex-1"
          iconName="Plus"
          iconSize={14}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default TrendingCard;