// src/components/FAQ.jsx
import React, { useState } from "react";

export const FAQ_ITEMS = [
  {
    q: "Est-ce utile si je ne suis pas expert SEO ?",
    a: "Oui. Les recommandations sont pensées pour être comprises et appliquées sans expertise technique.",
  },
  {
    q: "Est-ce que MaiSeoM modifie mon site ?",
    a: "Non. L’audit analyse uniquement le HTML public, exactement comme un moteur de recherche. Aucune modification n’est effectuée.",
  },
  {
    q: "Est-ce rapide d'utiliser MaiSeoM ?",
    a: "Oui. MaiSeoM est un outils puissant et rapide qui permets d'analyser le referencement du site internet par les moteurs de recherche IA très rapidement.",
  },
  {
    q: "Puis-je tester plusieurs domaines avec le plan Starter ?",
    a: "Non. Le plan Starter est volontairement limité à un seul domaine pour garantir des analyses fiables.",
  },
  {
    q: "Que fait t-il de plus que les concurrents ?",
    a: "MaiSeoM analyse réelement les performances de votre site par rapport aux moteurs de recherches IA et vous permets de connaitre votre position Google et votre chance d'êtres cités par les IA .",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Questions fréquentes
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Cliquez sur une question pour afficher la réponse.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map((it, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex((cur) => (cur === idx ? null : idx))}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {it.q}
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`grid transition-all duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden px-5 pb-5">
                    <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700">
                      {it.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
