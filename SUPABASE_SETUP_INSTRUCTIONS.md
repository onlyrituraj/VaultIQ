# Supabase Database Setup Instructions

Your application is failing because the database schema hasn't been applied to your Supabase project. The `user_profiles` table and other required tables don't exist yet.

## How to Fix This Issue

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Migration SQL**
   - Copy the entire contents of `supabase/migrations/20241216120000_cryptofolio_portfolio_management.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

4. **Verify the Tables Were Created**
   - Go to "Table Editor" in the left sidebar
   - You should see the following tables:
     - `user_profiles`
     - `portfolios`
     - `assets`
     - `portfolio_assets`
     - `transactions`
     - `price_alerts`

## Alternative: Quick Setup SQL

If you prefer, you can also run this simplified version that creates just the essential tables:

```sql
-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'standard',
    avatar_url TEXT,
    currency_preference TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "users_own_profile" ON public.user_profiles 
FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'standard')
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## After Running the SQL

1. **Test the Connection**
   - Refresh your application
   - Try logging in or signing up
   - The error should be resolved

2. **If You Still See Errors**
   - Check that your `.env` file has the correct Supabase URL and keys
   - Verify that your Supabase project is active (not paused)
   - Make sure Row Level Security policies are properly configured

## Important Notes

- The migration file contains comprehensive schema including portfolios, transactions, and other advanced features
- Running the full migration will give you all the functionality your app expects
- The simplified version above will at least fix the immediate `user_profiles` error
- Make sure to run this in your actual Supabase project, not locally

Once you've executed the SQL in your Supabase dashboard, your application should work properly!