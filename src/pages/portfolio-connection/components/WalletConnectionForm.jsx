import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const WalletConnectionForm = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Wallet Address
        </label>
        <Input
          type="text"
          name="walletAddress"
          placeholder="0x... or bc1... or other wallet address"
          value={formData.walletAddress}
          onChange={onInputChange}
        />
        <p className="text-sm text-text-muted mt-1">
          Enter any cryptocurrency wallet address to track its holdings
        </p>
      </div>

      <div className="p-4 bg-accent-50 border border-accent-100 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-accent)" />
          <div>
            <h4 className="font-medium text-accent mb-1">Public Address Only</h4>
            <p className="text-sm text-accent">
              We only need your public wallet address to track holdings. 
              Your private keys remain secure with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionForm;