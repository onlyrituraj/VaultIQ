import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';


const AnalyticsPanel = ({ transactions, selectedTransaction }) => {
  const [activeTab, setActiveTab] = useState('volume');

  // Process transaction data for charts
  const processVolumeData = () => {
    const monthlyData = {};
    transactions.forEach(tx => {
      const date = new Date(tx.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, volume: 0, count: 0 };
      }
      monthlyData[monthKey].volume += parseFloat(tx.usdValue);
      monthlyData[monthKey].count += 1;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const processProfitLossData = () => {
    let cumulativePL = 0;
    const plData = [];
    
    transactions
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .forEach(tx => {
        if (tx.type === 'sell') {
          cumulativePL += parseFloat(tx.profitLoss || 0);
        }
        plData.push({
          date: new Date(tx.timestamp).toLocaleDateString(),
          cumulativePL: cumulativePL,
          transactionPL: parseFloat(tx.profitLoss || 0)
        });
      });

    return plData;
  };

  const processTransactionTypeData = () => {
    const typeData = {};
    transactions.forEach(tx => {
      if (!typeData[tx.type]) {
        typeData[tx.type] = { type: tx.type, count: 0, value: 0 };
      }
      typeData[tx.type].count += 1;
      typeData[tx.type].value += parseFloat(tx.usdValue);
    });

    return Object.values(typeData);
  };

  const calculateStats = () => {
    const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.usdValue), 0);
    const totalProfitLoss = transactions
      .filter(tx => tx.profitLoss)
      .reduce((sum, tx) => sum + parseFloat(tx.profitLoss), 0);
    const avgTransactionSize = totalVolume / transactions.length || 0;
    const totalGasFees = transactions.reduce((sum, tx) => sum + parseFloat(tx.gasFeeUSD), 0);

    return {
      totalVolume,
      totalProfitLoss,
      avgTransactionSize,
      totalGasFees,
      transactionCount: transactions.length
    };
  };

  const volumeData = processVolumeData();
  const profitLossData = processProfitLossData();
  const typeData = processTransactionTypeData();
  const stats = calculateStats();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const tabs = [
    { id: 'volume', label: 'Volume', icon: 'BarChart3' },
    { id: 'profitloss', label: 'P&L', icon: 'TrendingUp' },
    { id: 'types', label: 'Types', icon: 'PieChart' },
    { id: 'stats', label: 'Stats', icon: 'Calculator' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Analytics</h3>
        <div className="flex gap-1 mt-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'volume' && (
          <div>
            <h4 className="text-md font-medium text-text-primary mb-4">Monthly Transaction Volume</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Volume']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="volume" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'profitloss' && (
          <div>
            <h4 className="text-md font-medium text-text-primary mb-4">Cumulative Profit & Loss</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-text-secondary)"
                    fontSize={12}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Cumulative P&L']}
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativePL" 
                    stroke="var(--color-success)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'types' && (
          <div>
            <h4 className="text-md font-medium text-text-primary mb-4">Transaction Types Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, 'Transactions']}
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-text-primary mb-4">Transaction Statistics</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="DollarSign" size={20} color="var(--color-primary)" />
                  <span className="text-sm font-medium text-text-secondary">Total Volume</span>
                </div>
                <span className="text-xl font-bold text-text-primary font-data">
                  ${stats.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon 
                    name={stats.totalProfitLoss >= 0 ? "TrendingUp" : "TrendingDown"} 
                    size={20} 
                    color={stats.totalProfitLoss >= 0 ? "var(--color-success)" : "var(--color-error)"} 
                  />
                  <span className="text-sm font-medium text-text-secondary">Total P&L</span>
                </div>
                <span className={`text-xl font-bold font-data ${
                  stats.totalProfitLoss >= 0 ? 'text-success' : 'text-error'
                }`}>
                  ${stats.totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="BarChart3" size={20} color="var(--color-secondary)" />
                  <span className="text-sm font-medium text-text-secondary">Avg Transaction</span>
                </div>
                <span className="text-xl font-bold text-text-primary font-data">
                  ${stats.avgTransactionSize.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Fuel" size={20} color="var(--color-warning)" />
                  <span className="text-sm font-medium text-text-secondary">Total Gas Fees</span>
                </div>
                <span className="text-xl font-bold text-text-primary font-data">
                  ${stats.totalGasFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="bg-surface-secondary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Hash" size={20} color="var(--color-accent)" />
                <span className="text-sm font-medium text-text-secondary">Total Transactions</span>
              </div>
              <span className="text-xl font-bold text-text-primary font-data">
                {stats.transactionCount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Selected Transaction Details */}
        {selectedTransaction && (
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-md font-medium text-text-primary mb-3">Selected Transaction</h4>
            <div className="bg-surface-secondary rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Type:</span>
                  <span className="ml-2 font-medium text-text-primary capitalize">
                    {selectedTransaction.type}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Asset:</span>
                  <span className="ml-2 font-medium text-text-primary">
                    {selectedTransaction.asset}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Amount:</span>
                  <span className="ml-2 font-medium text-text-primary font-data">
                    {parseFloat(selectedTransaction.amount).toLocaleString()} {selectedTransaction.asset}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">USD Value:</span>
                  <span className="ml-2 font-medium text-text-primary font-data">
                    ${parseFloat(selectedTransaction.usdValue).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;