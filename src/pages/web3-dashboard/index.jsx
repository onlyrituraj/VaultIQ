import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PortfolioOverview from './components/PortfolioOverview';
import DeFiPositions from './components/DeFiPositions';
import TokenSwap from './components/TokenSwap';
import NFTGallery from './components/NFTGallery';
import TransactionHistory from './components/TransactionHistory';
import YieldFarming from './components/YieldFarming';

const Web3Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [chain, setChain] = useState({ id: 1 });
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 124567.89,
    tokens: [
      {
        symbol: 'ETH',
        balance: 2.5,
        price: 2500,
        value: 6250,
        change24h: 2.5
      },
      {
        symbol: 'BTC',
        balance: 0.1,
        price: 43000,
        value: 4300,
        change24h: 1.2
      },
      {
        symbol: 'USDC',
        balance: 5000,
        price: 1,
        value: 5000,
        change24h: 0.0
      }
    ],
    defiPositions: [
      {
        protocol: 'Uniswap V3',
        type: 'Liquidity Pool',
        pair: 'ETH/USDC',
        value: 5000,
        apy: 12.5,
        rewards: 125
      },
      {
        protocol: 'Aave',
        type: 'Lending',
        asset: 'USDC',
        value: 3000,
        apy: 8.2,
        rewards: 82
      }
    ],
    nfts: [
      {
        collection: 'Demo NFT Collection',
        tokenId: '1234',
        value: 15000,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'
      }
    ],
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'defi', label: 'DeFi', icon: 'Coins' },
    { id: 'swap', label: 'Swap', icon: 'ArrowLeftRight' },
    { id: 'nft', label: 'NFTs', icon: 'Image' },
    { id: 'yield', label: 'Yield', icon: 'TrendingUp' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  const truncateAddress = (addr) => {
    if (!addr) return '';
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

  const handleConnect = async () => {
    try {
      // Check if we have Web3 capabilities
      if (typeof window !== 'undefined' && window.ethereum) {
        // Try to connect to MetaMask or other injected wallet
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      } else {
        // Demo mode - simulate connection
        setAddress('0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4');
        setIsConnected(true);
      }
    } catch (error) {
      console.log('Connection error:', error);
      setError('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setIsConnected(false);
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
                <span className="text-xl font-semibold text-text-primary">VoltIQ Web3</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button onClick={handleConnect}>
                  Connect Wallet
                </Button>
              </div>
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
              Welcome to VoltIQ Web3
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Icon name="User" size={20} className="mr-2" />
                Sign Up / Sign In
              </Button>

              <span className="text-text-muted">or</span>

              <Button
                onClick={handleConnect}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Icon name="Wallet" size={20} className="mr-2" />
                Connect Wallet Only
              </Button>
            </div>

            <div className="mt-8 text-sm text-text-muted">
              <p>Create an account to save your portfolio data and access advanced features</p>
            </div>
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
              <span className="text-xl font-semibold text-text-primary">VoltIQ Web3</span>
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
                {!user && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="text-sm"
                  >
                    Sign In
                  </Button>
                )}
                <div className="text-right">
                  <div className="text-sm font-medium text-text-primary">
                    {truncateAddress(address)}
                  </div>
                  <div className="text-xs text-text-secondary">Connected</div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
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
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
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
              onClick={() => setError(null)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
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