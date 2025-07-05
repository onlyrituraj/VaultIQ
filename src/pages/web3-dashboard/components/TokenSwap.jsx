import React, { useState } from 'react';
import { useDeFi } from '../../../contexts/DeFiContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TokenSwap = ({ tokens }) => {
  const { swapTokens, isLoading } = useDeFi();
  const [fromToken, setFromToken] = useState(tokens[0] || null);
  const [toToken, setToToken] = useState(tokens[1] || null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);

  // Mock exchange rate calculation
  const calculateToAmount = (amount, from, to) => {
    if (!amount || !from || !to) return '';
    const rate = from.price / to.price;
    return (parseFloat(amount) * rate).toFixed(6);
  };

  const handleFromAmountChange = (value) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value, fromToken, toToken));
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) return;

    try {
      const result = await swapTokens(fromToken.symbol, toToken.symbol, fromAmount);
      if (result.success) {
        setFromAmount('');
        setToAmount('');
        // Show success message
      }
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  const getMaxBalance = () => {
    return fromToken ? fromToken.balance.toFixed(6) : '0';
  };

  const setMaxAmount = () => {
    const maxBalance = getMaxBalance();
    setFromAmount(maxBalance);
    setToAmount(calculateToAmount(maxBalance, fromToken, toToken));
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Swap Tokens</h2>
          <Button
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2"
          >
            <Icon name="Settings" size={20} />
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 bg-surface-secondary rounded-lg">
            <h3 className="font-medium text-text-primary mb-3">Swap Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Slippage Tolerance
                </label>
                <div className="flex gap-2">
                  {['0.1', '0.5', '1.0'].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        slippage === value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface border border-border hover:bg-surface-secondary'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                  <Input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-20 text-center"
                    placeholder="Custom"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* From Token */}
        <div className="space-y-4">
          <div className="p-4 bg-surface-secondary rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-secondary">From</span>
              <span className="text-sm text-text-secondary">
                Balance: {getMaxBalance()} {fromToken?.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                className="flex-1 text-lg font-data"
              />
              <Button
                variant="outline"
                onClick={setMaxAmount}
                className="px-3 py-2 text-sm"
              >
                MAX
              </Button>
              <select
                value={fromToken?.symbol || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.symbol === e.target.value);
                  setFromToken(token);
                }}
                className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary font-medium"
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleSwapTokens}
              className="w-10 h-10 p-0 rounded-full"
            >
              <Icon name="ArrowUpDown" size={20} />
            </Button>
          </div>

          {/* To Token */}
          <div className="p-4 bg-surface-secondary rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-text-secondary">To</span>
              <span className="text-sm text-text-secondary">
                Balance: {toToken?.balance.toFixed(6) || '0'} {toToken?.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="flex-1 text-lg font-data bg-surface"
              />
              <select
                value={toToken?.symbol || ''}
                onChange={(e) => {
                  const token = tokens.find(t => t.symbol === e.target.value);
                  setToToken(token);
                }}
                className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary font-medium"
              >
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && (
          <div className="mt-4 p-4 bg-surface-secondary rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Exchange Rate</span>
              <span className="text-text-primary font-data">
                1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Price Impact</span>
              <span className="text-success">{'<0.01%'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Network Fee</span>
              <span className="text-text-primary">~$5.20</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Minimum Received</span>
              <span className="text-text-primary font-data">
                {(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken.symbol}
              </span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!fromAmount || !toAmount || isLoading}
          className="w-full mt-6"
          size="lg"
        >
          {isLoading ? (
            <>
              <Icon name="Loader2" size={20} className="animate-spin mr-2" />
              Swapping...
            </>
          ) : (
            <>
              <Icon name="ArrowLeftRight" size={20} className="mr-2" />
              Swap Tokens
            </>
          )}
        </Button>

        {/* Powered by */}
        <div className="mt-4 text-center">
          <p className="text-xs text-text-muted">
            Powered by Uniswap V3 • Best price guaranteed
          </p>
        </div>
      </div>

      {/* Recent Swaps */}
      <div className="mt-6 bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Swaps</h3>
        <div className="space-y-3">
          {[
            { from: 'ETH', to: 'USDC', amount: '0.5', value: '$1,250', time: '2 min ago' },
            { from: 'USDC', to: 'UNI', amount: '500', value: '$500', time: '1 hour ago' },
            { from: 'WBTC', to: 'ETH', amount: '0.1', value: '$4,300', time: '3 hours ago' },
          ].map((swap, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-text-primary">{swap.from}</span>
                  <Icon name="ArrowRight" size={14} className="text-text-muted" />
                  <span className="font-medium text-text-primary">{swap.to}</span>
                </div>
                <span className="text-sm text-text-secondary">{swap.amount}</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-text-primary">{swap.value}</div>
                <div className="text-xs text-text-muted">{swap.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;