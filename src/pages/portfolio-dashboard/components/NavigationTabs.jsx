import React from 'react';
import Icon from '../../../components/AppIcon';

const NavigationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'assets', label: 'Assets', icon: 'Coins' },
    { id: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { id: 'alerts', label: 'Alerts', icon: 'Bell' }
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-2 shadow-md mb-6">
      <div className="flex items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
          >
            <Icon 
              name={tab.icon} 
              size={18} 
              color={activeTab === tab.id ? 'white' : 'currentColor'} 
            />
            <span className="hidden sm:inline font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;