import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PortfolioOverview = ({ data }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const totalChange24h = 5.67; // Mock 24h change
  const isPositive = totalChange24h >= 0;

  // Prepare chart data
  const tokenChartData = data.tokens.map((token, index) => ({
    name: token.symbol,
    value: token.value,
    percentage: ((token.value / data.totalValue) * 100).toFixed(1)
  }));

  const performanceData = data.tokens.map(token => ({
    name: token.symbol,
    change: token.change24h,
    value: token.value
  }));

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Total Portfolio Value</h2>
            <Button variant="ghost" size="sm">
              <Icon name="RefreshCw" size={16} />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-text-primary font-data">
              ${data.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2">
              <Icon 
                name={isPositive ? "TrendingUp" : "TrendingDown"} 
                size={20} 
                color={isPositive ? "var(--color-success)" : "var(--color-error)"} 
              />
              <span className={`font-semibold ${isPositive ? 'text-success' : 'text-error'}`}>
                {isPositive ? '+' : ''}{totalChange24h}% (24h)
              </span>
            </div>
            <div className="text-sm text-text-secondary">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Coins" size={20} color="var(--color-primary)" />
            <h3 className="font-semibold text-text-primary">Assets</h3>
          </div>
          <div className="text-2xl font-bold text-text-primary">{data.tokens.length}</div>
          <div className="text-sm text-text-secondary">Tokens tracked</div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Zap" size={20} color="var(--color-secondary)" />
            <h3 className="font-semibold text-text-primary">DeFi</h3>
          </div>
          <div className="text-2xl font-bold text-text-primary">{data.defiPositions.length}</div>
          <div className="text-sm text-text-secondary">Active positions</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Asset Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {tokenChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {tokenChartData.map((token, index) => (
              <div key={token.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-text-primary">{token.name}</span>
                </div>
                <span className="text-sm font-medium text-text-secondary">
                  {token.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">24h Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}%`, '24h Change']}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="change" 
                  fill={(entry) => entry >= 0 ? 'var(--color-success)' : 'var(--color-error)'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Token Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-secondary">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Asset</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Balance</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Price</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">24h Change</th>
                <th className="text-right p-4 text-sm font-medium text-text-secondary">Value</th>
                <th className="text-center p-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.tokens.map((token, index) => (
                <tr key={token.symbol} className="border-b border-border hover:bg-surface-secondary transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {token.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{token.symbol}</div>
                        <div className="text-sm text-text-secondary">{token.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-data">
                    {token.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </td>
                  <td className="p-4 text-right font-data">
                    ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      token.change24h >= 0 ? 'text-success' : 'text-error'
                    }`}>
                      <Icon 
                        name={token.change24h >= 0 ? "TrendingUp" : "TrendingDown"} 
                        size={14} 
                      />
                      <span className="font-medium">
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-data font-semibold">
                    ${token.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm">
                        <Icon name="ArrowLeftRight" size={14} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icon name="Send" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;