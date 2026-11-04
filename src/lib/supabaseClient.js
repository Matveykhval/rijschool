import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing or using placeholder values. Falling back to local demo data until configured.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fallback packages shown only if Supabase env variables have not been set yet
export const DEFAULT_PACKAGES = [
  {
    id: 'default-1',
    name: 'Basis Pakket',
    subtitle: 'Voor leerlingen die snel de basis oppakken',
    price: 1395,
    lessons_count: 20,
    features: [
      '20 rijlessen van 60 minuten',
      'Vaste gecertificeerde instructeur',
      'CBR Praktijkexamen inbegrepen',
      'Gratis toegang tot online theorie-omgeving',
      'Ophaalservice thuis of op school',
    ],
    is_popular: false,
    sort_order: 1,
  },
  {
    id: 'default-2',
    name: 'Compleet Pakket',
    subtitle: 'Onze meest gekozen route naar het rijbewijs',
    price: 1995,
    lessons_count: 30,
    features: [
      '30 rijlessen van 60 minuten',
      'CBR Tussentijdse Toets (TTT) inbegrepen',
      'CBR Praktijkexamen inbegrepen',
      'Volledige online theoriecursus + oefenexamens',
      'Vaste instructeur & vaste lesauto',
    ],
    is_popular: true,
    sort_order: 2,
  },
  {
    id: 'default-3',
    name: 'ZekerSlagen Pakket',
    subtitle: 'Extra rust en ruimte om in je eigen tempo te leren',
    price: 2475,
    lessons_count: 38,
    features: [
      '38 rijlessen van 60 minuten',
      'CBR Tussentijdse Toets (TTT) inbegrepen',
      'CBR Praktijkexamen inbegrepen',
      '1x CBR Herexamen garantie inbegrepen',
      'Extra aandacht voor rijangst of faalangst',
    ],
    is_popular: false,
    sort_order: 3,
  },
];

