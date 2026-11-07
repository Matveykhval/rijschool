import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Instagram } from 'lucide-react';
import { useSiteSettings } from '../lib/siteSettings';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-emerald-950 text-slate-300 border-t border-emerald-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: School info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-emerald-700 flex items-center justify-center text-white font-extrabold text-lg border border-white">
                L
              </div>
              <span className="text-lg font-bold text-white">
                Rijschool KlaverDrive
              </span>
            </div>
            <p className="text-sm text-emerald-100/80 leading-relaxed mb-4">
              Persoonlijke rijlessen in een rustige, veilige sfeer met een vaste instructeur in onze {settings.car_model}.
            </p>
            <p className="text-xs text-emerald-300/70">
              KvK: {settings.kvk_number} &bull; CBR Rijschoolnummer: {settings.cbr_number}
            </p>
          </div>

          {/* Column 2: Contact details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact &amp; Lesgebied
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <a
                  href={`tel:${settings.phone_raw}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.phone_display}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Stuur direct een WhatsApp bericht
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Instagram className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <a
                  href="https://www.instagram.com/rijschoolklaverdrive/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram: @rijschoolklaverdrive
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <span>
                  <strong>Lesgebied:</strong> {settings.service_areas}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <span>{settings.opening_hours}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Practical links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Direct regelen
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('proefles');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Vrijblijvende proefles aanvragen
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('pakketten');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Lespakketten &amp; losse tarieven
                </button>
              </li>
              <li>
                <a
                  href="https://www.cbr.nl"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Rijschool machtigen bij het CBR (nr. {settings.cbr_number})
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-300/70 gap-4">
          <p>&copy; {new Date().getFullYear()} Rijschool KlaverDrive. Alle rechten voorbehouden.</p>
          <p>Gecertificeerd WRM-instructeur &bull; CBR Rijschoolnr. {settings.cbr_number}</p>
        </div>
      </div>
    </footer>
  );
}
