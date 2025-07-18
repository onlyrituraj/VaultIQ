import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ui/ProtectedRoute";
import { useAuth } from "contexts/AuthContext";
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

// Component to handle root route redirection
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/portfolio-dashboard" replace />;
  }

  // If not authenticated, show the web3 dashboard (landing page)
  return <Web3Dashboard />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Root route with conditional redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public routes */}
          <Route path="/auth" element={
            <ProtectedRoute requireAuth={false}>
              <AuthPage />
            </ProtectedRoute>
          } />

          {/* Web3 Dashboard - Landing page for non-authenticated users */}
          <Route path="/web3-dashboard" element={<Web3Dashboard />} />

          {/* Protected routes */}
          <Route path="/wallet-connection" element={
            <ProtectedRoute requireAuth={true}>
              <WalletConnectionPage />
            </ProtectedRoute>
          } />

          <Route path="/portfolio-dashboard" element={
            <ProtectedRoute requireAuth={true}>
              <PortfolioDashboard />
            </ProtectedRoute>
          } />

          <Route path="/transaction-history-analytics" element={
            <ProtectedRoute requireAuth={true}>
              <TransactionHistoryAnalytics />
            </ProtectedRoute>
          } />

          <Route path="/market-analysis-watchlist" element={
            <ProtectedRoute requireAuth={false}>
              <MarketAnalysisWatchlist />
            </ProtectedRoute>
          } />

          <Route path="/asset-portfolio-management" element={
            <ProtectedRoute requireAuth={true}>
              <AssetPortfolioManagement />
            </ProtectedRoute>
          } />

          <Route path="/settings-profile-management" element={
            <ProtectedRoute requireAuth={true}>
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