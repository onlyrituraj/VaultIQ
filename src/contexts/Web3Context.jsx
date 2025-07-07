import React, { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Web3Context = createContext();

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function Web3Provider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setIsInitialized(true);
          return;
        }

        // Get projectId from environment with fallback
        const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

        // Only initialize Web3 components if we have a valid project ID
        if (projectId && projectId !== 'demo-project-id') {
          try {
            // Dynamic import to avoid SSR issues
            const { createAppKit } = await import('@reown/appkit/react');
            const { WagmiAdapter } = await import('@reown/appkit-adapter-wagmi');
            const { mainnet, polygon, arbitrum, optimism, base } = await import('wagmi/chains');

            const metadata = {
              name: 'CryptoFolio',
              description: 'Advanced Web3 Portfolio Management',
              url: typeof window !== 'undefined' ? window.location.origin : 'https://cryptofolio.app',
              icons: ['https://avatars.githubusercontent.com/u/37784886']
            };

            const chains = [mainnet, polygon, arbitrum, optimism, base];

            const wagmiAdapter = new WagmiAdapter({
              chains,
              projectId,
              networks: chains
            });

            createAppKit({
              adapters: [wagmiAdapter],
              projectId,
              networks: chains,
              metadata,
              features: {
                analytics: true,
                onramp: false // Disable onramp for demo
              },
              themeMode: 'light',
              themeVariables: {
                '--w3m-color-mix': '#1E40AF',
                '--w3m-color-mix-strength': 40
              }
            });

            console.log('Web3 initialized successfully');
          } catch (web3Error) {
            console.warn('Web3 initialization failed, continuing in demo mode:', web3Error);
          }
        } else {
          console.log('Running in demo mode - Web3 features disabled');
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Web3 initialization error:', error);
        setError(error.message);
        setIsInitialized(true); // Still initialize to show the app
      }
    };

    initializeWeb3();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-text-primary">Initializing...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-error mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-text-primary mb-2">Initialization Error</h1>
          <p className="text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Context.Provider value={{ isInitialized }}>
        {children}
      </Web3Context.Provider>
    </QueryClientProvider>
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