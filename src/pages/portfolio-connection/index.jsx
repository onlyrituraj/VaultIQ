import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const PortfolioConnection = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeMethod, setActiveMethod] = useState('api');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    walletAddress: '',
    exchangeName: 'binance',
    portfolioName: 'My Portfolio'
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const connectionMethods = [
    {
      id: 'api',
      title: 'Exchange API',
      description: 'Connect via exchange API keys for automatic portfolio sync',
      icon: 'Key',
      popular: true
    },
    {
      id: 'wallet',
      title: 'Wallet Address',
      description: 'Track portfolio by monitoring wallet addresses',
      icon: 'Wallet',
      popular: true
    },
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Manually add and track your cryptocurrency holdings',
      icon: 'Edit',
      popular: false
    },
    {
      id: 'csv',
      title: 'CSV Import',
      description: 'Import your portfolio data from CSV files',
      icon: 'Upload',
      popular: false
    }
  ];

  const supportedExchanges = [
    { id: 'binance', name: 'Binance', logo: '🔶' },
    { id: 'coinbase', name: 'Coinbase Pro', logo: '🔵' },
    { id: 'kraken', name: 'Kraken', logo: '🟣' },
    { id: 'kucoin', name: 'KuCoin', logo: '🟢' },
    { id: 'huobi', name: 'Huobi', logo: '🔴' },
    { id: 'okx', name: 'OKX', logo: '⚫' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus(null);

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (activeMethod === 'api') {
        if (!formData.apiKey || !formData.apiSecret) {
          throw new Error('API key and secret are required');
        }
        setConnectionStatus({
          type: 'success',
          message: `Successfully connected to ${supportedExchanges.find(e => e.id === formData.exchangeName)?.name}`,
          details: 'Portfolio data will be synced automatically every 15 minutes'
        });
      } else if (activeMethod === 'wallet') {
        if (!formData.walletAddress) {
          throw new Error('Wallet address is required');
        }
        setConnectionStatus({
          type: 'success',
          message: 'Wallet address added successfully',
          details: 'Portfolio will be updated based on on-chain transactions'
        });
      } else if (activeMethod === 'manual') {
        setConnectionStatus({
          type: 'success',
          message: 'Portfolio created successfully',
          details: 'You can now manually add your cryptocurrency holdings'
        });
      }

      // Redirect to dashboard after successful connection
      setTimeout(() => {
        navigate('/portfolio-dashboard');
      }, 2000);

    } catch (error) {
      setConnectionStatus({
        type: 'error',
        message: error.message || 'Connection failed',
        details: 'Please check your credentials and try again'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    navigate('/portfolio-dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
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
              <span className="text-xl font-semibold text-text-primary">VoltIQ</span>
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
            Connect Your Portfolio
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Choose how you'd like to connect your cryptocurrency portfolio. 
            You can always add more connection methods later.
          </p>
        </div>

        {/* Connection Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {connectionMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method.id)}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                activeMethod === method.id
                  ? 'border-primary bg-primary-50'
                  : 'border-border hover:border-border-dark hover:bg-surface-secondary'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  activeMethod === method.id ? 'bg-primary text-white' : 'bg-surface-secondary text-text-muted'
                }`}>
                  <Icon name={method.icon} size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${
                      activeMethod === method.id ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {method.title}
                    </h3>
                    {method.popular && (
                      <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Connection Form */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            {connectionMethods.find(m => m.id === activeMethod)?.title} Setup
          </h2>

          {/* API Connection */}
          {activeMethod === 'api' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Exchange
                </label>
                <select
                  name="exchangeName"
                  value={formData.exchangeName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {supportedExchanges.map((exchange) => (
                    <option key={exchange.id} value={exchange.id}>
                      {exchange.logo} {exchange.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  API Key
                </label>
                <Input
                  type="text"
                  name="apiKey"
                  placeholder="Enter your API key"
                  value={formData.apiKey}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  API Secret
                </label>
                <Input
                  type="password"
                  name="apiSecret"
                  placeholder="Enter your API secret"
                  value={formData.apiSecret}
                  onChange={handleInputChange}
                />
              </div>

              <div className="p-4 bg-warning-50 border border-warning-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="Shield" size={20} color="var(--color-warning)" />
                  <div>
                    <h4 className="font-medium text-warning mb-1">Security Notice</h4>
                    <p className="text-sm text-warning">
                      We recommend creating read-only API keys. Never share your API credentials 
                      and ensure they don't have withdrawal permissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Connection */}
          {activeMethod === 'wallet' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Wallet Address
                </label>
                <Input
                  type="text"
                  name="walletAddress"
                  placeholder="0x... or bc1... or other wallet address"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-text-muted mt-1">
                  Enter any cryptocurrency wallet address to track its holdings
                </p>
              </div>

              <div className="p-4 bg-accent-50 border border-accent-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} color="var(--color-accent)" />
                  <div>
                    <h4 className="font-medium text-accent mb-1">Public Address Only</h4>
                    <p className="text-sm text-accent">
                      We only need your public wallet address to track holdings. 
                      Your private keys remain secure with you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manual Entry */}
          {activeMethod === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Portfolio Name
                </label>
                <Input
                  type="text"
                  name="portfolioName"
                  placeholder="My Crypto Portfolio"
                  value={formData.portfolioName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="p-4 bg-secondary-50 border border-secondary-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="Edit" size={20} color="var(--color-secondary)" />
                  <div>
                    <h4 className="font-medium text-secondary mb-1">Manual Tracking</h4>
                    <p className="text-sm text-secondary">
                      You'll be able to manually add your cryptocurrency holdings 
                      and update them as needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CSV Import */}
          {activeMethod === 'csv' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Upload CSV File
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Icon name="Upload" size={32} className="text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-secondary mb-2">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="FileText" size={20} color="var(--color-primary)" />
                  <div>
                    <h4 className="font-medium text-primary mb-1">CSV Format</h4>
                    <p className="text-sm text-primary">
                      Your CSV should include columns: Asset, Amount, Purchase Price, Date
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        {connectionStatus && (
          <div className={`p-4 rounded-lg mb-6 ${
            connectionStatus.type === 'success' 
              ? 'bg-success-50 border border-success-100' 
              : 'bg-error-50 border border-error-100'
          }`}>
            <div className="flex items-start gap-3">
              <Icon 
                name={connectionStatus.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                size={20} 
                color={connectionStatus.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'} 
              />
              <div>
                <h4 className={`font-medium mb-1 ${
                  connectionStatus.type === 'success' ? 'text-success' : 'text-error'
                }`}>
                  {connectionStatus.message}
                </h4>
                <p className={`text-sm ${
                  connectionStatus.type === 'success' ? 'text-success' : 'text-error'
                }`}>
                  {connectionStatus.details}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isConnecting}
            className="sm:order-1"
          >
            Skip for Now
          </Button>
          <Button
            variant="primary"
            onClick={handleConnect}
            disabled={isConnecting}
            className="sm:order-2"
          >
            {isConnecting ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Icon name="Link" size={16} className="mr-2" />
                Connect Portfolio
              </>
            )}
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
              <h4 className="font-medium text-text-primary mb-1">Documentation</h4>
              <p className="text-sm text-text-secondary">Learn how to set up API keys</p>
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
              <h4 className="font-medium text-text-primary mb-1">Video Guide</h4>
              <p className="text-sm text-text-secondary">Watch setup tutorials</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioConnection;