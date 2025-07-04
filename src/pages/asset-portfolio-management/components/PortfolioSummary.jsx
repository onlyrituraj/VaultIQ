import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioSummary = ({ portfolioData, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-lg p-4 lg:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Portfolio Summary</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={onRefresh}
            className="w-8 h-8 p-0"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 p-0"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-surface-secondary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Total Value</span>
            <Icon name="DollarSign" size={16} className="text-text-muted" />
          </div>
          <div className="text-2xl font-bold text-text-primary font-data">
            {portfolioData.totalValue}
          </div>
          <div className={`flex items-center gap-1 mt-1 ${
            portfolioData.totalChange.isPositive ? 'text-success' : 'text-error'
          }`}>
            <Icon 
              name={portfolioData.totalChange.isPositive ? "TrendingUp" : "TrendingDown"} 
              size={14} 
            />
            <span className="text-sm font-medium">
              {portfolioData.totalChange.percentage} ({portfolioData.totalChange.value})
            </span>
          </div>
        </div>

        <div className="bg-surface-secondary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">24h Change</span>
            <Icon name="Clock" size={16} className="text-text-muted" />
          </div>
          <div className={`text-2xl font-bold font-data ${
            portfolioData.dayChange.isPositive ? 'text-success' : 'text-error'
          }`}>
            {portfolioData.dayChange.value}
          </div>
          <div className={`flex items-center gap-1 mt-1 ${
            portfolioData.dayChange.isPositive ? 'text-success' : 'text-error'
          }`}>
            <span className="text-sm font-medium">
              {portfolioData.dayChange.percentage}
            </span>
          </div>
        </div>

        <div className="bg-surface-secondary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Total Assets</span>
            <Icon name="Coins" size={16} className="text-text-muted" />
          </div>
          <div className="text-2xl font-bold text-text-primary font-data">
            {portfolioData.totalAssets}
          </div>
          <div className="text-sm text-text-secondary mt-1">
            Across {portfolioData.walletCount} wallets
          </div>
        </div>

        <div className="bg-surface-secondary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Best Performer</span>
            <Icon name="Award" size={16} className="text-text-muted" />
          </div>
          <div className="text-lg font-bold text-text-primary">
            {portfolioData.bestPerformer.symbol}
          </div>
          <div className="flex items-center gap-1 mt-1 text-success">
            <Icon name="TrendingUp" size={14} />
            <span className="text-sm font-medium">
              +{portfolioData.bestPerformer.change}
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border pt-4 animate-slide-down">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">Top Holdings</h3>
              <div className="space-y-2">
                {portfolioData.topHoldings.map((holding, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {holding.symbol.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-text-primary">{holding.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-text-primary">
                        {holding.percentage}%
                      </div>
                      <div className="text-xs text-text-secondary">
                        {holding.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-primary mb-3">Allocation Breakdown</h3>
              <div className="space-y-2">
                {portfolioData.allocation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary w-12 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSummary;