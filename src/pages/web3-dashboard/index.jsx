import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useEnsName } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useDeFi } from '../../contexts/DeFiContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PortfolioOverview from './components/PortfolioOverview';
import DeFiPositions from './components/DeFiPositions';
import TokenSwap from './components/TokenSwap';
import NFTGallery from './components/NFTGallery';
import TransactionHistory from './components/TransactionHistory';
import YieldFarming from './components/YieldFarming';

const Web3Dashboard = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const { data: ensName } = useEnsName({ address });
  const { portfolioData, isLoading, error, refreshPortfolio } = useDeFi();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'defi', label: 'DeFi', icon: 'Coins' },
    { id: 'swap', label: 'Swap', icon: 'ArrowLeftRight' },
    { id: 'nft', label: 'NFTs', icon: 'Image' },
    { id: 'yield', label: 'Yield', icon: 'TrendingUp' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  const truncateAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainName = (chainId) => {
    const chains = {
      1: 'Ethereum',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism',
      8453: 'Base',
      56: 'BSC',
      43114: 'Avalanche'
    };
    return chains[chainId] || `Chain ${chainId}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-text-primary">CryptoFolio Web3</span>
              </div>
              <Button onClick={() => open()}>
                Connect Wallet
              </Button>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Icon name="Wallet" size={48} color="white" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Welcome to CryptoFolio Web3
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              The most advanced Web3 portfolio management platform. Track your DeFi positions, 
              NFTs, and execute trades across multiple chains.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-surface border border-border rounded-xl">
                <Icon name="BarChart3" size={32} className="text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">Portfolio Tracking</h3>
                <p className="text-text-secondary">Real-time portfolio valuation across all chains and protocols</p>
              </div>
              <div className="p-6 bg-surface border border-border rounded-xl">
                <Icon name="Zap" size={32} className="text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">DeFi Integration</h3>
                <p className="text-text-secondary">Interact with Uniswap, Aave, Compound, and more</p>
              </div>
              <div className="p-6 bg-surface border border-border rounded-xl">
                <Icon name="Shield" size={32} className="text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">Secure & Private</h3>
                <p className="text-text-secondary">Non-custodial, your keys your crypto</p>
              </div>
            </div>

            <Button 
              onClick={() => open()} 
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Icon name="Wallet" size={20} className="mr-2" />
              Connect Your Wallet
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary">CryptoFolio Web3</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Portfolio Value */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg">
                <Icon name="DollarSign" size={16} className="text-success" />
                <span className="font-semibold font-data">
                  ${portfolioData.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Chain Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm font-medium">{getChainName(chain?.id)}</span>
              </div>

              {/* Wallet Info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-text-primary">
                    {ensName || truncateAddress(address)}
                  </div>
                  <div className="text-xs text-text-secondary">Connected</div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => disconnect()}
                  className="p-2"
                >
                  <Icon name="LogOut" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-dark'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-error-50 border border-error-200 text-error px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={refreshPortfolio}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Icon name="Loader2" size={24} className="animate-spin text-primary" />
              <span className="text-text-primary">Loading portfolio data...</span>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {activeTab === 'overview' && <PortfolioOverview data={portfolioData} />}
            {activeTab === 'defi' && <DeFiPositions positions={portfolioData.defiPositions} />}
            {activeTab === 'swap' && <TokenSwap tokens={portfolioData.tokens} />}
            {activeTab === 'nft' && <NFTGallery nfts={portfolioData.nfts} />}
            {activeTab === 'yield' && <YieldFarming />}
            {activeTab === 'history' && <TransactionHistory transactions={portfolioData.transactions} />}
          </>
        )}
      </main>
    </div>
  );
};

export default Web3Dashboard;