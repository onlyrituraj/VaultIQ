import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const AssetTable = ({ assets, onBuySell, onAddToWatchlist, onViewDetails, onSort, sortConfig }) => {
  const handleSort = (key) => {
    onSort(key);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "ArrowUpDown";
    return sortConfig.direction === 'asc' ? "ArrowUp" : "ArrowDown";
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  Asset
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="text-right p-4">
                <button
                  onClick={() => handleSort('currentPrice')}
                  className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary ml-auto"
                >
                  Price
                  <Icon name={getSortIcon('currentPrice')} size={14} />
                </button>
              </th>
              <th className="text-right p-4">
                <button
                  onClick={() => handleSort('change24h')}
                  className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary ml-auto"
                >
                  24h Change
                  <Icon name={getSortIcon('change24h')} size={14} />
                </button>
              </th>
              <th className="text-right p-4">
                <button
                  onClick={() => handleSort('holdings')}
                  className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary ml-auto"
                >
                  Holdings
                  <Icon name={getSortIcon('holdings')} size={14} />
                </button>
              </th>
              <th className="text-right p-4">
                <button
                  onClick={() => handleSort('value')}
                  className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary ml-auto"
                >
                  Value
                  <Icon name={getSortIcon('value')} size={14} />
                </button>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-text-secondary">Market Cap</span>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-text-secondary">Volume</span>
              </th>
              <th className="text-center p-4">
                <span className="text-sm font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => {
              const isPositive = asset.change24h >= 0;
              return (
                <tr key={asset.id} className="border-b border-border hover:bg-surface-secondary transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-secondary">
                        <Image 
                          src={asset.icon} 
                          alt={`${asset.name} icon`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{asset.symbol}</div>
                        <div className="text-sm text-text-secondary">{asset.name}</div>
                      </div>
                      {asset.isWatchlisted && (
                        <Icon name="Star" size={14} className="text-warning" />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-semibold text-text-primary font-data">{asset.currentPrice}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      isPositive ? 'text-success' : 'text-error'
                    }`}>
                      <Icon 
                        name={isPositive ? "TrendingUp" : "TrendingDown"} 
                        size={14} 
                      />
                      <span className="font-medium">{asset.change24h}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-semibold text-text-primary font-data">{asset.holdings}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-semibold text-text-primary font-data">{asset.value}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm text-text-secondary font-data">{asset.marketCap}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm text-text-secondary font-data">{asset.volume24h}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBuySell(asset.id, 'buy')}
                        className="w-8 h-8 p-0"
                      >
                        <Icon name="Plus" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBuySell(asset.id, 'sell')}
                        className="w-8 h-8 p-0"
                      >
                        <Icon name="Minus" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddToWatchlist(asset.id)}
                        className="w-8 h-8 p-0"
                      >
                        <Icon 
                          name={asset.isWatchlisted ? "Star" : "StarOff"} 
                          size={14}
                          className={asset.isWatchlisted ? "text-warning" : "text-text-muted"}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(asset.id)}
                        className="w-8 h-8 p-0"
                      >
                        <Icon name="MoreHorizontal" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;