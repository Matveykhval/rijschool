-- ============================================================================
-- SUPABASE DATABASE SCHEMA & RLS POLICIES FOR LOCAL DRIVING SCHOOL (RIJSCHOOL)
-- Run this entire script in the Supabase SQL Editor
-- ============================================================================

-- Enable UUID generation extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PACKAGES TABLE (Driving Lesson Packages & Pricing)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subtitle TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  lessons_count INTEGER NOT NULL CHECK (lessons_count > 0),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. BOOKINGS TABLE ("Proefles" Trial Lesson Requests)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_datetime TEXT NOT NULL,
  transmission TEXT NOT NULL DEFAULT 'schakel' CHECK (transmission IN ('schakel', 'automaat')),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_packages_updated_at ON public.packages;
CREATE TRIGGER set_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5. RLS POLICIES FOR PACKAGES
--    - Anyone (anon + authenticated) can read packages
--    - Only authenticated admins can insert, update, or delete packages
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public users can view packages" ON public.packages;
CREATE POLICY "Public users can view packages"
  ON public.packages
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert packages" ON public.packages;
CREATE POLICY "Admins can insert packages"
  ON public.packages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update packages" ON public.packages;
CREATE POLICY "Admins can update packages"
  ON public.packages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete packages" ON public.packages;
CREATE POLICY "Admins can delete packages"
  ON public.packages
  FOR DELETE
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 6. RLS POLICIES FOR BOOKINGS
--    - Anyone (anon + authenticated) can insert a new trial lesson booking
--    - Only authenticated admins can view, update (approve/reject), or delete bookings
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public users can create bookings" ON public.bookings;
CREATE POLICY "Public users can create bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
CREATE POLICY "Admins can delete bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 7. SEED INITIAL REALISTIC PACKAGES
-- ----------------------------------------------------------------------------
INSERT INTO public.packages (name, subtitle, price, lessons_count, features, is_popular, sort_order)
VALUES
  (
    'Basis Pakket',
    'Voor leerlingen die snel de basis oppakken',
    1395.00,
    20,
    '["20 rijlessen van 60 minuten", "Vaste gecertificeerde instructeur", "CBR Praktijkexamen inbegrepen", "Gratis toegang tot online theorie-omgeving", "Ophaalservice thuis of op school"]'::jsonb,
    false,
    1
  ),
  (
    'Compleet Pakket',
    'Onze meest gekozen route naar het rijbewijs',
    1995.00,
    30,
    '["30 rijlessen van 60 minuten", "CBR Tussentijdse Toets (TTT) inbegrepen", "CBR Praktijkexamen inbegrepen", "Volledige online theoriecursus + oefenexamens", "Vaste instructeur & vaste lesauto"]'::jsonb,
    true,
    2
  ),
  (
    'ZekerSlagen Pakket',
    'Extra rust en ruimte om in je eigen tempo te leren',
    2475.00,
    38,
    '["38 rijlessen van 60 minuten", "CBR Tussentijdse Toets (TTT) inbegrepen", "CBR Praktijkexamen inbegrepen", "1x CBR Herexamen garantie inbegrepen", "Extra aandacht voor rijangst of faalangst"]'::jsonb,
    false,
    3
  );

