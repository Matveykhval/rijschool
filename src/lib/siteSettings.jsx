import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const SETTINGS_ROW_NAME = '__SITE_SETTINGS__';

export const SITE_INFO = {
  // Groene Statistiekenbalk vaste waarden & labels
  stat_1_label: 'Ervaring als rijinstructeur',
  stat_2_label: 'Slaagt in één keer bij het CBR',
  stat_3_value: '100 min',
  stat_3_label: 'Blokuren (2 lessen van 50 min)',
  stat_4_value: '5/5',
  stat_4_label: 'Waardering van oud-leerlingen',

  // Lesduur & Losse Tarieven (in €)
  single_lesson_minutes: '50',
  block_lesson_minutes: '100',
  single_lesson_price: '58',
  exam_price: '285',
  ttt_price: '210',
  response_time_hours: '24',

  // Bedrijfs- & Contactgegevens
  phone_display: '06 - 84 27 66 49',
  phone_raw: '0684276649',
  whatsapp_url:
    'https://wa.me/31684276649?text=Hoi!%20Ik%20heb%20interesse%20in%20een%20proefles%20bij%20Rijschool%20KlaverDrive.',
  email: 'info@klaverdrive.nl',
  cbr_number: '1085G9',
  kvk_number: '92860605',
  opening_hours: 'Ma t/m Za: 08:00 – 21:00 uur',
  car_model: 'Volkswagen Golf 8 (Handgeschakeld)',
  service_areas:
    'Den Hoorn, Den Haag, Rijswijk, Nootdorp, Ypenburg, Delft en Wateringen',
};

export const DEFAULT_SITE_SETTINGS = {
  ...SITE_INFO,
  stat_1_value: '15+ jaar',
  stat_2_value: '88%',
};

function sanitizeSettings(raw) {
  const merged = {
    ...DEFAULT_SITE_SETTINGS,
    ...(raw && typeof raw === 'object' ? raw : {}),
  };

  // Ensure deprecated phone number is never loaded from old cache/DB rows
  if (
    merged.phone_raw === '0624819032' ||
    String(merged.phone_display).includes('24 81 90 32')
  ) {
    merged.phone_display = DEFAULT_SITE_SETTINGS.phone_display;
    merged.phone_raw = DEFAULT_SITE_SETTINGS.phone_raw;
    merged.whatsapp_url = DEFAULT_SITE_SETTINGS.whatsapp_url;
  } else if (merged.phone_raw) {
    const cleanDigits = String(merged.phone_raw).replace(/\D/g, '');
    const intlPhone = cleanDigits.startsWith('0')
      ? `31${cleanDigits.slice(1)}`
      : cleanDigits;
    merged.whatsapp_url = `https://wa.me/${intlPhone}?text=Hoi!%20Ik%20heb%20interesse%20in%20een%20proefles%20bij%20Rijschool%20KlaverDrive.`;
  }

  return merged;
}

function getInitialSettings() {
  try {
    const cached = localStorage.getItem('demo_site_settings');
    if (cached) {
      const parsed = JSON.parse(cached);
      return sanitizeSettings(parsed);
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_SITE_SETTINGS;
}

const SiteSettingsContext = createContext({
  settings: DEFAULT_SITE_SETTINGS,
  loadingSettings: true,
  refreshSettings: async () => {},
  saveSettings: async () => {},
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('name', SETTINGS_ROW_NAME)
          .maybeSingle();

        if (
          !error &&
          data &&
          data.features &&
          typeof data.features === 'object' &&
          !Array.isArray(data.features)
        ) {
          const merged = sanitizeSettings(data.features);
          setSettings(merged);
          localStorage.setItem('demo_site_settings', JSON.stringify(merged));
        }
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async (newSettings) => {
    const merged = sanitizeSettings(newSettings);

    localStorage.setItem('demo_site_settings', JSON.stringify(merged));

    if (isSupabaseConfigured && supabase) {
      const { data: existing } = await supabase
        .from('packages')
        .select('id')
        .eq('name', SETTINGS_ROW_NAME)
        .maybeSingle();

      const payload = {
        name: SETTINGS_ROW_NAME,
        subtitle: 'Systeeminstellingen voor website statistieken',
        price: 0,
        lessons_count: 1,
        features: merged,
        is_popular: false,
        sort_order: -999,
      };

      if (existing && existing.id) {
        const { error } = await supabase
          .from('packages')
          .update(payload)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('packages').insert([payload]);
        if (error) throw error;
      }
    }

    setSettings(merged);
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loadingSettings,
        refreshSettings: fetchSettings,
        saveSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
