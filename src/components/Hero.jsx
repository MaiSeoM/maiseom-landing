// src/components/Hero.jsx
import { useState } from "react";

// Composants de motion (à adapter selon ton setup)
const MotionSection = ({ children, className }) => <section className={className}>{children}</section>;
const MotionItem = ({ children, delay }) => <div style={{ animationDelay: `${delay}s` }} className="animate-fade-in">{children}</div>;

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIChlP9e-Cr0ysvok38xK7M7yflgfv8elVCqzzQA9rfQGbe760tfdKeOiqfyLiZo8t/exec";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [plan] = useState("Pro");
  const [status, setStatus] = useState("idle");

  async function submitWaitlist(e) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const url = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&plan=${encodeURIComponent(plan)}&source=landing&ts=${Date.now()}`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok && res.type !== "opaque") throw new Error("bad status");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("ko");
    }
  }

  return (
    <MotionSection className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-white pt-20 pb-16 lg:pt-32 lg:pb-24">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl" />
        </div>
        <div className="absolute right-0 top-1/4 -translate-y-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-400/15 to-pink-400/15 blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Badge de lancement */}
        <MotionItem delay={0.0}>
          <div className="mb-8 flex justify-center">
            <div className="group inline-flex items-center gap-3 rounded-full border border-indigo-200/60 bg-white/80 px-4 py-2 shadow-lg shadow-indigo-500/10 backdrop-blur-sm transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-700">
                Nouveau : MaiSeoM Parrainage
              </span>
              <svg className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </MotionItem>

        {/* Titre principal */}
        <div className="mx-auto max-w-5xl text-center">
          <MotionItem delay={0.08}>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Dominez les moteurs IA
              <br />
              avant vos{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  concurrents
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C100 2 200 2 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="50%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </MotionItem>

          <MotionItem delay={0.16}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              MaiSeoM analyse votre site pour <strong className="font-semibold text-slate-900">Google SGE, ChatGPT, Perplexity</strong> et vous révèle comment être cité comme source de confiance. 
              Audit SEO + IA-SEO + Core Web Vitals en une seule plateforme.
            </p>
          </MotionItem>

          {/* CTA principal */}
          <MotionItem delay={0.24}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/audit/free"
                className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
              >
                <span className="relative z-10">Analyser mon site gratuitement</span>
                <svg className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>

              <a
                href="/tarifs"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
              >
                <span>Voir les offres</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Résultat en 30 secondes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Lecture seule · Non intrusif</span>
              </div>
            </div>
          </MotionItem>

          {/* Social Proof - Avis et stats */}
          <MotionItem delay={0.32}>
            <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-8 lg:gap-12">
              {/* Avis clients */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    M
                  </div>
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    L
                  </div>
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    +
                  </div>
                </div>
                <div className="ml-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-900">4.9/5</span> · 127 avis
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200"></div>

              {/* Stats impressionnantes */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">2,400+</p>
                  <p className="text-xs text-slate-600">Sites analysés</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">94%</p>
                  <p className="text-xs text-slate-600">Satisfaction client</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">+45%</p>
                  <p className="text-xs text-slate-600">Visibilité IA moy.</p>
                </div>
              </div>
            </div>
          </MotionItem>
        </div>

        {/* Visuel principal avec cartes flottantes */}
        <MotionItem delay={0.40}>
          <div className="relative mx-auto mt-16 max-w-6xl">
            <div className="relative rounded-2xl border border-slate-200/60 bg-white/50 p-2 shadow-2xl backdrop-blur-sm">
              <div className="overflow-hidden rounded-xl">
                <img
                  src="/hero.png"
                  alt="Dashboard MaiSeoM"
                  className="w-full"
                />
              </div>

              {/* Carte flottante - Score IA-SEO */}
              <div className="absolute -left-8 top-1/4 hidden lg:block">
                <div className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 blur-xl transition-opacity group-hover:opacity-30" />
                  <div className="relative rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xl backdrop-blur-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Score IA-SEO</p>
                        <p className="text-xs text-slate-500">Visibilité IA</p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-900">78<span className="text-2xl text-slate-500">%</span></div>
                    <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">+12% ce mois</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte flottante - Moteurs IA */}
              <div className="absolute -right-8 top-1/2 hidden lg:block">
                <div className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 opacity-20 blur-xl transition-opacity group-hover:opacity-30" />
                  <div className="relative rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xl backdrop-blur-sm">
                    <p className="mb-4 text-sm font-semibold text-slate-900">Visibilité sur les IA</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm text-slate-600">ChatGPT</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">45%</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-indigo-500" />
                          <span className="text-sm text-slate-600">Google SGE</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">12ᵉ</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          <span className="text-sm text-slate-600">Perplexity</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">38%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte flottante - Quick Wins */}
              <div className="absolute -bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
                <div className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 opacity-20 blur-xl transition-opacity group-hover:opacity-30" />
                  <div className="relative flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white px-6 py-4 shadow-xl backdrop-blur-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Quick Wins détectés</p>
                      <p className="text-xs text-slate-500">3 optimisations rapides disponibles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionItem>

        {/* Témoignages clients en bas */}
        <MotionItem delay={0.56}>
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Recommandé par des centaines d'e-commerçants
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {/* Témoignage 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                <div className="mb-3 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  "MaiSeoM nous a permis d'être cités par ChatGPT sur nos requêtes principales. Le ROI est impressionnant."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Antoine M.</p>
                    <p className="text-xs text-slate-500">CEO · E-commerce mode</p>
                  </div>
                </div>
              </div>

              {/* Témoignage 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                <div className="mb-3 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  "L'audit IA-SEO a révélé des angles morts que nos concurrents ignorent. On a gagné 40% de visibilité en 2 mois."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Marie L.</p>
                    <p className="text-xs text-slate-500">CMO · SaaS B2B</p>
                  </div>
                </div>
              </div>

              {/* Témoignage 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                <div className="mb-3 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  "Interface claire, recommandations actionnables. En 3 semaines, notre site est devenu une source de référence pour Perplexity."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Lucas D.</p>
                    <p className="text-xs text-slate-500">Founder · Marketplace</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionItem>
      </div>
    </MotionSection>
  );
}