import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Login from "pages/login";
import PortfolioConnection from "pages/portfolio-connection";
import AuthenticationWalletConnection from "pages/authentication-wallet-connection";
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
        {/* Define your routes here */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portfolio-connection" element={<PortfolioConnection />} />
        <Route path="/authentication-wallet-connection" element={<AuthenticationWalletConnection />} />
        <Route path="/portfolio-dashboard" element={<PortfolioDashboard />} />
        <Route path="/transaction-history-analytics" element={<TransactionHistoryAnalytics />} />
        <Route path="/market-analysis-watchlist" element={<MarketAnalysisWatchlist />} />
        <Route path="/asset-portfolio-management" element={<AssetPortfolioManagement />} />
        <Route path="/settings-profile-management" element={<SettingsProfileManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;