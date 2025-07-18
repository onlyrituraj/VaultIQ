import React, { createContext, useContext, useEffect, useState } from 'react';
import { createConfig, http, connect, disconnect, getAccount, getBalance, watchAccount } from '@wagmi/core';
import { mainnet, polygon, arbitrum, optimism, base } from 'viem/chains';
import { 
  metaMask, 
  walletConnect, 
  coinbaseWallet, 
  injected 
} from '@wagmi/connectors';

const WalletContext = createContext();

// Wagmi configuration
const config = createConfig({
  chains: [mainnet, polygon, arbitrum, optimism, base],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '2f05a7cde2bb14f2b3a85e33bef2e766',
    }),
    coinbaseWallet({
      appName: 'VoltIQ',
    }),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
});

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [connectedWallets, setConnectedWallets] = useState([]);

  useEffect(() => {
    // Initialize account state
    const initializeWallet = async () => {
      try {
        const account = getAccount(config);
        if (account.isConnected) {
          setAccount(account);
          setIsConnected(true);
          await updateBalance(account.address, account.chainId);
        }
      } catch (error) {
        console.log('Error initializing wallet:', error);
      }
    };

    initializeWallet();

    // Watch for account changes
    const unwatch = watchAccount(config, {
      onChange: async (account) => {
        setAccount(account);
        setIsConnected(account.isConnected);
        
        if (account.isConnected) {
          await updateBalance(account.address, account.chainId);
          setError(null);
        } else {
          setBalance(null);
        }
      },
    });

    return () => unwatch();
  }, []);

  const updateBalance = async (address, chainId) => {
    try {
      const balance = await getBalance(config, {
        address,
        chainId,
      });
      setBalance(balance);
    } catch (error) {
      console.log('Error fetching balance:', error);
    }
  };

  const connectWallet = async (connectorId) => {
    try {
      setIsConnecting(true);
      setError(null);

      const connector = config.connectors.find(c => c.id === connectorId);
      if (!connector) {
        throw new Error('Connector not found');
      }

      const result = await connect(config, { connector });
      
      if (result.accounts?.[0]) {
        const walletInfo = {
          id: Date.now().toString(),
          address: result.accounts[0],
          connector: connectorId,
          chainId: result.chainId,
          connectedAt: new Date().toISOString(),
        };
        
        setConnectedWallets(prev => [...prev, walletInfo]);
        await updateBalance(result.accounts[0], result.chainId);
      }

      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error.message || 'Failed to connect wallet';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect(config);
      setConnectedWallets([]);
      setBalance(null);
      setError(null);
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Failed to disconnect wallet';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const switchChain = async (chainId) => {
    try {
      // This would typically use switchChain from wagmi
      // For now, we'll just update the UI
      console.log('Switching to chain:', chainId);
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Failed to switch chain';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const connectMetaMask = async () => {
    return await connectWallet('io.metamask');
  };

  const connectWalletConnect = async () => {
    return await connectWallet('walletConnect');
  };

  const connectCoinbase = async () => {
    return await connectWallet('coinbaseWalletSDK');
  };

  const getWalletInfo = () => {
    if (!account || !isConnected) return null;

    return {
      address: account.address,
      chainId: account.chainId,
      chainName: account.chainId === 1 ? 'Ethereum' : `Chain ${account.chainId}`,
      connector: account.connector?.name,
      balance: balance?.formatted || '0',
    };
  };

  const value = {
    account,
    isConnected,
    isConnecting,
    balance,
    error,
    connectedWallets,
    connectWallet,
    connectMetaMask,
    connectWalletConnect,
    connectCoinbase,
    disconnectWallet,
    switchChain,
    getWalletInfo,
    clearError: () => setError(null),
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;