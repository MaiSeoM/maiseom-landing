import MotionSection from "./MotionSection.jsx";
import MotionItem from "./MotionItem.jsx";
import { useState } from "react";
import PlanSelector from "./PlanSelector.jsx";
import { trackEvent } from "../lib/analytics.js";
import { Link } from "react-router-dom";

// ⬅️ Mets ici TON URL Apps Script (celle qui fonctionne déjà)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIChlP9e-Cr0ysvok38xK7M7yflgfv8elVCqzzQA9rfQGbe760tfdKeOiqfyLiZo8t/exec";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Pro");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | ko

  async function submitWaitlist(e) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const url = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&plan=${encodeURIComponent(plan)}&source=landing&ts=${Date.now()}`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok && res.type !== "opaque") throw new Error("bad status");
      trackEvent?.("waitlist_submit", { plan, email_domain: email.split("@")[1] || "" });
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("ko");
    }
  }

  return (
    <MotionSection className="relative bg-gradient-to-b from-white to-gray-50 pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Colonne texte */}
        <div>
          <MotionItem delay={0.0}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Optimisez votre SEO pour <span className="text-indigo-600">l’ère de l’IA 🚀</span>
            </h1>
          </MotionItem>

          <MotionItem delay={0.08}>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
              MaiSeoM permet de faire l'Analyse et l'optimisations IA-SEO automatique prêtes pour Google SGE,
              ChatGPT, Perplexity & co.<br/>
              <br />
              <strong className="text-gray-900">Un seul clic suffit</strong> pour rester visible et convertir plus.<br/>
              Ce qui vous offre un vrai <strong className="text-gray-900">gain de temps et d'energie !</strong>
            </p>
          </MotionItem>

          {/* Sélecteur d’offre */}
          <MotionItem delay={0.14}>
            <div className="mt-8">
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Je suis intéressé par l’offre :
              </label>
              <PlanSelector value={plan} onChange={setPlan} />
            </div>
          </MotionItem>

          {/* Formulaire */}
          <MotionItem delay={0.2}>
            <form onSubmit={submitWaitlist} id="waitlist" className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email professionnel"
                className="flex-1 h-14 rounded-xl border border-gray-300 px-5 text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-14 px-8 rounded-xl font-semibold text-white text-lg shadow-lg transition hover:scale-105 disabled:opacity-60"
                style={{ backgroundImage: "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)" }}
                onClick={() => trackEvent?.("cta_click", { location: "hero", label: "rejoindre_beta", plan })}
              >
                {status === "loading" ? "Envoi…" : "Rejoindre la liste d’attente"}
              </button>
                {/* Bouton secondaire plus propre */}
              <Link
                to="/tarifs"
                className="h-14 px-8 rounded-xl font-semibold text-indigo-700 border border-indigo-200 bg-white shadow-sm transition-all hover:border-indigo-400 hover:text-indigo-900 hover:shadow-md flex items-center justify-center"
              >
                Comprendre nos offres
              </Link>
            </form>

            {status === "ok" && (
              <p className="mt-3 text-green-600 font-medium">
                ✅ Merci ! Nous revenons vers vous très vite.
              </p>
            )}
            {status === "ko" && (
              <p className="mt-3 text-red-600 font-medium">
                ❌ Oups, l’inscription a échoué. Réessayez.
              </p>
            )}
          </MotionItem>
        </div>

        {/* Colonne visuel + bulles KPI sous l'image */}
        <MotionItem delay={0.22}>
          <div className="relative">
            <img
              src="/hero.png"
              alt="Dashboard SEO IA"
              className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
            />

            {/* Ligne de bulles sous l'image */}
            <div className="mt-6 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
              <KpiBubble color="from-emerald-500 to-lime-400" title="78%" subtitle="Clics organiques" />
              <KpiBubble color="from-blue-600 to-cyan-400" title="-32%" subtitle="Erreurs SEO" />
              <KpiBubble color="from-purple-600 to-pink-500" title="A+" subtitle="Score IA-SEO" />
            </div>
          </div>
        </MotionItem>
      </div>
    </MotionSection>
  );
}

/** Bulle KPI premium avec bordure dégradée + glass + effet hover */
function KpiBubble({ color, title, subtitle }) {
  return (
    <div className={`group p-[2px] rounded-2xl bg-gradient-to-r ${color}`}>
      <div
        className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-md
                   px-4 py-3 flex flex-col items-center text-center
                   transition-transform duration-300 ease-out
                   group-hover:scale-[1.04] group-hover:-translate-y-0.5 group-hover:shadow-2xl"
        style={{ backgroundImage: "linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.8))" }}
      >
        <div className={`h-2.5 w-2.5 rounded-full mb-2 bg-gradient-to-r ${color} shadow`} />
        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{title}</div>
        <div className="text-xs text-gray-600 -mt-0.5">{subtitle}</div>
        <div className={`mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r ${color}
                         opacity-60 transition-opacity duration-300 group-hover:opacity-100`} />
      </div>
    </div>
  );
}
