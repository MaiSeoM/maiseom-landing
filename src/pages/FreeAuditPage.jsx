// src/pages/FreeAuditPage.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "../lib/analytics.js";
import Seo from "../components/Seo.jsx";

const FREE_AUDIT_ENDPOINT = "https://maiseom.app.n8n.cloud/webhook/free-audit";

function safeNumber(n, fallback = "—") {
  if (n === null || n === undefined || Number.isNaN(n)) return fallback;
  return Math.round(Number(n));
}

function toneFromScore(score) {
  if (score == null) return "neutral";
  if (score >= 80) return "excellent";
  if (score >= 70) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

function normalizeFreeAuditResponse(data) {
  const base = Array.isArray(data) ? data[0] : data;
  if (!base) return null;
  if (base.kpis && (base.topIssues || base.quickWins)) return base;
  if (base.body && base.body.kpis) return base.body;
  return null;
}

export default function FreeAuditPage() {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error
  const [errorMessage, setErrorMessage] = useState("");
  const [audit, setAudit] = useState(null);
  const [progress, setProgress] = useState(0);

  // 1B: sticky CTA mobile (répétition intelligente)
  const [showStickyCta, setShowStickyCta] = useState(false);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (status !== "loading") return;
    setProgress(8);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p < 70) return p + 8;
        if (p < 92) return p + 2;
        return p;
      });
    }, 450);
    return () => clearInterval(id);
  }, [status]);

  const hasResults = status === "ok" && !!audit;

  const seoScore = audit?.kpis?.seo ?? null;
  const iaScore = audit?.kpis?.aiSeoLite ?? null;
  const quickScore = audit?.kpis?.quickScore ?? null;

  const topIssues = Array.isArray(audit?.topIssues) ? audit.topIssues : [];
  const quickWins = Array.isArray(audit?.quickWins) ? audit.quickWins : [];
  const locked = audit?.locked ?? null;
  const cta = audit?.cta ?? null;

  const issuesToShow = useMemo(() => topIssues.slice(0, 2), [topIssues]);
  const quickWinToShow = useMemo(() => quickWins.slice(0, 1), [quickWins]);

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setAudit(null);
    setShowStickyCta(false);

    let cleanDomain = (domain || "").trim();
    const cleanEmail = (email || "").trim();

    if (!cleanDomain) {
      setErrorMessage("Merci d'indiquer un domaine à auditer.");
      return;
    }
    if (!/^https?:\/\//i.test(cleanDomain)) cleanDomain = "https://" + cleanDomain;

    if (!cleanEmail) {
      setErrorMessage("Merci d'indiquer votre email.");
      return;
    }

    setStatus("loading");
    setProgress(10);

    try {
      trackEvent?.("free_audit_start", { domain: cleanDomain });

      const res = await fetch(FREE_AUDIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanDomain, email: cleanEmail }),
      });

      const data = await res.json().catch(() => null);
      const normalized = normalizeFreeAuditResponse(data);

      if (!res.ok || !normalized) {
        setStatus("error");
        setErrorMessage("Impossible d'obtenir l'audit pour le moment. Réessayez dans un instant.");
        trackEvent?.("free_audit_error", { domain: cleanDomain });
        return;
      }

      setAudit(normalized);
      setStatus("ok");
      setProgress(100);
      trackEvent?.("free_audit_success", { domain: cleanDomain });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 180);
    } catch (err) {
      setStatus("error");
      setErrorMessage("Erreur réseau. Vérifiez votre connexion puis réessayez.");
      trackEvent?.("free_audit_error", { err: String(err) });
    }
  }

  // ✅ CTA final : vers /tarifs (pas de CTA secondaire)
  const pricingHref = cta?.primary?.href || "/tarifs?from=free-audit";

  // 1B: afficher une barre sticky mobile après que l'utilisateur a commencé à scroller les résultats
  useEffect(() => {
    if (!hasResults) return;

    function onScroll() {
      const el = resultsRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Dès que les résultats sont globalement visibles (le top est passé), on peut activer la sticky
      const shouldShow = rect.top < 120; // ajustable
      setShowStickyCta(shouldShow);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
      {/* Bandeau sticky succès */}
      {hasResults && (
        <div className="sticky top-16 z-40 border-b border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-emerald-100/50 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-600/25">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-emerald-900">
                Audit terminé — Résultats disponibles ci-dessous
              </span>
            </div>
            <button
              onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-800"
            >
              Voir les résultats
            </button>
          </div>
        </div>
      )}
<Seo
  title="Audit SEO IA Gratuit | Google, SGE & ChatGPT – MaiSeoM"
  description="Analysez gratuitement votre site : SEO, performance et visibilité IA (Google SGE, ChatGPT, Perplexity). Résultats immédiats et recommandations prioritaires."
  canonical="https://www.maiseom.com/audit/free"
  jsonLd={{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.maiseom.com/audit/free#webpage",
      "name": "Audit SEO IA Gratuit",
      "url": "https://www.maiseom.com/audit/free",
      "isPartOf": { "@id": "https://www.maiseom.com/#website" },
      "about": { "@id": "https://www.maiseom.com/#app" },
      "inLanguage": "fr-FR"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.maiseom.com/audit/free#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Que contient le Free Audit MaiSeoM ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Un aperçu rapide : scores SEO et IA-SEO, 2 problèmes prioritaires et 1 quick win. Le rapport complet (priorisation P1/P2/P3, export PDF, visibilité IA complète) est disponible sur les plans payants."
          }
        },
        {
          "@type": "Question",
          "name": "Est-ce que l’audit modifie mon site ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Non. MaiSeoM analyse uniquement le contenu public (HTML) comme un moteur de recherche. Aucun accès admin n’est requis."
          }
        },
        {
          "@type": "Question",
          "name": "Pourquoi l’audit est limité en version gratuite ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pour protéger l’infrastructure et éviter les abus. Les plans Starter/Pro débloquent plus d’analyses, l’historique, et les exports."
          }
        }
      ]
    }
  ]
}}

