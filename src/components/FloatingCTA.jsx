import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanSelector from "./PlanSelector.jsx";
import { trackEvent } from "../lib/analytics.js";

// ⬅️ Mets ici TON URL Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIChlP9e-Cr0ysvok38xK7M7yflgfv8elVCqzzQA9rfQGbe760tfdKeOiqfyLiZo8t/exec";

// paramètres du compteur
const MIN_SPOTS = 3;             // jamais en dessous
const INIT_MIN = 28;             // fourchette initiale
const INIT_MAX = 55;
const DECAY_HOURS = 6;           // toutes les 6h
const DECAY_MIN = 1;             // -1 à -3
const DECAY_MAX = 3;

// clés localStorage
const LS_SPOTS = "maiseom_spots_left";
const LS_UPDATED = "maiseom_spots_updated_at";

export default function FloatingCTA() {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState(() => localStorage.getItem("maiseom_selected_plan") || "Pro");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ok | ko
  const [spots, setSpots] = useState(() => initSpots());

  // init + decay temporel
  useEffect(() => {
    const { spots: s2 } = maybeDecay();
    setSpots(s2);
  }, []);

  function openModal() {
    const saved = localStorage.getItem("maiseom_selected_plan");
    if (saved) setPlan(saved);
    setOpen(true);
    trackEvent?.("floating_open");
  }

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const url = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&plan=${encodeURIComponent(plan)}&source=floating_cta&ts=${Date.now()}`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok && res.type !== "opaque") throw new Error("bad status");
      localStorage.setItem("maiseom_selected_plan", plan);
      trackEvent?.("waitlist_submit", { via: "floating_cta", plan, email_domain: email.split("@")[1] || "" });
      setStatus("ok");
      setEmail("");

      // décrémente 1 place à l’inscription (sans passer sous MIN_SPOTS)
      const current = getSpots();
      const next = Math.max(MIN_SPOTS, current - 1);
      persistSpots(next);
      setSpots(next);

      setTimeout(() => setOpen(false), 900);
    } catch {
      setStatus("ko");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <>
      {/* Desktop: bouton flottant (≥ sm) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden sm:block fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={openModal}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          🚀 Rejoindre maintenant
          <span className="ml-2 text-white/90 text-xs align-middle bg-white/10 px-2 py-0.5 rounded-full">
            {spots} places restantes
          </span>
        </button>
      </motion.div>

      {/* Mobile: barre collante bas (< sm) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="sm:hidden fixed inset-x-0 bottom-0 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-3 mb-3 rounded-2xl shadow-2xl overflow-hidden border border-white/20 bg-white/90 backdrop-blur-xl">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">Early access</div>
              <div className="text-sm font-medium text-gray-900 truncate">
                Rejoignez la bêta — <span className="text-indigo-600 font-bold">{spots}</span> places restantes
              </div>
            </div>
            <button
              onClick={openModal}
              className="shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md active:scale-[0.98] transition"
            >
              S’inscrire
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal commun */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="w-full max-w-md">
                <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400 shadow-2xl">
                  <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-extrabold text-gray-900">
                        Rejoindre la liste d’attente
                      </h3>
                      <button
                        onClick={() => setOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Fermer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Sélecteur de plan */}
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-900 mb-2 block">
                        Choisissez votre offre
                      </label>
                      <PlanSelector value={plan} onChange={setPlan} />
                    </div>

                    {/* Email + CTA */}
                    <form onSubmit={submit} className="mt-4 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-900 mb-1 block">
                          Email professionnel
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="prenom@entreprise.com"
                          className="w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full h-12 rounded-xl font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundImage: "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)" }}
                      >
                        {status === "loading" ? "Envoi…" : `Rejoindre en ${plan}`}
                      </button>

                      {status === "ok" && (
                        <p className="text-sm text-green-600">✅ Merci ! Vous êtes bien inscrit.</p>
                      )}
                      {status === "ko" && (
                        <p className="text-sm text-red-600">❌ Oups, réessayez dans un instant.</p>
                      )}

                      <p className="text-[11px] text-gray-500 mt-2">
                        En vous inscrivant, vous acceptez d’être contacté à propos de MaiSeoM. Désinscription à tout moment.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- Helpers Compteur ---------------- */

function initSpots() {
  const existing = localStorage.getItem(LS_SPOTS);
  if (existing) return parseInt(existing, 10);

  // valeur initiale réaliste
  const initial = Math.floor(Math.random() * (INIT_MAX - INIT_MIN + 1)) + INIT_MIN;
  persistSpots(initial);
  return initial;
}

function getSpots() {
  const v = parseInt(localStorage.getItem(LS_SPOTS) || "0", 10);
  return Number.isFinite(v) ? v : INIT_MIN;
}

function persistSpots(v) {
  localStorage.setItem(LS_SPOTS, String(v));
  localStorage.setItem(LS_UPDATED, String(Date.now()));
}

function maybeDecay() {
  const last = parseInt(localStorage.getItem(LS_UPDATED) || "0", 10);
  const now = Date.now();
  const hours = (now - last) / (1000 * 60 * 60);

  let current = getSpots();

  if (!last) {
    persistSpots(current);
    return { spots: current };
  }

  if (hours >= DECAY_HOURS) {
    const dec = Math.floor(Math.random() * (DECAY_MAX - DECAY_MIN + 1)) + DECAY_MIN;
    current = Math.max(MIN_SPOTS, current - dec);
    persistSpots(current);
  }
  return { spots: current };
}
