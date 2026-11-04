import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, DEFAULT_PACKAGES } from '../lib/supabaseClient';
import BookingForm from '../components/BookingForm';
import {
  Check,
  Award,
  Shield,
  HeartHandshake,
  Car,
  Phone,
  Clock,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('');

  useEffect(() => {
    async function fetchPackages() {
      setLoadingPackages(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('packages')
            .select('*')
            .order('sort_order', { ascending: true });

          if (error) throw error;
          setPackages(data && data.length > 0 ? data : DEFAULT_PACKAGES);
        } else {
          const savedLocal = localStorage.getItem('demo_packages');
          if (savedLocal) {
            setPackages(JSON.parse(savedLocal));
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

  const handleChoosePackage = (pkgName) => {
    setSelectedPackage(pkgName);
    const el = document.getElementById('proefles');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
                Hoog Slagingspercentage bij het CBR &bull; Rijschoolnr. 1085G9
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Rustig, veilig en met vertrouwen je rijbewijs halen.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Bij Rijschool KlaverDrive krijg je altijd les van dezelfde ervaren instructeur in een vaste, handgeschakelde Volkswagen Golf 8. Wij geven rijles in <strong>Den Hoorn, Den Haag, Rijswijk, Nootdorp, Ypenburg, Delft en Wateringen</strong>.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  Altijd dezelfde vaste instructeur
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  Effectieve blokuren van 100 min (2x 50 min)
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
                <a
                  href="#proefles"
                  className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 py-4 rounded-md shadow-sm transition-colors text-base"
                >
                  Boek een Proefles
                </a>
                <a
                  href="#pakketten"
                  className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-6 py-4 rounded-md border border-slate-300 transition-colors text-base"
                >
                  Bekijk Lespakketten
                </a>
              </div>
            </div>

            {/* Right Authentic Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=80"
                  alt="Leerling achter het stuur tijdens een rijles op een Nederlandse weg"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Lesvoertuig</p>
                    <p className="text-sm font-bold text-slate-900">
                      Volkswagen Golf 8 (Handgeschakeld)
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

      {/* TRUST STATS BAR */}
      <section className="bg-emerald-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-emerald-800/60">
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">15+ jaar</div>
              <div className="text-xs sm:text-sm text-emerald-100 mt-1">Ervaring als rijinstructeur</div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">88%</div>
              <div className="text-xs sm:text-sm text-emerald-100 mt-1">Slaagt in één keer bij het CBR</div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100 min</div>
              <div className="text-xs sm:text-sm text-emerald-100 mt-1">Blokuren (2 lessen van 50 min)</div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">4.9 / 5</div>
              <div className="text-xs sm:text-sm text-emerald-100 mt-1">Waardering van oud-leerlingen</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT THE INSTRUCTOR SECTION */}
      <section id="instructeur" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Authentic Portrait Placeholder */}
            <div className="lg:col-span-5">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                  alt="Rijinstructeur bij Rijschool KlaverDrive"
                  className="w-full h-80 sm:h-96 object-cover rounded"
                />
                <div className="pt-3 px-1 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Rijschool KlaverDrive</h3>
                    <p className="text-xs text-slate-500">
                      WRM-gecertificeerd Rijinstructeur (CBR 1085G9)
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded">
                    Vaste instructeur
                  </span>
                </div>
              </div>
            </div>

            {/* Story & Pillars */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Even voorstellen
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Geen grote keten, maar persoonlijke begeleiding van begin tot eind.
                </h2>
              </div>

              <p className="text-slate-600 leading-relaxed">
                “Autorijden leer je het snelst wanneer je je op je gemak voelt in de auto. Wij begeleiden leerlingen in <strong>Den Hoorn, Delft, Den Haag, Rijswijk, Nootdorp, Ypenburg en Wateringen</strong> stap voor stap naar hun rijbewijs — van zenuwachtige beginners tot leerlingen die willen overstappen.”
              </p>

              <p className="text-slate-600 leading-relaxed">
                Wij werken bewust met <strong>blokuren van 100 minuten (2 aaneengesloten lessen van 50 minuten)</strong>. Zo gaat er geen kostbare tijd verloren aan heen- en terugrijden en heb je elke rit volop de tijd om verkeerssituaties en examenroutes rondom het CBR echt goed onder de knie te krijgen.
              </p>

              {/* Three Core Pillars: Patience, Safety, High Pass Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-4 rounded-md border border-slate-200">
                  <HeartHandshake className="w-6 h-6 text-emerald-800 mb-2" />
                  <h4 className="font-bold text-slate-900 text-sm">Alle rust &amp; geduld</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Fouten maken mag; daar zit dubbele bediening voor in de Golf 8. We oefenen net zo lang tot het vertrouwd voelt.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md border border-slate-200">
                  <Shield className="w-6 h-6 text-emerald-800 mb-2" />
                  <h4 className="font-bold text-slate-900 text-sm">Veiligheid voorop</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Je leert niet alleen een kunstje voor het examen, maar echt zelfstandig en veilig anticiperen in het verkeer.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md border border-slate-200">
                  <Award className="w-6 h-6 text-emerald-800 mb-2" />
                  <h4 className="font-bold text-slate-900 text-sm">Hoog slagingspercentage</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Ruim boven het landelijk CBR-gemiddelde doordat we pas examen aanvragen als je er echt klaar voor bent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC PACKAGES & PRICING SECTION */}
      <section id="pakketten" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Heldere Tarieven
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Lespakketten zonder kleine lettertjes
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Twijfel je welk pakket bij je past? Na de proefles geef ik je een eerlijk advies. Betalen in termijnen is zonder extra kosten mogelijk.
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {packages.map((pkg) => {
                const featureList = Array.isArray(pkg.features) ? pkg.features : [];
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-lg p-6 sm:p-8 flex flex-col justify-between relative ${
                      pkg.is_popular
                        ? 'border-2 border-emerald-800 bg-white shadow-md'
                        : 'border border-slate-200 bg-slate-50/60 shadow-sm'
                    }`}
                  >
                    {pkg.is_popular && (
                      <div className="absolute -top-3.5 left-6 bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                        Meest Gekozen
                      </div>
                    )}

                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-xl font-extrabold text-slate-900">{pkg.name}</h3>
                        <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded">
                          {pkg.lessons_count} lessen
                        </span>
                      </div>

                      {pkg.subtitle && (
                        <p className="text-sm text-slate-600 mt-1.5">{pkg.subtitle}</p>
                      )}

                      <div className="my-6 pb-6 border-b border-slate-200">
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                          € {Number(pkg.price).toLocaleString('nl-NL', { minimumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs text-slate-500 block mt-1">
                          Inclusief CBR praktijkexamen &bull; Geen inschrijfkosten
                        </span>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {featureList.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChoosePackage(pkg.name)}
                      className={`w-full py-3 px-4 rounded-md font-bold text-sm transition-colors ${
                        pkg.is_popular
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                          : 'bg-emerald-900 hover:bg-emerald-950 text-white'
                      }`}
                    >
                      Start met Proefles ({pkg.name})
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Explanation Box about 50/100 min lessons */}
          <div className="mt-10 bg-emerald-50/70 border border-emerald-200 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                Hoe werken onze lesuren van 50 en 100 minuten?
              </h4>
              <p className="text-sm text-slate-700 mt-1">
                1 les duurt <strong>50 minuten</strong>, maar we plannen altijd <strong>2 lessen achter elkaar (1 blokuur = 100 minuten)</strong>. Zo leer je sneller en heb je minder ritten nodig om klaar te zijn voor het CBR-examen.
              </p>
            </div>
            <a
              href="#proefles"
              className="text-sm font-bold text-emerald-900 hover:underline shrink-0"
            >
              Plan je proefles &rarr;
            </a>
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
                Vul hieronder je gegevens en voorkeursmoment in. Ik bel of app je binnen 24 uur om de afspraak en de ophaallocatie te bevestigen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="w-8 h-8 rounded bg-emerald-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Kennismakingsles in de Golf 8</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ik haal je thuis op in Den Hoorn, Delft, Den Haag, Rijswijk, Nootdorp, Ypenburg of Wateringen. Je gaat direct zelf achter het stuur om te ervaren hoe het rijden werkt.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="w-8 h-8 rounded bg-emerald-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Persoonlijk lesadvies</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Na afloop bespreken we hoeveel lessen (blokuren van 100 min) je naar verwachting nodig hebt. Kies je voor een pakket? Dan is de proefles helemaal gratis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROEFLES BOOKING SECTION */}
      <section id="proefles" className="py-16 md:py-24 bg-white">
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
                  Wil je ervaren of mijn manier van lesgeven bij je past? Vraag hiernaast je proefles aan. Je ontvangt direct een bevestiging per e-mail.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  Waarom leerlingen voor KlaverDrive kiezen:
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Car className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
                    <span>Handgeschakelde Volkswagen Golf 8 &bull; Geen wachttijd</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
                    <span>1 les = 50 min, altijd gereden in blokuren van 100 min (2 lessen)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-1" />
                    <span>
                      <strong>Lesgebied:</strong> Den Hoorn, Den Haag, Rijswijk, Nootdorp, Ypenburg, Delft &amp; Wateringen
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-950 text-white rounded-lg p-5">
                <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  Liever direct telefonisch overleggen?
                </p>
                <p className="text-sm text-emerald-100 mt-1">
                  Tijdens rijlessen neem ik de telefoon niet op voor de veiligheid van mijn leerling. Stuur gerust een WhatsAppje of spreek de voicemail in, dan bel ik je tussen de lessen door terug!
                </p>
                <a
                  href="tel:0624819032"
                  className="mt-4 inline-flex items-center gap-2 text-base font-extrabold text-white hover:text-amber-400"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  06 - 24 81 90 32
                </a>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <BookingForm selectedPackageName={selectedPackage} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
