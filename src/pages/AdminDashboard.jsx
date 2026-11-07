import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, DEFAULT_PACKAGES } from '../lib/supabaseClient';
import {
  useSiteSettings,
  SETTINGS_ROW_NAME,
  DEFAULT_SITE_SETTINGS,
} from '../lib/siteSettings';
import {
  Calendar,
  Package,
  Sliders,
  LogOut,
  Check,
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
  const [activeTab, setActiveTab] = useState('bookings');

  // Global Site Settings
  const { settings, saveSettings, refreshSettings } = useSiteSettings();
  const [settingsForm, setSettingsForm] = useState(DEFAULT_SITE_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Packages State
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [pkgForm, setPkgForm] = useState(EMPTY_PACKAGE_FORM);
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [savingPackage, setSavingPackage] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchBookings();
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
  // BOOKINGS CRUD
  // ---------------------------------------------------------------------------
  async function fetchBookings() {
    setLoadingBookings(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } else {
        const local = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
        setBookings(local);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  }

  async function handleUpdateBookingStatus(id, newStatus) {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) throw error;
      } else {
        const updated = bookings.map((b) =>
          b.id === id ? { ...b, status: newStatus } : b
        );
        localStorage.setItem('demo_bookings', JSON.stringify(updated));
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      showNotice(
        newStatus === 'approved' ? 'Aanvraag goedgekeurd.' : 'Aanvraag afgewezen.'
      );
    } catch (err) {
      console.error('Failed to update booking status:', err);
      alert('Kon status niet bijwerken.');
    }
  }

  async function handleDeleteBooking(id) {
    if (!window.confirm('Aanvraag definitief verwijderen?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
      } else {
        const updated = bookings.filter((b) => b.id !== id);
        localStorage.setItem('demo_bookings', JSON.stringify(updated));
      }
      setBookings((prev) => prev.filter((b) => b.id !== id));
      showNotice('Aanvraag verwijderd.');
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  }

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

  const filteredBookings = bookings.filter((b) =>
    statusFilter === 'all' ? true : b.status === statusFilter
  );

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Dedicated Utilitarian Admin Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span className="font-bold text-sm tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              KlaverDrive Admin
            </span>

            <nav className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'bookings'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Aanvragen
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[11px] px-1.5 py-0.2 rounded font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'pricing'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Pakketten ({packages.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Statistieken
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
                fetchBookings();
                fetchPackages();
                refreshSettings();
                showNotice('Ververst.');
              }}
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800"
              title="Gegevens verversen"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-red-900/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
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
        {/* TAB 1: BOOKINGS TABLE                                             */}
        {/* ================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-lg font-bold text-slate-900">Proefles Aanvragen</h1>
              <div className="flex items-center gap-1.5">
                {[
                  { key: 'all', label: `Alle (${bookings.length})` },
                  {
                    key: 'pending',
                    label: `Openstaand (${bookings.filter((b) => b.status === 'pending').length})`,
                  },
                  {
                    key: 'approved',
                    label: `Goedgekeurd (${bookings.filter((b) => b.status === 'approved').length})`,
                  },
                  {
                    key: 'rejected',
                    label: `Afgewezen (${bookings.filter((b) => b.status === 'rejected').length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                      statusFilter === tab.key
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingBookings ? (
              <div className="bg-white border border-slate-200 rounded p-6 text-center text-xs text-slate-500">
                Laden...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded p-8 text-center text-sm text-slate-500">
                Geen aanvragen gevonden.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase">
                      <th className="py-2.5 px-3 font-bold">Aangevraagd</th>
                      <th className="py-2.5 px-3 font-bold">Naam</th>
                      <th className="py-2.5 px-3 font-bold">Contact</th>
                      <th className="py-2.5 px-3 font-bold">Voorkeur Moment</th>
                      <th className="py-2.5 px-3 font-bold">Opmerking</th>
                      <th className="py-2.5 px-3 font-bold">Status</th>
                      <th className="py-2.5 px-3 font-bold text-right">Actie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredBookings.map((booking) => {
                      const statusBadge =
                        booking.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-900'
                          : booking.status === 'rejected'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-amber-100 text-amber-900';

                      const statusLabel =
                        booking.status === 'approved'
                          ? 'Goedgekeurd'
                          : booking.status === 'rejected'
                          ? 'Afgewezen'
                          : 'Nieuw';

                      const formattedDate = booking.created_at
                        ? new Date(booking.created_at).toLocaleString('nl-NL', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—';

                      return (
                        <tr key={booking.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                            {formattedDate}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {booking.name}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <a
                              href={`tel:${booking.phone}`}
                              className="font-semibold text-blue-700 hover:underline block"
                            >
                              {booking.phone}
                            </a>
                            <span className="text-slate-500">{booking.email}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-800">
                            {booking.preferred_datetime}
                          </td>
                          <td className="py-3 px-3 text-slate-600 max-w-xs">
                            {booking.message || '—'}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[11px] ${statusBadge}`}
                            >
                              {statusLabel}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateBookingStatus(booking.id, 'approved')
                              }
                              disabled={booking.status === 'approved'}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white font-semibold"
                              title="Goedkeuren"
                            >
                              <Check className="w-3 h-3" />
                              OK
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateBookingStatus(booking.id, 'rejected')
                              }
                              disabled={booking.status === 'rejected'}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 disabled:opacity-30 text-white font-semibold"
                              title="Afwijzen"
                            >
                              <X className="w-3 h-3" />
                              Nee
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="inline-flex items-center p-1 rounded text-slate-400 hover:text-red-600"
                              title="Verwijderen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-2 rounded"
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
                            <li key={idx} className=" truncate">
                              • {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => openEditPackageForm(pkg)}
                          className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-1.5 px-2 rounded"
                        >
                          <Pencil className="w-3 h-3" />
                          Bewerken
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="p-1.5 rounded border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50"
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
                      className="text-slate-400 hover:text-slate-600"
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
                        className="px-3 py-1.5 rounded border border-slate-300 font-semibold text-slate-700"
                      >
                        Annuleren
                      </button>
                      <button
                        type="submit"
                        disabled={savingPackage}
                        className="px-4 py-1.5 rounded bg-slate-900 text-white font-semibold"
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

        {/* ================================================================= */}
        {/* TAB 3: STATISTIEKEN ONLY                                          */}
        {/* ================================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSiteSettings} className="max-w-xl space-y-5">
            <h1 className="text-lg font-bold text-slate-900">
              Statistieken (Groene Balk)
            </h1>

            <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ervaring (bijv. 15+ jaar)
                  </label>
                  <input
                    type="text"
                    name="stat_1_value"
                    value={settingsForm.stat_1_value}
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
                    value={settingsForm.stat_2_value}
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
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded text-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {savingSettings ? 'Opslaan...' : 'Wijzigingen Opslaan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
