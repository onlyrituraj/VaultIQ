import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionList = ({ transactions, onTransactionSelect, selectedTransaction }) => {
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  const getTransactionIcon = (type) => {
    const iconMap = {
      buy: { name: 'ArrowUp', color: 'var(--color-success)' },
      sell: { name: 'ArrowDown', color: 'var(--color-error)' },
      transfer: { name: 'ArrowLeftRight', color: 'var(--color-secondary)' },
      swap: { name: 'RefreshCw', color: 'var(--color-accent)' },
      stake: { name: 'Lock', color: 'var(--color-primary)' },
      unstake: { name: 'Unlock', color: 'var(--color-warning)' }
    };
    return iconMap[type] || { name: 'Circle', color: 'var(--color-text-muted)' };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-success-100', text: 'text-success', label: 'Completed' },
      pending: { bg: 'bg-warning-100', text: 'text-warning', label: 'Pending' },
      failed: { bg: 'bg-error-100', text: 'text-error', label: 'Failed' }
    };
    const config = statusConfig[status] || statusConfig.completed;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatAmount = (amount, symbol) => {
    return `${parseFloat(amount).toLocaleString()} ${symbol}`;
  };

  const formatUSDValue = (value) => {
    return `$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const truncateHash = (hash) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleTransactionClick = (transaction) => {
    onTransactionSelect(transaction);
    setExpandedTransaction(
      expandedTransaction === transaction.id ? null : transaction.id
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Transaction History</h3>
        <p className="text-sm text-text-secondary mt-1">
          {transactions.length} transactions found
        </p>
      </div>

      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {transactions.map((transaction) => {
          const icon = getTransactionIcon(transaction.type);
          const dateTime = formatDate(transaction.timestamp);
          const isExpanded = expandedTransaction === transaction.id;
          const isSelected = selectedTransaction?.id === transaction.id;

          return (
            <div
              key={transaction.id}
              className={`transition-colors ${
                isSelected ? 'bg-primary-50' : 'hover:bg-surface-secondary'
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="flex items-center gap-4">
                  {/* Transaction Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center">
                      <Icon name={icon.name} size={20} color={icon.color} />
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary capitalize">
                          {transaction.type}
                        </span>
                        <span className="text-sm text-text-secondary">
                          {transaction.asset}
                        </span>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="text-right">
                        <div className="font-data text-sm text-text-primary">
                          {formatAmount(transaction.amount, transaction.asset)}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {formatUSDValue(transaction.usdValue)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>{dateTime.date} at {dateTime.time}</span>
                      <span className="font-data">
                        {truncateHash(transaction.hash)}
                      </span>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="flex-shrink-0">
                    <Icon 
                      name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-text-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border bg-surface-secondary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                          Transaction Hash
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-data text-sm text-text-primary">
                            {transaction.hash}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() => copyToClipboard(transaction.hash)}
                            className="p-1 h-auto"
                          >
                            <Icon name="Copy" size={14} />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                          From Address
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-data text-sm text-text-primary">
                            {truncateAddress(transaction.fromAddress)}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() => copyToClipboard(transaction.fromAddress)}
                            className="p-1 h-auto"
                          >
                            <Icon name="Copy" size={14} />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                          To Address
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-data text-sm text-text-primary">
                            {truncateAddress(transaction.toAddress)}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() => copyToClipboard(transaction.toAddress)}
                            className="p-1 h-auto"
                          >
                            <Icon name="Copy" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                          Gas Fee
                        </label>
                        <div className="mt-1">
                          <span className="font-data text-sm text-text-primary">
                            {transaction.gasFee} ETH
                          </span>
                          <span className="text-xs text-text-secondary ml-2">
                            (${transaction.gasFeeUSD})
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                          Exchange Rate
                        </label>
                        <div className="mt-1">
                          <span className="font-data text-sm text-text-primary">
                            ${transaction.exchangeRate}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                          Block Number
                        </label>
                        <div className="mt-1">
                          <span className="font-data text-sm text-text-primary">
                            {transaction.blockNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/tx/${transaction.hash}`, '_blank')}
                      iconName="ExternalLink"
                      iconPosition="right"
                    >
                      View on Explorer
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(transaction, null, 2))}
                      iconName="Copy"
                      iconPosition="left"
                    >
                      Copy Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {transactions.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="FileText" size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Transactions Found</h3>
          <p className="text-text-secondary">
            Try adjusting your filters or connect a wallet to import transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;