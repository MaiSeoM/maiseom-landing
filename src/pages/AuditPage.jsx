// src/pages/AuditPage.jsx

import { Link } from "react-router-dom";



export default function AuditPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-0 lg:py-16">
        {/* Badge + titre */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Audit IA-SEO • pour PME, agences & solo-makers
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Voyez comment votre site se classe aux yeux des moteurs de recherche…
            et des moteurs IA.
          </h1>

          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Maiseom scanne votre site, mesure les Core Web Vitals, évalue vos signaux
            SEO et IA-SEO (intent, FAQ, schémas, E-E-A-T)… et estime même vos positions
            probables sur Google, Google SGE, ChatGPT et Perplexity. Rapport clair,
            actionnable, prêt à être partagé à vos équipes ou vos clients.
          </p>


          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              to="/audit/free"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
            >
              Accéder à l’Audit Gratuit
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Créer un compte
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Aucun accès admin requis. Lecture uniquement du HTML public de votre
            site.
          </p>
        </div>

        {/* 3 colonnes de bénéfices */}
        <div className="mt-10 grid gap-4 md:grid-cols-3 text-sm">
          <FeatureCard
            title="Vue IA + SEO"
            desc="Combine signaux SEO classiques (titles, metas, maillage…) et analyse IA-SEO (intent, FAQ, schémas, préparation moteurs IA)."
          />
          <FeatureCard
            title="Rapport partageable"
            desc="Export PDF propre pour documenter vos audits, vos recommandations et votre travail auprès de vos clients ou de votre direction."
          />
          <FeatureCard
            title="Pensé pour les petites équipes"
            desc="Idéal pour freelancers, agences, PME : pas de setup complexe, vous collez un domaine, vous obtenez un rapport exploitable."
          />
        </div>

        {/* Bloc “Comment ça marche ?” */}
        <div className="mt-12 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Comment ça marche ?
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              De l’URL au rapport IA-SEO en 3 étapes.
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <StepRow
                number={1}
                title="Vous collez votre domaine"
                desc="Par exemple : https://www.votre-site.com. Maiseom détecte automatiquement la page d’accueil / page principale."
              />
              <StepRow
                number={2}
                title="L’agent lance l’audit complet"
                desc="Scan SEO technique + contenu, appel à PageSpeed Insights et analyse IA-SEO (intent, FAQ, schémas, E-E-A-T estimé…)."
              />
              <StepRow
                number={3}
                title="Vous obtenez un rapport structuré"
                desc="Scores globaux, détails par page, quick wins IA-SEO, mots-clés focus et idées de FAQ à implémenter."
              />
            </div>
          </div>

          <div className="rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
              Pour qui ?
            </p>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">
              Pensé pour les profils non-développeurs.
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Freelances SEO / SEA / content.</li>
              <li>• Agences qui veulent un audit rapide à envoyer.</li>
              <li>• Fondateurs & marketers en PME / startups.</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              L’outil ne modifie rien sur votre site : il analyse uniquement ce qui
              est déjà public, comme un moteur de recherche.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepRow({ number, title, desc }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 px-3 py-3">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
        {number}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
