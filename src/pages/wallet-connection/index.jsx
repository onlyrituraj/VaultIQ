import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const WalletConnectionPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    connectWallet, 
    disconnectWallet, 
    isConnected, 
    isConnecting, 
    account, 
    balance, 
    error: walletError,
    clearError 
  } = useWallet();
  
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const walletOptions = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      icon: 'Wallet',
      color: 'from-orange-500 to-orange-600',
      popular: true,
      installed: typeof window !== 'undefined' && window.ethereum?.isMetaMask
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      description: 'Scan with mobile wallet',
      icon: 'Smartphone',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      installed: true
    },
    {
      id: 'coinbaseWallet',
      name: 'Coinbase Wallet',
      description: 'Connect with Coinbase Wallet',
      icon: 'CreditCard',
      color: 'from-blue-600 to-blue-700',
      popular: false,
      installed: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet
    },
    {
      id: 'injected',
      name: 'Browser Wallet',
      description: 'Connect with any injected wallet',
      icon: 'Globe',
      color: 'from-purple-500 to-purple-600',
      popular: false,
      installed: typeof window !== 'undefined' && window.ethereum
    }
  ];

  const handleWalletConnect = async (wallet) => {
    setSelectedWallet(wallet.id);
    setConnectionStatus(null);
    clearError();

    try {
      const result = await connectWallet(wallet.id);
      
      if (result?.success) {
        setConnectionStatus({
          type: 'success',
          message: `Successfully connected to ${wallet.name}`,
          details: 'Your wallet is now connected and ready to use'
        });
        
        // Redirect to dashboard after successful connection
        setTimeout(() => {
          navigate('/portfolio-dashboard');
        }, 2000);
      } else {
        setConnectionStatus({
          type: 'error',
          message: result?.error || `Failed to connect to ${wallet.name}`,
          details: 'Please try again or select a different wallet'
        });
      }
    } catch (error) {
      setConnectionStatus({
        type: 'error',
        message: `Failed to connect to ${wallet.name}`,
        details: error.message || 'Please try again or select a different wallet'
      });
    } finally {
      setSelectedWallet(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setConnectionStatus(null);
    } catch (error) {
      console.log('Error disconnecting wallet:', error);
    }
  };

  const handleSkip = () => {
    navigate('/portfolio-dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    if (!balance) return '0 ETH';
    return `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`;
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-text-primary">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary">CryptoFolio</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Welcome, {user?.email}</span>
              <Button variant="ghost" onClick={handleSignOut}>
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Connect Your Wallet
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Connect your cryptocurrency wallet to start tracking your portfolio. 
            Your wallet data is secure and we never store your private keys.
          </p>
        </div>

        {/* Connection Status */}
        {isConnected && account && (
          <div className="bg-success-50 border border-success-100 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                <Icon name="CheckCircle" size={24} color="white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-success mb-2">Wallet Connected!</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Address:</strong> {truncateAddress(account.address)}</p>
                  <p><strong>Balance:</strong> {formatBalance(balance)}</p>
                  <p><strong>Network:</strong> {account.chainId === 1 ? 'Ethereum Mainnet' : `Chain ${account.chainId}`}</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/portfolio-dashboard')}
                    className="bg-white"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDisconnect}
                    className="bg-white text-error border-error hover:bg-error hover:text-white"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {(walletError || connectionStatus?.type === 'error') && (
          <div className="bg-error-50 border border-error-100 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Icon name="AlertCircle" size={24} color="var(--color-error)" />
              <div>
                <h3 className="text-lg font-semibold text-error mb-2">
                  {connectionStatus?.message || 'Connection Error'}
                </h3>
                <p className="text-sm text-error">
                  {connectionStatus?.details || walletError}
                </p>
                <Button
                  variant="outline"
                  onClick={clearError}
                  className="mt-3 bg-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success Status */}
        {connectionStatus?.type === 'success' && (
          <div className="bg-success-50 border border-success-100 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Icon name="CheckCircle" size={24} color="var(--color-success)" />
              <div>
                <h3 className="text-lg font-semibold text-success mb-2">
                  {connectionStatus.message}
                </h3>
                <p className="text-sm text-success">
                  {connectionStatus.details}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Options */}
        {!isConnected && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Popular Wallets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {walletOptions.filter(w => w.popular).map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletConnect(wallet)}
                    disabled={isConnecting || selectedWallet === wallet.id}
                    className={`p-6 border-2 border-border rounded-xl hover:border-primary transition-all duration-200 text-left group ${
                      selectedWallet === wallet.id ? 'border-primary bg-primary-50' : 'hover:bg-surface-secondary'
                    } ${!wallet.installed ? 'opacity-60' : ''}`}
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
                          {!wallet.installed && (
                            <span className="px-2 py-1 bg-warning-100 text-warning text-xs font-medium rounded-full">
                              Not Installed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{wallet.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {selectedWallet === wallet.id ? (
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Icon name="ChevronRight" size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-4">Other Wallets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {walletOptions.filter(w => !w.popular).map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletConnect(wallet)}
                    disabled={isConnecting || selectedWallet === wallet.id}
                    className={`p-4 border-2 border-border rounded-xl hover:border-primary transition-all duration-200 text-left group ${
                      selectedWallet === wallet.id ? 'border-primary bg-primary-50' : 'hover:bg-surface-secondary'
                    } ${!wallet.installed ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${wallet.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon name={wallet.icon} size={20} color="white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                            {wallet.name}
                          </h3>
                          {!wallet.installed && (
                            <span className="px-2 py-1 bg-warning-100 text-warning text-xs font-medium rounded-full">
                              Not Installed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary mt-1">{wallet.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {selectedWallet === wallet.id ? (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Icon name="ChevronRight" size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 p-6 bg-secondary-50 border border-secondary-200 rounded-xl">
          <div className="flex items-start gap-4">
            <Icon name="Shield" size={24} color="var(--color-secondary)" />
            <div>
              <h3 className="font-semibold text-secondary mb-2">Security & Privacy</h3>
              <ul className="text-sm text-secondary space-y-1">
                <li>• We never store your private keys or seed phrases</li>
                <li>• Your wallet data is encrypted and secure</li>
                <li>• We only request read-only access to display your portfolio</li>
                <li>• You can disconnect your wallet at any time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isConnecting}
          >
            Skip for now and explore the demo
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="#"
              className="p-4 bg-surface border border-border rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <Icon name="Book" size={24} className="text-primary mx-auto mb-2" />
              <h4 className="font-medium text-text-primary mb-1">Wallet Guide</h4>
              <p className="text-sm text-text-secondary">Learn how to set up a wallet</p>
            </a>
            <a
              href="#"
              className="p-4 bg-surface border border-border rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <Icon name="MessageCircle" size={24} className="text-primary mx-auto mb-2" />
              <h4 className="font-medium text-text-primary mb-1">Support</h4>
              <p className="text-sm text-text-secondary">Get help from our team</p>
            </a>
            <a
              href="#"
              className="p-4 bg-surface border border-border rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <Icon name="Video" size={24} className="text-primary mx-auto mb-2" />
              <h4 className="font-medium text-text-primary mb-1">Video Tutorial</h4>
              <p className="text-sm text-text-secondary">Watch connection tutorials</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletConnectionPage;