import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const SearchBar = ({ onSearch, searchQuery, setSearchQuery }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const mockSuggestions = [
    { id: 'btc', symbol: 'BTC', name: 'Bitcoin', icon: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=32&h=32&fit=crop&crop=center' },
    { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center' },
    { id: 'ada', symbol: 'ADA', name: 'Cardano', icon: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=32&h=32&fit=crop&crop=center' },
    { id: 'dot', symbol: 'DOT', name: 'Polkadot', icon: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=32&h=32&fit=crop&crop=center' },
    { id: 'sol', symbol: 'SOL', name: 'Solana', icon: 'https://images.unsplash.com/photo-1640826787865-e1e2c7c8e8c8?w=32&h=32&fit=crop&crop=center' },
    { id: 'avax', symbol: 'AVAX', name: 'Avalanche', icon: 'https://images.unsplash.com/photo-1640826787865-e1e2c7c8e8c8?w=32&h=32&fit=crop&crop=center' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = mockSuggestions.filter(
        item => 
          item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.symbol);
    onSearch(suggestion.symbol);
    setShowSuggestions(false);
    setIsExpanded(false);
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className={`flex items-center transition-all duration-300 ${
        isExpanded ? 'w-full sm:w-80' : 'w-full sm:w-64'
      }`}>
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <Input
            type="search"
            placeholder="Search assets, symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            className="w-full pl-10 pr-4"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" 
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </form>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-overlay animate-slide-down">
          <div className="p-2">
            <div className="text-xs text-text-secondary px-3 py-2 font-medium">
              Suggestions
            </div>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-secondary rounded-lg transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-surface-secondary">
                  <Image 
                    src={suggestion.icon} 
                    alt={`${suggestion.name} icon`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">
                    {suggestion.symbol}
                  </div>
                  <div className="text-xs text-text-secondary truncate">
                    {suggestion.name}
                  </div>
                </div>
                <Icon name="Search" size={14} className="text-text-muted" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;