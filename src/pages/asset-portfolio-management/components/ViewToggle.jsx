import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center bg-surface-secondary rounded-lg p-1">
      <Button
        variant={currentView === 'cards' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('cards')}
        className="flex items-center gap-2 px-3 py-2"
      >
        <Icon name="Grid3X3" size={16} />
        <span className="hidden sm:inline">Cards</span>
      </Button>
      <Button
        variant={currentView === 'table' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="flex items-center gap-2 px-3 py-2"
      >
        <Icon name="List" size={16} />
        <span className="hidden sm:inline">Table</span>
      </Button>
    </div>
  );
};

export default ViewToggle;