/>



      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        {/* Formulaire principal */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm lg:p-10">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit IA-SEO gratuit</h1>
              <p className="mt-2 text-base leading-relaxed text-slate-600">
                Obtenez un premier diagnostic de votre visibilité IA en quelques secondes.
                Analyse automatisée des signaux critiques.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">URL du site à analyser</label>
                <input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="https://www.votre-site.com"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Votre email professionnel</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@entreprise.com"
                  type="email"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:hover:from-blue-600 disabled:hover:to-indigo-600"
              onClick={() => trackEvent?.("cta_click", { location: "free_audit", label: "run_free_audit" })}
            >
              {status === "loading" ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <span>Lancer l'audit gratuit</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {status === "loading" && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Analyse en cours</span>
                  <span className="font-bold text-blue-600">{Math.min(progress, 99)}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/80">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.min(progress, 99)}%` }}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <AnalysisStep icon="🔍" label="Scan SEO" />
                  <AnalysisStep icon="⚡" label="Performance" />
                  <AnalysisStep icon="🤖" label="IA-SEO Lite" />
                </div>

                <p className="mt-4 text-center text-xs text-slate-500">
                  L'analyse prend généralement 15 à 30 secondes. Ne fermez pas cette page.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-rose-100">
                  <span className="text-sm">⚠</span>
                </div>
                <p className="text-sm text-rose-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {hasResults && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-600">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-emerald-900">
                  Audit terminé avec succès. Consultez vos résultats ci-dessous.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ✅ IMPORTANT : aucune section avant la fin de l'audit */}
        {hasResults && (
          <div ref={resultsRef} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreCard label="Score SEO" score={seoScore} />
              <ScoreCard label="Score IA-SEO" score={iaScore} subtitle="Version simplifiée" />
              <ScoreCard label="Quick Score" score={quickScore} />
            </div>

            {/* Problèmes détectés */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                  <svg className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Points d'amélioration prioritaires</h2>
                  <p className="text-sm text-slate-600">Problèmes détectés ayant un impact sur votre visibilité</p>
                </div>
              </div>

              <div className="space-y-3">
                {issuesToShow.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 transition-all hover:border-rose-200 hover:bg-rose-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
                        {idx + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-900">{it.title}</p>
                    </div>
                    <span className="flex-none rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {it.priority || "P1"}
                    </span>
                  </div>
                ))}

                {locked?.issuesHidden && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🔒</span>
                      <p className="text-sm text-slate-700">
                        <strong className="font-semibold text-slate-900">{locked.issuesHidden} autres problèmes</strong>{" "}
                        masqués dans la version gratuite.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Win */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Action rapide recommandée</h2>
                  <p className="text-sm text-slate-600">Optimisation à impact immédiat</p>
                </div>
              </div>

              {quickWinToShow.length > 0 ? (
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-600">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-900">{quickWinToShow[0].title}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-600">
                    ✅ Quick win indisponible sur cet audit (Starter = recommandations complètes).
                  </p>
                </div>
              )}

              {locked?.message && (
                <div className="mt-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4">
                  <p className="text-sm text-slate-700">{locked.message}</p>
                </div>
              )}
            </div>

            {/* ✅ BLOC 1-4 + CTA unique + FAQ */}
            <UpgradeSection
              pricingHref={pricingHref}
              onCtaClick={() =>
                trackEvent?.("cta_click", { location: "free_audit_post_results", label: "pricing_primary" })
              }
            />

            <p className="text-center text-xs text-slate-400">
              * L'audit gratuit est volontairement limité pour garantir la qualité du service.
            </p>
          </div>
        )}
      </div>

      {/* 1B: Sticky bottom CTA (mobile only), même CTA, même décision */}
      {hasResults && (
        <MobileStickyCta
          show={showStickyCta}
          href={pricingHref}
          onClick={() => trackEvent?.("cta_click", { location: "free_audit_sticky_mobile", label: "pricing_primary" })}
        />
      )}
    </div>
  );
}

/* =============== Components =============== */

function AnalysisStep({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white/60 px-4 py-3">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm">{icon}</span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
}

function ScoreCard({ label, score, subtitle }) {
  const n = score === null || score === undefined ? null : Number(score);
  const s = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
  const tone = toneFromScore(s);

  const colors = {
    excellent: { bg: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-200/60", text: "text-emerald-700" },
    good: { bg: "from-blue-500/10 to-blue-600/5", border: "border-blue-200/60", text: "text-blue-700" },
    warn: { bg: "from-amber-500/10 to-amber-600/5", border: "border-amber-200/60", text: "text-amber-700" },
    bad: { bg: "from-rose-500/10 to-rose-600/5", border: "border-rose-200/60", text: "text-rose-700" },
    neutral: { bg: "from-slate-500/10 to-slate-600/5", border: "border-slate-200/60", text: "text-slate-700" },
  };

  const c = colors[tone] || colors.neutral;

  const statusText = {
    excellent: "Excellent",
    good: "Très bon",
    warn: "À améliorer",
    bad: "Critique",
    neutral: "En attente",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-6 shadow-md ${c.border} ${c.bg}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      <p className={`mt-4 text-4xl font-bold ${c.text}`}>{s != null ? `${safeNumber(s)}%` : "—"}</p>
      <p className="mt-2 text-sm font-medium text-slate-600">{statusText[tone]}</p>
    </div>
  );
}

function UpgradeSection({ pricingHref, onCtaClick }) {
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm lg:p-10">
      {/* 🔹 BLOC 1 — TITRE DE TRANSITION */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
          Votre site est analysé.
          <br />
          Mais ce n’est que la surface.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          Cet audit gratuit révèle les signaux visibles.
          <br className="hidden sm:inline" />
          Mais les moteurs IA utilisent bien plus de critères
          <br className="hidden sm:inline" />
          pour décider quels sites ils citent… ou ignorent.
        </p>
      </div>

      {/* 🔒 BLOC 2 — LIMITES */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-lg font-bold text-slate-900">Ce que la version gratuite ne montre pas</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Pour éviter les audits génériques, certaines données sont volontairement
          <br className="hidden sm:inline" />
          masquées dans la version gratuite.
        </p>

        <ul className="mt-5 space-y-2.5">
          {[
            "Priorisation complète des problèmes (P1 / P2 / P3)",
            "Visibilité réelle sur ChatGPT, Perplexity et Google SGE",
            "Recommandations IA actionnables page par page",
            "Rapport PDF prêt à être partagé",
            "Historique et suivi du domaine",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-200 text-xs">
                🔒
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm font-semibold text-slate-900">
          Ces éléments sont pourtant ceux qui font réellement la différence
          <br className="hidden sm:inline" />
          sur la visibilité IA.
        </p>
      </div>

      {/* 🚀 BLOC 3 — PRO */}
      <div className="mt-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6">
        <h3 className="text-lg font-bold text-slate-900">Ce que vous débloquez avec le plan Pro</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Le plan Pro vous donne accès à l’audit IA-SEO complet,
          <br className="hidden sm:inline" />
          sans limitation artificielle.
        </p>

        <ul className="mt-5 space-y-2.5">
          {[
            "✅ Analyse IA-SEO complète (intent, FAQ, schémas, E-E-A-T)",
            "✅ Priorités claires : quoi corriger en premier et pourquoi",
            "✅ Estimation de visibilité sur les moteurs IA",
            "✅ Quick wins réellement exploitables",
            "✅ Rapport PDF prêt à envoyer ou à présenter",
          ].map((item, i) => (
            <li key={i} className="text-sm text-slate-800">{item}</li>
          ))}
        </ul>

        <p className="mt-5 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Un seul domaine.</span> Sans engagement. Résiliable à tout moment.
        </p>
      </div>

      {/* 🎯 BLOC 4 — CTA PRINCIPAL (1 seul) — 1B: plus visible + micro-rassurance */}
      <div className="mt-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-5 sm:p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:gap-3">
            <p className="text-sm font-semibold text-white/90">
              Suite logique : débloquer l’audit IA-SEO complet
            </p>

            <Link
              to={pricingHref}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-slate-50 sm:max-w-xl"
              onClick={onCtaClick}
            >
              <span>Débloquer l’audit IA-SEO complet</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/70">
              <span className="inline-flex items-center gap-1">⚡ Accès immédiat</span>
              <span className="hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1">🛡️ Aucun risque</span>
              <span className="hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1">🔎 Audit non intrusif</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FAQ (accordion) */}
      <FaqSection
        items={[
          {
            q: "Est-ce que MaiSeoM modifie mon site ?",
            a: "Non. L’audit analyse uniquement le HTML public, exactement comme un moteur de recherche. Aucune modification n’est effectuée.",
          },
          {
            q: "Puis-je tester plusieurs domaines avec le plan Starter ?",
            a: "Non. Le plan Starter est volontairement limité à un seul domaine pour garantir des analyses fiables.",
          },
          {
            q: "Est-ce utile si je ne suis pas expert SEO ?",
            a: "Oui. Les recommandations sont pensées pour être comprises et appliquées sans expertise technique.",
          },
        ]}
      />
    </div>
  );
}

/* ===========================
   1B: Mobile sticky CTA (même CTA)
   =========================== */

function MobileStickyCta({ show, href, onClick }) {
  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-50 sm:hidden",
        "transition-all duration-200",
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur">
          <Link
            to={href}
            onClick={onClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Débloquer l’audit IA-SEO complet
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-2 text-center text-[11px] text-slate-500">Accès immédiat • Aucun risque • Audit non intrusif</p>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   FAQ ACCORDION COMPONENTS
   =========================== */

function FaqSection({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0); // 1ère ouverte par défaut (mets null pour tout fermé)

  return (
    <div className="mt-10 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm lg:p-8">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">FAQ</p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">Questions fréquentes</h3>
        <p className="mt-2 text-sm text-slate-600">Cliquez sur une question pour afficher la réponse</p>
      </div>

      <div className="space-y-3">
        {items.map((it, idx) => (
          <FaqRow
            key={idx}
            q={it.q}
            a={it.a}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex((cur) => (cur === idx ? null : idx))}
          />
        ))}
      </div>
    </div>
  );
}

function FaqRow({ q, a, isOpen, onToggle }) {
  return (
    <div
      className={[
        "rounded-2xl border transition-all",
        isOpen
          ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/30"
          : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-start gap-3">
          <span
            className={[
              "mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold",
              isOpen ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700",
            ].join(" ")}
          >
            ?
          </span>
          <span className="text-sm font-semibold text-slate-900 sm:text-base">{q}</span>
        </div>

        <span
          className={[
            "flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-all",
            isOpen ? "border-blue-200 bg-white text-blue-700" : "border-slate-200 bg-slate-50 text-slate-600",
          ].join(" ")}
        >
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div className={`grid transition-all duration-200 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden px-5 pb-5">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}
