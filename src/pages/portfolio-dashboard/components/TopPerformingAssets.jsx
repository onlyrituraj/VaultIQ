import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const TopPerformingAssets = ({ assets, isExpanded, onToggleExpand }) => {
  const displayAssets = isExpanded ? assets : assets.slice(0, 5);

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Top Performers</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="p-2"
          >
            <Icon name={isExpanded ? "Minimize2" : "Maximize2"} size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>
      
      <div className={`space-y-3 transition-all duration-300 ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-64'}`}>
        {displayAssets.map((asset, index) => (
          <div key={asset.symbol} className="flex items-center justify-between p-3 hover:bg-surface-secondary rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={asset.logo}
                  alt={asset.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div>
                <div className="font-medium text-text-primary">{asset.symbol}</div>
                <div className="text-sm text-text-secondary">{asset.name}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-data text-text-primary">${asset.price.toLocaleString()}</div>
              <div className="flex items-center gap-1 justify-end">
                <Icon 
                  name={asset.change >= 0 ? "TrendingUp" : "TrendingDown"} 
                  size={14} 
                  color={asset.change >= 0 ? "var(--color-success)" : "var(--color-error)"} 
                />
                <span className={`text-sm font-medium ${asset.change >= 0 ? 'text-success' : 'text-error'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!isExpanded && assets.length > 5 && (
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            View All {assets.length} Assets
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopPerformingAssets;