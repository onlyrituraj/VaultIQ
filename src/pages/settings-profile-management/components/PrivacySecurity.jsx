import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PrivacySecurity = ({ isExpanded, onToggle }) => {
  const [connectedWallets, setConnectedWallets] = useState([
    {
      id: 1,
      name: 'MetaMask',
      address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      network: 'Ethereum',
      connected: true,
      lastUsed: '2 hours ago'
    },
    {
      id: 2,
      name: 'Coinbase Wallet',
      address: '0x8ba1f109551bD432803012645Hac136c22C501e5',
      network: 'Ethereum',
      connected: true,
      lastUsed: '1 day ago'
    },
    {
      id: 3,
      name: 'WalletConnect',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      network: 'Polygon',
      connected: false,
      lastUsed: '1 week ago'
    }
  ]);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [exportFormat, setExportFormat] = useState('json');
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    portfolioSharing: false,
    analyticsTracking: true,
    marketingCommunications: false
  });

  const handleWalletDisconnect = (walletId) => {
    setConnectedWallets(prev =>
      prev.map(wallet =>
        wallet.id === walletId
          ? { ...wallet, connected: false }
          : wallet
      )
    );
  };

  const handleWalletConnect = (walletId) => {
    setConnectedWallets(prev =>
      prev.map(wallet =>
        wallet.id === walletId
          ? { ...wallet, connected: true, lastUsed: 'Just now' }
          : wallet
      )
    );
  };

  const handleExportData = () => {
    console.log(`Exporting data in ${exportFormat} format`);
    // Mock export functionality
    const data = {
      profile: { name: 'Alex Johnson', email: 'alex.johnson@email.com' },
      portfolio: { totalValue: 124567.89, assets: [] },
      transactions: [],
      settings: privacySettings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VoltIQ-export.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE MY ACCOUNT') {
      console.log('Account deletion confirmed');
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
      // Handle account deletion
    } else {
      alert('Please type "DELETE MY ACCOUNT" to confirm');
    }
  };

  const handlePrivacyToggle = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon name="Shield" size={20} color="var(--color-warning)" />
          <h3 className="text-lg font-semibold text-text-primary">Privacy & Security</h3>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-muted" 
        />
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-6">
          {/* Wallet Connections */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Connected Wallets</h4>
            <div className="space-y-3">
              {connectedWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`p-4 rounded-lg border ${
                    wallet.connected ? 'bg-surface border-border' : 'bg-surface-secondary border-border opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        wallet.connected ? 'bg-success' : 'bg-border'
                      }`} />
                      <div>
                        <p className="font-medium text-text-primary">{wallet.name}</p>
                        <p className="text-sm text-text-muted font-data">
                          {truncateAddress(wallet.address)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {wallet.network} • Last used {wallet.lastUsed}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {wallet.connected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWalletDisconnect(wallet.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleWalletConnect(wallet.id)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" iconName="Plus" iconPosition="left">
              Add New Wallet
            </Button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-text-primary">Two-Factor Authentication</h4>
            <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
              <div>
                <p className="font-medium text-text-primary">2FA Protection</p>
                <p className="text-sm text-text-muted">
                  {twoFactorEnabled 
                    ? 'Your account is protected with 2FA' :'Add an extra layer of security to your account'
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                {twoFactorEnabled && (
                  <Icon name="Shield" size={20} color="var(--color-success)" />
                )}
                <Button
                  variant={twoFactorEnabled ? "outline" : "primary"}
                  size="sm"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                >
                  {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                </Button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-text-primary">Privacy Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">Profile Visibility</p>
                  <p className="text-sm text-text-muted">Control who can see your profile</p>
                </div>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                  className="p-2 border border-border rounded-lg bg-surface text-text-primary"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              {[
                {
                  key: 'portfolioSharing',
                  label: 'Portfolio Sharing',
                  description: 'Allow others to view your portfolio performance'
                },
                {
                  key: 'analyticsTracking',
                  label: 'Analytics Tracking',
                  description: 'Help improve our service with usage analytics'
                },
                {
                  key: 'marketingCommunications',
                  label: 'Marketing Communications',
                  description: 'Receive promotional emails and updates'
                }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">{setting.label}</p>
                    <p className="text-sm text-text-muted">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={privacySettings[setting.key]}
                      onChange={() => handlePrivacyToggle(setting.key)}
                    />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-text-primary">Data Management</h4>
            
            <div className="space-y-3">
              <div className="p-4 bg-surface-secondary rounded-lg">
                <h5 className="font-medium text-text-primary mb-2">Export Your Data</h5>
                <p className="text-sm text-text-muted mb-3">
                  Download a copy of your portfolio data, transactions, and settings
                </p>
                <div className="flex items-center gap-3">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="p-2 border border-border rounded-lg bg-surface text-text-primary"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export Data
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-error-50 border border-error-100 rounded-lg">
                <h5 className="font-medium text-error mb-2">Delete Account</h5>
                <p className="text-sm text-error mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-surface p-6 rounded-lg max-w-md w-full mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="AlertTriangle" size={24} color="var(--color-error)" />
                  <h3 className="text-lg font-semibold text-text-primary">Delete Account</h3>
                </div>
                
                <p className="text-text-secondary mb-4">
                  This will permanently delete your account and all associated data. 
                  This action cannot be undone.
                </p>
                
                <p className="text-sm text-text-muted mb-3">
                  Type <strong>DELETE MY ACCOUNT</strong> to confirm:
                </p>
                
                <Input
                  type="text"
                  placeholder="DELETE MY ACCOUNT"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="mb-4"
                />
                
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE MY ACCOUNT'}
                  >
                    Delete Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrivacySecurity;