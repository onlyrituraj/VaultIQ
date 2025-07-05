import React, { createContext, useContext, useEffect, useState } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet, polygon, optimism, base, bsc, avalanche } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { reconnect } from '@wagmi/core';

const Web3Context = createContext();

// Get projectId from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

// Create wagmi config
const metadata = {
  name: 'CryptoFolio',
  description: 'Advanced Web3 Portfolio Management',
  url: 'https://cryptofolio.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, polygon, arbitrum, optimism, base, bsc, avalanche];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#1E40AF',
    '--w3m-color-mix-strength': 40
  }
});

// Create query client
const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Reconnect to previous session
    reconnect(config).finally(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-text-primary">Initializing Web3...</span>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Context.Provider value={{ config }}>
          {children}
        </Web3Context.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export default Web3Context;