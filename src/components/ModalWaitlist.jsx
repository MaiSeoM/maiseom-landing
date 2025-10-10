// src/components/ModalWaitlist.jsx
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics.js";

// ⬅️ Mets ICI ton URL Google Apps Script (celle qui marche déjà)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIChlP9e-Cr0ysvok38xK7M7yflgfv8elVCqzzQA9rfQGbe760tfdKeOiqfyLiZo8t/exec";

export default function ModalWaitlist({ open, onClose, planDefault = "Pro" }) {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState(planDefault);
  const [status, setStatus] = useState("idle"); // idle | loading | ok | ko
  const backdropRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setPlan(planDefault);
    setEmail("");
    setStatus("idle");
    // focus + lock scroll
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = prev;
    };
  }, [open, planDefault]);

  // fermer au clic sur l’arrière-plan
  function onBackdrop(e) {
    if (e.target === backdropRef.current) onClose?.();
  }

  async function submit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const url =
        `${SCRIPT_URL}?email=${encodeURIComponent(email)}&plan=${encodeURIComponent(plan)}` +
        `&source=pricing_modal&ts=${Date.now()}`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok && res.type !== "opaque") throw new Error("bad status");
      trackEvent?.("waitlist_submit", { via: "pricing_modal", plan, email_domain: (email.split("@")[1] || "").toLowerCase() });
      setStatus("ok");
      setEmail("");
    } catch (err) {
      console.error("submit error", err);
      setStatus("ko");
    }
  }

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={onBackdrop}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[92%] max-w-xl p-[1px] rounded-2xl" style={{ backgroundImage: "linear-gradient(90deg,#2066CC,#8C52FF)" }}>
        <div className="rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b">
            <h3 className="text-lg font-bold text-gray-900">Rejoindre la liste d’attente</h3>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full hover:bg-gray-100 grid place-items-center"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <form onSubmit={submit} className="px-6 py-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900">Offre qui vous intéresse</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["Starter", "Pro", "Entreprise"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPlan(p)}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      plan === p ? "border-indigo-600 text-indigo-700 bg-indigo-50" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900">Votre e-mail professionnel</label>
              <input
                ref={inputRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: prenom@entreprise.com"
                className="mt-2 w-full h-12 rounded-xl border border-gray-300 px-4 text-[15px] outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-1 flex items-center justify-between gap-3">
              <button type="button" onClick={onClose} className="px-4 h-11 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 h-11 rounded-xl text-white font-semibold shadow-lg transition hover:shadow-xl hover:scale-[1.02] disabled:opacity-60"
                style={{ backgroundImage: "linear-gradient(90deg,#2066CC,#8C52FF)" }}
              >
                {status === "loading" ? "Envoi…" : "Valider"}
              </button>
            </div>

            {status === "ok" && <p className="text-green-600 text-sm">✅ Merci ! Nous revenons vers vous très vite.</p>}
            {status === "ko" && <p className="text-red-600 text-sm">❌ Oups, l’inscription a échoué. Réessayez.</p>}
          </form>

          <div className="px-6 pb-5 text-xs text-gray-500">
            En validant, vous acceptez d’être recontacté par MaiSeoM (désinscription 1 clic).
          </div>
        </div>
      </div>
    </div>
  );
}
