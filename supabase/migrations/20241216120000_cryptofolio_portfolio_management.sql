-- Cryptofolio Portfolio Management Migration
-- Location: supabase/migrations/20241216120000_cryptofolio_portfolio_management.sql

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'premium', 'standard');
CREATE TYPE public.transaction_type AS ENUM ('buy', 'sell', 'transfer', 'swap', 'stake', 'unstake');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.alert_condition AS ENUM ('above', 'below', 'change_percent');

-- 2. Core Tables
-- User profiles table (intermediary for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'standard'::public.user_role,
    avatar_url TEXT,
    currency_preference TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Portfolios table
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'My Portfolio',
    description TEXT,
    total_value DECIMAL(20,8) DEFAULT 0,
    total_change_24h DECIMAL(10,2) DEFAULT 0,
    total_change_percent_24h DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Assets table (crypto assets metadata)
CREATE TABLE public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo_url TEXT,
    current_price DECIMAL(20,8),
    market_cap DECIMAL(30,2),
    volume_24h DECIMAL(30,2),
    change_24h DECIMAL(10,2),
    change_percent_24h DECIMAL(10,2),
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio assets (user holdings)
CREATE TABLE public.portfolio_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    amount DECIMAL(30,18) NOT NULL DEFAULT 0,
    average_buy_price DECIMAL(20,8),
    total_invested DECIMAL(20,8) DEFAULT 0,
    current_value DECIMAL(20,8) DEFAULT 0,
    profit_loss DECIMAL(20,8) DEFAULT 0,
    profit_loss_percent DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, asset_id)
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    transaction_hash TEXT,
    type public.transaction_type NOT NULL,
    amount DECIMAL(30,18) NOT NULL,
    price_per_unit DECIMAL(20,8),
    total_value DECIMAL(20,8) NOT NULL,
    gas_fee DECIMAL(20,8),
    gas_fee_usd DECIMAL(10,2),
    from_address TEXT,
    to_address TEXT,
    block_number BIGINT,
    status public.transaction_status DEFAULT 'pending'::public.transaction_status,
    notes TEXT,
    profit_loss DECIMAL(20,8),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Price alerts table
CREATE TABLE public.price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    condition public.alert_condition NOT NULL,
    target_price DECIMAL(20,8),
    change_percent DECIMAL(10,2),
    is_enabled BOOLEAN DEFAULT true,
    is_triggered BOOLEAN DEFAULT false,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolio_assets_portfolio_id ON public.portfolio_assets(portfolio_id);
