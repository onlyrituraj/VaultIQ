import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DisplayPreferences = ({ isExpanded, onToggle }) => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    currency: 'USD',
    numberFormat: 'US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  });

  const [dashboardWidgets, setDashboardWidgets] = useState([
    { id: 'portfolio-overview', name: 'Portfolio Overview', enabled: true, order: 1 },
    { id: 'price-alerts', name: 'Price Alerts', enabled: true, order: 2 },
    { id: 'market-trends', name: 'Market Trends', enabled: true, order: 3 },
    { id: 'recent-transactions', name: 'Recent Transactions', enabled: false, order: 4 },
    { id: 'news-feed', name: 'News Feed', enabled: true, order: 5 },
    { id: 'performance-chart', name: 'Performance Chart', enabled: true, order: 6 }
  ]);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
    { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' }
  ];

  const numberFormats = [
    { id: 'US', label: '1,234.56', description: 'US Format' },
    { id: 'EU', label: '1.234,56', description: 'European Format' },
    { id: 'IN', label: '1,23,456.78', description: 'Indian Format' }
  ];

  const dateFormats = [
    { id: 'MM/DD/YYYY', label: '12/31/2024', description: 'US Format' },
    { id: 'DD/MM/YYYY', label: '31/12/2024', description: 'European Format' },
    { id: 'YYYY-MM-DD', label: '2024-12-31', description: 'ISO Format' }
  ];

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('displayPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('displayPreferences', JSON.stringify(newPreferences));
    
    // Apply theme immediately
    if (key === 'theme') {
      document.documentElement.setAttribute('data-theme', value);
    }
  };

  const toggleWidget = (widgetId) => {
    setDashboardWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    );
  };

  const moveWidget = (widgetId, direction) => {
    setDashboardWidgets(prev => {
      const widgets = [...prev];
      const index = widgets.findIndex(w => w.id === widgetId);
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex >= 0 && newIndex < widgets.length) {
        [widgets[index], widgets[newIndex]] = [widgets[newIndex], widgets[index]];
        // Update order values
        widgets.forEach((widget, idx) => {
          widget.order = idx + 1;
        });
      }
      
      return widgets;
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon name="Palette" size={20} color="var(--color-secondary)" />
          <h3 className="text-lg font-semibold text-text-primary">Display Preferences</h3>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-muted" 
        />
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Theme</h4>
            <div className="grid grid-cols-2 gap-3">
              {['light', 'dark'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => handlePreferenceChange('theme', theme)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.theme === theme
                      ? 'border-primary bg-primary-50' :'border-border hover:border-border-dark'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      name={theme === 'light' ? 'Sun' : 'Moon'} 
                      size={20} 
                      color={preferences.theme === theme ? 'var(--color-primary)' : 'var(--color-text-muted)'} 
                    />
                    <span className={`font-medium capitalize ${
                      preferences.theme === theme ? 'text-primary' : 'text-text-secondary'
                    }`}>
                      {theme}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Primary Currency</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handlePreferenceChange('currency', currency.code)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    preferences.currency === currency.code
                      ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-border-dark text-text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currency.symbol}</span>
                    <div>
                      <p className="font-medium">{currency.code}</p>
                      <p className="text-xs opacity-70">{currency.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Number Format */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Number Format</h4>
            <div className="space-y-2">
              {numberFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handlePreferenceChange('numberFormat', format.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    preferences.numberFormat === format.id
                      ? 'border-primary bg-primary-50' :'border-border hover:border-border-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${
                        preferences.numberFormat === format.id ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {format.label}
                      </p>
                      <p className="text-sm text-text-muted">{format.description}</p>
                    </div>
                    {preferences.numberFormat === format.id && (
                      <Icon name="Check" size={16} color="var(--color-primary)" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">Date Format</h4>
              <div className="space-y-2">
                {dateFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => handlePreferenceChange('dateFormat', format.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      preferences.dateFormat === format.id
                        ? 'border-primary bg-primary-50' :'border-border hover:border-border-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${
                          preferences.dateFormat === format.id ? 'text-primary' : 'text-text-primary'
                        }`}>
                          {format.label}
                        </p>
                        <p className="text-sm text-text-muted">{format.description}</p>
                      </div>
                      {preferences.dateFormat === format.id && (
                        <Icon name="Check" size={16} color="var(--color-primary)" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">Time Format</h4>
              <div className="space-y-2">
                {[
                  { id: '12h', label: '12:30 PM', description: '12-hour format' },
                  { id: '24h', label: '12:30', description: '24-hour format' }
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => handlePreferenceChange('timeFormat', format.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      preferences.timeFormat === format.id
                        ? 'border-primary bg-primary-50' :'border-border hover:border-border-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${
                          preferences.timeFormat === format.id ? 'text-primary' : 'text-text-primary'
                        }`}>
                          {format.label}
                        </p>
                        <p className="text-sm text-text-muted">{format.description}</p>
                      </div>
                      {preferences.timeFormat === format.id && (
                        <Icon name="Check" size={16} color="var(--color-primary)" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Widget Customization */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-text-primary">Dashboard Widgets</h4>
            <p className="text-sm text-text-muted">Customize which widgets appear on your dashboard and their order.</p>
            
            <div className="space-y-2">
              {dashboardWidgets
                .sort((a, b) => a.order - b.order)
                .map((widget, index) => (
                <div
                  key={widget.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    widget.enabled ? 'bg-surface border-border' : 'bg-surface-secondary border-border opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        widget.enabled
                          ? 'bg-primary border-primary' :'border-border hover:border-border-dark'
                      }`}
                    >
                      {widget.enabled && (
                        <Icon name="Check" size={12} color="white" />
                      )}
                    </button>
                    <span className={`font-medium ${
                      widget.enabled ? 'text-text-primary' : 'text-text-muted'
                    }`}>
                      {widget.name}
                    </span>
                  </div>
                  
                  {widget.enabled && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveWidget(widget.id, 'up')}
                        disabled={index === 0}
                        className="w-8 h-8 p-0"
                      >
                        <Icon name="ChevronUp" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveWidget(widget.id, 'down')}
                        disabled={index === dashboardWidgets.filter(w => w.enabled).length - 1}
                        className="w-8 h-8 p-0"
                      >
                        <Icon name="ChevronDown" size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayPreferences;