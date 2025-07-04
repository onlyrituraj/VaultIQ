import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/tailwind.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <Routes />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;