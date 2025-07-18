-- Update user_profiles table to support enhanced authentication
-- Location: supabase/migrations/20241217000000_update_user_profiles_auth.sql

-- Add missing columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS wallet_type TEXT DEFAULT 'metamask',
ADD COLUMN IF NOT EXISTS wallet_connected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": false, "price_alerts": true, "portfolio_updates": true}'::jsonb;

-- Update the currency_preference column name to preferred_currency for consistency
-- (Skip if already renamed)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'currency_preference') THEN
    UPDATE public.user_profiles SET preferred_currency = currency_preference WHERE preferred_currency IS NULL;
    ALTER TABLE public.user_profiles DROP COLUMN currency_preference;
  END IF;
END $$;

-- Create index for wallet addresses
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address ON public.user_profiles(wallet_address);

-- Update the existing user_profiles RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Create comprehensive RLS policies for user_profiles
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name,
    role,
    preferred_currency,
    notification_preferences,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', ''),
    'standard'::public.user_role,
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', NEW.raw_user_meta_data->>'preferredCurrency', 'USD'),
    COALESCE(
      (NEW.raw_user_meta_data->>'notification_preferences')::jsonb,
      (NEW.raw_user_meta_data->>'notificationPreferences')::jsonb,
      '{"email": true, "push": false, "price_alerts": true, "portfolio_updates": true}'::jsonb
    ),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user profiles updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at timestamp
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create default portfolio for new users
CREATE OR REPLACE FUNCTION public.create_default_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.portfolios (
    user_id,
    name,
    description,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    'My Portfolio',
    'Default portfolio',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for default portfolio creation
DROP TRIGGER IF EXISTS on_profile_created ON public.user_profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_portfolio();

-- Update portfolios table triggers
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update portfolio_assets table triggers  
DROP TRIGGER IF EXISTS update_portfolio_assets_updated_at ON public.portfolio_assets;
CREATE TRIGGER update_portfolio_assets_updated_at
  BEFORE UPDATE ON public.portfolio_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update transactions table triggers
DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update price_alerts table triggers
DROP TRIGGER IF EXISTS update_price_alerts_updated_at ON public.price_alerts;
CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON public.price_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Insert some default assets for testing (if they don't exist)
INSERT INTO public.assets (symbol, name, logo_url, current_price, market_cap, volume_24h, change_24h, change_percent_24h)
VALUES 
  ('BTC', 'Bitcoin', 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', 45000.00, 850000000000, 25000000000, 1200.00, 2.75),
  ('ETH', 'Ethereum', 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', 3200.00, 380000000000, 15000000000, -80.00, -2.44),
  ('USDT', 'Tether', 'https://assets.coingecko.com/coins/images/325/large/Tether.png', 1.00, 95000000000, 45000000000, 0.00, 0.01),
  ('BNB', 'BNB', 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', 320.00, 52000000000, 1800000000, 15.20, 4.98),
  ('USDC', 'USD Coin', 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png', 1.00, 45000000000, 5500000000, 0.00, -0.01)
ON CONFLICT (symbol) DO NOTHING;

-- Comment explaining the migration
COMMENT ON TABLE public.user_profiles IS 'Enhanced user profiles table with wallet integration and preferences';
COMMENT ON COLUMN public.user_profiles.wallet_address IS 'User cryptocurrency wallet address';
COMMENT ON COLUMN public.user_profiles.wallet_type IS 'Type of wallet (metamask, walletconnect, etc.)';
COMMENT ON COLUMN public.user_profiles.notification_preferences IS 'JSON object containing user notification preferences';
