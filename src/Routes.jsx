import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ui/ProtectedRoute";
// Add your imports here
import AuthPage from "pages/auth";
import WalletConnectionPage from "pages/wallet-connection";
import Web3Dashboard from "pages/web3-dashboard";
import PortfolioDashboard from "pages/portfolio-dashboard";
import TransactionHistoryAnalytics from "pages/transaction-history-analytics";
import MarketAnalysisWatchlist from "pages/market-analysis-watchlist";
import AssetPortfolioManagement from "pages/asset-portfolio-management";
import SettingsProfileManagement from "pages/settings-profile-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/auth" element={
          <ProtectedRoute requireAuth={false}>
            <AuthPage />
          </ProtectedRoute>
        } />
        
        {/* Web3 Dashboard - Main route */}
        <Route path="/" element={<Web3Dashboard />} />
        <Route path="/web3-dashboard" element={<Web3Dashboard />} />
        
        {/* Protected routes */}
        <Route path="/wallet-connection" element={
          <ProtectedRoute requireAuth={true}>
            <WalletConnectionPage />
          </ProtectedRoute>
        } />
        
        {/* Legacy portfolio routes - now redirect to Web3 Dashboard */}
        <Route path="/portfolio-dashboard" element={<Web3Dashboard />} />
        
        <Route path="/transaction-history-analytics" element={
          <ProtectedRoute requireAuth={false}>
            <TransactionHistoryAnalytics />
          </ProtectedRoute>
        } />
        
        <Route path="/market-analysis-watchlist" element={
          <ProtectedRoute requireAuth={false}>
            <MarketAnalysisWatchlist />
          </ProtectedRoute>
        } />
        
        <Route path="/asset-portfolio-management" element={
          <ProtectedRoute requireAuth={false}>
            <AssetPortfolioManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/settings-profile-management" element={
          <ProtectedRoute requireAuth={false}>
            <SettingsProfileManagement />
          </ProtectedRoute>
        } />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/authentication-wallet-connection" element={
          <ProtectedRoute requireAuth={false}>
            <AuthPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;