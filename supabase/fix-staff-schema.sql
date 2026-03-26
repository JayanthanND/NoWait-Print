-- Run this in your Supabase SQL Editor to fix the staff creation error
BEGIN;

-- 1. Add missing email and phone columns to staff_profiles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_profiles' AND column_name='email') THEN
        ALTER TABLE public.staff_profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff_profiles' AND column_name='phone') THEN
        ALTER TABLE public.staff_profiles ADD COLUMN phone TEXT;
    END IF;
END $$;

-- 2. Make user_id nullable to allow adding staff before they sign up
ALTER TABLE public.staff_profiles ALTER COLUMN user_id DROP NOT NULL;

-- 3. Update unique constraint to prioritize email+shop_id
-- First, drop the old constraint if it exists
ALTER TABLE public.staff_profiles DROP CONSTRAINT IF EXISTS staff_profiles_user_id_shop_id_key;

-- Then add a more flexible unique constraint
-- Note: This requires the columns to exist first (handled above)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'staff_profiles_email_shop_id_key') THEN
        ALTER TABLE public.staff_profiles ADD CONSTRAINT staff_profiles_email_shop_id_key UNIQUE (email, shop_id);
    END IF;
END $$;

COMMIT;
