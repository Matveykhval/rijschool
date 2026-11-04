import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: School info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white font-extrabold text-lg border border-white">
                L
              </div>
              <span className="text-lg font-bold text-white">
                Rijschool KlaverDrive
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Al meer dan 15 jaar een vertrouwd gezicht op de weg. Persoonlijke rijlessen in een rustige, veilige sfeer met een vaste instructeur.
            </p>
            <p className="text-xs text-slate-500">
              KvK: 68492014 &bull; CBR Rijschoolnummer: 1085G9
            </p>
          </div>

          {/* Column 2: Contact details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contactgegevens
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <span>06 - 24 81 90 32 (Bellen of WhatsApp)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <span>info@klaverdrive.nl</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <span>Lesgebied: Utrecht, Nieuwegein, Houten, IJsselstein &amp; omgeving</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <span>Ma t/m Za: 08:00 – 21:00 uur</span>
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
                <a href="#proefles" className="hover:text-white transition-colors">
                  Vrijblijvende proefles aanvragen
                </a>
              </li>
              <li>
                <a href="#pakketten" className="hover:text-white transition-colors">
                  Lespakketten &amp; losse tarieven
                </a>
              </li>
              <li>
                <a
                  href="https://www.cbr.nl"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Rijschool machtigen bij het CBR (DigiD)
                </a>
              </li>
              <li className="pt-3 border-t border-slate-800">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Instructeur Inloggen (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Rijschool KlaverDrive. Alle rechten voorbehouden.</p>
          <p>Gecertificeerd WRM-instructeur &bull; BOVAG Normering</p>
        </div>
      </div>
    </footer>
  );
}

