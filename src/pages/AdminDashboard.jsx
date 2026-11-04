import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, DEFAULT_PACKAGES } from '../lib/supabaseClient';
import {
  Calendar,
  Package,
  LogOut,
  Check,
  X,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Clock,
  RefreshCw,
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

  const showNotice = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3500);
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
        newStatus === 'approved'
          ? 'Proefles aanvraag goedgekeurd.'
          : 'Proefles aanvraag afgewezen.'
      );
    } catch (err) {
      console.error('Failed to update booking status:', err);
      alert('Kon status niet bijwerken. Controleer uw verbinding.');
    }
  }

  async function handleDeleteBooking(id) {
    if (!window.confirm('Weet u zeker dat u deze proefles-aanvraag wilt verwijderen?')) {
      return;
    }
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
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setPackages(data || []);
      } else {
        const local = JSON.parse(
          localStorage.getItem('demo_packages') || JSON.stringify(DEFAULT_PACKAGES)
        );
        setPackages(local);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
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
        if (isEditingPackage && pkgForm.id) {
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
          updatedList = [
            ...packages,
            { id: crypto.randomUUID(), ...payload },
          ];
        }
        localStorage.setItem('demo_packages', JSON.stringify(updatedList));
        setPackages(updatedList);
      }

      setShowPackageModal(false);
      showNotice(
        isEditingPackage
          ? 'Lespakket succesvol bijgewerkt.'
          : 'Nieuw lespakket toegevoegd.'
      );
    } catch (err) {
      console.error('Error saving package:', err);
      alert('Fout bij opslaan van lespakket.');
    } finally {
      setSavingPackage(false);
    }
  }

  async function handleDeletePackage(id) {
    if (!window.confirm('Weet u zeker dat u dit lespakket wilt verwijderen?')) {
      return;
    }
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('packages').delete().eq('id', id);
        if (error) throw error;
      } else {
        const updated = packages.filter((p) => p.id !== id);
        localStorage.setItem('demo_packages', JSON.stringify(updated));
      }
      setPackages((prev) => prev.filter((p) => p.id !== id));
      showNotice('Lespakket verwijderd.');
    } catch (err) {
      console.error('Error deleting package:', err);
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
    <div className="min-h-[80vh] bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Beheerpaneel Rijschool KlaverDrive
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Overzicht van binnengekomen proefles-aanvragen en actuele lespakketten
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                fetchBookings();
                fetchPackages();
                showNotice('Gegevens ververst.');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Verversen
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-900 text-xs font-semibold text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              Uitloggen
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {feedback && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-md text-sm font-medium">
            {feedback}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`inline-flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-blue-800 text-blue-900 bg-white rounded-t-md'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Proefles Aanvragen
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-extrabold">
                {pendingCount} nieuw
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`inline-flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'pricing'
                ? 'border-blue-800 text-blue-900 bg-white rounded-t-md'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Lespakketten &amp; Prijzen ({packages.length})
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: BOOKINGS MANAGEMENT                                        */}
        {/* ================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {[
                  { key: 'all', label: `Alle (${bookings.length})` },
                  {
                    key: 'pending',
                    label: `In afwachting (${bookings.filter((b) => b.status === 'pending').length})`,
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
                    className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors ${
                      statusFilter === tab.key
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingBookings ? (
              <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-sm text-slate-500">
                Aanvragen laden...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <p className="text-base font-bold text-slate-800">
                  Geen proefles-aanvragen gevonden in deze weergave.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Nieuwe aanvragen via het formulier op de voorpagina verschijnen direct hier.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((booking) => {
                  const badgeStyle =
                    booking.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : booking.status === 'rejected'
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200';

                  const statusLabel =
                    booking.status === 'approved'
                      ? 'Goedgekeurd / Ingepland'
                      : booking.status === 'rejected'
                      ? 'Afgewezen'
                      : 'Nieuw / In afwachting';

                  return (
                    <div
                      key={booking.id}
                      className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-base font-bold text-slate-900">
                            {booking.name}
                          </h3>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded border ${badgeStyle}`}
                          >
                            {statusLabel}
                          </span>
                          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {booking.transmission === 'automaat'
                              ? 'Automaat'
                              : 'Schakelauto'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
                          <a
                            href={`tel:${booking.phone}`}
                            className="flex items-center gap-1.5 font-semibold text-blue-800 hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {booking.phone}
                          </a>
                          <a
                            href={`mailto:${booking.email}`}
                            className="flex items-center gap-1.5 hover:underline"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {booking.email}
                          </a>
                          <span className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Voorkeur: {booking.preferred_datetime}
                          </span>
                        </div>

                        {booking.message && (
                          <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded p-2.5 mt-1">
                            <strong>Bericht:</strong> {booking.message}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'approved')}
                          disabled={booking.status === 'approved'}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Goedkeuren
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                          disabled={booking.status === 'rejected'}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Afwijzen
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-2 rounded border border-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-500 text-xs font-semibold transition-colors"
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
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PACKAGES & PRICING CRUD                                    */}
        {/* ================================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Wijzigingen in pakketten en prijzen zijn direct zichtbaar op de openbare website.
              </p>
              <button
                type="button"
                onClick={openNewPackageForm}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-md shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nieuw Lespakket Toevoegen
              </button>
            </div>

            {loadingPackages ? (
              <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-sm text-slate-500">
                Lespakketten laden...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const featureList = Array.isArray(pkg.features) ? pkg.features : [];
                  return (
                    <div
                      key={pkg.id}
                      className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-slate-400">
                            Volgorde #{pkg.sort_order || 1}
                          </span>
                          {pkg.is_popular && (
                            <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-0.5 rounded">
                              Meest Gekozen Badge
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900">{pkg.name}</h3>
                        {pkg.subtitle && (
                          <p className="text-xs text-slate-500 mt-0.5">{pkg.subtitle}</p>
                        )}

                        <div className="my-4 py-3 border-y border-slate-100 flex items-baseline justify-between">
                          <span className="text-2xl font-extrabold text-slate-900">
                            € {Number(pkg.price).toLocaleString('nl-NL')}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            {pkg.lessons_count} rijlessen
                          </span>
                        </div>

                        <ul className="space-y-1.5 mb-6 text-xs text-slate-700">
                          {featureList.map((f, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => openEditPackageForm(pkg)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Prijs / Pakket Bewerken
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="inline-flex items-center justify-center p-2.5 rounded border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Pakket verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
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
                <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {isEditingPackage ? 'Lespakket Bewerken' : 'Nieuw Lespakket Toevoegen'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPackageModal(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSavePackage} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Pakketnaam *
                      </label>
                      <input
                        type="text"
                        required
                        value={pkgForm.name}
                        onChange={(e) =>
                          setPkgForm({ ...pkgForm, name: e.target.value })
                        }
                        placeholder="Bijv. Compleet Pakket"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Korte ondertitel
                      </label>
                      <input
                        type="text"
                        value={pkgForm.subtitle}
                        onChange={(e) =>
                          setPkgForm({ ...pkgForm, subtitle: e.target.value })
                        }
                        placeholder="Bijv. Onze meest gekozen route naar het rijbewijs"
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
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
                          placeholder="1995"
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Aantal lessen *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={pkgForm.lessons_count}
                          onChange={(e) =>
                            setPkgForm({ ...pkgForm, lessons_count: e.target.value })
                          }
                          placeholder="30"
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Volgorde
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={pkgForm.sort_order}
                          onChange={(e) =>
                            setPkgForm({ ...pkgForm, sort_order: e.target.value })
                          }
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Onderdelen / Kenmerken (één per regel) *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={pkgForm.featuresText}
                        onChange={(e) =>
                          setPkgForm({ ...pkgForm, featuresText: e.target.value })
                        }
                        placeholder={
                          '30 rijlessen van 60 minuten\nCBR Praktijkexamen inbegrepen\nVaste instructeur'
                        }
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-800 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pkgForm.is_popular}
                        onChange={(e) =>
                          setPkgForm({ ...pkgForm, is_popular: e.target.checked })
                        }
                        className="rounded border-slate-300 text-blue-800 focus:ring-blue-800"
                      />
                      Markeer als &ldquo;Meest Gekozen&rdquo; pakket
                    </label>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowPackageModal(false)}
                        className="px-4 py-2 rounded border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Annuleren
                      </button>
                      <button
                        type="submit"
                        disabled={savingPackage}
                        className="px-5 py-2 rounded bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold"
                      >
                        {savingPackage ? 'Opslaan...' : 'Pakket Opslaan'}
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

