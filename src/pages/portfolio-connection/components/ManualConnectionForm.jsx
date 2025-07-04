import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ManualConnectionForm = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Portfolio Name
        </label>
        <Input
          type="text"
          name="portfolioName"
          placeholder="My Crypto Portfolio"
          value={formData.portfolioName}
          onChange={onInputChange}
        />
      </div>

      <div className="p-4 bg-secondary-50 border border-secondary-100 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Edit" size={20} color="var(--color-secondary)" />
          <div>
            <h4 className="font-medium text-secondary mb-1">Manual Tracking</h4>
            <p className="text-sm text-secondary">
              You'll be able to manually add your cryptocurrency holdings 
              and update them as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualConnectionForm;