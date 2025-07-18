import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import { WalletProvider } from './contexts/WalletContext';
import { DeFiProvider } from './contexts/DeFiContext';
import Routes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/tailwind.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Web3Provider>
          <WalletProvider>
            <DeFiProvider>
              <div className="App">
                <Routes />
              </div>
            </DeFiProvider>
          </WalletProvider>
        </Web3Provider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;