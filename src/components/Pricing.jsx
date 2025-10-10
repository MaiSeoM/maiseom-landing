// src/components/Pricing.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { trackEvent } from "../lib/analytics.js";
import { Link } from "react-router-dom";
import ModalWaitlist from "./ModalWaitlist.jsx";

const brandGrad = "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)";

export default function Pricing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  const plans = [
    {
      name: "Starter",
      price: 19,
      period: "/mois",
      bullets: ["5 Audits/mois ", "Recommandations IA basiques", "Export CSV"],
      cta: "Choisir Starter",
      featured: false,
    },
    {
      name: "Pro",
      price: 49,
      period: "/mois",
      bullets: [
        "Audit illimité",
        "Recommandations IA avancées",
        "Correction automatique IA-SEO",
        "Alertes e-mail + PDF",
        "Schema.org assisté",
      ],
      cta: "Choisir Pro",
      featured: true,
      ribbon: "-30% à vie",
    },
    {
      name: "Entreprise",
      price: 99,
      period: "/mois",
      bullets: [
        "Tout le plan Pro",
        "Support prioritaire",
        "Intégrations & API",
        "Conçu pour une utilisation MULTI-SITE",
      ],
      cta: "Contacter l’équipe",
      featured: false,
      prefix: "À partir de",
      badge: "Sur mesure",
    },
  ];

  function openModal(planName) {
    setSelectedPlan(planName);
    localStorage.setItem("maiseom_selected_plan", planName);
    trackEvent?.("pricing_intent", {
      plan: planName,
      source: "home_pricing",
    });
    setModalOpen(true);
  }

  return (
    <section
      id="pricing"
      className="py-16 bg-gradient-to-b from-white to-gray-50 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl lg:text-4xl font-extrabold tracking-tight"
          >
            Des plans simples. Pensés pour la croissance.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
            className="mt-2 text-gray-600"
          >
            Bêta : <b>-30% à vie</b> pour les 50 premiers clients.
          </motion.p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 * i }}
              className="relative"
            >
              {/* Bordure dégradée premium */}
              <div
                className={`p-[2px] rounded-2xl ${
                  p.featured
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400"
                    : "bg-gray-200"
                } transition-transform duration-300 hover:scale-[1.04] hover:shadow-2xl`}
              >
                <div className="relative rounded-2xl bg-white p-6 shadow">
                  {p.ribbon && (
                    <div className="absolute -top-3 right-4 text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white shadow">
                      {p.ribbon}
                    </div>
                  )}

                  {p.badge && (
                    <div className="absolute -top-3 left-4 text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow">
                      {p.badge}
                    </div>
                  )}

                  <h3
                    className={`text-lg font-bold ${
                      p.featured ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {p.name}
                  </h3>

                  {/* Prix */}
                  <div className="mt-1">
                    {p.prefix && (
                      <div className="text-xs font-medium text-gray-500 mb-0.5">
                        {p.prefix}
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">
                        {new Intl.NumberFormat("fr-FR").format(p.price)}€
                      </span>
                      <span className="text-sm text-gray-600">
                        HT{p.period}
                      </span>
                    </div>
                  </div>

                  {/* Points clés */}
                  <ul className="mt-4 text-sm text-gray-700 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b}>✔ {b}</li>
                    ))}
                  </ul>

                  {/* CTA → ouvre la modale d’intention */}
                  <button
                    type="button"
                    onClick={() => openModal(p.name)}
                    className="mt-6 w-full inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white shadow-md transition hover:opacity-90"
                    style={{
                      backgroundImage: p.featured
                        ? brandGrad
                        : "linear-gradient(90deg,#6B7280 0%,#9CA3AF 100%)",
                    }}
                  >
                    {p.cta}
                  </button>

                  {p.featured && (
                    <p className="mt-3 text-xs text-center text-gray-500">
                      Plan recommandé
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Prix <b>HT</b>, TVA applicable. Sans engagement. Annulation en 1 clic.
        </p>

        {/* Bouton vers la page tarifs — responsive propre */}
        <div className="mt-12 text-center">
          <Link
            to="/tarifs"
            className="inline-block rounded-xl font-semibold text-white shadow-lg transition-all hover:scale-[1.05] hover:shadow-xl
                       px-4 py-2 text-sm
                       sm:px-5 sm:py-2.5 sm:text-base
                       md:px-6 md:py-3 md:text-lg"
            style={{ backgroundImage: brandGrad }}
          >
            Voir le détail de nos offres
          </Link>
        </div>
      </div>

      {/* Modale d’intention (même que /tarifs) */}
      <ModalWaitlist
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        planDefault={selectedPlan}
      />
    </section>
  );
}
