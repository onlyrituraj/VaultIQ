import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ui/ProtectedRoute";
// Add your imports here
import AuthPage from "pages/auth";
import WalletConnectionPage from "pages/wallet-connection";
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
        
        {/* Protected routes */}
        <Route path="/wallet-connection" element={
          <ProtectedRoute requireAuth={true}>
            <WalletConnectionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          <ProtectedRoute requireAuth={false}>
            <PortfolioDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/portfolio-dashboard" element={
          <ProtectedRoute requireAuth={false}>
            <PortfolioDashboard />
          </ProtectedRoute>
        } />
        
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