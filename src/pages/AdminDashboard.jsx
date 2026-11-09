import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, DEFAULT_PACKAGES } from '../lib/supabaseClient';
import {
  useSiteSettings,
  SETTINGS_ROW_NAME,
  DEFAULT_SITE_SETTINGS,
} from '../lib/siteSettings';
import {
  Package,
  Sliders,
  LogOut,
  X,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Save,
  ExternalLink,
} from 'lucide-react';

const EMPTY_PACKAGE_FORM = {
  id: null,
  name: '',
  subtitle: '',
  price: '',
  lessons_count: '',
  featuresText: '',
  is_popular: false,
  sort_order: 1,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');

  // Global Site Settings
  const { settings, saveSettings, refreshSettings } = useSiteSettings();
  const [settingsForm, setSettingsForm] = useState(DEFAULT_SITE_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);

  // Packages State
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [pkgForm, setPkgForm] = useState(EMPTY_PACKAGE_FORM);
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [savingPackage, setSavingPackage] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  const showNotice = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  // ---------------------------------------------------------------------------
  // PACKAGES CRUD
  // ---------------------------------------------------------------------------
  async function fetchPackages() {
    setLoadingPackages(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .neq('name', SETTINGS_ROW_NAME)
          .order('sort_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setPackages(data);
        } else {
          const seedRows = DEFAULT_PACKAGES.map(
            ({
              name,
              subtitle,
              price,
              lessons_count,
              features,
              is_popular,
              sort_order,
            }) => ({
              name,
              subtitle,
              price,
              lessons_count,
              features,
              is_popular,
              sort_order,
            })
          );
          const { data: inserted, error: seedError } = await supabase
            .from('packages')
            .insert(seedRows)
            .select('*');

          if (!seedError && inserted && inserted.length > 0) {
            setPackages(inserted);
          } else {
            setPackages(DEFAULT_PACKAGES);
          }
        }
      } else {
        const local = JSON.parse(
          localStorage.getItem('demo_packages') || JSON.stringify(DEFAULT_PACKAGES)
        ).filter((p) => p.name !== SETTINGS_ROW_NAME);
        setPackages(local);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setPackages(DEFAULT_PACKAGES);
    } finally {
      setLoadingPackages(false);
    }
  }

  function openNewPackageForm() {
    setPkgForm({
      ...EMPTY_PACKAGE_FORM,
      sort_order: packages.length + 1,
    });
    setIsEditingPackage(false);
    setShowPackageModal(true);
  }

  function openEditPackageForm(pkg) {
    const featuresArray = Array.isArray(pkg.features) ? pkg.features : [];
    setPkgForm({
      id: pkg.id,
      name: pkg.name,
      subtitle: pkg.subtitle || '',
      price: pkg.price,
      lessons_count: pkg.lessons_count,
      featuresText: featuresArray.join('\n'),
      is_popular: Boolean(pkg.is_popular),
      sort_order: pkg.sort_order || 1,
    });
    setIsEditingPackage(true);
    setShowPackageModal(true);
  }

  async function handleSavePackage(e) {
    e.preventDefault();
    setSavingPackage(true);

    const parsedFeatures = pkgForm.featuresText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      name: pkgForm.name.trim(),
      subtitle: pkgForm.subtitle.trim() || null,
      price: Number(pkgForm.price),
      lessons_count: Number(pkgForm.lessons_count),
      features: parsedFeatures,
      is_popular: Boolean(pkgForm.is_popular),
      sort_order: Number(pkgForm.sort_order) || 1,
    };

    try {
      if (isSupabaseConfigured && supabase) {
        if (
          isEditingPackage &&
          pkgForm.id &&
          !String(pkgForm.id).startsWith('default-')
        ) {
          const { error } = await supabase
            .from('packages')
            .update(payload)
            .eq('id', pkgForm.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('packages').insert([payload]);
          if (error) throw error;
        }
        await fetchPackages();
      } else {
        let updatedList;
        if (isEditingPackage && pkgForm.id) {
          updatedList = packages.map((p) =>
            p.id === pkgForm.id ? { ...p, ...payload } : p
          );
        } else {
          updatedList = [...packages, { id: crypto.randomUUID(), ...payload }];
        }
        localStorage.setItem('demo_packages', JSON.stringify(updatedList));
        setPackages(updatedList);
      }

      setShowPackageModal(false);
      showNotice(isEditingPackage ? 'Pakket bijgewerkt.' : 'Pakket toegevoegd.');
    } catch (err) {
      console.error('Error saving package:', err);
      alert('Fout bij opslaan.');
    } finally {
      setSavingPackage(false);
    }
  }

  async function handleDeletePackage(id) {
    if (!window.confirm('Dit pakket definitief verwijderen?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('packages').delete().eq('id', id);
        if (error) throw error;
      } else {
        const updated = packages.filter((p) => p.id !== id);
        localStorage.setItem('demo_packages', JSON.stringify(updated));
      }
      setPackages((prev) => prev.filter((p) => p.id !== id));
      showNotice('Pakket verwijderd.');
    } catch (err) {
      console.error('Error deleting package:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // SITE SETTINGS SAVE
  // ---------------------------------------------------------------------------
  function handleSettingsChange(e) {
    const { name, value } = e.target;
    setSettingsForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveSiteSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await saveSettings(settingsForm);
      showNotice('Instellingen opgeslagen.');
    } catch (err) {
      console.error('Error saving site settings:', err);
      alert('Kon instellingen niet opslaan.');
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleSignOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      sessionStorage.removeItem('demo_admin_authenticated');
    }
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Dedicated Utilitarian Admin Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="font-bold text-sm tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              KlaverDrive Beheer
            </span>

            <nav className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Site Instellingen
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Pakketten ({packages.length})
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Website
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={() => {
                fetchPackages();
                refreshSettings();
                showNotice('Ververst.');
              }}
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Gegevens verversen"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-red-900/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Uitloggen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {feedback && (
          <div className="mb-4 bg-slate-900 text-white px-4 py-2.5 rounded text-xs font-semibold inline-block shadow">
            ✓ {feedback}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: SITE SETTINGS                                              */}
        {/* ================================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSiteSettings} className="max-w-3xl space-y-6">
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Website Instellingen
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pas hier snel statistieken, losse tarieven en contactgegevens aan.
              </p>
            </div>

            {/* Section 1: Statistieken */}
            <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. Statistieken (Groene Balk)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ervaring (bijv. 15+ jaar)
                  </label>
                  <input
                    type="text"
                    name="stat_1_value"
                    value={settingsForm.stat_1_value || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slagingspercentage (bijv. 88%)
                  </label>
                  <input
                    type="text"
                    name="stat_2_value"
                    value={settingsForm.stat_2_value || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Losse Tarieven & Lesduur */}
            <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                2. Losse Tarieven &amp; Lesduur
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Losse rijles prijs (€)
                  </label>
                  <input
                    type="text"
                    name="single_lesson_price"
                    value={settingsForm.single_lesson_price || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Los praktijkexamen (€)
                  </label>
                  <input
                    type="text"
                    name="exam_price"
                    value={settingsForm.exam_price || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tussentijdse Toets (€)
                  </label>
                  <input
                    type="text"
                    name="ttt_price"
                    value={settingsForm.ttt_price || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duur 1 les (minuten)
                  </label>
                  <input
                    type="text"
                    name="single_lesson_minutes"
                    value={settingsForm.single_lesson_minutes || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duur blokuur (minuten)
                  </label>
                  <input
                    type="text"
                    name="block_lesson_minutes"
                    value={settingsForm.block_lesson_minutes || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact & Bedrijfsgegevens */}
            <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                3. Contact- &amp; Bedrijfsgegevens
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefoonnummer weergave
                  </label>
                  <input
                    type="text"
                    name="phone_display"
                    value={settingsForm.phone_display || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefoonnummer (zonder spaties, voor bellen &amp; WhatsApp)
                  </label>
                  <input
                    type="text"
                    name="phone_raw"
                    value={settingsForm.phone_raw || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mailadres
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settingsForm.email || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Openingstijden
                  </label>
                  <input
                    type="text"
                    name="opening_hours"
                    value={settingsForm.opening_hours || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lesauto
                  </label>
                  <input
                    type="text"
                    name="car_model"
                    value={settingsForm.car_model || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lesgebied (steden)
                  </label>
                  <input
                    type="text"
                    name="service_areas"
                    value={settingsForm.service_areas || ''}
                    onChange={handleSettingsChange}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded text-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {savingSettings ? 'Opslaan...' : 'Wijzigingen Opslaan'}
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PACKAGES CRUD                                              */}
        {/* ================================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-slate-900">Lespakketten</h1>
              <button
                type="button"
                onClick={openNewPackageForm}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-2 rounded cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Pakket Toevoegen
              </button>
            </div>

            {loadingPackages ? (
              <div className="bg-white border border-slate-200 rounded p-6 text-center text-xs text-slate-500">
                Laden...
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-4 ${
                  packages.length >= 4
                    ? 'md:grid-cols-2 lg:grid-cols-4'
                    : 'md:grid-cols-3'
                }`}
              >
                {packages.map((pkg) => {
                  const featureList = Array.isArray(pkg.features) ? pkg.features : [];
                  return (
                    <div
                      key={pkg.id}
                      className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-slate-900 text-sm">{pkg.name}</h3>
                          {pkg.is_popular && (
                            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                              Meest Gekozen
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{pkg.subtitle}</p>

                        <div className="py-2 mb-3 border-y border-slate-100 flex items-baseline justify-between">
                          <span className="text-lg font-extrabold text-slate-900">
                            € {Number(pkg.price).toLocaleString('nl-NL')}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            {pkg.lessons_count} lessen
                          </span>
                        </div>

                        <ul className="space-y-1 mb-4 text-xs text-slate-600">
                          {featureList.map((f, idx) => (
                            <li key={idx} className="truncate">
                              • {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => openEditPackageForm(pkg)}
                          className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-1.5 px-2 rounded cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          Bewerken
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="p-1.5 rounded border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal for Add / Edit Package */}
            {showPackageModal && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                <div className="bg-white border border-slate-200 rounded max-w-md w-full p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">
                      {isEditingPackage ? 'Pakket Bewerken' : 'Nieuw Pakket'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPackageModal(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSavePackage} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Naam *
                      </label>
                      <input
                        type="text"
                        required
                        value={pkgForm.name}
                        onChange={(e) =>
                          setPkgForm({ ...pkgForm, name: e.target.value })
                        }
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Ondertitel
                      </label>
                      <input
                        type="text"
                        value={pkgForm.subtitle}
                        onChange={(e) =>
                          setPkgForm({ ...pkgForm, subtitle: e.target.value })
                        }
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Prijs (€) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={pkgForm.price}
                          onChange={(e) =>
                            setPkgForm({ ...pkgForm, price: e.target.value })
                          }
                          className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Lessen *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={pkgForm.lessons_count}
                          onChange={(e) =>
                            setPkgForm({ ...pkgForm, lessons_count: e.target.value })
                          }
                          className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Volgorde
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={pkgForm.sort_order}
                          onChange={(e) =>
                            setPkgForm({ ...pkgForm, sort_order: e.target.value })
                          }
                          className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Kenmerken (één per regel) *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={pkgForm.featuresText}
                        onChange={(e) =>
                          setPkgForm({ ...pkgForm, featuresText: e.target.value })
                        }
                        className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-sm"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-800 font-semibold cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={pkgForm.is_popular}
                        onChange={(e) =>
                          setPkgForm({ ...pkgForm, is_popular: e.target.checked })
                        }
                      />
                      Markeer als &ldquo;Meest Gekozen&rdquo;
                    </label>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowPackageModal(false)}
                        className="px-3 py-1.5 rounded border border-slate-300 font-semibold text-slate-700 cursor-pointer"
                      >
                        Annuleren
                      </button>
                      <button
                        type="submit"
                        disabled={savingPackage}
                        className="px-4 py-1.5 rounded bg-slate-900 text-white font-semibold cursor-pointer"
                      >
                        {savingPackage ? 'Opslaan...' : 'Opslaan'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
