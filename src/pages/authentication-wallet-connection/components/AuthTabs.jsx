import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'email',
      label: 'Email Login',
      icon: 'Mail',
      description: 'Sign in with email and password'
    },
    {
      id: 'wallet',
      label: 'Connect Wallet',
      icon: 'Wallet',
      description: 'Connect with Web3 wallet'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex bg-surface-secondary rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-text-secondary">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>
    </div>
  );
};

export default AuthTabs;