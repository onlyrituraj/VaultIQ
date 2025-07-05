import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeFiPositions = ({ positions }) => {
  const getProtocolIcon = (protocol) => {
    const icons = {
      'Uniswap V3': 'Zap',
      'Aave': 'Shield',
      'Compound': 'Coins',
      'Curve': 'TrendingUp',
      'Yearn': 'Target'
    };
    return icons[protocol] || 'Circle';
  };

  const getProtocolColor = (protocol) => {
    const colors = {
      'Uniswap V3': 'from-pink-500 to-purple-500',
      'Aave': 'from-blue-500 to-cyan-500',
      'Compound': 'from-green-500 to-emerald-500',
      'Curve': 'from-yellow-500 to-orange-500',
      'Yearn': 'from-indigo-500 to-purple-500'
    };
    return colors[protocol] || 'from-gray-500 to-gray-600';
  };

  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
  const totalRewards = positions.reduce((sum, pos) => sum + pos.rewards, 0);
  const avgAPY = positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length;

  return (
    <div className="space-y-6">
      {/* DeFi Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="DollarSign" size={20} color="var(--color-primary)" />
            <h3 className="font-semibold text-text-primary">Total DeFi Value</h3>
          </div>
          <div className="text-2xl font-bold text-text-primary font-data">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary mt-1">
            Across {positions.length} protocols
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="TrendingUp" size={20} color="var(--color-success)" />
            <h3 className="font-semibold text-text-primary">Average APY</h3>
          </div>
          <div className="text-2xl font-bold text-success font-data">
            {avgAPY.toFixed(1)}%
          </div>
          <div className="text-sm text-text-secondary mt-1">
            Weighted average
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Gift" size={20} color="var(--color-warning)" />
            <h3 className="font-semibold text-text-primary">Pending Rewards</h3>
          </div>
          <div className="text-2xl font-bold text-warning font-data">
            ${totalRewards.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary mt-1">
            Ready to claim
          </div>
        </div>
      </div>

      {/* Position Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {positions.map((position, index) => (
          <div key={index} className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getProtocolColor(position.protocol)} flex items-center justify-center`}>
                  <Icon name={getProtocolIcon(position.protocol)} size={24} color="white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{position.protocol}</h3>
                  <p className="text-sm text-text-secondary">{position.type}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-text-primary font-data">
                  ${position.value.toLocaleString()}
                </div>
                <div className="text-sm text-success">
                  {position.apy}% APY
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Asset/Pair:</span>
                <span className="font-medium text-text-primary">
                  {position.pair || position.asset}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Pending Rewards:</span>
                <span className="font-medium text-warning font-data">
                  ${position.rewards.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="primary" size="sm" className="flex-1">
                  <Icon name="Plus" size={14} className="mr-1" />
                  Add
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Icon name="Minus" size={14} className="mr-1" />
                  Remove
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Gift" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Position */}
      <div className="bg-surface border-2 border-dashed border-border rounded-xl p-8 text-center">
        <Icon name="Plus" size={32} className="text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Add New DeFi Position</h3>
        <p className="text-text-secondary mb-4">
          Explore lending, liquidity providing, and yield farming opportunities
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline">
            <Icon name="Shield" size={16} className="mr-2" />
            Lend on Aave
          </Button>
          <Button variant="outline">
            <Icon name="Zap" size={16} className="mr-2" />
            Add Liquidity
          </Button>
          <Button variant="outline">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Yield Farm
          </Button>
        </div>
      </div>

      {/* Protocol Stats */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Protocol Breakdown</h3>
        <div className="space-y-4">
          {positions.map((position, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getProtocolColor(position.protocol)} flex items-center justify-center`}>
                  <Icon name={getProtocolIcon(position.protocol)} size={16} color="white" />
                </div>
                <span className="font-medium text-text-primary">{position.protocol}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-text-primary font-data">
                  ${position.value.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">
                  {((position.value / totalValue) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeFiPositions;