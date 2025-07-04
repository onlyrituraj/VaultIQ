# Supabase Database Setup Instructions

Your application is failing because the database schema hasn't been applied to your Supabase project. The required tables don't exist yet.

## ⚠️ CRITICAL: Database Setup Required

The errors you're seeing indicate that your Supabase database is missing the required tables. **You must run the migration SQL before the application will work.**

## How to Fix This Issue

### Step 1: Access Your Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. If your project is paused, click "Restore project" first

### Step 2: Run the Migration SQL
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the **entire contents** of `supabase/migrations/20241216120000_cryptofolio_portfolio_management.sql`
4. Paste it into the SQL Editor
5. Click **"Run"** to execute the migration

### Step 3: Verify Tables Were Created
1. Go to **"Table Editor"** in the left sidebar
2. You should see these tables:
   - `user_profiles`
   - `portfolios` 
   - `assets`
   - `portfolio_assets`
   - `transactions`
   - `price_alerts`

## What the Migration Creates

The migration script will create:
- **All required tables** with proper relationships
- **Row Level Security (RLS)** policies for data protection
- **Foreign key constraints** between tables
- **Sample data** for testing
- **Triggers** for automatic user profile creation

## Alternative: Quick Setup SQL

If you prefer a minimal setup, you can run this simplified version:

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

1. **Refresh your application** - the errors should be resolved
2. **Test user registration** - try signing up for a new account
3. **Check data flow** - verify that portfolio data loads correctly

## Troubleshooting

### If you still see errors:

1. **Check your .env file** - ensure correct Supabase URL and keys
2. **Verify project status** - make sure your Supabase project isn't paused
3. **Check RLS policies** - ensure they're properly configured
4. **Review table permissions** - verify that the `authenticated` role has access

### Common Issues:

- **"relation does not exist"** = Tables haven't been created yet
- **"foreign key relationship not found"** = Missing table relationships
- **"permission denied"** = RLS policies need to be configured

## Important Notes

- **Run the FULL migration** for complete functionality
- **The simplified version** will only fix immediate errors
- **Sample data** is included for testing purposes
- **All tables use RLS** for security

## Need Help?

If you continue to have issues:
1. Check the browser console for specific error messages
2. Verify your Supabase project settings
3. Ensure your API keys are correctly configured
4. Try the simplified SQL first, then the full migration

Once you've executed the SQL in your Supabase dashboard, refresh your application and the errors should be resolved!