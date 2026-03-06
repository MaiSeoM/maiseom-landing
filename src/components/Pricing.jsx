// src/components/Pricing.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { trackEvent } from "../lib/analytics.js";
import { Link } from "react-router-dom";
import ModalWaitlist from "./ModalWaitlist.jsx";
import FreeAuditEntry from "./FreeAuditEntry.jsx";
import { startCheckout } from "../lib/billing.js";
import { useAuth } from "../auth/AuthContext.jsx"; // optionnel si tu l'as

const brandGrad = "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)";

export default function Pricing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [loadingPlan, setLoadingPlan] = useState(null); // "Starter" | "Pro" | null

  // Si tu as un AuthContext, on l'utilise uniquement pour améliorer l'UX (pas obligatoire)
  // (si pas dispo ou pas utilisé, aucun souci)
  const auth = (() => {
    try {
      return useAuth?.();
    } catch {
      return null;
    }
  })();

  const plans = [
    {
      name: "Starter",
      price: 19,
      period: "/mois",
      bullets: ["5 Audits/mois", "Recommandations IA basiques", "Export CSV"],
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
      ribbon: "Populaire",
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
    trackEvent?.("pricing_intent", { plan: planName, source: "home_pricing" });
    setModalOpen(true);
  }

  async function handlePlanClick(planName) {
    // Entreprise: on garde la modale / contact
    if (planName === "Entreprise") {
      openModal(planName);
      return;
    }

    // Starter/Pro : checkout direct
    setLoadingPlan(planName);
    try {
      trackEvent?.("cta_click", {
        location: "pricing_section",
        label: `choose_${planName.toLowerCase()}`,
      });

      await startCheckout(planName); // "Starter" ou "Pro"
    } catch (e) {
      // si pas connecté → redirige vers login
      if (String(e?.message || e).includes("NOT_LOGGED_IN")) {
        // petit confort UX : mémoriser le plan choisi
        localStorage.setItem("maiseom_selected_plan", planName);
        window.location.href = "/signup";
        return;
      }

      console.error(e);
      alert("Impossible de lancer le paiement. Réessaie.");
    } finally {
      setLoadingPlan(null);
    }
  }

  // ✅ AUTOPAY: si on arrive sur /tarifs?autopay=1&plan=Pro|Starter, on déclenche checkout automatiquement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autopay = params.get("autopay");
    const plan = params.get("plan");

    if (autopay === "1" && plan) {
      // anti double-call + UX
      const normalizedPlan =
        plan.toLowerCase() === "pro"
          ? "Pro"
          : plan.toLowerCase() === "starter"
          ? "Starter"
          : null;

      if (!normalizedPlan) return;

      // évite de relancer plusieurs fois si re-render
      const key = `maiseom_autopay_${normalizedPlan}`;
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");

      setLoadingPlan(normalizedPlan);

      startCheckout(normalizedPlan).catch((err) => {
        console.error(err);
        setLoadingPlan(null);

        // si pas connecté -> login
        if (String(err?.message || err).includes("NOT_LOGGED_IN")) {
          localStorage.setItem("maiseom_selected_plan", normalizedPlan);
          window.location.href = "/signup";
          return;
        }

        alert("Impossible de lancer le paiement. Réessaie.");
      });
    }
  }, []);

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

          

          {/* ✅ CTA Free Audit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <FreeAuditEntry location="pricing_section" />

            {/* Micro confiance */}
            <p className="text-xs text-gray-500">
              Paiement sécurisé • Accès immédiat • Résiliable à tout moment
            </p>
          </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => {
            const isLoading = loadingPlan === p.name;
            const disabled = !!loadingPlan && loadingPlan !== p.name;

            return (
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

                    {/* CTA : Starter/Pro => checkout direct, Entreprise => modale */}
                    <button
                      type="button"
                      onClick={() => handlePlanClick(p.name)}
                      disabled={disabled || isLoading}
                      className={[
                        "mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white shadow-md transition",
                        "hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed",
                      ].join(" ")}
                      style={{
                        backgroundImage: p.featured
                          ? brandGrad
                          : p.name === "Entreprise"
                          ? "linear-gradient(90deg,#111827 0%,#374151 100%)"
                          : "linear-gradient(90deg,#6B7280 0%,#9CA3AF 100%)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Redirection…</span>
                        </>
                      ) : (
                        <span>{p.cta}</span>
                      )}
                    </button>

                    {/* Micro-rassurance sous CTA */}
                    {p.name !== "Entreprise" ? (
                      <p className="mt-3 text-xs text-center text-gray-500">
                        {p.name === "Pro"
                          ? "Accès immédiat •  Facturation mensuelle"
                          : "Accès immédiat • Facturation mensuelle"}
                      </p>
                    ) : (
                      <p className="mt-3 text-xs text-center text-gray-500">
                        Devis rapide • Réponse sous 24h
                      </p>
                    )}

                    {p.featured && (
                      <p className="mt-2 text-xs text-center text-gray-500">
                        Plan recommandé
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Prix <b>HT</b>, TVA applicable • Engagement 3 mois • Annulation en 1 clic.
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
            onClick={() =>
              trackEvent?.("cta_click", {
                location: "pricing_section",
                label: "see_offers",
              })
            }
          >
            Voir le détail de nos offres
          </Link>
        </div>
      </div>

      {/* Modale (Entreprise / intention) */}
      <ModalWaitlist
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        planDefault={selectedPlan}
      />
    </section>
  );
}
