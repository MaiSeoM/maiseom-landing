// src/pages/app/BillingPage.jsx
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "19€/mois",
    priceId: "price_1SqDXBRrDyU3qBDhXq3fCvQz",
    bullets: ["1 domaine", "Quota Starter", "Recommandations basiques"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "49€/mois",
    priceId: "price_1SqE2qRrDyU3qBDhcMhZDkg7",
    bullets: ["1 domaine", "Quota Pro", "Automations + PDF"],
    featured: true,
  },
];

export default function BillingPage() {
  const [loadingKey, setLoadingKey] = useState(null);
  const [err, setErr] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // 🔹 Auto récupération code parrain
  useEffect(() => {
    const savedCode = localStorage.getItem("maiseom_referral_code");
    if (savedCode) {
      setReferralCode(savedCode);
    }
  }, []);

  async function goCheckout(planKey, priceId) {
    setErr("");
    setLoadingKey(planKey);

    try {
      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();

      if (sessionErr) throw sessionErr;

      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const code = referralCode.trim();
      const body = code ? { priceId, referralCode: code } : { priceId };

      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        { body }
      );

      if (error) throw error;

      console.log("checkout response:", data, error);

      if (data?.error) {
        const msg =
          data.error === "INVALID_REFERRAL_CODE"
            ? "Code parrain invalide."
            : data.error === "REFERRAL_CODE_ALREADY_USED"
            ? "Vous avez déjà utilisé un code parrain."
            : data.error === "SELF_REFERRAL_NOT_ALLOWED"
            ? "Vous ne pouvez pas utiliser votre propre code."
            : "Erreur lors du paiement. Réessaie.";

        setErr(msg);
        setLoadingKey(null);
        return;
      }

      if (!data?.url) throw new Error("No checkout url returned");

      // 🔹 Nettoyage code parrain
      localStorage.removeItem("maiseom_referral_code");

      window.location.href = data.url;
    } catch (e) {
      console.error("goCheckout error:", e);

      const message =
        e?.message?.includes?.("INVALID_REFERRAL_CODE")
          ? "Code parrain invalide."
          : e?.message?.includes?.("REFERRAL_CODE_ALREADY_USED")
          ? "Vous avez déjà utilisé un code parrain."
          : e?.message?.includes?.("SELF_REFERRAL_NOT_ALLOWED")
          ? "Vous ne pouvez pas utiliser votre propre code."
          : e?.message?.includes?.("REFERRAL_CODE_LOOKUP_ERROR")
          ? "Erreur de configuration du système de parrainage."
          : e?.message?.includes?.("REFERRAL_TABLE_MISSING_OR_RLS")
          ? "La base de données du parrainage n’est pas encore prête."
          : "Impossible de lancer le paiement. Réessaie.";

      setErr(message);
      setLoadingKey(null);
    }
  }

  function refreshStatus() {
    window.location.href = "/app";
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Activer votre abonnement
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Choisissez votre plan. Paiement sécurisé (Stripe). Accès immédiat
            après validation.
          </p>

          {/* Champ code parrain */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              Code parrain (optionnel)
            </div>
            <p className="mt-1 text-xs text-slate-600">
              -15% sur votre premier paiement si vous avez un code valide.
            </p>

            <input
              type="text"
              value={referralCode}
              onChange={(e) =>
                setReferralCode(e.target.value.toUpperCase())
              }
              placeholder="Ex: ABCD1234"
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {err && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {err}
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {PLANS.map((p) => {
              const isLoading = loadingKey === p.key;

              return (
                <div
                  key={p.key}
                  className={`rounded-2xl border p-5 bg-white shadow-sm ${
                    p.featured
                      ? "border-sky-300 ring-1 ring-sky-200"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-slate-900">
                      {p.name}
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {p.price}
                    </div>
                  </div>

                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {p.bullets.map((b) => (
                      <li key={b}>✅ {b}</li>
                    ))}
                  </ul>

                  <button
                    disabled={!!loadingKey}
                    onClick={() => goCheckout(p.key, p.priceId)}
                    className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 ${
                      p.featured
                        ? "bg-slate-900 hover:bg-slate-800"
                        : "bg-sky-600 hover:bg-sky-700"
                    }`}
                  >
                    {isLoading
                      ? "Ouverture du paiement…"
                      : `Choisir ${p.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Annulation à tout moment. Facture automatique. TVA selon pays.
            </p>

            <button
              onClick={refreshStatus}
              className="text-xs font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900"
            >
              J’ai déjà payé → accéder à l’app
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}