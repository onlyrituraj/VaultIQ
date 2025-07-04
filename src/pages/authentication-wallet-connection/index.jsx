import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AuthBackground from './components/AuthBackground';
import AuthTabs from './components/AuthTabs';
import EmailLoginForm from './components/EmailLoginForm';
import WalletConnectionForm from './components/WalletConnectionForm';
import AuthFooter from './components/AuthFooter';
import Icon from '../../components/AppIcon';

const AuthenticationWalletConnection = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/portfolio-dashboard');
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-text-primary">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Background Pattern */}
      <AuthBackground />
      
      <main className="relative pt-16 pb-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Auth Card */}
          <div className="bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-8 text-center border-b border-border">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Icon name="Wallet" size={24} color="white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Welcome to CryptoFolio
              </h1>
              <p className="text-text-secondary">
                Sign in to access your portfolio or create a new account
              </p>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-6">
              <AuthTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Forms */}
            <div className="px-6 pb-6">
              {activeTab === 'email' ? (
                <EmailLoginForm 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              ) : (
                <WalletConnectionForm 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}
            </div>

            {/* Footer */}
            <AuthFooter />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Demo Credentials: email: demo@cryptofolio.com, password: demo123
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthenticationWalletConnection;