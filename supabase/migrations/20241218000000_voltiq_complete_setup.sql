-- VoltIQ Complete Database Setup
-- This migration sets up all required tables for the VoltIQ crypto portfolio management application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    wallet_address TEXT,
    wallet_type TEXT DEFAULT 'metamask',
    wallet_connected_at TIMESTAMPTZ,
    preferred_currency TEXT DEFAULT 'USD' CHECK (preferred_currency IN ('USD', 'EUR', 'GBP', 'BTC', 'ETH')),
    notification_preferences JSONB DEFAULT '{"email": true, "push": false, "price_alerts": true, "portfolio_updates": true}'::jsonb,
    avatar_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PORTFOLIOS TABLE
-- ============================================================================
CREATE TABLE portfolios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    total_value_usd DECIMAL(20, 8) DEFAULT 0,
    total_change_24h DECIMAL(10, 4) DEFAULT 0,
    total_change_percentage_24h DECIMAL(10, 4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ASSETS TABLE (Cryptocurrency definitions)
-- ============================================================================
CREATE TABLE assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo_url TEXT,
    coingecko_id TEXT,
    coinmarketcap_id TEXT,
    contract_address TEXT,
    blockchain TEXT DEFAULT 'ethereum',
    decimals INTEGER DEFAULT 18,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PORTFOLIO ASSETS TABLE (User holdings)
-- ============================================================================
CREATE TABLE portfolio_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    quantity DECIMAL(30, 18) NOT NULL DEFAULT 0,
    average_cost_usd DECIMAL(20, 8) DEFAULT 0,
    current_price_usd DECIMAL(20, 8) DEFAULT 0,
    total_value_usd DECIMAL(20, 8) DEFAULT 0,
    unrealized_pnl_usd DECIMAL(20, 8) DEFAULT 0,
    unrealized_pnl_percentage DECIMAL(10, 4) DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(portfolio_id, asset_id)
);

-- ============================================================================
-- TRANSACTIONS TABLE
-- ============================================================================
CREATE TYPE transaction_type AS ENUM ('buy', 'sell', 'transfer_in', 'transfer_out', 'reward', 'airdrop', 'staking', 'swap');

CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    transaction_type transaction_type NOT NULL,
    quantity DECIMAL(30, 18) NOT NULL,
    price_per_unit_usd DECIMAL(20, 8),
    total_value_usd DECIMAL(20, 8),
    fee_usd DECIMAL(20, 8) DEFAULT 0,
    transaction_hash TEXT,
    exchange_name TEXT,
    notes TEXT,
    transaction_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WATCHLIST TABLE
-- ============================================================================
CREATE TABLE watchlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    price_alert_enabled BOOLEAN DEFAULT FALSE,
    target_price_usd DECIMAL(20, 8),
    alert_condition TEXT CHECK (alert_condition IN ('above', 'below')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, asset_id)
);

-- ============================================================================
-- PRICE ALERTS TABLE
-- ============================================================================
CREATE TABLE price_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    target_price_usd DECIMAL(20, 8) NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
    is_active BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- DeFi POSITIONS TABLE
-- ============================================================================
CREATE TABLE defi_positions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    protocol_name TEXT NOT NULL,
    position_type TEXT NOT NULL, -- 'lending', 'borrowing', 'liquidity_pool', 'staking', 'farming'
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    quantity DECIMAL(30, 18) NOT NULL,
    current_value_usd DECIMAL(20, 8) DEFAULT 0,
    apy DECIMAL(10, 4) DEFAULT 0,
    rewards_earned_usd DECIMAL(20, 8) DEFAULT 0,
    contract_address TEXT,
    pool_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- API CONNECTIONS TABLE
-- ============================================================================
CREATE TABLE api_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
    provider_name TEXT NOT NULL, -- 'coinbase', 'binance', 'kraken', etc.
    api_key_encrypted TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync TIMESTAMPTZ,
    sync_status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_wallet_address ON user_profiles(wallet_address);

-- Portfolios indexes
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_user_default ON portfolios(user_id, is_default);

-- Assets indexes
CREATE INDEX idx_assets_symbol ON assets(symbol);
CREATE INDEX idx_assets_coingecko_id ON assets(coingecko_id);
CREATE INDEX idx_assets_active ON assets(is_active);

-- Portfolio assets indexes
CREATE INDEX idx_portfolio_assets_portfolio_id ON portfolio_assets(portfolio_id);
CREATE INDEX idx_portfolio_assets_asset_id ON portfolio_assets(asset_id);

-- Transactions indexes
CREATE INDEX idx_transactions_portfolio_id ON transactions(portfolio_id);
CREATE INDEX idx_transactions_asset_id ON transactions(asset_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);

-- Watchlist indexes
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_watchlist_asset_id ON watchlist(asset_id);

-- Price alerts indexes
CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_asset_id ON price_alerts(asset_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active);

-- DeFi positions indexes
CREATE INDEX idx_defi_positions_portfolio_id ON defi_positions(portfolio_id);
CREATE INDEX idx_defi_positions_protocol ON defi_positions(protocol_name);
CREATE INDEX idx_defi_positions_active ON defi_positions(is_active);

-- API connections indexes
CREATE INDEX idx_api_connections_user_id ON api_connections(user_id);
CREATE INDEX idx_api_connections_portfolio_id ON api_connections(portfolio_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE defi_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_connections ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolios policies
CREATE POLICY "Users can view own portfolios" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolios" ON portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolios" ON portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolios" ON portfolios FOR DELETE USING (auth.uid() = user_id);

-- Portfolio assets policies
CREATE POLICY "Users can view own portfolio assets" ON portfolio_assets FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can update own portfolio assets" ON portfolio_assets FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can insert own portfolio assets" ON portfolio_assets FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can delete own portfolio assets" ON portfolio_assets FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);

-- Watchlist policies
CREATE POLICY "Users can view own watchlist" ON watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own watchlist" ON watchlist FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watchlist" ON watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own watchlist" ON watchlist FOR DELETE USING (auth.uid() = user_id);

-- Price alerts policies
CREATE POLICY "Users can view own price alerts" ON price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own price alerts" ON price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own price alerts" ON price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own price alerts" ON price_alerts FOR DELETE USING (auth.uid() = user_id);

-- DeFi positions policies
CREATE POLICY "Users can view own defi positions" ON defi_positions FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can update own defi positions" ON defi_positions FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can insert own defi positions" ON defi_positions FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);
CREATE POLICY "Users can delete own defi positions" ON defi_positions FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM portfolios WHERE id = portfolio_id)
);

-- API connections policies
CREATE POLICY "Users can view own api connections" ON api_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own api connections" ON api_connections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api connections" ON api_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own api connections" ON api_connections FOR DELETE USING (auth.uid() = user_id);

-- Assets table is public (everyone can read)
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_assets_updated_at BEFORE UPDATE ON portfolio_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON price_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_defi_positions_updated_at BEFORE UPDATE ON defi_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_connections_updated_at BEFORE UPDATE ON api_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default portfolio for new users
CREATE OR REPLACE FUNCTION create_default_portfolio()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO portfolios (user_id, name, description, is_default)
    VALUES (NEW.id, 'Main Portfolio', 'Your primary crypto portfolio', TRUE);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default portfolio when user profile is created
CREATE TRIGGER create_default_portfolio_trigger
    AFTER INSERT ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION create_default_portfolio();

-- ============================================================================
-- SEED DATA - Popular Cryptocurrencies
-- ============================================================================
INSERT INTO assets (symbol, name, logo_url, coingecko_id, blockchain) VALUES
('BTC', 'Bitcoin', 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', 'bitcoin', 'bitcoin'),
('ETH', 'Ethereum', 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', 'ethereum', 'ethereum'),
('BNB', 'BNB', 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', 'binancecoin', 'bsc'),
('XRP', 'XRP', 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', 'ripple', 'xrp'),
('ADA', 'Cardano', 'https://assets.coingecko.com/coins/images/975/small/cardano.png', 'cardano', 'cardano'),
('DOGE', 'Dogecoin', 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', 'dogecoin', 'dogecoin'),
('MATIC', 'Polygon', 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png', 'matic-network', 'polygon'),
('SOL', 'Solana', 'https://assets.coingecko.com/coins/images/4128/small/solana.png', 'solana', 'solana'),
('DOT', 'Polkadot', 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png', 'polkadot', 'polkadot'),
('AVAX', 'Avalanche', 'https://assets.coingecko.com/coins/images/12559/small/avalanche-logo.png', 'avalanche-2', 'avalanche'),
('LINK', 'Chainlink', 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', 'chainlink', 'ethereum'),
('UNI', 'Uniswap', 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png', 'uniswap', 'ethereum'),
('LTC', 'Litecoin', 'https://assets.coingecko.com/coins/images/2/small/litecoin.png', 'litecoin', 'litecoin'),
('ATOM', 'Cosmos', 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png', 'cosmos', 'cosmos'),
('USDT', 'Tether', 'https://assets.coingecko.com/coins/images/325/small/Tether.png', 'tether', 'ethereum'),
('USDC', 'USD Coin', 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png', 'usd-coin', 'ethereum');

-- ============================================================================
-- FINAL SETUP COMPLETE
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
