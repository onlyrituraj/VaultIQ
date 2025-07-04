import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CsvConnectionForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Upload CSV File
        </label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <Icon name="Upload" size={32} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-secondary mb-2">
            Drag and drop your CSV file here, or click to browse
          </p>
          <Button variant="outline" size="sm">
            Choose File
          </Button>
        </div>
      </div>

      <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="FileText" size={20} color="var(--color-primary)" />
          <div>
            <h4 className="font-medium text-primary mb-1">CSV Format</h4>
            <p className="text-sm text-primary">
              Your CSV should include columns: Asset, Amount, Purchase Price, Date
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvConnectionForm;