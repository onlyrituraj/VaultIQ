import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedAssets, onClearSelection, onRebalance, onExport }) => {
  const [isRebalanceModalOpen, setIsRebalanceModalOpen] = useState(false);

  if (selectedAssets.length === 0) return null;

  const handleRebalance = () => {
    setIsRebalanceModalOpen(true);
  };

  const handleExport = (format) => {
    onExport(selectedAssets, format);
  };

  return (
    <>
      <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-6 lg:right-6 bg-surface border border-border rounded-lg shadow-xl p-4 z-40 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{selectedAssets.length}</span>
            </div>
            <span className="text-sm font-medium text-text-primary">
              {selectedAssets.length} asset{selectedAssets.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRebalance}
              className="flex items-center gap-2"
            >
              <Icon name="BarChart3" size={16} />
              <span className="hidden sm:inline">Rebalance</span>
            </Button>
            
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Icon name="Download" size={16} />
                <span className="hidden sm:inline">Export</span>
                <Icon name="ChevronDown" size={14} />
              </Button>
              
              <div className="absolute bottom-full right-0 mb-2 w-40 bg-surface border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
                  >
                    <Icon name="FileText" size={14} />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
                  >
                    <Icon name="Code" size={14} />
                    Export as JSON
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
                  >
                    <Icon name="FileDown" size={14} />
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="w-8 h-8 p-0"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Rebalance Modal */}
      {isRebalanceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-md animate-slide-down">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">Portfolio Rebalancing</h3>
              <Button
                variant="ghost"
                onClick={() => setIsRebalanceModalOpen(false)}
                className="w-8 h-8 p-0"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="BarChart3" size={32} className="text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-text-primary mb-2">
                  Rebalance Selected Assets
                </h4>
                <p className="text-sm text-text-secondary">
                  Get AI-powered recommendations to optimize your portfolio allocation for the selected {selectedAssets.length} assets.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-secondary rounded-lg p-4">
                  <h5 className="font-medium text-text-primary mb-2">Rebalancing Options</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="rebalanceType"
                        value="equal"
                        defaultChecked
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="text-sm text-text-primary">Equal Weight Distribution</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="rebalanceType"
                        value="market_cap"
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="text-sm text-text-primary">Market Cap Weighted</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="rebalanceType"
                        value="risk_adjusted"
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="text-sm text-text-primary">Risk-Adjusted Allocation</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsRebalanceModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onRebalance(selectedAssets);
                  setIsRebalanceModalOpen(false);
                }}
                className="flex-1"
              >
                Generate Recommendations
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;