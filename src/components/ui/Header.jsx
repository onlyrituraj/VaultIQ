import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut, connectWallet } = useAuth();
  // const { 
  //   account, 
  //   isConnected, 
  //   isConnecting, 
  //   balance, 
  //   connectMetaMask, 
  //   connectWalletConnect, 
  //   connectCoinbase, 
  //   disconnectWallet,
  //   error: walletError 
  // } = useWallet();
  const { 
    isConnected, 
    account, 
    disconnectWallet, 
    getWalletInfo, 
    connectMetaMask, 
    connectWalletConnect, 
    connectCoinbase,
    isConnecting,
    error: walletError 
  } = useWallet();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'price', message: 'BTC reached $45,000', time: '2 min ago', read: false },
    { id: 2, type: 'portfolio', message: 'Portfolio up 5.2% today', time: '1 hour ago', read: false },
    { id: 3, type: 'alert', message: 'ETH price alert triggered', time: '3 hours ago', read: true },
  ]);
  const [portfolioValue] = useState({
    total: '$124,567.89',
    change: '+5.2%',
    changeValue: '+$6,234.12',
    isPositive: true
  });

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const walletRef = useRef(null);
  const userMenuRef = useRef(null);

  const navigationItems = [
    { label: 'Dashboard', path: '/portfolio-dashboard', icon: 'LayoutDashboard' },
    { label: 'Portfolio', path: '/asset-portfolio-management', icon: 'PieChart' },
    { label: 'Transactions', path: '/transaction-history-analytics', icon: 'ArrowLeftRight' },
    { label: 'Markets', path: '/market-analysis-watchlist', icon: 'TrendingUp' },
    { label: 'Settings', path: '/settings-profile-management', icon: 'Settings' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (walletRef.current && !walletRef.current.contains(event.target)) {
        setIsWalletMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    setIsNotificationOpen(false);
  };

  const handleWalletDisconnect = async () => {
    try {
      console.log('Disconnecting wallet');
      const result = await disconnectWallet();
      if (result.success) {
        console.log('Wallet disconnected successfully');
        
        // Also update the user profile to remove wallet address
        if (user?.id && userProfile?.wallet_address) {
          await connectWallet(null); // This will clear the wallet address in the database
        }
      } else {
        console.error('Failed to disconnect wallet:', result.error);
      }
      setIsWalletMenuOpen(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const handleConnectWallet = async (walletType = 'metamask') => {
    try {
      setIsWalletMenuOpen(false);
      let result;
      
      switch (walletType) {
        case 'metamask':
          result = await connectMetaMask();
          break;
        case 'walletconnect':
          result = await connectWalletConnect();
          break;
        case 'coinbase':
          result = await connectCoinbase();
          break;
        default:
          result = await connectMetaMask();
      }

      if (result?.success && result?.account && user?.id) {
        // Save the connected wallet address to the user profile
        await connectWallet(result.account.address, walletType);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCopyAddress = async () => {
    try {
      const walletInfo = getWalletInfo();
      const address = walletInfo?.address || userProfile?.wallet_address;
      if (address) {
        await navigator.clipboard.writeText(address);
        console.log('Address copied to clipboard');
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error copying address:', error);
    }
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Don't show header on authentication page
  if (location.pathname === '/authentication-wallet-connection' || location.pathname === '/auth') {
    return null;
  }

  // Get wallet info from user profile or connected wallet
  const walletInfo = getWalletInfo();
  const walletStatus = {
    connected: isConnected || !!userProfile?.wallet_address,
    address: walletInfo?.address || userProfile?.wallet_address,
    balance: walletInfo?.balance || null,
    network: walletInfo?.chainName || 'Ethereum'
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-1000">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-text-primary font-heading">
              VoltIQ
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`nav-tab ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Portfolio Summary - Desktop Only */}
        <div className="hidden xl:flex portfolio-summary">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Total Value:</span>
            <span className="font-semibold font-data">{portfolioValue.total}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon 
              name={portfolioValue.isPositive ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              color={portfolioValue.isPositive ? "var(--color-success)" : "var(--color-error)"} 
            />
            <span className={`text-sm font-medium ${portfolioValue.isPositive ? 'text-success' : 'text-error'}`}>
              {portfolioValue.change}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <div className={`flex items-center transition-all duration-300 ${
              isSearchExpanded ? 'w-64' : 'w-10'
            }`}>
              {isSearchExpanded ? (
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <Input
                    type="search"
                    placeholder="Search assets, transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4"
                    autoFocus
                  />
                  <Icon 
                    name="Search" 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" 
                  />
                </form>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setIsSearchExpanded(true)}
                  className="w-10 h-10 p-0"
                >
                  <Icon name="Search" size={20} />
                </Button>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative w-10 h-10 p-0"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="dropdown-menu animate-slide-down">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 text-left hover:bg-surface-secondary transition-colors ${
                        !notification.read ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          !notification.read ? 'bg-primary' : 'bg-border'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary">{notification.message}</p>
                          <p className="text-xs text-text-muted mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="relative" ref={walletRef}>
            <button
              onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
              className="wallet-indicator"
            >
              <div className={`w-2 h-2 rounded-full ${
                walletStatus.connected ? 'bg-success' : 'bg-error'
              }`} />
              <span className="hidden sm:inline font-data">
                {walletStatus.connected && walletStatus.address ? truncateAddress(walletStatus.address) : 'Connect'}
              </span>
              <Icon name="ChevronDown" size={16} />
            </button>

            {isWalletMenuOpen && (
              <div className="dropdown-menu w-64 animate-slide-down">
                <div className="p-4">
                  {walletStatus.connected ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-text-muted">Connected to {walletStatus.network}</p>
                        <p className="font-data text-sm text-text-primary mt-1">
                          {walletStatus.address}
                        </p>
                        {walletStatus.balance && (
                          <p className="text-xs text-text-muted mt-1">
                            Balance: {parseFloat(walletStatus.balance).toFixed(4)} ETH
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCopyAddress}
                          className="flex-1"
                        >
                          Copy Address
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleWalletDisconnect}
                          className="flex-1"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-text-secondary text-center">Connect your wallet to continue</p>
                      
                      {walletError && (
                        <div className="text-xs text-error bg-error-50 p-2 rounded">
                          {walletError}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-3"
                          onClick={() => handleConnectWallet('metamask')}
                          disabled={isConnecting}
                        >
                          <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            M
                          </div>
                          {isConnecting ? 'Connecting...' : 'MetaMask'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-3"
                          onClick={() => handleConnectWallet('walletconnect')}
                          disabled={isConnecting}
                        >
                          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            W
                          </div>
                          {isConnecting ? 'Connecting...' : 'WalletConnect'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-3"
                          onClick={() => handleConnectWallet('coinbase')}
                          disabled={isConnecting}
                        >
                          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            C
                          </div>
                          {isConnecting ? 'Connecting...' : 'Coinbase Wallet'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-text-primary">
                  {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
                <Icon name="ChevronDown" size={16} />
              </button>

              {isUserMenuOpen && (
                <div className="dropdown-menu w-48 animate-slide-down">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">
                        {userProfile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/settings-profile-management');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-secondary rounded-lg flex items-center gap-2"
                    >
                      <Icon name="Settings" size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 text-left text-sm text-error hover:bg-surface-secondary rounded-lg flex items-center gap-2"
                    >
                      <Icon name="LogOut" size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-1000">
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`mobile-nav-tab ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;