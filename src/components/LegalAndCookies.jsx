import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, FileText, Cookie } from 'lucide-react';
import { useSiteSettings } from '../lib/siteSettings';

const COOKIE_NOTICE_KEY = 'klaverdrive_cookie_notice_dismissed';

export default function LegalAndCookies() {
  const { settings } = useSiteSettings();
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null
  const [showCookieNotice, setShowCookieNotice] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(COOKIE_NOTICE_KEY);
      if (!dismissed) {
        setShowCookieNotice(true);
      }
    } catch {
      // ignore storage errors
    }

    const handleOpenModal = (e) => {
      if (e.detail === 'privacy' || e.detail === 'terms') {
        setActiveModal(e.detail);
      }
    };

    window.addEventListener('open-legal-modal', handleOpenModal);
    return () => window.removeEventListener('open-legal-modal', handleOpenModal);
  }, []);

  const dismissCookieNotice = () => {
    try {
      localStorage.setItem(COOKIE_NOTICE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    setShowCookieNotice(false);
  };

  return (
    <>
      {/* Subtle 1-Click Functional Cookie Notice */}
      {showCookieNotice && (
        <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40 bg-slate-900 text-slate-200 border border-slate-700 rounded-lg shadow-xl p-4 text-xs leading-relaxed">
          <div className="flex items-start gap-3">
            <Cookie className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p>
                Wij gebruiken uitsluitend <strong>functionele cookies</strong> voor een goed werkende website (geen volg- of advertentiecookies). Bekijk ook onze{' '}
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  Privacy- &amp; Cookieverklaring
                </button>
                .
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={dismissCookieNotice}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded transition-colors cursor-pointer"
                >
                  Oké, begrepen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Terms Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-lg">
              <div className="flex items-center gap-2.5">
                {activeModal === 'privacy' ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                ) : (
                  <FileText className="w-5 h-5 text-emerald-800" />
                )}
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {activeModal === 'privacy'
                    ? 'Privacy- & Cookieverklaring'
                    : 'Algemene Voorwaarden'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeModal === 'privacy' ? (
                <>
                  <p>
                    <strong>Rijschool KlaverDrive</strong> (ingeschreven bij de Kamer van Koophandel onder nummer{' '}
                    <strong>{settings.kvk_number}</strong>, CBR-rijschoolnummer <strong>{settings.cbr_number}</strong>) hecht veel waarde aan de bescherming van jouw persoonsgegevens. In deze verklaring leggen wij uit welke gegevens wij verzamelen wanneer je onze website bezoekt of een proefles aanvraagt.
                  </p>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    1. Welke persoonsgegevens verwerken wij?
                  </h3>
                  <p>
                    Wanneer je het proefles-aanvraagformulier invult of contact met ons opneemt via telefoon/WhatsApp, verwerken wij de volgende gegevens:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Voor- en achternaam</li>
                    <li>Telefoonnummer</li>
                    <li>E-mailadres</li>
                    <li>Gewenste datum/tijdstip en eventueel opgegeven ophaaladres of woonplaats</li>
                  </ul>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    2. Waarom verwerken wij deze gegevens?
                  </h3>
                  <p>
                    Wij gebruiken jouw gegevens uitsluitend om:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Je een bevestiging te sturen van je proeflesaanvraag per e-mail.</li>
                    <li>Telefonisch of via WhatsApp contact met je op te nemen om de proefles en ophaallocatie definitief in te plannen.</li>
                    <li>Bij vervolglessen een correcte les- en leerlingenadministratie bij te houden.</li>
                  </ul>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    3. Bewaartermijn &amp; Delen met derden
                  </h3>
                  <p>
                    Wij verkopen jouw gegevens <strong>nooit</strong> aan derden. Indien je na een proefles besluit geen vervolglessen te volgen, worden je aanvraaggegevens uiterlijk binnen 6 maanden verwijderd. Volg je wel rijlessen, dan bewaren wij de benodigde administratieve gegevens conform de wettelijke fiscale bewaarplicht (7 jaar).
                  </p>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    4. Cookies &amp; Lokale Opslag
                  </h3>
                  <p>
                    Deze website maakt <strong>geen gebruik van tracking-, advertentie- of profileringscookies</strong> van derden. Wij gebruiken uitsluitend functionele lokale opslag (<code>localStorage</code>) in je browser om:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Te onthouden dat je de cookiemelding hebt gesloten.</li>
                    <li>De actuele lespakketten en tarieven snel te kunnen tonen.</li>
                  </ul>
                  <p>
                    Voor deze strikt functionele opslag is op grond van de Nederlandse Telecommunicatiewet geen voorafgaande tracking-toestemming vereist.
                  </p>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    5. Jouw rechten (Inzage, correctie en verwijdering)
                  </h3>
                  <p>
                    Je hebt altijd het recht om je persoonsgegevens in te zien, te laten aanpassen of direct te laten verwijderen. Stuur hiervoor een bericht naar{' '}
                    <a href={`mailto:${settings.email}`} className="text-emerald-800 font-semibold hover:underline">
                      {settings.email}
                    </a>{' '}
                    of bel/WhatsApp naar <strong>{settings.phone_display}</strong>.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Deze algemene voorwaarden zijn van toepassing op alle proeflessen, rijlessen en lespakketten van{' '}
                    <strong>Rijschool KlaverDrive</strong> (KvK: {settings.kvk_number}).
                  </p>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    1. Proefles &amp; Lesadvies
                  </h3>
                  <p>
                    De proefles is vrijblijvend en bedoeld om kennis te maken en je aanvangsniveau in te schatten. Kies je aansluitend voor een van onze lespakketten, dan is de proefles geheel gratis. Kies je niet voor een pakket, dan wordt het tarief van een losse les (€ {settings.single_lesson_price},- incl. btw) in rekening gebracht.
                  </p>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    2. Rijlessen &amp; Annuleren van een afspraak
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Eén losse rijles duurt {settings.single_lesson_minutes} minuten. Wij plannen standaard blokuren van {settings.block_lesson_minutes} minuten (2 lessen).</li>
                    <li>Ben je verhinderd? Meld dit dan uiterlijk <strong>24 uur van tevoren</strong> telefonisch of via WhatsApp.</li>
                    <li>Lessen die binnen 24 uur voor aanvang worden afgezegd (behoudens dringende medische of familie-omstandigheden), worden in rekening gebracht of afgeschreven van het pakket.</li>
                  </ul>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    3. Verplichtingen van de leerling
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>De leerling dient tijdens elke rijles een geldig legitimatiebewijs bij zich te hebben.</li>
                    <li>De leerling is voor aanvang van een rijles niet onder invloed van alcohol, drugs of medicijnen die de rijvaardigheid beïnvloeden.</li>
                    <li>Voor het reserveren van een Tussentijdse Toets of CBR Praktijkexamen dient de leerling Rijschool KlaverDrive (CBR-nummer <strong>{settings.cbr_number}</strong>) te machtigen via Mijn CBR en over een geldig theoriecertificaat en Gezondheidsverklaring te beschikken.</li>
                  </ul>

                  <h3 className="font-bold text-slate-900 text-sm pt-2">
                    4. Tarieven &amp; Betaling in termijnen
                  </h3>
                  <p>
                    Alle vermelde tarieven op de website zijn inclusief btw. Betaling van een lespakket kan in één keer of zonder extra kosten in vooraf afgesproken termijnen plaatsvinden. Voordat het CBR-praktijkexamen wordt aangevraagd, dienen de openstaande termijnen van het pakket te zijn voldaan.
                  </p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 rounded-b-lg flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setActiveModal(activeModal === 'privacy' ? 'terms' : 'privacy')
                }
                className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                {activeModal === 'privacy'
                  ? 'Bekijk ook onze Algemene Voorwaarden →'
                  : 'Bekijk ook onze Privacy- & Cookieverklaring →'}
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function openLegalModal(type) {
  window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: type }));
}

