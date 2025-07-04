import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const AssetCard = ({ asset, onBuySell, onAddToWatchlist, onViewDetails }) => {
  const isPositive = asset.change24h >= 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-secondary">
            <Image 
              src={asset.icon} 
              alt={`${asset.name} icon`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{asset.symbol}</h3>
            <p className="text-sm text-text-secondary">{asset.name}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => onAddToWatchlist(asset.id)}
          className="w-8 h-8 p-0"
        >
          <Icon 
            name={asset.isWatchlisted ? "Star" : "StarOff"} 
            size={16}
            className={asset.isWatchlisted ? "text-warning" : "text-text-muted"}
          />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-text-secondary mb-1">Current Price</p>
          <p className="font-semibold text-text-primary font-data">{asset.currentPrice}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">24h Change</p>
          <div className={`flex items-center gap-1 ${
            isPositive ? 'text-success' : 'text-error'
          }`}>
            <Icon 
              name={isPositive ? "TrendingUp" : "TrendingDown"} 
              size={12} 
            />
            <span className="text-sm font-medium">{asset.change24h}%</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Holdings</p>
          <p className="font-semibold text-text-primary font-data">{asset.holdings}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Value</p>
          <p className="font-semibold text-text-primary font-data">{asset.value}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onBuySell(asset.id, 'buy')}
          className="flex-1"
        >
          Buy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBuySell(asset.id, 'sell')}
          className="flex-1"
        >
          Sell
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(asset.id)}
          className="w-8 h-8 p-0"
        >
          <Icon name="MoreHorizontal" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AssetCard;