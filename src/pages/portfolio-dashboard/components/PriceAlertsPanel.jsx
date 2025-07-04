import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const PriceAlertsPanel = ({ alerts, isExpanded, onToggleExpand, onAddAlert, onRemoveAlert }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    asset: '',
    condition: 'above',
    price: '',
    enabled: true
  });

  const handleAddAlert = () => {
    if (newAlert.asset && newAlert.price) {
      onAddAlert({
        ...newAlert,
        id: Date.now(),
        price: parseFloat(newAlert.price)
      });
      setNewAlert({ asset: '', condition: 'above', price: '', enabled: true });
      setShowAddForm(false);
    }
  };

  const displayAlerts = isExpanded ? alerts : alerts.slice(0, 4);

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Price Alerts</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2"
          >
            <Icon name="Plus" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="p-2"
          >
            <Icon name={isExpanded ? "Minimize2" : "Maximize2"} size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="mb-4 p-4 bg-surface-secondary rounded-lg space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="text"
              placeholder="Asset (e.g., BTC)"
              value={newAlert.asset}
              onChange={(e) => setNewAlert({ ...newAlert, asset: e.target.value.toUpperCase() })}
            />
            <select
              value={newAlert.condition}
              onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
              className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          <Input
            type="number"
            placeholder="Price ($)"
            value={newAlert.price}
            onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
          />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleAddAlert}>
              Add Alert
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <div className={`space-y-3 transition-all duration-300 ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-64'}`}>
        {displayAlerts.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Icon name="Bell" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No price alerts set</p>
            <p className="text-sm">Add alerts to track price movements</p>
          </div>
        ) : (
          displayAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 hover:bg-surface-secondary rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${alert.enabled ? 'bg-success' : 'bg-text-muted'}`} />
                <Image
                  src={alert.asset.logo}
                  alt={alert.asset.symbol}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium text-text-primary">
                    {alert.asset.symbol} {alert.condition} ${alert.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-text-secondary">
                    Current: ${alert.currentPrice.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveAlert(alert.id)}
                  className="p-1 text-error hover:bg-error-50"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {!isExpanded && alerts.length > 4 && (
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" onClick={onToggleExpand}>
            View All {alerts.length} Alerts
          </Button>
        </div>
      )}
    </div>
  );
};

export default PriceAlertsPanel;