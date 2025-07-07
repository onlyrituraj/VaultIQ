import React, { createContext, useContext, useState, useEffect } from 'react';

const DeFiContext = createContext();

export function DeFiProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 124567.89,
    tokens: [
      {
        symbol: 'ETH',
        balance: 2.5,
        price: 2500,
        value: 6250,
        change24h: 2.5,
        address: 'native'
      },
      {
        symbol: 'BTC',
        balance: 0.1,
        price: 43000,
        value: 4300,
        change24h: 1.2,
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
      },
      {
        symbol: 'USDC',
        balance: 5000,
        price: 1,
        value: 5000,
        change24h: 0.0,
        address: '0xA0b86a33E6441b8435b662303c0f6a4D2F23E6e3'
      }
    ],
    defiPositions: [
      {
        protocol: 'Uniswap V3',
        type: 'Liquidity Pool',
        pair: 'ETH/USDC',
        value: 5000,
        apy: 12.5,
        rewards: 125
      },
      {
        protocol: 'Aave',
        type: 'Lending',
        asset: 'USDC',
        value: 3000,
        apy: 8.2,
        rewards: 82
      },
      {
        protocol: 'Compound',
        type: 'Lending',
        asset: 'ETH',
        value: 2000,
        apy: 6.8,
        rewards: 45
      }
    ],
    nfts: [
      {
        collection: 'Bored Ape Yacht Club',
        tokenId: '1234',
        value: 15000,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'
      },
      {
        collection: 'CryptoPunks',
        tokenId: '5678',
        value: 25000,
        image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200&h=200&fit=crop'
      }
    ],
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // DeFi operations
  const swapTokens = async (tokenIn, tokenOut, amountIn) => {
    try {
      setIsLoading(true);
      // Mock swap operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, txHash: '0x' + Math.random().toString(16).substr(2, 64) };
    } catch (error) {
      setError('Swap failed: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const addLiquidity = async (token0, token1, amount0, amount1) => {
    try {
      setIsLoading(true);
      // Mock liquidity addition
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, txHash: '0x' + Math.random().toString(16).substr(2, 64) };
    } catch (error) {
      setError('Add liquidity failed: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const lendAsset = async (asset, amount, protocol = 'aave') => {
    try {
      setIsLoading(true);
      // Mock lending operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, txHash: '0x' + Math.random().toString(16).substr(2, 64) };
    } catch (error) {
      setError('Lending failed: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const stakeTokens = async (token, amount, protocol) => {
    try {
      setIsLoading(true);
      // Mock staking operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, txHash: '0x' + Math.random().toString(16).substr(2, 64) };
    } catch (error) {
      setError('Staking failed: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPortfolio = async () => {
    setIsLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const value = {
    portfolioData,
    isLoading,
    error,
    // Operations
    swapTokens,
    addLiquidity,
    lendAsset,
    stakeTokens,
    refreshPortfolio,
    clearError: () => setError(null)
  };

  return (
    <DeFiContext.Provider value={value}>
      {children}
    </DeFiContext.Provider>
  );
}

export const useDeFi = () => {
  const context = useContext(DeFiContext);
  if (!context) {
    throw new Error('useDeFi must be used within a DeFiProvider');
  }
  return context;
};

export default DeFiContext;