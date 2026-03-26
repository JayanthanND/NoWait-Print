-- 1. Add slug column to shops table
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Generate slugs for existing shops (replace spaces with hyphens and lowercase)
UPDATE public.shops 
SET slug = LOWER(REPLACE(name, ' ', '-'))
WHERE slug IS NULL;

-- 3. Add unique constraint and NOT NULL
ALTER TABLE public.shops ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.shops ADD CONSTRAINT shops_slug_unique UNIQUE (slug);

-- 4. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_shops_slug ON public.shops(slug);
