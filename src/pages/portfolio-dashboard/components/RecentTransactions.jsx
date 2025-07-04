import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RecentTransactions = ({ transactions, isExpanded, onToggleExpand }) => {
  const displayTransactions = isExpanded ? transactions : transactions.slice(0, 5);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'buy': return 'ArrowDownLeft';
      case 'sell': return 'ArrowUpRight';
      case 'transfer': return 'ArrowLeftRight';
      case 'stake': return 'Lock';
      case 'unstake': return 'Unlock';
      default: return 'Activity';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'buy': return 'text-success';
      case 'sell': return 'text-error';
      case 'transfer': return 'text-secondary';
      case 'stake': return 'text-primary';
      case 'unstake': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Recent Transactions</h3>
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
        {displayTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-surface-secondary rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                <Icon name={getTransactionIcon(transaction.type)} size={18} />
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src={transaction.asset.logo}
                  alt={transaction.asset.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <div className="font-medium text-text-primary capitalize">
                    {transaction.type} {transaction.asset.symbol}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {formatTimeAgo(transaction.timestamp)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`font-data ${getTransactionColor(transaction.type)}`}>
                {transaction.type === 'sell' ? '-' : '+'}
                {transaction.amount} {transaction.asset.symbol}
              </div>
              <div className="text-sm text-text-secondary">
                ${transaction.value.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!isExpanded && transactions.length > 5 && (
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            View All Transactions
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;