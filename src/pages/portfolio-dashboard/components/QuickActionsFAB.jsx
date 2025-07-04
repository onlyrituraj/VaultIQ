import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const QuickActionsFAB = ({ onAddTransaction, onConnectWallet }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      label: 'Add Transaction',
      icon: 'Plus',
      onClick: onAddTransaction,
      color: 'bg-primary hover:bg-primary-600'
    },
    {
      label: 'Connect Wallet',
      icon: 'Wallet',
      onClick: onConnectWallet,
      color: 'bg-secondary hover:bg-secondary-600'
    },
    {
      label: 'Import CSV',
      icon: 'Upload',
      onClick: () => console.log('Import CSV'),
      color: 'bg-accent hover:bg-accent-600'
    }
  ];

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <div key={action.label} className="flex items-center gap-3">
            <div className="hidden sm:block bg-surface border border-border rounded-lg px-3 py-2 shadow-lg">
              <span className="text-sm font-medium text-text-primary whitespace-nowrap">
                {action.label}
              </span>
            </div>
            <button
              onClick={action.onClick}
              className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon name={action.icon} size={20} color="white" />
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full bg-primary hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
      >
        <Icon name="Plus" size={24} color="white" />
      </button>
    </div>
  );
};

export default QuickActionsFAB;