CREATE INDEX idx_portfolio_assets_asset_id ON public.portfolio_assets(asset_id);
CREATE INDEX idx_transactions_portfolio_id ON public.transactions(portfolio_id);
CREATE INDEX idx_transactions_asset_id ON public.transactions(asset_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_asset_id ON public.price_alerts(asset_id);
CREATE INDEX idx_assets_symbol ON public.assets(symbol);

-- 4. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions
CREATE OR REPLACE FUNCTION public.is_portfolio_owner(portfolio_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.portfolios p
    WHERE p.id = portfolio_uuid AND p.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_transaction(transaction_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.transactions t
    JOIN public.portfolios p ON t.portfolio_id = p.id
    WHERE t.id = transaction_uuid AND p.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_portfolio_asset(asset_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.portfolio_assets pa
    JOIN public.portfolios p ON pa.portfolio_id = p.id
    WHERE pa.id = asset_uuid AND p.user_id = auth.uid()
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    default_portfolio_id UUID;
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'standard'::public.user_role)
    );

    -- Create default portfolio
    INSERT INTO public.portfolios (id, user_id, name, description)
    VALUES (
        gen_random_uuid(),
        NEW.id,
        'My Portfolio',
        'Default portfolio created automatically'
    );

    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update portfolio totals
CREATE OR REPLACE FUNCTION public.update_portfolio_totals(portfolio_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_val DECIMAL(20,8) := 0;
    total_change DECIMAL(20,8) := 0;
    total_change_pct DECIMAL(10,2) := 0;
    total_invested DECIMAL(20,8) := 0;
BEGIN
    -- Calculate totals from portfolio assets
    SELECT 
        COALESCE(SUM(pa.current_value), 0),
        COALESCE(SUM(pa.profit_loss), 0),
        COALESCE(SUM(pa.total_invested), 0)
    INTO total_val, total_change, total_invested
    FROM public.portfolio_assets pa
    WHERE pa.portfolio_id = portfolio_uuid;

    -- Calculate percentage change
    IF total_invested > 0 THEN
        total_change_pct := (total_change / total_invested) * 100;
    END IF;

    -- Update portfolio
    UPDATE public.portfolios 
    SET 
        total_value = total_val,
        total_change_24h = total_change,
        total_change_percent_24h = total_change_pct,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = portfolio_uuid;
END;
$$;

-- 6. RLS Policies
-- User profiles
CREATE POLICY "users_own_profile" ON public.user_profiles 
FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Portfolios
CREATE POLICY "users_own_portfolios" ON public.portfolios 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Assets (public read access)
CREATE POLICY "public_can_read_assets" ON public.assets 
FOR SELECT TO public USING (true);

CREATE POLICY "authenticated_can_update_assets" ON public.assets 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Portfolio assets
CREATE POLICY "users_own_portfolio_assets" ON public.portfolio_assets 
FOR ALL USING (public.can_access_portfolio_asset(id)) 
WITH CHECK (public.can_access_portfolio_asset(id));

-- Transactions
CREATE POLICY "users_own_transactions" ON public.transactions 
FOR ALL USING (public.can_access_transaction(id)) 
WITH CHECK (public.can_access_transaction(id));

-- Price alerts
CREATE POLICY "users_own_alerts" ON public.price_alerts 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. Mock Data
DO $$
DECLARE
    user1_auth_id UUID := gen_random_uuid();
    user2_auth_id UUID := gen_random_uuid();
    portfolio1_id UUID := gen_random_uuid();
    portfolio2_id UUID := gen_random_uuid();
    btc_id UUID := gen_random_uuid();
    eth_id UUID := gen_random_uuid();
    ada_id UUID := gen_random_uuid();
    sol_id UUID := gen_random_uuid();
    matic_id UUID := gen_random_uuid();
    dot_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (user1_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'demo@cryptofolio.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Demo User"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'investor@cryptofolio.com', crypt('investor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Crypto Investor"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create assets
    INSERT INTO public.assets (id, symbol, name, logo_url, current_price, market_cap, volume_24h, change_24h, change_percent_24h) VALUES
        (btc_id, 'BTC', 'Bitcoin', 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100&h=100&fit=crop&crop=center', 43250.00, 850000000000, 25000000000, 2150.00, 5.2),
        (eth_id, 'ETH', 'Ethereum', 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=center', 2680.50, 320000000000, 15000000000, 290.30, 12.3),
        (ada_id, 'ADA', 'Cardano', 'https://images.unsplash.com/photo-1640826844110-c5c8e0c7b6b8?w=100&h=100&fit=crop&crop=center', 0.52, 18000000000, 850000000, 0.033, 6.8),
        (sol_id, 'SOL', 'Solana', 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=100&h=100&fit=crop&crop=center', 98.75, 42000000000, 2100000000, 13.45, 15.7),
        (matic_id, 'MATIC', 'Polygon', 'https://images.unsplash.com/photo-1640826844110-c5c8e0c7b6b8?w=100&h=100&fit=crop&crop=center', 0.89, 8500000000, 450000000, 0.075, 9.2),
        (dot_id, 'DOT', 'Polkadot', 'https://images.unsplash.com/photo-1640826844110-c5c8e0c7b6b8?w=100&h=100&fit=crop&crop=center', 7.45, 9200000000, 320000000, 0.29, 4.1);

    -- Create sample portfolio assets for user1
    INSERT INTO public.portfolio_assets (portfolio_id, asset_id, amount, average_buy_price, total_invested, current_value, profit_loss, profit_loss_percent) VALUES
        ((SELECT id FROM public.portfolios WHERE user_id = user1_auth_id LIMIT 1), btc_id, 1.25, 41000.00, 51250.00, 54062.50, 2812.50, 5.49),
        ((SELECT id FROM public.portfolios WHERE user_id = user1_auth_id LIMIT 1), eth_id, 12.5, 2400.00, 30000.00, 33506.25, 3506.25, 11.69),
        ((SELECT id FROM public.portfolios WHERE user_id = user1_auth_id LIMIT 1), sol_id, 150, 85.00, 12750.00, 14812.50, 2062.50, 16.18),
        ((SELECT id FROM public.portfolios WHERE user_id = user1_auth_id LIMIT 1), ada_id, 20000, 0.45, 9000.00, 10400.00, 1400.00, 15.56);

    -- Create sample transactions
    INSERT INTO public.transactions (portfolio_id, asset_id, transaction_hash, type, amount, price_per_unit, total_value, gas_fee, gas_fee_usd, from_address, to_address, block_number, status, profit_loss) VALUES
        ((SELECT id FROM public.portfolios WHERE user_id = user1_auth_id LIMIT 1), btc_id, '0x1234567890abcdef1234567890abcdef12345678', 'buy'::public.transaction_type, 0.5, 41000.00, 20500.00, 0.002, 5.40, '0x742d35Cc6634C0532925a3b8D4C053C532925a3b8D4', '0x8ba1f109551bD432803012645Hac136c22c501e', 18456789, 'completed'::public.transaction_status, 1125.00),
        ((SELECT id FROM public.portfolios WHERE user_id = user1_auth_id LIMIT 1), eth_id, '0xabcdef1234567890abcdef1234567890abcdef12', 'buy'::public.transaction_type, 5.0, 2400.00, 12000.00, 0.0015, 3.60, '0x8ba1f109551bD432803012645Hac136c22c501e', '0x742d35Cc6634C0532925a3b8D4C053C532925a3b8D4', 18456788, 'completed'::public.transaction_status, 1400.00),
        ((SELECT id FROM public.portfolios WHERE user_id = user1_auth_id LIMIT 1), sol_id, '0x567890abcdef1234567890abcdef1234567890ab', 'swap'::public.transaction_type, 75, 85.00, 6375.00, 0.001, 2.40, '0x742d35Cc6634C0532925a3b8D4C053C532925a3b8D4', '0x9cd24f5299b2b4e9a45d5e8496bd4a87132d158f', 18456787, 'completed'::public.transaction_status, 1031.25);

    -- Create sample price alerts
    INSERT INTO public.price_alerts (user_id, asset_id, condition, target_price, is_enabled) VALUES
        (user1_auth_id, btc_id, 'above'::public.alert_condition, 45000.00, true),
        (user1_auth_id, eth_id, 'below'::public.alert_condition, 2500.00, true),
        (user1_auth_id, sol_id, 'above'::public.alert_condition, 100.00, false);

    -- Update portfolio totals
    PERFORM public.update_portfolio_totals((SELECT id FROM public.portfolios WHERE user_id = user1_auth_id LIMIT 1));

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 8. Cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs for test data
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@cryptofolio.com';

    -- Delete in dependency order (children first)
    DELETE FROM public.price_alerts WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.transactions WHERE portfolio_id IN (
        SELECT id FROM public.portfolios WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.portfolio_assets WHERE portfolio_id IN (
        SELECT id FROM public.portfolios WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.portfolios WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;