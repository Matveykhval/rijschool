import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://hpkrcviezcinqzhjzjzb.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_cqZE8Ofq154Ag2ABUuY4TQ_6X9YqViZ';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fallback packages shown only if the database table is empty or unreachable
export const DEFAULT_PACKAGES = [
  {
    id: 'default-1',
    name: 'Basis Pakket',
    subtitle: 'Voor leerlingen die snel de basis oppakken (10 ritten van 100 min)',
    price: 1395,
    lessons_count: 20,
    features: [
      '20 rijlessen van 50 min (10 blokuren van 100 min)',
      'Vaste gecertificeerde instructeur',
      'CBR Praktijkexamen inbegrepen',
      'Gratis toegang tot online theorie-omgeving',
      'Ophaalservice thuis, school of station',
    ],
    is_popular: false,
    sort_order: 1,
  },
  {
    id: 'default-2',
    name: 'Compleet Pakket',
    subtitle: 'Onze meest gekozen route naar het rijbewijs (15 ritten van 100 min)',
    price: 1995,
    lessons_count: 30,
    features: [
      '30 rijlessen van 50 min (15 blokuren van 100 min)',
      'CBR Tussentijdse Toets (TTT) inbegrepen',
      'CBR Praktijkexamen inbegrepen',
      'Volledige online theoriecursus + oefenexamens',
      'Vaste instructeur & vaste Volkswagen Golf 8',
    ],
    is_popular: true,
    sort_order: 2,
  },
  {
    id: 'default-3',
    name: 'ZekerSlagen Pakket',
    subtitle: 'Extra rust en ruimte om in je eigen tempo te leren (20 ritten van 100 min)',
    price: 2475,
    lessons_count: 40,
    features: [
      '40 rijlessen van 50 min (20 blokuren van 100 min)',
      'CBR Tussentijdse Toets (TTT) inbegrepen',
      'CBR Praktijkexamen inbegrepen',
      '1x CBR Herexamen garantie inbegrepen',
      'Extra aandacht voor rijangst of faalangst',
    ],
    is_popular: false,
    sort_order: 3,
  },
];
