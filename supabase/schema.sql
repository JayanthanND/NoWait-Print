-- ======================================================================
-- NoWait-Print: Supabase Schema Migration
-- Run this in the Supabase SQL Editor to initialize your database
-- ======================================================================

-- Prevent issues with partial runs
BEGIN;

-- 1. Create Tables
-------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL UNIQUE,
    address TEXT,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    upi_id TEXT,
    bank_details TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'operator', -- owner, manager, operator
    status TEXT NOT NULL DEFAULT 'active',
    last_active TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(email, shop_id)
);

CREATE TABLE IF NOT EXISTS public.printers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'B&W', -- B&W, Color
    status TEXT NOT NULL DEFAULT 'online', -- online, offline, printing, maintenance
    queue_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- warning, error, info
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    mobile TEXT NOT NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PENDING',
    payment_status TEXT NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    page_size TEXT NOT NULL,
    color_type TEXT NOT NULL,
    print_side TEXT NOT NULL,
    copies INTEGER NOT NULL DEFAULT 1,
    binding_type TEXT,
    paper_type TEXT,
    gsm TEXT,
    calculated_price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID NOT NULL REFERENCES public.works(id) ON DELETE CASCADE,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Path in Supabase Storage
    file_type TEXT NOT NULL,
    page_count INTEGER NOT NULL DEFAULT 0,
    printable_pages INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pricing Configuration Tables
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
    page_size TEXT NOT NULL,
    color_type TEXT NOT NULL,
    print_side TEXT NOT NULL,
    base_price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(shop_id, page_size, color_type, print_side)
);

CREATE TABLE IF NOT EXISTS public.binding_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.paper_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gsm_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value TEXT NOT NULL UNIQUE,
    price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Handle unique constraints for existing tables
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shops_name_key') THEN
        ALTER TABLE public.shops ADD CONSTRAINT shops_name_key UNIQUE (name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'binding_options_name_key') THEN
        ALTER TABLE public.binding_options ADD CONSTRAINT binding_options_name_key UNIQUE (name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'paper_types_name_key') THEN
        ALTER TABLE public.paper_types ADD CONSTRAINT paper_types_name_key UNIQUE (name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gsm_options_value_key') THEN
        ALTER TABLE public.gsm_options ADD CONSTRAINT gsm_options_value_key UNIQUE (value);
    END IF;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- 2. Enable Row Level Security (RLS)
-------------------------------------------------------------------------
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.binding_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsm_options ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-------------------------------------------------------------------------

-- Shops
DROP POLICY IF EXISTS "Public shops are viewable by everyone" ON public.shops;
CREATE POLICY "Public shops are viewable by everyone" ON public.shops FOR SELECT USING (true);
DROP POLICY IF EXISTS "Shops are fully manageable by authenticated users" ON public.shops;
CREATE POLICY "Shops are fully manageable by authenticated users" ON public.shops FOR ALL USING (auth.role() = 'authenticated');

-- Orders
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can view specific order" ON public.orders;
CREATE POLICY "Public can view specific order" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Orders are manageable by authenticated users" ON public.orders;
CREATE POLICY "Orders are manageable by authenticated users" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

-- Works
DROP POLICY IF EXISTS "Public can insert works" ON public.works;
CREATE POLICY "Public can insert works" ON public.works FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can view works" ON public.works;
CREATE POLICY "Public can view works" ON public.works FOR SELECT USING (true);
DROP POLICY IF EXISTS "Works are manageable by authenticated users" ON public.works;
CREATE POLICY "Works are manageable by authenticated users" ON public.works FOR ALL USING (auth.role() = 'authenticated');

-- Files
DROP POLICY IF EXISTS "Public can insert files" ON public.files;
CREATE POLICY "Public can insert files" ON public.files FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public can view files" ON public.files;
CREATE POLICY "Public can view files" ON public.files FOR SELECT USING (true);
DROP POLICY IF EXISTS "Files are manageable by authenticated users" ON public.files;
CREATE POLICY "Files are manageable by authenticated users" ON public.files FOR ALL USING (auth.role() = 'authenticated');

-- Pricing & Config
DROP POLICY IF EXISTS "Pricing rules viewable by everyone" ON public.pricing_rules;
CREATE POLICY "Pricing rules viewable by everyone" ON public.pricing_rules FOR SELECT USING (true);
DROP POLICY IF EXISTS "Pricing rules manageable by authenticated users" ON public.pricing_rules;
CREATE POLICY "Pricing rules manageable by authenticated users" ON public.pricing_rules FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Binding options viewable by everyone" ON public.binding_options;
CREATE POLICY "Binding options viewable by everyone" ON public.binding_options FOR SELECT USING (true);
DROP POLICY IF EXISTS "Binding options manageable by authenticated users" ON public.binding_options;
CREATE POLICY "Binding options manageable by authenticated users" ON public.binding_options FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Paper types viewable by everyone" ON public.paper_types;
CREATE POLICY "Paper types viewable by everyone" ON public.paper_types FOR SELECT USING (true);
DROP POLICY IF EXISTS "Paper types manageable by authenticated users" ON public.paper_types;
CREATE POLICY "Paper types manageable by authenticated users" ON public.paper_types FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "GSM options viewable by everyone" ON public.gsm_options;
CREATE POLICY "GSM options viewable by everyone" ON public.gsm_options FOR SELECT USING (true);
DROP POLICY IF EXISTS "GSM options manageable by authenticated users" ON public.gsm_options;
CREATE POLICY "GSM options manageable by authenticated users" ON public.gsm_options FOR ALL USING (auth.role() = 'authenticated');

-- 4. Create Storage Bucket
-------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('print-files', 'print-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'print-files' );

DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;
CREATE POLICY "Allow public viewing" ON storage.objects FOR SELECT USING ( bucket_id = 'print-files' );

DROP POLICY IF EXISTS "Allow admin full access" ON storage.objects;
CREATE POLICY "Allow admin full access" ON storage.objects FOR ALL USING ( auth.role() = 'authenticated' AND bucket_id = 'print-files' );

-- 5. Seed Data
-------------------------------------------------------------------------
-- Default Shop
INSERT INTO public.shops (name) VALUES ('NoWait Print Express Default') ON CONFLICT (name) DO NOTHING;

-- Seed Pricing Rules (A4 sizes)
INSERT INTO public.pricing_rules (page_size, color_type, print_side, base_price) VALUES
('A4', 'BW', 'SINGLE', 2.0),
('A4', 'BW', 'DOUBLE', 1.5),
('A4', 'COLOR', 'SINGLE', 10.0),
('A4', 'COLOR', 'DOUBLE', 8.0),
-- A3 sizes
('A3', 'BW', 'SINGLE', 5.0),
('A3', 'COLOR', 'SINGLE', 20.0)
ON CONFLICT (page_size, color_type, print_side) DO NOTHING;

-- Seed Binding Options
INSERT INTO public.binding_options (name, price) VALUES
('Spiral', 50.0),
('Hardcover', 150.0),
('Staple', 10.0),
('Tape', 20.0),
('None', 0.0)
ON CONFLICT (name) DO NOTHING;

-- Seed Paper Types
INSERT INTO public.paper_types (name, price) VALUES
('Regular', 0.0),
('Glossy', 5.0),
('Bond', 2.0)
ON CONFLICT (name) DO NOTHING;

-- Seed GSM Options
INSERT INTO public.gsm_options (value, price) VALUES
('75', 0.0),
('80', 1.0),
('100', 3.0),
('300', 10.0)
ON CONFLICT (value) DO NOTHING;

COMMIT;
-- End of Migration
