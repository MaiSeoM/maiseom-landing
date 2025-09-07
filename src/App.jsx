import { useEffect, useRef, useState } from "react";

/* ------------------ Utilitaires ------------------ */
function Counter({ to, duration = 1200, prefix = "", suffix = "", className = "" }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      setVal(Math.round(to * easeOutCubic(p)));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration]);

  return <span className={className}>{prefix}{val}{suffix}</span>;
}

/* ------------------ Composants UI ------------------ */
function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="text-[#2066CC]">{icon}</div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function LogoStrip() {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs uppercase tracking-widest text-gray-500">Ils nous font confiance</p>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-6 items-center opacity-70">
          <div className="text-center"><span className="text-sm font-semibold">WordPress</span></div>
          <div className="text-center"><span className="text-sm font-semibold">Shopify</span></div>
          <div className="text-center"><span className="text-sm font-semibold">Webflow</span></div>
          <div className="text-center hidden sm:block"><span className="text-sm font-semibold">Wix</span></div>
          <div className="text-center hidden sm:block"><span className="text-sm font-semibold">PrestaShop</span></div>
          <div className="text-center hidden sm:block"><span className="text-sm font-semibold">Framer</span></div>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  const items = [
    { title: "1. Entrez votre domaine", desc: "Nous analysons structure, contenu, balises, performances & IA-SEO." },
    { title: "2. Recevez vos recommandations", desc: "Titres, metas, schémas, contenus, vitesse… prêtes à appliquer." },
    { title: "3. Corrigez en un clic", desc: "Intégrations WordPress/Shopify/Webflow. Rapports & alertes." },
  ];
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center">Comment ça marche</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <div key={i} className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-6">
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Integrations() {
  const badges = ["WordPress", "Shopify", "Webflow", "Wix", "PrestaShop", "API"];
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Intégrations</h2>
        <p className="text-gray-600 mt-2">Appliquez vos corrections sans effort sur vos outils.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {badges.map((b) => (
            <span key={b} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  const plans = [
    { name: "Starter", price: "19€", features: ["Audit de base", "Reco SEO essentielles", "1 intégration CMS"] },
    { name: "Pro", price: "49€", features: ["Audit complet + IA-SEO", "Corrections automatiques", "Toutes intégrations"] },
  ];
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center">Tarifs de lancement</h2>
        <p className="text-gray-600 text-center mt-2">Rejoignez la bêta : bénéficiez des meilleurs prix à vie.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((p) => (
            <div key={p.name} className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="text-3xl font-extrabold">
                  {p.price}<span className="text-sm font-medium text-gray-500">/mois</span>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {p.features.map((f) => <li key={f}>✅ {f}</li>)}
              </ul>
              <a href="#waitlist" className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow bg-gradient-to-r from-[#2066CC] to-[#8C52FF] hover:opacity-90 transition">
                Rejoindre ici
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Nadia — e-commerce", text: "En 48h, nos principales erreurs SEO ont été corrigées et nos clics organiques progressent déjà." },
    { name: "Yannis — agence", text: "On gagne un temps fou sur l’audit et les recommandations IA sont directement actionnables." },
  ];
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center">Ils en parlent</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((t, i) => (
            <div key={i} className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-6">
              <p className="text-gray-700">“{t.text}”</p>
              <p className="mt-3 text-sm text-gray-500">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const data = [
    { q: "Qu’est-ce que l’IA-SEO ?", a: "C’est l’optimisation de votre site pour apparaître dans les réponses des assistants et moteurs d’IA (SGE, ChatGPT, Perplexity…), en plus de Google classique." },
    { q: "Comment se passent les corrections automatiques ?", a: "Via nos intégrations CMS et notre API : nous proposons le correctif et vous l’appliquez en un clic, avec suivi et rollback." },
    { q: "Puis-je annuler à tout moment ?", a: "Oui. L’offre est sans engagement. Vous pouvez annuler avant la prochaine période de facturation." },
    { q: "Mes données sont-elles sécurisées ?", a: "Oui, hébergement en UE, chiffrement en transit/au repos, accès restreints." },
    { q: "Quand sort la bêta ?", a: "Très bientôt ! Inscrivez-vous pour être notifié et profiter du tarif de lancement." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center">FAQ</h2>
        <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm">
          {data.map((item, i) => (
            <button
              key={i}
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full text-left px-5 py-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{item.q}</span>
                <span className="text-gray-400">{open === i ? "–" : "+"}</span>
              </div>
              {open === i && <p className="mt-2 text-sm text-gray-600">{item.a}</p>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("maiseom_cookie_ok") !== "1";
  });
  if (!show) return null;
  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-4 z-50 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur shadow-lg p-4 max-w-xl">
      <p className="text-sm text-gray-700">
        Nous utilisons des cookies analytiques pour améliorer votre expérience.{" "}
        <a href="#" className="underline">En savoir plus</a>.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => { localStorage.setItem("maiseom_cookie_ok", "1"); setShow(false); }}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-white bg-[#2066CC] hover:bg-[#1b58ad] transition"
        >
          D’accord
        </button>
        <button
          onClick={() => setShow(false)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-gray-300"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}

function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-t border-gray-200 p-3 sm:hidden">
      <a
        href="#waitlist"
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow
                   bg-gradient-to-r from-[#2066CC] to-[#8C52FF] hover:opacity-90 transition"
      >
        Rejoindre ici
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

/* ------------------ Page principale ------------------ */
export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-200/60">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/maiseom-logo.png" alt="MaiSeoM" className="h-7 w-auto object-contain" />
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">MaiSeoM</span>
          </div>
          <a
            href="#waitlist"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow
                       bg-gradient-to-r from-[#2066CC] to-[#8C52FF] hover:opacity-90 transition"
          >
            Rejoindre ici
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-6">
        <section className="relative mt-10 sm:mt-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Texte */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 shadow-sm">
                🚀 Bêta privée — places limitées
              </span>
              {/* Compteurs sous le badge */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 shadow-sm">
                  🔥 Déjà <strong><Counter to={124} /></strong> inscrits
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1 text-red-600 shadow-sm">
                  🎟️ Places restantes : <strong><Counter to={26} /></strong>
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                </span>
              </div>

              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Le SEO pensé pour l’
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2066CC] to-[#8C52FF]">
                  ère de l’IA
                </span>
              </h1>
              <p className="text-lg text-gray-600 mt-4">
                Analyse, recommandations <strong>SEO + IA-SEO</strong> et corrections automatiques pour
                gagner en visibilité sur Google et dans les réponses d’IA.
              </p>

              {!submitted ? (
                <form id="waitlist" onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email professionnel"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2066CC] bg-white"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow
                               bg-gradient-to-r from-[#2066CC] to-[#8C52FF] hover:opacity-90 transition
                               ring-4 ring-[#2066CC]/20"
                  >
                    Rejoindre ici
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              ) : (
                <p className="mt-6 text-green-600 font-semibold">Merci ! Vous êtes bien inscrit à la liste d’attente 🎉</p>
              )}

              {/* Points clés */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-sm text-gray-600">
                <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-3">
                  ✅ Corrections automatiques
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-3">
                  🔒 Données hébergées en UE
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-3">
                  ⚡ Déploiement rapide
                </div>
              </div>
            </div>

            {/* Visuel */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-r from-[#2066CC]/25 to-[#8C52FF]/25 blur-xl" />
              <img
                src="/hero.png"
                alt="Dashboard MaiSeoM"
                className="relative w-full h-64 sm:h-80 object-cover rounded-2xl border border-gray-200 shadow-xl"
                style={{ animation: "float 8s ease-in-out infinite" }}
              />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-3">
                  <div className="text-2xl font-extrabold text-[#2066CC]"><Counter to={78} suffix="%" /></div>
                  <div className="text-xs text-gray-500">Clics organiques</div>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-3">
                  <div className="text-2xl font-extrabold text-[#8C52FF]"><Counter to={32} prefix="-" suffix="%" /></div>
                  <div className="text-xs text-gray-500">Erreurs SEO</div>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-3">
                  <div className="text-2xl font-extrabold">A+</div>
                  <div className="text-xs text-gray-500">Score IA-SEO</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offre limitée -30% à vie */}
        <section className="mt-16 sm:mt-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-red-200 bg-red-50/80 backdrop-blur shadow-md p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-100 via-transparent to-red-100 opacity-40" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-white px-3 py-1 text-xs text-red-600 shadow-sm">
                  🔥 Offre limitée
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-red-700">
                  -30% à vie pour les 50 premiers inscrits
                </h2>
                <p className="mt-2 text-gray-700">
                  Rejoignez la bêta maintenant et bénéficiez d’un tarif réduit valable à vie.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Déjà <span className="font-bold text-red-600"><Counter to={124} /></span> inscrits —
                  plus que <span className="font-bold text-red-600"><Counter to={26} /></span> places disponibles !
                </p>
                <a
                  href="#waitlist"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow
                             bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition"
                >
                  Profiter de l’offre
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <LogoStrip />
        <Steps />

        {/* Features clés */}
        <section className="mt-16 sm:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Audit complet en 1 clic"
              desc="Titres, metas, schémas, performance, accessibilité : détectez ce qui freine votre visibilité."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2"/><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2"/></svg>}
            />
            <FeatureCard
              title="Optimisations IA"
              desc="Contenus et balisage prêts pour SGE, ChatGPT, Perplexity & co."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2"/></svg>}
            />
            <FeatureCard
              title="Corrections automatiques"
              desc="Connecteurs WordPress / Shopify / Webflow : appliquez les fix en un clic."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"/></svg>}
            />
          </div>
        </section>

        <Integrations />
        <PricingTeaser />
        <Testimonials />
        <FAQ />

        {/* CTA bas */}
        <section className="mt-16 sm:mt-20 mb-16">
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-r from-[#2066CC]/15 via-transparent to-[#8C52FF]/15 blur-2xl" />
            <h2 className="text-2xl sm:text-3xl font-extrabold">Passez au référencement nouvelle génération</h2>
            <p className="text-gray-600 mt-2">
              Rejoignez la bêta privée et bénéficiez du tarif de lancement.
              <br />
              <span className="text-[#2066CC] font-semibold">Déjà <Counter to={124} /> inscrits !</span>
            </p>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow
                         bg-gradient-to-r from-[#2066CC] to-[#8C52FF] hover:opacity-90 transition mt-5"
            >
              Rejoindre ici
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/70">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} MaiSeoM — Tous droits réservés</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#2066CC]">Mentions légales</a>
            <a href="#" className="hover:text-[#2066CC]">Confidentialité</a>
            <a href="#" className="hover:text-[#2066CC]">Contact</a>
          </div>
        </div>
      </footer>

      <CookieBanner />
      <StickyCTA />
    </div>
  );
}
