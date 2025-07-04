import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioSummaryCard = ({ portfolioData, onCurrencyToggle }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  const currencies = ['USD', 'EUR', 'BTC', 'ETH'];
  
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    onCurrencyToggle(currency);
  };

  const formatValue = (value, currency) => {
    if (currency === 'BTC') return `₿${value}`;
    if (currency === 'ETH') return `Ξ${value}`;
    return `${currency === 'EUR' ? '€' : '$'}${value}`;
  };

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
            {formatValue(portfolioData.totalValue, selectedCurrency)}
          </div>
          <div className="text-sm text-text-secondary">Total Portfolio Value</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon 
              name={portfolioData.change24h >= 0 ? "TrendingUp" : "TrendingDown"} 
              size={20} 
              color={portfolioData.change24h >= 0 ? "var(--color-success)" : "var(--color-error)"} 
            />
            <span className={`font-semibold ${portfolioData.change24h >= 0 ? 'text-success' : 'text-error'}`}>
              {portfolioData.change24h >= 0 ? '+' : ''}{portfolioData.change24h.toFixed(2)}%
            </span>
          </div>
          <div className={`text-sm font-medium ${portfolioData.change24h >= 0 ? 'text-success' : 'text-error'}`}>
            {portfolioData.change24h >= 0 ? '+' : ''}{formatValue(portfolioData.changeValue, selectedCurrency)}
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