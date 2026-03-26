-- Run this in your Supabase SQL Editor to fix pricing issues permanently
BEGIN;

-- 1. Standardize existing data to UPPERCASE
UPDATE public.pricing_rules 
SET color_type = UPPER(color_type), 
    print_side = UPPER(print_side);

-- 2. Clean up duplicates that would block the unique constraint
DELETE FROM public.pricing_rules a
USING public.pricing_rules b
WHERE a.id < b.id 
  AND a.shop_id = b.shop_id 
  AND a.page_size = b.page_size 
  AND a.color_type = b.color_type 
  AND a.print_side = b.print_side;

-- 3. DROP old constraints to ensure the new one takes precedence
ALTER TABLE public.pricing_rules DROP CONSTRAINT IF EXISTS pricing_rules_page_size_color_type_print_side_key;
ALTER TABLE public.pricing_rules DROP CONSTRAINT IF EXISTS unique_pricing_rule;
ALTER TABLE public.pricing_rules DROP CONSTRAINT IF EXISTS unique_shop_pricing_rule;

-- 4. Create the final, robust unique constraint
ALTER TABLE public.pricing_rules ADD CONSTRAINT unique_shop_pricing_rule 
UNIQUE (shop_id, page_size, color_type, print_side);

-- 5. Ensure shop settings column allows for the new structure if not already
-- No changes needed if 'settings' is JSONB

COMMIT;
