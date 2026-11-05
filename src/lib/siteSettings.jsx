import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const SETTINGS_ROW_NAME = '__SITE_SETTINGS__';

export const DEFAULT_SITE_SETTINGS = {
  // Groene Statistiekenbalk (4 blokken)
  stat_1_value: '15+ jaar',
  stat_1_label: 'Ervaring als rijinstructeur',
  stat_2_value: '88%',
  stat_2_label: 'Slaagt in één keer bij het CBR',
  stat_3_value: '100 min',
  stat_3_label: 'Blokuren (2 lessen van 50 min)',
  stat_4_value: '4.9 / 5',
  stat_4_label: 'Waardering van oud-leerlingen',

  // Lesduur & Losse Tarieven (in €)
  single_lesson_minutes: '50',
  block_lesson_minutes: '100',
  single_lesson_price: '58',
  exam_price: '285',
  ttt_price: '210',
  response_time_hours: '24',

  // Bedrijfs- & Contactgegevens
  phone_display: '06 - 24 81 90 32',
  phone_raw: '0624819032',
  email: 'info@klaverdrive.nl',
  cbr_number: '1085G9',
  kvk_number: '68492014',
  opening_hours: 'Ma t/m Za: 08:00 – 21:00 uur',
  car_model: 'Volkswagen Golf 8 (Handgeschakeld)',
  service_areas:
    'Den Hoorn, Den Haag, Rijswijk, Nootdorp, Ypenburg, Delft en Wateringen',
};

const SiteSettingsContext = createContext({
  settings: DEFAULT_SITE_SETTINGS,
  loadingSettings: true,
  refreshSettings: async () => {},
  saveSettings: async () => {},
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
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

        if (!error && data && data.features && typeof data.features === 'object' && !Array.isArray(data.features)) {
          setSettings({ ...DEFAULT_SITE_SETTINGS, ...data.features });
        } else {
          const local = localStorage.getItem('demo_site_settings');
          if (local) {
            setSettings({ ...DEFAULT_SITE_SETTINGS, ...JSON.parse(local) });
          }
        }
      } else {
        const local = localStorage.getItem('demo_site_settings');
        if (local) {
          setSettings({ ...DEFAULT_SITE_SETTINGS, ...JSON.parse(local) });
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
    const merged = { ...DEFAULT_SITE_SETTINGS, ...newSettings };
    localStorage.setItem('demo_site_settings', JSON.stringify(merged));

    if (isSupabaseConfigured && supabase) {
      const { data: existing } = await supabase
        .from('packages')
        .select('id')
        .eq('name', SETTINGS_ROW_NAME)
        .maybeSingle();

      const payload = {
        name: SETTINGS_ROW_NAME,
        subtitle: 'Systeeminstellingen voor website cijfers en gegevens',
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

