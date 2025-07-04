import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ApiConnectionForm = ({ formData, onInputChange, supportedExchanges }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Exchange
        </label>
        <select
          name="exchangeName"
          value={formData.exchangeName}
          onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
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
  );
};

export default ApiConnectionForm;