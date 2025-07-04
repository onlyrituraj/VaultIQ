import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortOptions = ({ sortConfig, onSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { key: 'name', label: 'Name (A-Z)', icon: 'SortAsc' },
    { key: 'currentPrice', label: 'Price', icon: 'DollarSign' },
    { key: 'change24h', label: '24h Change', icon: 'TrendingUp' },
    { key: 'holdings', label: 'Holdings Amount', icon: 'Coins' },
    { key: 'value', label: 'Holdings Value', icon: 'PieChart' },
    { key: 'marketCap', label: 'Market Cap', icon: 'BarChart3' },
    { key: 'volume24h', label: '24h Volume', icon: 'Activity' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSort = (key) => {
    onSort(key);
    setIsOpen(false);
  };

  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find(option => option.key === sortConfig.key);
    return currentOption ? currentOption.label : 'Sort by';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Icon name="ArrowUpDown" size={16} />
        <span className="hidden sm:inline">{getCurrentSortLabel()}</span>
        <Icon name="ChevronDown" size={16} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50 animate-slide-down">
          <div className="p-2">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSort(option.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  sortConfig.key === option.key 
                    ? 'bg-primary-50 text-primary' :'hover:bg-surface-secondary text-text-primary'
                }`}
              >
                <Icon name={option.icon} size={16} />
                <span className="text-sm">{option.label}</span>
                {sortConfig.key === option.key && (
                  <Icon 
                    name={sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                    size={14} 
                    className="ml-auto"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortOptions;