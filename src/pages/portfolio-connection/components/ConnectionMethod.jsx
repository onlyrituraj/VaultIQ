import React from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionMethod = ({ method, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(method.id)}
      className={`p-6 border-2 rounded-xl text-left transition-all duration-200 w-full ${
        isActive
          ? 'border-primary bg-primary-50'
          : 'border-border hover:border-border-dark hover:bg-surface-secondary'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isActive ? 'bg-primary text-white' : 'bg-surface-secondary text-text-muted'
        }`}>
          <Icon name={method.icon} size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${
              isActive ? 'text-primary' : 'text-text-primary'
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
  );
};

export default ConnectionMethod;