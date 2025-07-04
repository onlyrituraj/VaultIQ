import React from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isOpen, 
  onToggle 
}) => {
  const marketCapRanges = [
    { label: 'All', value: 'all' },
    { label: 'Large Cap (&gt; $10B)', value: 'large' },
    { label: 'Mid Cap ($1B - $10B)', value: 'mid' },
    { label: 'Small Cap (&lt; $1B)', value: 'small' }
  ];

  const priceChangeRanges = [
    { label: 'All', value: 'all' },
    { label: 'Gainers (&gt; 0%)', value: 'gainers' },
    { label: 'Losers (&lt; 0%)', value: 'losers' },
    { label: 'Stable (-1% to +1%)', value: 'stable' }
  ];

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'DeFi', value: 'defi' },
    { label: 'Layer 1', value: 'layer1' },
    { label: 'Layer 2', value: 'layer2' },
    { label: 'Meme', value: 'meme' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'NFT', value: 'nft' }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={onToggle}
        iconName="Filter"
        iconSize={16}
        className="lg:hidden"
      >
        Filters
      </Button>

      <div className={`${
        isOpen ? 'block' : 'hidden'
      } lg:block absolute lg:relative top-full lg:top-0 left-0 right-0 lg:right-auto mt-2 lg:mt-0 bg-surface lg:bg-transparent border lg:border-0 border-border rounded-lg lg:rounded-none shadow-xl lg:shadow-none z-50 lg:z-auto`}>
        <div className="p-4 lg:p-0 space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Price Range
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => onFilterChange('priceMin', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => onFilterChange('priceMax', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Market Cap */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Market Cap
            </label>
            <select
              value={filters.marketCap}
              onChange={(e) => onFilterChange('marketCap', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {marketCapRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Change */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              24h Change
            </label>
            <select
              value={filters.priceChange}
              onChange={(e) => onFilterChange('priceChange', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {priceChangeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Volume Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Volume Range (24h)
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.volumeMin}
                onChange={(e) => onFilterChange('volumeMin', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.volumeMax}
                onChange={(e) => onFilterChange('volumeMax', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full"
            iconName="X"
            iconSize={16}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;