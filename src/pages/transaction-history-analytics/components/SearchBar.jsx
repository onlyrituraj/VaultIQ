import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ onSearch, onExport, onRefresh, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleExport = (format) => {
    onExport(format);
    setShowExportOptions(false);
  };

  const exportOptions = [
    { format: 'csv', label: 'Export as CSV', icon: 'FileText' },
    { format: 'pdf', label: 'Export as PDF', icon: 'FileDown' },
    { format: 'json', label: 'Export as JSON', icon: 'Code' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search by hash, amount, or asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" 
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            iconName="RefreshCw"
            iconPosition="left"
            className={isLoading ? 'animate-spin' : ''}
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <div className="relative">
            <Button
              variant="secondary"
              onClick={() => setShowExportOptions(!showExportOptions)}
              iconName="Download"
              iconPosition="left"
            >
              <span className="hidden sm:inline">Export</span>
            </Button>

            {showExportOptions && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50 animate-slide-down">
                <div className="p-2">
                  {exportOptions.map((option) => (
                    <button
                      key={option.format}
                      onClick={() => handleExport(option.format)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
                    >
                      <Icon name={option.icon} size={16} />
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-border p-2">
                  <button
                    onClick={() => setShowExportOptions(false)}
                    className="w-full px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Search" size={16} />
            <span>Searching for: "{searchQuery}"</span>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
              className="ml-2 p-1 h-auto"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;