// src/pages/PricingPage.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModalWaitlist from "../components/ModalWaitlist.jsx";
import { startCheckout } from "../lib/billing.js";
import { trackEvent } from "../lib/analytics.js";

const brandGrad = "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)";

export default function PricingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [loadingPlan, setLoadingPlan] = useState(null); // "Starter" | "Pro" | null

  // Scroll top automatique à l’arrivée sur la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ AUTOPAY: /tarifs?autopay=1&plan=Pro|Starter => déclenche checkout automatiquement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autopay = params.get("autopay");
    const plan = params.get("plan");

    if (autopay === "1" && plan) {
      const normalizedPlan =
        plan.toLowerCase() === "pro"
          ? "Pro"
          : plan.toLowerCase() === "starter"
          ? "Starter"
          : null;

      if (!normalizedPlan) return;

      // éviter double déclenchement (re-render / navigation)
      const key = `maiseom_autopay_${normalizedPlan}`;
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");

      // UI loading
      setLoadingPlan(normalizedPlan);

      trackEvent?.("cta_click", {
        location: "pricing_page",
        label: `autopay_${normalizedPlan.toLowerCase()}`,
      });

      startCheckout(normalizedPlan).catch((e) => {
        console.error(e);
        setLoadingPlan(null);

        // si pas connecté -> login
        if (String(e?.message || e).includes("NOT_LOGGED_IN")) {
          localStorage.setItem("maiseom_selected_plan", normalizedPlan);
          window.location.href = "/login";
          return;
        }

        alert("Impossible de lancer le paiement. Réessaie.");
      });
    }
  }, []);

  function openModal(plan) {
    setSelectedPlan(plan);
    setModalOpen(true);
  }

  async function handleCheckout(planName) {
    // Entreprise => modale / contact
    if (planName === "Entreprise") {
      trackEvent?.("cta_click", {
        location: "pricing_page",
        label: "contact_enterprise",
      });
      openModal("Entreprise");
      return;
    }

    setLoadingPlan(planName);
    try {
      trackEvent?.("cta_click", {
        location: "pricing_page",
        label: `choose_${planName.toLowerCase()}`,
      });

      await startCheckout(planName); // "Starter" ou "Pro"
    } catch (e) {
      if (String(e?.message || e).includes("NOT_LOGGED_IN")) {
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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Bande couleur top + halos */}
      <section className="relative overflow-visible">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="h-2 w-full" style={{ backgroundImage: brandGrad }} />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Tarifs <span className="text-indigo-600">clairs</span>, valeur{" "}
            <span className="text-indigo-600">immédiate</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 text-lg text-gray-600"
          >
            Tous les prix sont <b>Hors Taxes</b>. Comprenez en un clin d’œil ce
            que fait chaque offre.
          </motion.p>

          {/* micro-rassurance */}
          <p className="mt-4 text-sm text-gray-500">
            Paiement sécurisé • Accès immédiat • Résiliation en 1 clic
          </p>
        </div>
      </section>

      {/* Bande info */}
      <ColorBand
        title="Résumé express"
        subtitle="Starter : 5 autis par mois. Pro : Audit ilimités pour 1 seul domaine. Entreprise : multi-sites + intégrations."
      />

      {/* Cartes plans */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <PlanCard
          ribbon="Essentiel"
          label="Starter"
          price="19€"
          ht
          tagline="5 audits / mois. Recommandations prêtes, à appliquer par vous-même."
          bullets={[
            "5 audits SEO & IA-SEO / mois",
            "Détection : titres, metas, schémas, perfs, maillage",
            "Recommandations priorisées et actionnables",
            "Application automatique : non (DIY)",
            "Rapport mensuel (PDF)",
            "Support e-mail (standard)",
          ]}
          who="Freelances, petits sites, premier pas IA-SEO."
          onCheckout={handleCheckout}
          ctaLabel="Choisir Starter"
          loading={loadingPlan === "Starter"}
          disabled={!!loadingPlan && loadingPlan !== "Starter"}
        />

        <PlanCard
          highlight
          ribbon="Le plus choisi"
          label="Pro"
          price="49€"
          ht
          tagline="Audits illimités + IA-SEO avancé + application automatique."
          bullets={[
            "Audits illimités (1 domaine)",
            "Recommandations IA-SEO avancées",
            "Application simplifier",
            "Suivi CTR (résultats IA) & alertes intelligentes",
            "Rapports hebdo + exports",
            "Support prioritaire",
          ]}
          footnote="* Via plugin/API/FTP selon faisabilité. Validation possible avant déploiement."
          who="PME ambitieuses, e-commerces, SaaS."
          onCheckout={handleCheckout}
          ctaLabel="Choisir Pro"
          loading={loadingPlan === "Pro"}
          disabled={!!loadingPlan && loadingPlan !== "Pro"}
        />

        <PlanCard
          ribbon="Sur mesure"
          label="Entreprise"
          price="À partir de 99€"
          ht
          tagline="L'offre Pro pour plusieurs sites + intégrations & accompagnement."
          bullets={[
            "L'offre Pro pour plusieurs sites",
            "Intégrations data (GA4, GSC, Data Studio…)",
            "Playbooks IA-SEO personnalisés",
            "Onboarding & formation équipe",
            "Support dédié + SLA",
            "API & webhooks (option)",
          ]}
          who="Agences, groupes, réseaux de sites."
          onCheckout={handleCheckout}
          ctaLabel="Contacter le service commercial"
          loading={false}
          disabled={!!loadingPlan} // on bloque pendant une redirection checkout
        />
      </section>

      {/* === BANDE PROMO BETA === */}
      <section className="max-w-5xl mx-auto px-6 pt-8 pb-10 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg">
          <span className="text-lg font-bold tracking-tight">
            -15 % pour les nouveaux inscrits ayant un code de parainage !
          </span>
          
        </div>
        <p className="mt-3 text-sm text-gray-600">
          
        </p>
      </section>

      {/* Comparatif */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-extrabold text-center mb-10">
          Comparez nos <span className="text-indigo-600">offres</span>
        </h2>

        <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-lg bg-white/80 backdrop-blur-md">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-gray-900">
                <th className="px-6 py-4 text-left font-semibold">Fonctionnalités</th>
                <th className="px-6 py-4 text-center font-semibold">Starter</th>
                <th className="px-6 py-4 text-center font-semibold text-indigo-700 bg-white shadow-inner rounded-t-lg">
                  ⭐ Pro
                </th>
                <th className="px-6 py-4 text-center font-semibold">Entreprise</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {[
                {
                  label: "Audits SEO & IA-SEO / mois",
                  starter: "5",
                  pro: "Illimités (1 domaine)",
                  ent: "Illimités (multi-sites)",
                },
                {
                  label: "Recommandations IA-SEO",
                  starter: "Oui (détaillées)",
                  pro: "Oui (avancées)",
                  ent: "Oui (personnalisées)",
                },
                { label: "Application simplifier", starter: "—", pro: "✔️ Oui", ent: "✔️ Oui" },
                { label: "Rapports", starter: "Mensuel (PDF)", pro: "Hebdo + exports", ent: "Personnalisés" },
                { label: "Alertes intelligentes", starter: "—", pro: "✔️ Oui", ent: "✔️ Oui (+ SLA)" },
                { label: "Intégrations (GA4, GSC…)", starter: "—", pro: "Standard", ent: "Étendues + Data Studio" },
                { label: "Support", starter: "E-mail (standard)", pro: "Prioritaire", ent: "Dédié" },
              ].map((r, i) => (
                <tr
                  key={i}
                  className={`transition-colors ${i % 2 === 0 ? "bg-white/70" : "bg-gray-50/70"} hover:bg-indigo-50/40`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{r.label}</td>
                  <td className="px-6 py-4 text-center text-gray-700">{r.starter}</td>
                  <td className="px-6 py-4 text-center font-semibold text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm">
                    {r.pro}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700">{r.ent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-center text-gray-500">
          * Application automatique : titres, metas, schémas, maillage et correctifs de performance (si accès technique possible).
        </p>
      </section>

      {/* Bande “Comment ça marche” */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(96,165,250,0.15),transparent_50%)] blur-2xl pointer-events-none -z-10" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-600 mt-2">3 étapes simples pour des gains rapides</p>

          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Connectez votre site", text: "Indiquez votre domaine. En Pro/Entreprise, autorisez l’accès (plugin/API/FTP)." },
              { n: "2", title: "On audite & on priorise", text: "Nos audits IA-SEO détectent tout et classent les actions à ROI rapide." },
              { n: "3", title: "On optimise & on suit", text: "Starter : vous appliquez. Pro/Entreprise : on déploie + rapports & alertes." },
            ].map((step, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-blue-100 hover:border-blue-400"
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.n}
                </div>

                <h3 className="mt-8 text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                  {step.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{step.text}</p>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-b-2xl" />
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* CTA final */}
      <section className="text-center pb-20">
        <p className="text-gray-600 mb-3">Besoin d’aide pour choisir ?</p>
        <Link
          to="/#contact"
          className="inline-block px-8 py-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
          style={{ backgroundImage: brandGrad }}
        >
          Discutons de vos objectifs 🚀
        </Link>
      </section>

      <div className="h-2 w-full" style={{ backgroundImage: brandGrad }} />

      {/* Modal */}
      <ModalWaitlist
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        planDefault={selectedPlan}
      />
    </div>
  );
}

/* -------- composants locaux -------- */
function ColorBand({ title, subtitle }) {
  return (
    <div className="relative">
      <div className="h-1 w-full" style={{ backgroundImage: brandGrad }} />
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <h3 className="text-xl font-extrabold">{title}</h3>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  ribbon,
  label,
  price,
  ht,
  tagline,
  bullets,
  footnote,
  who,
  onCheckout,
  ctaLabel,
  highlight,
  loading,
  disabled,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl group"
      style={{ overflow: "visible" }}
    >
      <div
        className={`p-[1px] rounded-3xl ${
          highlight ? "bg-gradient-to-r from-indigo-500 to-violet-500 shadow-xl" : "bg-gray-200"
        }`}
      >
        <div className="relative rounded-3xl bg-white/90 backdrop-blur-sm p-7 h-full flex flex-col">
          {ribbon && (
            <div className="absolute -top-3 left-5 z-10 text-xs font-semibold text-white bg-indigo-600 rounded-full px-3 py-1 shadow">
              {ribbon}
            </div>
          )}

          <div>
            <h3 className="text-xl font-extrabold text-gray-900">{label}</h3>
            <p className="text-gray-600 text-sm mt-1">{tagline}</p>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">{price}</span>
              {ht && <span className="text-sm text-gray-500">HT / mois</span>}
            </div>

            <div className="relative mt-4 rounded-xl overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.4) 50%, rgba(255,255,255,0) 70%)",
                }}
              />
              <ul className="relative space-y-3 text-sm text-gray-800 p-2">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 text-lg leading-none mt-[2px]">✔</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {footnote && <p className="mt-2 text-xs text-gray-500">{footnote}</p>}
            {who && (
              <p className="mt-3 text-sm text-gray-700">
                <b>Pour qui ?</b> {who}
              </p>
            )}
          </div>

          <div className="mt-7">
            <button
              type="button"
              disabled={disabled || loading}
              onClick={() => onCheckout?.(label)}
              className="w-full py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundImage: brandGrad }}
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Redirection…
                </span>
              ) : (
                ctaLabel
              )}
            </button>

            {/* micro-rassurance */}
            {label !== "Entreprise" ? (
              <p className="mt-2 text-xs text-center text-gray-500">
                Paiement sécurisé • Accès immédiat • Facturation mensuelle
              </p>
            ) : (
              <p className="mt-2 text-xs text-center text-gray-500">
                Devis rapide • Réponse sous 24h
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------ Countdown ------ */
function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());

  function calcTimeLeft() {
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (timeLeft.d + timeLeft.h + timeLeft.m + timeLeft.s <= 0)
    return <span className="text-sm font-medium">⏰ Offre expirée</span>;

  return (
    <div className="flex items-center gap-2 text-sm font-semibold bg-white/10 rounded-lg px-3 py-1 backdrop-blur-md">
      <span className="text-white/90">Expire dans</span>
      <span className="tabular-nums">{timeLeft.d}j</span>
      <span className="tabular-nums">{timeLeft.h}h</span>
      <span className="tabular-nums">{timeLeft.m}m</span>
      <span className="tabular-nums">{timeLeft.s}s</span>
    </div>
  );
}
