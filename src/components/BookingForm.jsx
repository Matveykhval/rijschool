import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useSiteSettings } from '../lib/siteSettings';
import { CheckCircle2, AlertCircle, Calendar, Send } from 'lucide-react';

export default function BookingForm({ selectedPackageName }) {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_datetime: '',
    transmission: 'schakel',
    message: selectedPackageName ? `Interesse in: ${selectedPackageName}` : '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  // Update message when user clicks a specific package card
  React.useEffect(() => {
    if (selectedPackageName) {
      setFormData((prev) => {
        const packageLine = `Ik heb interesse in het ${selectedPackageName}.`;
        if (!prev.message) {
          return { ...prev, message: packageLine };
        }
        // Replace previous auto-filled package line if the user clicked a different package
        const autoFillPattern = /^(Ik heb interesse in het .+\.|Interesse in: .+)$/m;
        if (autoFillPattern.test(prev.message)) {
          return {
            ...prev,
            message: prev.message.replace(autoFillPattern, packageLine),
          };
        }
        return {
          ...prev,
          message: `${packageLine}\n${prev.message}`,
        };
      });
    }
  }, [selectedPackageName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const bookingPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        preferred_datetime: formData.preferred_datetime.trim(),
        transmission: 'schakel',
        message: formData.message.trim() || null,
        status: 'pending',
      };

      if (isSupabaseConfigured && supabase) {
        const { error: insertError } = await supabase
          .from('bookings')
          .insert([bookingPayload]);

        if (insertError) throw insertError;

        // Trigger the confirmation and instructor notification emails via Edge Function
        supabase.functions
          .invoke('send-booking-email', { body: bookingPayload })
          .catch((emailErr) => {
            console.warn('Could not invoke send-booking-email function:', emailErr);
          });
      } else {
        const localBookings = JSON.parse(localStorage.getItem('demo_bookings') || '[]');
        localBookings.unshift({
          id: crypto.randomUUID(),
          ...bookingPayload,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('demo_bookings', JSON.stringify(localBookings));
      }

      setStatus({
        type: 'success',
        message: `Bedankt voor je aanvraag! We hebben een bevestiging gestuurd naar je e-mailadres en nemen binnen ${settings.response_time_hours} uur contact met je op om de proefles definitief in te plannen.`,
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        preferred_datetime: '',
        transmission: 'schakel',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting booking:', err);
      setStatus({
        type: 'error',
        message: `Er ging iets mis bij het versturen van je aanvraag. Probeer het opnieuw of bel/WhatsApp ons direct op ${settings.phone_display}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-900">
          Aanvraagformulier Proefles
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          De proefles is <strong>geheel gratis</strong> wanneer je aansluitend kiest voor een lespakket.
        </p>
      </div>

      {status.type === 'success' && (
        <div className="mb-6 p-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">{status.message}</div>
        </div>
      )}

      {status.type === 'error' && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-3 text-red-900">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">{status.message}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Voor- en achternaam <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Bijv. Sanne de Vries"
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Telefoonnummer <span className="text-red-600">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="06 - 12 34 56 78"
              className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            E-mailadres <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="sanne@voorbeeld.nl"
            className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="preferred_datetime"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            Gewenste datum en/of dagdeel <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="preferred_datetime"
              name="preferred_datetime"
              type="text"
              required
              value={formData.preferred_datetime}
              onChange={handleChange}
              placeholder="Bijv. Donderdagmiddag of op een zaterdagochtend"
              className="w-full rounded-md border border-slate-300 pl-10 pr-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            Woonplaats / Ophaaladres of korte toelichting (optioneel)
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder={`Bijv. woonplaats (${settings.service_areas}) of eerdere rijervaring...`}
            className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold py-3.5 px-6 rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 text-base"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Aanvraag wordt verstuurd...' : 'Proefles Aanvragen'}
        </button>

        <p className="text-xs text-slate-500 text-center">
          Je zit nergens aan vast. Na de proefles krijg je eerlijk advies over hoeveel lessen je ongeveer nodig hebt.
        </p>
      </form>
    </div>
  );
}
