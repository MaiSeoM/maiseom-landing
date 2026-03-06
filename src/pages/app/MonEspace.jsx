// src/pages/app/MonEspace.jsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../auth/AuthContext.jsx";

const WORKSPACE_ME_ENDPOINT = import.meta.env.VITE_API_WORKSPACE_ME;
const WORKSPACE_SAVE_ENDPOINT = import.meta.env.VITE_API_WORKSPACE_SAVE;

const MonEspace = () => {
  const { user, subscription } = useAuth() || {};

  const [domain, setDomain] = useState("");
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [email, setEmail] = useState("");
  const [mainQuery, setMainQuery] = useState(""); // 🔹 nouvelle state

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const plan = subscription?.plan ?? null;
  

  // ============================
  // 1. Chargement du workspace
  // ============================
  useEffect(() => {
    const loadWorkspace = async () => {
      setError("");
      setSuccess("");

      if (!WORKSPACE_ME_ENDPOINT) {
        console.warn("[MonEspace] WORKSPACE_ME_ENDPOINT manquant");
        setLoading(false);
        return;
      }

      if (!user?.email) {
        console.warn("[MonEspace] Pas d’email user, pas de workspace à charger");
        setLoading(false);
        return;
      }

      try {
        const url = new URL(WORKSPACE_ME_ENDPOINT);
        url.searchParams.set("email", user.email);

        console.log("[MonEspace] Appel workspace-me :", url.toString());

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json().catch(() => null);
        console.log("[MonEspace] Réponse workspace-me :", res.status, data);

        if (!res.ok || !data || data.ok === false || !data.workspace) {
          setLoading(false);
          return;
        }

        const w = data.workspace;

        setDomain(w.domain || "");
        setClientFirstName(w.clientFirstName || "");
        setClientLastName(w.clientLastName || "");
        setClientCompany(w.clientCompany || "");
        setEmail(w.email || user.email || "");
        setMainQuery(w.mainQuery || ""); // 🔹 on hydrate aussi mainQuery
      } catch (e) {
        console.error("Erreur workspace-me :", e);
        setError("Impossible de charger vos informations d’espace.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, [user]);

  // ============================
  // 2. Sauvegarde du workspace
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!WORKSPACE_SAVE_ENDPOINT) {
      setError("Endpoint de sauvegarde non configuré côté front.");
      console.error(
        "[MonEspace] VITE_API_WORKSPACE_SAVE manquant dans ton .env"
      );
      return;
    }

    if (!domain.trim()) {
      setError("Merci d’indiquer au moins le domaine principal.");
      return;
    }

    const payload = {
      userId: user?.id || null,
      email: (email || user?.email || "").trim(),
      plan,
      domain: domain.trim(),
      clientFirstName: clientFirstName.trim() || null,
      clientLastName: clientLastName.trim() || null,
      clientCompany: clientCompany.trim() || null,
      mainQuery: mainQuery.trim() || null, // 🔹 on l’envoie
    };

    console.log("[MonEspace] Payload envoyé à workspace-save :", payload);
    console.log("[MonEspace] Endpoint workspace-save :", WORKSPACE_SAVE_ENDPOINT);

    try {
      setSaving(true);

      const res = await fetch(WORKSPACE_SAVE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      console.log("[MonEspace] Réponse workspace-save :", res.status, data);

      if (!res.ok || !data || data.ok === false) {
        const msg =
          data?.error ||
          data?.message ||
          "Impossible d’enregistrer votre espace pour le moment.";
        setError(msg);
        return;
      }

      setSuccess("Votre espace MaiSeoM a bien été enregistré ✅");
    } catch (e) {
      console.error("Erreur workspace-save :", e);
      setError("Erreur lors de l’enregistrement de votre espace.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-0">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Mon espace MaiSeoM
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Configurez une fois les informations de votre compte. Elles seront
            réutilisées automatiquement pour chaque audit et chaque rapport PDF.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-0 lg:py-10">
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Informations générales
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Ces informations serviront pour les audits, les rapports PDF et
                les envois par email.
              </p>
            </div>
    
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Chargement de votre espace…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-sm text-slate-800">
              {/* Domaine */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-900">
                  Domaine principal
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="https://www.votre-site.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Ce domaine sera utilisé par défaut dans la page d’audit.
                </p>
              </div>

              {/* Requête principale */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-900">
                  Requête principale ciblée
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="ex : consultant SEO Lyon"
                  value={mainQuery}
                  onChange={(e) => setMainQuery(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Utilisée pour contextualiser vos audits (position Google / IA,
                  intention, etc.).
                </p>
              </div>

              {/* Prénom / Nom */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-900">
                    Prénom du contact principal
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="Marie"
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-900">
                    Nom du contact principal
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="Dupont"
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Entreprise */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-900">
                  Nom de l’entreprise
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="Votre agence / société"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-900">
                  Email principal
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder={user?.email || "vous@entreprise.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Utilisé pour les envois de rapport. Par défaut, l’email de votre
                  compte est utilisé.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Enregistrement..." : "💾 Enregistrer mon espace"}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </motion.section>
      </main>
    </div>
  );
};

function PlanBadge({ plan }) {
  let label = "Starter";
  if (plan?.toLowerCase() === "pro") label = "Pro";
  if (plan?.toLowerCase() === "entreprise" || plan === "Enterprise")
    label = "Entreprise";

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      <span>Plan :</span>
      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] text-white">
        {label}
      </span>
    </div>
  );
}

export default MonEspace;
