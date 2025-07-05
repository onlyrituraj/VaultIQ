import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther, formatUnits } from 'viem';

const DeFiContext = createContext();

// Common DeFi protocol addresses (Ethereum mainnet)
const PROTOCOLS = {
  UNISWAP_V3_ROUTER: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  AAVE_LENDING_POOL: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
  COMPOUND_COMPTROLLER: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
  YEARN_VAULT_REGISTRY: '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804',
  CURVE_REGISTRY: '0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5',
};

// ERC20 ABI for token interactions
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export function DeFiProvider({ children }) {
  const { address, isConnected, chain } = useAccount();
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    tokens: [],
    defiPositions: [],
    nfts: [],
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Common token addresses for portfolio tracking
  const commonTokens = [
    { address: '0xA0b86a33E6441b8435b662303c0f6a4D2F23E6e3', symbol: 'USDC', decimals: 6 },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6 },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', decimals: 18 },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', decimals: 8 },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', decimals: 18 },
    { address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', symbol: 'AAVE', decimals: 18 },
    { address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', symbol: 'COMP', decimals: 18 },
  ];

  // Fetch portfolio data
  const fetchPortfolioData = async () => {
    if (!address || !isConnected) return;

    setIsLoading(true);
    setError(null);

    try {
      const portfolio = {
        totalValue: 0,
        tokens: [],
        defiPositions: [],
        nfts: [],
        transactions: []
      };

      // Add ETH balance
      if (ethBalance) {
        const ethValue = parseFloat(formatEther(ethBalance.value));
        portfolio.tokens.push({
          symbol: 'ETH',
          balance: ethValue,
          value: ethValue * 2500, // Mock ETH price
          price: 2500,
          change24h: 2.5,
          address: 'native'
        });
        portfolio.totalValue += ethValue * 2500;
      }

      // Fetch token balances (simplified for demo)
      for (const token of commonTokens.slice(0, 3)) {
        try {
          // Mock token balance for demo
          const mockBalance = Math.random() * 1000;
          const mockPrice = Math.random() * 100 + 1;
          const value = mockBalance * mockPrice;

          portfolio.tokens.push({
            symbol: token.symbol,
            balance: mockBalance,
            value: value,
            price: mockPrice,
            change24h: (Math.random() - 0.5) * 10,
            address: token.address
          });
          portfolio.totalValue += value;
        } catch (error) {
          console.log(`Error fetching ${token.symbol} balance:`, error);
        }
      }

      // Mock DeFi positions
      portfolio.defiPositions = [
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
      ];

      // Mock NFTs
      portfolio.nfts = [
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
      ];

      setPortfolioData(portfolio);
    } catch (error) {
      setError('Failed to fetch portfolio data');
      console.error('Portfolio fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // DeFi operations
  const swapTokens = async (tokenIn, tokenOut, amountIn) => {
    try {
      setIsLoading(true);
      // Mock swap operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh portfolio after swap
      await fetchPortfolioData();
      
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
      
      await fetchPortfolioData();
      
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
      
      await fetchPortfolioData();
      
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
      
      await fetchPortfolioData();
      
      return { success: true, txHash: '0x' + Math.random().toString(16).substr(2, 64) };
    } catch (error) {
      setError('Staking failed: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchPortfolioData();
    }
  }, [isConnected, address, chain]);

  const value = {
    portfolioData,
    isLoading,
    error,
    protocols: PROTOCOLS,
    // Operations
    swapTokens,
    addLiquidity,
    lendAsset,
    stakeTokens,
    refreshPortfolio: fetchPortfolioData,
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