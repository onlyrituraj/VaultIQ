import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionHistory = ({ transactions = [] }) => {
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  // Mock transaction data
  const mockTransactions = [
    {
      id: '1',
      type: 'swap',
      from: 'ETH',
      to: 'USDC',
      amount: '0.5 ETH',
      value: '$1,250',
      hash: '0x1234...5678',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      status: 'completed',
      gasUsed: '$12.50'
    },
    {
      id: '2',
      type: 'stake',
      protocol: 'Uniswap V3',
      pair: 'ETH/USDC',
      amount: '1000 USDC',
      value: '$1,000',
      hash: '0x2345...6789',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'completed',
      gasUsed: '$18.75'
    },
    {
      id: '3',
      type: 'lend',
      protocol: 'Aave',
      asset: 'USDC',
      amount: '500 USDC',
      value: '$500',
      hash: '0x3456...7890',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'completed',
      gasUsed: '$8.25'
    },
    {
      id: '4',
      type: 'transfer',
      from: 'Wallet',
      to: 'Exchange',
      amount: '0.1 BTC',
      value: '$4,300',
      hash: '0x4567...8901',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'completed',
      gasUsed: '$5.50'
    },
    {
      id: '5',
      type: 'swap',
      from: 'USDT',
      to: 'DAI',
      amount: '1000 USDT',
      value: '$1,000',
      hash: '0x5678...9012',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: 'failed',
      gasUsed: '$15.00'
    }
  ];

  const getTransactionIcon = (type) => {
    const icons = {
      swap: 'ArrowLeftRight',
      stake: 'Lock',
      lend: 'Shield',
      transfer: 'Send',
      unstake: 'Unlock',
      claim: 'Gift'
    };
    return icons[type] || 'Activity';
  };

  const getTransactionColor = (type, status) => {
    if (status === 'failed') return 'text-error';
    if (status === 'pending') return 'text-warning';
    
    const colors = {
      swap: 'text-primary',
      stake: 'text-success',
      lend: 'text-secondary',
      transfer: 'text-accent',
      unstake: 'text-warning',
      claim: 'text-success'
    };
    return colors[type] || 'text-text-primary';
  };

  const getStatusBadge = (status) => {
    const configs = {
      completed: { bg: 'bg-success-100', text: 'text-success', label: 'Completed' },
      pending: { bg: 'bg-warning-100', text: 'text-warning', label: 'Pending' },
      failed: { bg: 'bg-error-100', text: 'text-error', label: 'Failed' }
    };
    const config = configs[status] || configs.completed;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const truncateHash = (hash) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const filteredTransactions = mockTransactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const filters = [
    { id: 'all', label: 'All', count: mockTransactions.length },
    { id: 'swap', label: 'Swaps', count: mockTransactions.filter(tx => tx.type === 'swap').length },
    { id: 'stake', label: 'Staking', count: mockTransactions.filter(tx => tx.type === 'stake').length },
    { id: 'lend', label: 'Lending', count: mockTransactions.filter(tx => tx.type === 'lend').length },
    { id: 'transfer', label: 'Transfers', count: mockTransactions.filter(tx => tx.type === 'transfer').length }
  ];

  return (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-text-secondary">Total Transactions</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">{mockTransactions.length}</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-text-secondary">Total Volume</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">$8,050</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Fuel" size={16} color="var(--color-warning)" />
            <span className="text-sm font-medium text-text-secondary">Gas Spent</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">$60.00</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-text-secondary">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">80%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Time:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-secondary">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Transaction</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Details</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Amount</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Gas</th>
                <th className="text-center p-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Time</th>
                <th className="text-center p-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border hover:bg-surface-secondary transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center ${getTransactionColor(tx.type, tx.status)}`}>
                        <Icon name={getTransactionIcon(tx.type)} size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary capitalize">{tx.type}</div>
                        <div className="text-sm text-text-secondary font-data">
                          {truncateHash(tx.hash)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {tx.type === 'swap' && (
                        <span className="text-text-primary">
                          {tx.from} → {tx.to}
                        </span>
                      )}
                      {tx.type === 'stake' && (
                        <span className="text-text-primary">
                          {tx.protocol} - {tx.pair}
                        </span>
                      )}
                      {tx.type === 'lend' && (
                        <span className="text-text-primary">
                          {tx.protocol} - {tx.asset}
                        </span>
                      )}
                      {tx.type === 'transfer' && (
                        <span className="text-text-primary">
                          {tx.from} → {tx.to}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-semibold text-text-primary font-data">{tx.amount}</div>
                    <div className="text-sm text-text-secondary">{tx.value}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm text-text-secondary font-data">{tx.gasUsed}</div>
                  </td>
                  <td className="p-4 text-center">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm text-text-secondary">
                      {formatTimeAgo(tx.timestamp)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Icon name="ExternalLink" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Icon name="Copy" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <Icon name="Activity" size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Transactions Found</h3>
          <p className="text-text-secondary">
            {filter === 'all' 
              ? 'Start using DeFi protocols to see your transaction history here'
              : `No ${filter} transactions found for the selected time period`
            }
          </p>
        </div>
      )}

      {/* Export Options */}
      <div className="flex justify-center">
        <Button variant="outline">
          <Icon name="Download" size={16} className="mr-2" />
          Export Transaction History
        </Button>
      </div>
    </div>
  );
};

export default TransactionHistory;