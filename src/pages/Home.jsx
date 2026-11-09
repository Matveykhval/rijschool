import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, DEFAULT_PACKAGES } from '../lib/supabaseClient';
import {
  useSiteSettings,
  SETTINGS_ROW_NAME,
  extractPackageMeta,
} from '../lib/siteSettings';
import BookingForm from '../components/BookingForm';
import {
  Check,
  Award,
  Car,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';

export default function Home() {
  const { settings } = useSiteSettings();
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
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
          setPackages(data && data.length > 0 ? data : DEFAULT_PACKAGES);
        } else {
          const savedLocal = localStorage.getItem('demo_packages');
          if (savedLocal) {
            setPackages(
              JSON.parse(savedLocal).filter((p) => p.name !== SETTINGS_ROW_NAME)
            );
          } else {
            localStorage.setItem('demo_packages', JSON.stringify(DEFAULT_PACKAGES));
            setPackages(DEFAULT_PACKAGES);
          }
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
        setPackages(DEFAULT_PACKAGES);
      } finally {
        setLoadingPackages(false);
      }
    }

    fetchPackages();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChoosePackage = (pkgName) => {
    setSelectedPackage(pkgName);
    scrollTo('proefles');
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold uppercase tracking-wide">
                <Award className="w-4 h-4 text-emerald-800" />
                {settings.stat_2_value} Slagingspercentage bij het CBR &bull; Rijschoolnr. {settings.cbr_number}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Rustig, veilig en met vertrouwen je rijbewijs halen.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Bij Rijschool KlaverDrive krijg je altijd les van dezelfde ervaren instructeur in een vaste {settings.car_model}. Wij geven rijles in <strong>{settings.service_areas}</strong>.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  Altijd dezelfde vaste instructeur
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  Effectieve blokuren van {settings.block_lesson_minutes} min (2x {settings.single_lesson_minutes} min)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  Thuis, op school of station opgehaald
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  Les in het weekend &amp; avonduren mogelijk
                </li>
              </ul>

              <div className="pt-3 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo('proefles')}
                  className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 py-4 rounded-md shadow-sm transition-colors text-base cursor-pointer"
                >
                  Boek een Proefles
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('pakketten')}
                  className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-4 rounded-md border border-slate-300 transition-colors text-base cursor-pointer"
                >
                  Bekijk Lespakketten
                </button>
              </div>
            </div>

            {/* Right Authentic Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100">
                <img
                  src="./auto.jpg"
                  alt="Lesauto Rijschool KlaverDrive"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Lesvoertuig</p>
                    <p className="text-sm font-bold text-slate-900">
                      {settings.car_model}
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded">
                    Direct plek
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STATS BAR (All 4 numbers & labels editable in Admin) */}
      <section className="bg-emerald-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-emerald-800/60">
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {settings.stat_1_value}
              </div>
              <div className="text-xs sm:text-sm text-emerald-100 mt-1">
                {settings.stat_1_label}
              </div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {settings.stat_2_value}
              </div>
              <div className="text-xs sm:text-sm text-emerald-100 mt-1">
                {settings.stat_2_label}
              </div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {settings.stat_3_value}
              </div>
              <div className="text-xs sm:text-sm text-emerald-100 mt-1">
                {settings.stat_3_label}
              </div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {settings.stat_4_value}
              </div>
              <div className="text-xs sm:text-sm text-emerald-100 mt-1">
                {settings.stat_4_label}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC PACKAGES & PRICING SECTION */}
      <section id="pakketten" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div
          className={`mx-auto px-4 sm:px-6 lg:px-8 ${
            packages.length >= 4 ? 'max-w-[1400px]' : 'max-w-6xl'
          }`}
        >
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Heldere Tarieven
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Lespakketten zonder kleine lettertjes
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Twijfel je welk pakket bij je past? Na de proefles geef ik je een eerlijk advies. Betalen in termijnen is zonder extra kosten mogelijk.
            </p>

            {/* Optional Seasonal Promo / Discount Banner (e.g. Herfstactie) */}
            {settings.promo_active && (settings.promo_title || settings.promo_text) && (
              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2.5 bg-amber-50 border border-amber-300 text-amber-950 px-5 py-2.5 rounded-full shadow-sm text-sm">
                {settings.promo_title && (
                  <span className="bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {settings.promo_title}
                  </span>
                )}
                {settings.promo_text && (
                  <span className="font-semibold text-amber-950">
                    {settings.promo_text}
                  </span>
                )}
              </div>
            )}
          </div>

          {loadingPackages ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="border border-slate-200 rounded-lg p-6 h-96 animate-pulse bg-slate-50"
                />
              ))}
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 gap-6 items-stretch ${
                packages.length >= 4
                  ? 'md:grid-cols-2 xl:grid-cols-4'
                  : packages.length === 2
                  ? 'md:grid-cols-2 max-w-4xl mx-auto'
                  : 'md:grid-cols-3'
              }`}
            >
              {packages.map((pkg) => {
                const { cleanFeatures: featureList, oldPrice } = extractPackageMeta(pkg);
                const currentPrice = Number(pkg.price);
                const hasDiscount = oldPrice && oldPrice > currentPrice;
                const savings = hasDiscount ? Math.round(oldPrice - currentPrice) : 0;

                return (
                  <div
                    key={pkg.id}
                    className={`rounded-xl p-6 sm:p-7 flex flex-col justify-between relative transition-shadow ${
                      pkg.is_popular
                        ? 'border-2 border-emerald-800 bg-white shadow-md'
                        : 'border border-slate-200 bg-slate-50/60 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {pkg.is_popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                        Meest Gekozen
                      </div>
                    )}

                    <div>
                      {/* Card Header with fixed min-height so prices & dividers align across all 4 cards */}
                      <div className="min-h-[84px] flex flex-col justify-start">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                            {pkg.name}
                          </h3>
                          <span className="whitespace-nowrap shrink-0 text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md">
                            {pkg.lessons_count} lessen
                          </span>
                        </div>

                        {pkg.subtitle && (
                          <p className="text-sm text-slate-600 mt-1.5 leading-snug">
                            {pkg.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="my-5 pb-5 border-b border-slate-200">
                        <div className="flex items-baseline flex-wrap gap-2.5">
                          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            € {currentPrice.toLocaleString('nl-NL', { minimumFractionDigits: 0 })}
                          </span>
                          {hasDiscount && (
                            <span className="text-base font-bold text-slate-400 line-through">
                              € {oldPrice.toLocaleString('nl-NL', { minimumFractionDigits: 0 })}
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                              {settings.promo_active && settings.promo_title
                                ? `${settings.promo_title}: -€ ${savings}`
                                : `Bespaar € ${savings}`}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 block mt-1.5 leading-relaxed">
                          Inclusief btw &amp; CBR praktijkexamen &bull; Geen inschrijfkosten
                        </span>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {featureList.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug">
                            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChoosePackage(pkg.name)}
                      className={`w-full min-h-[48px] py-3 px-4 rounded-md font-bold text-sm transition-colors flex items-center justify-center text-center cursor-pointer ${
                        pkg.is_popular
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                          : 'bg-emerald-900 hover:bg-emerald-950 text-white'
                      }`}
                    >
                      Start met Proefles
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Explanation Box about 50/100 min lessons + Loose Rates */}
          <div className="mt-10 bg-emerald-50/70 border border-emerald-200 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-base">
                Hoe werken onze lesuren van {settings.single_lesson_minutes} en {settings.block_lesson_minutes} minuten?
              </h4>
              <p className="text-sm text-slate-700">
                1 les duurt <strong>{settings.single_lesson_minutes} minuten</strong>, maar we plannen altijd <strong>2 lessen achter elkaar (1 blokuur = {settings.block_lesson_minutes} minuten)</strong>. Zo leer je sneller en heb je minder ritten nodig om klaar te zijn voor het CBR-examen.
              </p>
              <p className="text-xs text-slate-600 pt-1">
                Losse rijles ({settings.single_lesson_minutes} min): <strong>€ {settings.single_lesson_price},-</strong> &bull; Los CBR Praktijkexamen: <strong>€ {settings.exam_price},-</strong> &bull; Tussentijdse Toets: <strong>€ {settings.ttt_price},-</strong> <span className="text-slate-500">(alle tarieven zijn incl. btw)</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollTo('proefles')}
              className="text-sm font-bold text-emerald-900 hover:underline shrink-0 text-left cursor-pointer"
            >
              Plan je proefles &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="werkwijze" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              In 3 Stappen op weg
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Hoe werkt de proefles?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="w-8 h-8 rounded bg-emerald-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Aanmelden via de website</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Vul hieronder je gegevens en voorkeursmoment in. Ik bel of app je binnen {settings.response_time_hours} uur om de afspraak en de ophaallocatie te bevestigen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="w-8 h-8 rounded bg-emerald-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Kennismakingsles in de auto</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ik haal je thuis op in {settings.service_areas}. Je gaat direct zelf achter het stuur om te ervaren hoe het rijden werkt.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="w-8 h-8 rounded bg-emerald-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Persoonlijk lesadvies</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Na afloop bespreken we hoeveel lessen (blokuren van {settings.block_lesson_minutes} min) je naar verwachting nodig hebt. Kies je voor een pakket? Dan is de proefles helemaal gratis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Goed om te weten
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Veelgestelde vragen
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Wat kost een proefles als ik daarna nog geen pakket kies?',
                a: 'Wanneer je na de proefles kiest voor een van onze lespakketten, is de proefles helemaal gratis. Besluit je om losse lessen te volgen of niet verder te gaan? Dan rekenen we enkel het tarief van een losse les.',
              },
              {
                q: 'Kan ik bij jullie al vanaf 16,5 jaar starten met rijles (2toDrive)?',
                a: 'Ja! Vanaf 16,5 jaar mag je starten met rijlessen en vanaf je 17e verjaardag mag je het CBR praktijkexamen afleggen. Tot je 18e rijd je daarna onder begeleiding van een coach.',
              },
              {
                q: 'Kan ik mijn lespakket in termijnen betalen?',
                a: 'Ja, betalen in termijnen is mogelijk zonder extra kosten of rente. We spreken samen een duidelijk betaalschema af voordat je start.',
              },
              {
                q: 'Geven jullie rijles in een schakelauto of automaat?',
                a: `Wij geven les in een moderne ${settings.car_model}. Wanneer je slaagt in een schakelauto, krijg je een volledig rijbewijs B waarmee je zowel in een handgeschakelde auto als in een automaat mag rijden.`,
              },
            ].map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border border-slate-200 rounded-lg transition-all ${
                    isOpen ? 'bg-white shadow-sm' : 'bg-slate-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left p-5 cursor-pointer font-bold text-slate-900 text-sm sm:text-base"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ml-4 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 -mt-2 text-sm text-slate-600 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROEFLES BOOKING SECTION */}
      <section id="proefles" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Direct Inplannen
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Boek een vrijblijvende proefles
                </h2>
                <p className="text-slate-600 mt-3 leading-relaxed text-sm sm:text-base">
                  Wil je ervaren of mijn manier van lesgeven bij je past? Vul hiernaast je gegevens in en stuur je aanvraag direct door via WhatsApp.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Waarom leerlingen voor KlaverDrive kiezen:
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Car className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
                    <span>{settings.car_model} &bull; Geen wachttijd</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
                    <span>1 les = {settings.single_lesson_minutes} min, altijd gereden in blokuren van {settings.block_lesson_minutes} min (2 lessen)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
                    <span>
                      <strong>Lesgebied:</strong> {settings.service_areas}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-950 text-white rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  Liever direct via WhatsApp of telefonisch overleggen?
                </p>
                <p className="text-sm text-emerald-100 mt-1">
                  Tijdens rijlessen neem ik de telefoon niet op voor de veiligheid van mijn leerling. Stuur gerust een WhatsAppje of spreek de voicemail in, dan reageer ik direct tussen de lessen door!
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={settings.whatsapp_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2.5 rounded-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    WhatsApp ons
                  </a>
                  <a
                    href={`tel:${settings.phone_raw}`}
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-white hover:text-amber-400 px-2 py-2"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    {settings.phone_display}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <BookingForm selectedPackageName={selectedPackage} />
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING WHATSAPP ACTION BUTTON */}
      <a
        href={settings.whatsapp_url}
        target="_blank"
        rel="noreferrer"
        aria-label="Stuur een WhatsApp bericht"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-lg border border-emerald-600 transition-transform hover:scale-105"
      >
        <MessageCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
