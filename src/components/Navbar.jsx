import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../lib/siteSettings';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { settings } = useSiteSettings();

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top utility bar - dark green theme */}
      <div className="bg-emerald-950 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-white">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              CBR Erkend Opleider (Rijschoolnr. {settings.cbr_number})
            </span>
            <span className="hidden md:inline text-emerald-700">|</span>
            <span className="hidden md:inline text-emerald-100">
              Regio {settings.service_areas}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.phone_raw}`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              Bel of WhatsApp: {settings.phone_display}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-emerald-800 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm border-2 border-white ring-2 ring-emerald-800">
              L
            </div>
            <div>
              <span className="block text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Rijschool <span className="text-emerald-800">KlaverDrive</span>
              </span>
              <span className="block text-xs text-slate-500 font-medium mt-0.5">
                Vertrouwd &amp; veilig op weg
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            {isHome ? (
              <>
                <button
                  onClick={() => scrollToSection('instructeur')}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Over de Instructeur
                </button>
                <button
                  onClick={() => scrollToSection('pakketten')}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Lespakketten &amp; Tarieven
                </button>
                <button
                  onClick={() => scrollToSection('werkwijze')}
                  className="hover:text-emerald-800 transition-colors"
                >
                  Werkwijze
                </button>
                <button
                  onClick={() => scrollToSection('proefles')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-md font-bold shadow-sm transition-colors"
                >
                  Boek een Proefles
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="text-emerald-800 hover:underline font-semibold"
              >
                &larr; Terug naar de hoofdpagina
              </Link>
            )}
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
              aria-label="Menu openen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-3">
          {isHome ? (
            <>
              <button
                onClick={() => scrollToSection('instructeur')}
                className="block w-full text-left py-2 text-base font-semibold text-slate-800 border-b border-slate-100"
              >
                Over de Instructeur
              </button>
              <button
                onClick={() => scrollToSection('pakketten')}
                className="block w-full text-left py-2 text-base font-semibold text-slate-800 border-b border-slate-100"
              >
                Lespakketten &amp; Tarieven
              </button>
              <button
                onClick={() => scrollToSection('werkwijze')}
                className="block w-full text-left py-2 text-base font-semibold text-slate-800 border-b border-slate-100"
              >
                Werkwijze
              </button>
              <button
                onClick={() => scrollToSection('proefles')}
                className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-md font-bold shadow-sm"
              >
                Boek een Proefles
              </button>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-emerald-800"
            >
              &larr; Terug naar de hoofdpagina
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
