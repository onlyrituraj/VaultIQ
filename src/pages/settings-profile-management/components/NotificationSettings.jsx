import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const NotificationSettings = ({ isExpanded, onToggle }) => {
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: {
      priceAlerts: true,
      portfolioUpdates: true,
      marketNews: false,
      securityAlerts: true,
      weeklyReports: true
    },
    push: {
      priceAlerts: true,
      portfolioUpdates: false,
      marketNews: false,
      securityAlerts: true,
      weeklyReports: false
    },
    sms: {
      priceAlerts: false,
      portfolioUpdates: false,
      marketNews: false,
      securityAlerts: true,
      weeklyReports: false
    }
  });

  const [priceAlerts, setPriceAlerts] = useState([
    {
      id: 1,
      asset: 'BTC',
      condition: 'above',
      price: 45000,
      enabled: true
    },
    {
      id: 2,
      asset: 'ETH',
      condition: 'below',
      price: 2500,
      enabled: true
    },
    {
      id: 3,
      asset: 'ADA',
      condition: 'above',
      price: 0.5,
      enabled: false
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    asset: '',
    condition: 'above',
    price: '',
    enabled: true
  });

  const [showAddAlert, setShowAddAlert] = useState(false);

  const notificationTypes = [
    {
      key: 'priceAlerts',
      label: 'Price Alerts',
      description: 'Get notified when assets reach target prices',
      icon: 'TrendingUp'
    },
    {
      key: 'portfolioUpdates',
      label: 'Portfolio Updates',
      description: 'Daily portfolio performance summaries',
      icon: 'PieChart'
    },
    {
      key: 'marketNews',
      label: 'Market News',
      description: 'Important cryptocurrency market updates',
      icon: 'Newspaper'
    },
    {
      key: 'securityAlerts',
      label: 'Security Alerts',
      description: 'Login attempts and security notifications',
      icon: 'Shield'
    },
    {
      key: 'weeklyReports',
      label: 'Weekly Reports',
      description: 'Comprehensive weekly portfolio analysis',
      icon: 'FileText'
    }
  ];

  const handleNotificationToggle = (channel, type) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type]
      }
    }));
  };

  const handleAlertToggle = (alertId) => {
    setPriceAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, enabled: !alert.enabled }
          : alert
      )
    );
  };

  const handleDeleteAlert = (alertId) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleAddAlert = () => {
    if (newAlert.asset && newAlert.price) {
      const alert = {
        id: Date.now(),
        ...newAlert,
        price: parseFloat(newAlert.price)
      };
      setPriceAlerts(prev => [...prev, alert]);
      setNewAlert({ asset: '', condition: 'above', price: '', enabled: true });
      setShowAddAlert(false);
    }
  };

  const popularAssets = ['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'MATIC'];

  return (
    <div className="bg-surface border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon name="Bell" size={20} color="var(--color-accent)" />
          <h3 className="text-lg font-semibold text-text-primary">Notification Settings</h3>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-muted" 
        />
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-6">
          {/* Notification Channels */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Notification Channels</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-text-primary">Notification Type</th>
                    <th className="text-center py-3 px-2 font-medium text-text-primary">Email</th>
                    <th className="text-center py-3 px-2 font-medium text-text-primary">Push</th>
                    <th className="text-center py-3 px-2 font-medium text-text-primary">SMS</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationTypes.map((type) => (
                    <tr key={type.key} className="border-b border-border-light">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <Icon name={type.icon} size={16} className="text-text-muted" />
                          <div>
                            <p className="font-medium text-text-primary">{type.label}</p>
                            <p className="text-sm text-text-muted">{type.description}</p>
                          </div>
                        </div>
                      </td>
                      {['email', 'push', 'sms'].map((channel) => (
                        <td key={channel} className="text-center py-4 px-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationPreferences[channel][type.key]}
                              onChange={() => handleNotificationToggle(channel, type.key)}
                            />
                            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Alerts Management */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary">Price Alerts</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddAlert(!showAddAlert)}
                iconName="Plus"
                iconPosition="left"
              >
                Add Alert
              </Button>
            </div>

            {showAddAlert && (
              <div className="p-4 bg-surface-secondary rounded-lg space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Asset</label>
                    <select
                      value={newAlert.asset}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, asset: e.target.value }))}
                      className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary"
                    >
                      <option value="">Select Asset</option>
                      {popularAssets.map(asset => (
                        <option key={asset} value={asset}>{asset}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Condition</label>
                    <select
                      value={newAlert.condition}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary"
                    >
                      <option value="above">Above</option>
                      <option value="below">Below</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Price ($)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newAlert.price}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleAddAlert}>
                    Create Alert
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddAlert(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {priceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    alert.enabled ? 'bg-surface border-border' : 'bg-surface-secondary border-border opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAlertToggle(alert.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        alert.enabled
                          ? 'bg-primary border-primary' :'border-border hover:border-border-dark'
                      }`}
                    >
                      {alert.enabled && (
                        <Icon name="Check" size={12} color="white" />
                      )}
                    </button>
                    <div>
                      <p className={`font-medium ${
                        alert.enabled ? 'text-text-primary' : 'text-text-muted'
                      }`}>
                        {alert.asset} {alert.condition} ${alert.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-text-muted">
                        Alert when {alert.asset} goes {alert.condition} ${alert.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-error hover:bg-error-50"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              ))}
            </div>

            {priceAlerts.length === 0 && (
              <div className="text-center py-8">
                <Icon name="Bell" size={48} className="text-text-muted mx-auto mb-3" />
                <p className="text-text-muted">No price alerts configured</p>
                <p className="text-sm text-text-muted">Add alerts to get notified when assets reach target prices</p>
              </div>
            )}
          </div>

          {/* Quiet Hours */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-text-primary">Quiet Hours</h4>
            <p className="text-sm text-text-muted">Set times when you don't want to receive notifications</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Start Time</label>
                <Input type="time" defaultValue="22:00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">End Time</label>
                <Input type="time" defaultValue="08:00" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="enableQuietHours" className="rounded" />
              <label htmlFor="enableQuietHours" className="text-sm text-text-primary">
                Enable quiet hours
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;