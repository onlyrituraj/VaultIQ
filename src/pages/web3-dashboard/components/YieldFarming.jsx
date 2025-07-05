import React, { useState } from 'react';
import { useDeFi } from '../../../contexts/DeFiContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const YieldFarming = () => {
  const { lendAsset, stakeTokens, isLoading } = useDeFi();
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');

  const yieldPools = [
    {
      id: 'eth-usdc-uni',
      protocol: 'Uniswap V3',
      pair: 'ETH/USDC',
      apy: 15.2,
      tvl: '$125M',
      risk: 'Medium',
      rewards: ['UNI', 'Fees'],
      icon: 'Zap',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'aave-usdc',
      protocol: 'Aave',
      asset: 'USDC',
      apy: 8.5,
      tvl: '$2.1B',
      risk: 'Low',
      rewards: ['AAVE'],
      icon: 'Shield',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'compound-eth',
      protocol: 'Compound',
      asset: 'ETH',
      apy: 6.8,
      tvl: '$890M',
      risk: 'Low',
      rewards: ['COMP'],
      icon: 'Coins',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'curve-3pool',
      protocol: 'Curve',
      pair: '3Pool (USDC/USDT/DAI)',
      apy: 12.3,
      tvl: '$456M',
      risk: 'Low',
      rewards: ['CRV', 'Fees'],
      icon: 'TrendingUp',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'yearn-yvusdc',
      protocol: 'Yearn',
      asset: 'yvUSDC',
      apy: 18.7,
      tvl: '$234M',
      risk: 'Medium',
      rewards: ['YFI', 'Auto-compound'],
      icon: 'Target',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'sushi-eth-sushi',
      protocol: 'SushiSwap',
      pair: 'ETH/SUSHI',
      apy: 22.1,
      tvl: '$67M',
      risk: 'High',
      rewards: ['SUSHI'],
      icon: 'Fish',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-success bg-success-50';
      case 'Medium': return 'text-warning bg-warning-50';
      case 'High': return 'text-error bg-error-50';
      default: return 'text-text-secondary bg-surface-secondary';
    }
  };

  const handleStake = async (pool) => {
    if (!stakeAmount) return;

    try {
      const result = await stakeTokens(pool.asset || pool.pair, stakeAmount, pool.protocol);
      if (result.success) {
        setStakeAmount('');
        setSelectedPool(null);
      }
    } catch (error) {
      console.error('Staking failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Yield Farming Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Yield Farming</h1>
            <p className="opacity-90">
              Earn rewards by providing liquidity and staking tokens across DeFi protocols
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">18.5%</div>
            <div className="opacity-90">Avg APY</div>
          </div>
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">All Protocols</Button>
          <Button variant="outline" size="sm">Low Risk</Button>
          <Button variant="outline" size="sm">High APY</Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Sort by:</span>
          <select className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm">
            <option>Highest APY</option>
            <option>Lowest Risk</option>
            <option>Highest TVL</option>
          </select>
        </div>
      </div>

      {/* Yield Pools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {yieldPools.map((pool) => (
          <div key={pool.id} className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pool.color} flex items-center justify-center`}>
                  <Icon name={pool.icon} size={24} color="white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{pool.protocol}</h3>
                  <p className="text-sm text-text-secondary">{pool.pair || pool.asset}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-success">{pool.apy}%</div>
                <div className="text-sm text-text-secondary">APY</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-text-secondary">TVL</div>
                <div className="font-semibold text-text-primary">{pool.tvl}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Risk Level</div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(pool.risk)}`}>
                  {pool.risk}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-text-secondary mb-2">Rewards</div>
              <div className="flex gap-2">
                {pool.rewards.map((reward, index) => (
                  <span key={index} className="px-2 py-1 bg-surface-secondary text-text-primary text-xs rounded-full">
                    {reward}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => setSelectedPool(pool)}
                className="flex-1"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Stake
              </Button>
              <Button variant="outline" className="flex-1">
                <Icon name="Info" size={16} className="mr-2" />
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Staking Modal */}
      {selectedPool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  Stake in {selectedPool.protocol}
                </h2>
                <Button variant="ghost" onClick={() => setSelectedPool(null)} className="p-2">
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-surface-secondary rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedPool.color} flex items-center justify-center`}>
                      <Icon name={selectedPool.icon} size={20} color="white" />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{selectedPool.pair || selectedPool.asset}</div>
                      <div className="text-sm text-text-secondary">{selectedPool.protocol}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-text-secondary">APY: </span>
                      <span className="font-semibold text-success">{selectedPool.apy}%</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Risk: </span>
                      <span className={`font-semibold ${getRiskColor(selectedPool.risk).split(' ')[0]}`}>
                        {selectedPool.risk}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Amount to Stake
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      className="pr-16"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      MAX
                    </Button>
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Balance: 1,250.00 {selectedPool.asset || 'LP'}
                  </div>
                </div>

                <div className="p-3 bg-primary-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Estimated Daily Rewards:</span>
                      <span className="font-medium text-text-primary">
                        ${((parseFloat(stakeAmount) || 0) * selectedPool.apy / 100 / 365).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Estimated Monthly Rewards:</span>
                      <span className="font-medium text-text-primary">
                        ${((parseFloat(stakeAmount) || 0) * selectedPool.apy / 100 / 12).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPool(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleStake(selectedPool)}
                    disabled={!stakeAmount || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                        Staking...
                      </>
                    ) : (
                      'Stake Now'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Section */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          <Icon name="BookOpen" size={20} className="inline mr-2" />
          Learn About Yield Farming
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface-secondary rounded-lg">
            <Icon name="Shield" size={24} className="text-primary mb-2" />
            <h4 className="font-medium text-text-primary mb-2">Risk Management</h4>
            <p className="text-sm text-text-secondary">
              Understand impermanent loss, smart contract risks, and how to diversify your positions.
            </p>
          </div>
          <div className="p-4 bg-surface-secondary rounded-lg">
            <Icon name="Calculator" size={24} className="text-primary mb-2" />
            <h4 className="font-medium text-text-primary mb-2">APY Calculation</h4>
            <p className="text-sm text-text-secondary">
              Learn how Annual Percentage Yield is calculated and what factors affect your returns.
            </p>
          </div>
          <div className="p-4 bg-surface-secondary rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-primary mb-2" />
            <h4 className="font-medium text-text-primary mb-2">Strategies</h4>
            <p className="text-sm text-text-secondary">
              Discover different yield farming strategies from conservative to aggressive approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldFarming;