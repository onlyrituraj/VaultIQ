import React from 'react';
import Icon from '../../../components/AppIcon';

const MarketOverviewCard = ({ title, value, change, changeValue, icon, color = "primary" }) => {
  const isPositive = change >= 0;
  
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success-50 text-success border-success-200';
      case 'warning':
        return 'bg-warning-50 text-warning border-warning-200';
      case 'error':
        return 'bg-error-50 text-error border-error-200';
      default:
        return 'bg-primary-50 text-primary border-primary-200';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1">
            <Icon 
              name={isPositive ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              color={isPositive ? "var(--color-success)" : "var(--color-error)"} 
            />
            <span className={`text-sm font-medium ${
              isPositive ? 'text-success' : 'text-error'
            }`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-1">{title}</h3>
        <p className="text-2xl font-bold text-text-primary font-data">{value}</p>
        {changeValue && (
          <p className={`text-sm mt-1 ${
            isPositive ? 'text-success' : 'text-error'
          }`}>
            {isPositive ? '+' : ''}{changeValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default MarketOverviewCard;