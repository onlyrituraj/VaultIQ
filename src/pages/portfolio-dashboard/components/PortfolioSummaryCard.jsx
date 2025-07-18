import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioSummaryCard = ({ portfolioData, onCurrencyToggle, loading = false }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const currencies = ['USD', 'EUR', 'BTC', 'ETH'];
  
  // Provide default values if portfolioData is null/undefined
  const safePortfolioData = portfolioData || {
    totalValue: 0,
    change24h: 0,
    changeValue: 0
  };
  
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    if (onCurrencyToggle) {
      onCurrencyToggle(currency);
    }
  };

  const formatValue = (value, currency) => {
    const safeValue = value || 0;
    const formattedValue = safeValue.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    if (currency === 'BTC') return `₿${formattedValue}`;
    if (currency === 'ETH') return `Ξ${formattedValue}`;
    return `${currency === 'EUR' ? '€' : '$'}${formattedValue}`;
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Portfolio Value</h2>
          <div className="flex items-center gap-2">
            {currencies.map((currency) => (
              <div
                key={currency}
                className="px-2 py-1 rounded bg-gray-200 animate-pulse h-6 w-12"
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="h-10 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
          </div>
          
          <div className="h-3 bg-gray-200 animate-pulse rounded w-40"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Portfolio Value</h2>
        <div className="flex items-center gap-2">
          {currencies.map((currency) => (
            <Button
              key={currency}
              variant={selectedCurrency === currency ? "primary" : "ghost"}
              size="xs"
              onClick={() => handleCurrencyChange(currency)}
              className="px-2 py-1"
            >
              {currency}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="text-3xl font-bold text-text-primary font-data">
            {formatValue(safePortfolioData.totalValue, selectedCurrency)}
          </div>
          <div className="text-sm text-text-secondary">Total Portfolio Value</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon 
              name={safePortfolioData.change24h >= 0 ? "TrendingUp" : "TrendingDown"} 
              size={20} 
              color={safePortfolioData.change24h >= 0 ? "var(--color-success)" : "var(--color-error)"} 
            />
            <span className={`font-semibold ${safePortfolioData.change24h >= 0 ? 'text-success' : 'text-error'}`}>
              {safePortfolioData.change24h >= 0 ? '+' : ''}{safePortfolioData.change24h.toFixed(2)}%
            </span>
          </div>
          <div className={`text-sm font-medium ${safePortfolioData.change24h >= 0 ? 'text-success' : 'text-error'}`}>
            {safePortfolioData.change24h >= 0 ? '+' : ''}{formatValue(safePortfolioData.changeValue, selectedCurrency)}
          </div>
        </div>
        
        <div className="text-xs text-text-muted">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;