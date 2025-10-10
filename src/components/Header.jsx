// src/components/Header.jsx
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics.js";
import { Link } from "react-router-dom";

const BRAND_GRADIENT = "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)";

export default function Header() {
  const [open, setOpen] = useState(null); // "benefits" | "pricing" | "resources" | null
  const wrapRef = useRef(null);

  // Close dropdowns on outside / Esc
  useEffect(() => {
    function onClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(null);
    }
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* halo très discret */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_260px_at_15%_-20%,rgba(32,102,204,0.08),transparent),radial-gradient(800px_240px_at_85%_120%,rgba(140,82,255,0.08),transparent)]" />
      {/* barre verre minimaliste */}
      <div className="backdrop-blur-xl bg-white/65 border-b border-white/60">
        <div ref={wrapRef} className="mx-auto max-w-7xl px-6 h-18 md:h-20 flex items-center justify-between">
          {/* Logo + marque */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-[1.5px] rounded-xl" style={{ background: BRAND_GRADIENT }}>
              <div className="bg-white rounded-xl px-2 py-1">
                <img
                  src="/logos/maiseom-logo.png"
                  alt="MaiSeoM"
                  className="h-10 w-auto md:h-12"
                />
              </div>
            </div>
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900">
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: BRAND_GRADIENT }}>
                MaiSeoM
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <DropItem
              label="Avantages"
              open={open === "benefits"}
              onToggle={() => setOpen(open === "benefits" ? null : "benefits")}
            >
              <Panel>
                <Section>
                  <LinkRow title="Audit IA ultra-rapide" desc="Titres, metas, schémas, perfs, maillage." href="#benefits" />
                  <LinkRow title="Optimisations IA-SEO" desc="Prêtes pour SGE, ChatGPT, Perplexity." href="#benefits" />
                  <LinkRow title="+ CTR mesurable" desc="Mieux repris par les IA → plus de clics." href="#benefits" />
                </Section>
                <Divider />
                <Stat title="+47% de CTR médian" note="sur pages optimisées (bêta)" />
              </Panel>
            </DropItem>

            <DropItem
              label="Tarifs"
              open={open === "pricing"}
              onToggle={() => setOpen(open === "pricing" ? null : "pricing")}
            >
              <Panel>
                <PlansPreview />
                <div className="px-5 pb-5 pt-3 text-right">
                  <Link
                    to="/tarifs"
                    onClick={() => trackEvent?.("nav_click", { item: "offres" })}
                    className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-white shadow-sm hover:opacity-90 transition"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    Comprendre nos offres
                  </Link>
                </div>
              </Panel>
            </DropItem>

            <DropItem
              label="Ressources"
              open={open === "resources"}
              onToggle={() => setOpen(open === "resources" ? null : "resources")}
            >
              <Panel>
                <Section>
                  <LinkRow title="Guide IA-SEO 2025" desc="Bonnes pratiques SGE & LLMs." href="#faq" />
                  <LinkRow title="Intégrations" desc="WordPress, Shopify, statique." href="#faq" />
                  <LinkRow title="RGPD & sécurité" desc="Conforme, export, minimisation." href="#faq" />
                </Section>
              </Panel>
            </DropItem>

            {/* CTA discret */}
            <Link
              to="/tarifs"
              className="ml-2 inline-flex items-center px-4 py-2 rounded-xl font-semibold text-white shadow-sm hover:opacity-90 transition"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              Offres
            </Link>
          </nav>

          {/* Mobile */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

/* ========= sous-composants ========= */

function Chevron({ open }) {
  return (
    <svg
      className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20" fill="none" aria-hidden="true"
    >
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DropItem({ label, open, onToggle, children }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg text-sm font-semibold text-gray-800 transition flex items-center gap-1.5
                    ${open ? "bg-gray-100" : "hover:bg-gray-100"}`}
        aria-expanded={open}
      >
        {label}
        <Chevron open={open} />
      </button>

      {/* dropdown card */}
      <div
        className={`absolute right-0 top-[calc(100%+8px)] w-[min(92vw,680px)] origin-top-right
                    transition-all duration-200
                    ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white/90 backdrop-blur-xl">
          {/* ligne gradient ultra fine */}
          <div className="h-[2px]" style={{ backgroundImage: BRAND_GRADIENT }} />
          {children}
        </div>
      </div>
    </div>
  );
}

function Panel({ children }) {
  return <div className="p-5 sm:p-6">{children}</div>;
}

function Section({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function Divider() {
  return <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />;
}

function LinkRow({ title, desc, href }) {
  return (
    <a
      href={href}
      className="group rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition flex items-start gap-3"
    >
      <div className="mt-1 h-2 w-2 rounded-full bg-gray-400 group-hover:bg-blue-600 transition" />
      <div>
        <div className="font-semibold text-gray-900 group-hover:text-blue-700">{title}</div>
        <div className="text-xs text-gray-600 mt-0.5">{desc}</div>
      </div>
    </a>
  );
}

function Stat({ title, note }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-blue-900">
      <div className="text-sm font-extrabold">{title}</div>
      <div className="text-[11px] opacity-80">{note}</div>
    </div>
  );
}

function PlansPreview() {
  const plans = [
    { name: "Starter", price: "19€", bullets: ["Audits 5 pages", "Recommandations basiques"] },
    { name: "Pro", price: "49€", bullets: ["Audits Illimité", "Recommandations avancées", "Alertes+PDF"], featured: true },
    { name: "Entreprise", price: "99€", bullets: ["Plan Pro +", "Support prioritaire", "API"] },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {plans.map((p) => (
        <div
          key={p.name}
          className={`rounded-xl border p-3 ${p.featured ? "border-blue-400/70 bg-blue-50/60" : "border-gray-200 bg-white"} shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold">{p.name}</div>
            <div className={`text-sm ${p.featured ? "text-blue-700" : "text-gray-700"}`}>{p.price}/mois</div>
          </div>
          <div className="mt-1 text-[11px] text-gray-600">{p.bullets.join(" • ")}</div>
          <a href="#pricing" className="mt-2 inline-flex text-[12px] font-semibold underline underline-offset-4 hover:text-blue-700">
            Détails
          </a>
        </div>
      ))}
    </div>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Esc pour fermer
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="md:hidden">
      {/* Bouton burger */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100"
        title="Menu"
      >
        <span className="sr-only">Ouvrir le menu</span>☰
      </button>

      {/* Overlay + panel mobile */}
      <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Overlay semi-opaque */}
        <div
          className={`absolute inset-0 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setOpen(false)}
        />

        {/* Panel blanc premium */}
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white/95 backdrop-blur-md shadow-2xl p-6 transition-transform
                      ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-lg">Menu</span>
            <button onClick={() => setOpen(false)} className="h-9 w-9 rounded-lg bg-gray-100" title="Fermer">
              ✕
            </button>
          </div>

          <nav className="mt-6 space-y-4">
            <a href="#benefits" onClick={() => setOpen(false)} className="block font-semibold text-gray-900">
              Avantages
            </a>
            <a href="#pricing" onClick={() => setOpen(false)} className="block font-semibold text-gray-900">
              Tarifs
            </a>
            <a href="#faq" onClick={() => setOpen(false)} className="block font-semibold text-gray-900">
              Ressources / FAQ
            </a>

            <Link
              to="/tarifs"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center w-full px-5 py-3 rounded-xl font-semibold text-white shadow-sm"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              Voir les offres
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
