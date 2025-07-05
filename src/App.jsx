import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import Routes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/tailwind.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WalletProvider>
          <div className="App">
            <Routes />
          </div>
        </WalletProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;