import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import { DeFiProvider } from './contexts/DeFiContext';
import Routes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/tailwind.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Web3Provider>
          <DeFiProvider>
            <div className="App">
              <Routes />
            </div>
          </DeFiProvider>
        </Web3Provider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;