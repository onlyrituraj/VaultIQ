import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';

const WalletConnectionForm = ({ onConnect, isLoading }) => {
  const [connectingWallet, setConnectingWallet] = useState(null);
  const [connectionError, setConnectionError] = useState('');

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using browser extension',
      icon: 'Wallet',
      color: 'from-orange-500 to-orange-600',
      popular: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Scan with mobile wallet',
      icon: 'Smartphone',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect with Coinbase',
      icon: 'CreditCard',
      color: 'from-blue-600 to-blue-700',
      popular: false
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      description: 'Mobile-first crypto wallet',
      icon: 'Shield',
      color: 'from-blue-400 to-blue-500',
      popular: false
    },
    {
      id: 'phantom',
      name: 'Phantom',
      description: 'Solana ecosystem wallet',
      icon: 'Zap',
      color: 'from-purple-500 to-purple-600',
      popular: false
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      description: 'Ethereum wallet for everyone',
      icon: 'Palette',
      color: 'from-pink-500 to-purple-500',
      popular: false
    }
  ];

  const handleWalletConnect = async (wallet) => {
    setConnectingWallet(wallet.id);
    setConnectionError('');

    try {
      // Simulate wallet connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockWalletData = {
        type: 'wallet',
        walletType: wallet.id,
        address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        network: 'Ethereum Mainnet',
        balance: '2.45 ETH'
      };
      
      onConnect(mockWalletData);
    } catch (error) {
      setConnectionError(`Failed to connect to ${wallet.name}. Please try again.`);
    } finally {
      setConnectingWallet(null);
    }
  };

  const popularWallets = walletOptions.filter(wallet => wallet.popular);
  const otherWallets = walletOptions.filter(wallet => !wallet.popular);

  const WalletCard = ({ wallet, isConnecting }) => (
    <button
      onClick={() => handleWalletConnect(wallet)}
      disabled={isLoading || isConnecting}
      className={`w-full p-4 border-2 border-border rounded-xl hover:border-primary transition-all duration-200 text-left group ${
        isConnecting ? 'border-primary bg-primary-50' : 'hover:bg-surface-secondary'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${wallet.color} flex items-center justify-center flex-shrink-0`}>
          <Icon name={wallet.icon} size={24} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
              {wallet.name}
            </h3>
            {wallet.popular && (
              <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                Popular
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">{wallet.description}</p>
        </div>
        <div className="flex-shrink-0">
          {isConnecting ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon name="ChevronRight" size={20} className="text-text-muted group-hover:text-primary transition-colors" />
          )}
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      {connectionError && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="AlertCircle" size={20} color="var(--color-error)" />
            <div>
              <p className="text-sm text-error font-medium">Connection Failed</p>
              <p className="text-sm text-error-600 mt-1">{connectionError}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Popular Wallets</h3>
        <div className="space-y-3">
          {popularWallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              isConnecting={connectingWallet === wallet.id}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Other Wallets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherWallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              isConnecting={connectingWallet === wallet.id}
            />
          ))}
        </div>
      </div>

      <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} color="var(--color-secondary)" />
          <div>
            <h4 className="font-medium text-text-primary">Security Notice</h4>
            <p className="text-sm text-text-secondary mt-1">
              CryptoFolio will never ask for your private keys or seed phrases. We only request read-only access to display your portfolio data securely.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-text-secondary">
          New to crypto wallets?{' '}
          <button
            type="button"
            className="text-primary hover:text-primary-700 font-medium transition-colors"
          >
            Learn how to get started
          </button>
        </p>
      </div>
    </div>
  );
};

export default WalletConnectionForm;