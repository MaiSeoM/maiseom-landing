import { useEffect, useRef, useState } from "react";

export default function PricingTopBar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  // Fermer au clic extérieur ou ESC
  useEffect(() => {
    function onClick(e) {
      if (!open) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative z-50">
      <div className="relative">
        {/* halo de couleur subtil */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_400px_at_20%_-10%,rgba(32,102,204,0.15),transparent),radial-gradient(900px_300px_at_80%_120%,rgba(140,82,255,0.15),transparent)]" />
        <div className="backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-white/50">
          <div className="mx-auto max-w-7xl px-6 h-11 flex items-center justify-between">
            <div className="text-xs sm:text-sm font-medium text-gray-800">
              🚀 Offre de lancement :{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2066CC] via-[#8C52FF] to-[#00D4FF] font-semibold">
                -30% à vie pour les 50 premiers inscrits
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                ref={btnRef}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls="pricing-dropdown"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 transition shadow-sm"
                title="Voir les tarifs"
              >
                Nos tarifs
                <span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Vague de liaison premium */}
<div className="-mt-px">
  <svg viewBox="0 0 1440 90" className="w-full h-[38px] sm:h-[48px]" preserveAspectRatio="none">
    <path fill="url(#grad-topbar)" d="M0,32 C240,64 480,64 720,32 C960,0 1200,0 1440,32 L1440,90 L0,90 Z"></path>
    <defs>
      <linearGradient id="grad-topbar" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#2066CC" stopOpacity="0.12" />
        <stop offset="55%" stopColor="#8C52FF" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.12" />
      </linearGradient>
    </defs>
  </svg>
</div>


      {/* Dropdown tarifs */}
      <div
        id="pricing-dropdown"
        ref={panelRef}
        className={`absolute right-6 top-11 w-[92vw] sm:w-[480px] md:w-[560px]
        origin-top-right transition-all duration-200
        ${open ? "opacity-100 translate-y-2 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/50 bg-white/90 backdrop-blur">
          <div
            className="p-5 sm:p-6 text-white relative"
            style={{
              background:
                "linear-gradient(120deg,#2066CC 0%,#8C52FF 55%,#00D4FF 100%)",
            }}
          >
            <h3 className="relative z-10 text-lg sm:text-xl font-extrabold">
              Nos offres
            </h3>
            <p className="relative z-10 text-xs sm:text-sm opacity-90 mt-1">
              Choisissez la formule adaptée à vos besoins.
            </p>
          </div>

          {/* Plans */}
          <ul className="p-5 sm:p-6 space-y-4 text-sm">
            <PlanLine
              name="Starter"
              price="19€"
              bullets={["5 pages", "Reco IA basiques"]}
              href="#pricing"
            />
            <PlanLine
              name="Pro"
              price="49€"
              bullets={["Illimité", "Reco IA avancées", "Alertes + PDF"]}
              href="#pricing"
              featured
            />
            <PlanLine
              name="Entreprise"
              price="99€"
              bullets={["Tout Pro", "Support prioritaire", "API & intégrations"]}
              href="#pricing"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

function PlanLine({ name, price, bullets = [], href = "#", featured = false }) {
  return (
    <li
      className={`p-4 rounded-xl border ${
        featured ? "border-blue-400/70 bg-blue-50/50" : "border-gray-200 bg-white"
      } shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold">
          {name}{" "}
          {featured && (
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white">
              Recommandé
            </span>
          )}
        </div>
        <div className={`text-sm ${featured ? "text-blue-700" : "text-gray-700"}`}>
          {price}/mois
        </div>
      </div>
      <div className="mt-1 text-[11px] text-gray-600">{bullets.join(" • ")}</div>
    </li>
  );
}
