import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onAddToWatchlist, onAddToPortfolio }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Mock search data
  const mockSearchData = [
    {
      id: 'bitcoin-search',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=32&h=32&fit=crop&crop=center',
      current_price: 43250.00,
      market_cap: 847000000000,
      price_change_percentage_24h: 2.45
    },
    {
      id: 'ethereum-search',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center',
      current_price: 2650.00,
      market_cap: 318000000000,
      price_change_percentage_24h: -1.23
    },
    {
      id: 'cardano-search',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=32&h=32&fit=crop&crop=center',
      current_price: 0.485,
      market_cap: 17200000000,
      price_change_percentage_24h: 3.67
    },
    {
      id: 'solana-search',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=32&h=32&fit=crop&crop=center',
      current_price: 98.50,
      market_cap: 42800000000,
      price_change_percentage_24h: 5.12
    },
    {
      id: 'polygon-search',
      symbol: 'matic',
      name: 'Polygon',
      image: 'https://images.unsplash.com/photo-1640826844110-c7c7d4b8b6b8?w=32&h=32&fit=crop&crop=center',
      current_price: 0.875,
      market_cap: 8100000000,
      price_change_percentage_24h: -2.34
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = mockSearchData.filter(asset =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
        setShowResults(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (asset, action) => {
    if (action === 'watchlist') {
      onAddToWatchlist(asset);
    } else if (action === 'portfolio') {
      onAddToPortfolio(asset);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4"
        />
        <Icon 
          name={isSearching ? "Loader2" : "Search"} 
          size={18} 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none ${
            isSearching ? 'animate-spin' : ''
          }`} 
        />
      </div>

      {showResults && (
        <div className="search-overlay animate-slide-down">
          <div className="max-h-80 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 hover:bg-surface-secondary transition-colors border-b border-border last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-secondary">
                        <Image 
                          src={asset.image} 
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-primary">{asset.symbol.toUpperCase()}</span>
                          <span className="text-sm text-text-secondary">{asset.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-data">{formatPrice(asset.current_price)}</span>
                          <span className={`text-xs ${
                            asset.price_change_percentage_24h >= 0 ? 'text-success' : 'text-error'
                          }`}>
                            {asset.price_change_percentage_24h >= 0 ? '+' : ''}{asset.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResultClick(asset, 'watchlist')}
                        className="p-2 text-text-muted hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                        title="Add to Watchlist"
                      >
                        <Icon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={() => handleResultClick(asset, 'portfolio')}
                        className="p-2 text-text-muted hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                        title="Add to Portfolio"
                      >
                        <Icon name="Plus" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-text-secondary">
                <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
                <p>No cryptocurrencies found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;