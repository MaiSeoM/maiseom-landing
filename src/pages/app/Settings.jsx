// src/pages/app/Settings.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

// ─── helpers (logique 100% inchangée) ───────────────────────────────────────

function isActive(status) {
  return status === "active" || status === "trialing";
}

function planLabel(plan) {
  const p = String(plan || "").toLowerCase();
  if (p === "pro") return "Pro";
  if (p === "starter") return "Starter";
  if (p === "enterprise" || p === "entreprise") return "Entreprise";
  if (p === "free") return "Free";
  if (!p) return "—";
  return plan;
}

function statusLabel(status) {
  const s = String(status || "").toLowerCase();
  if (s === "active") return "Actif";
  if (s === "trialing") return "Essai";
  if (s === "past_due") return "Paiement en retard";
  if (s === "canceled" || s === "cancelled") return "Résilié";
  if (s === "incomplete") return "Incomplet";
  if (!s) return "—";
  return status;
}

function formatDateFR(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isAfter(a, b) {
  if (!a || !b) return false;
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  if (Number.isNaN(da) || Number.isNaN(db)) return false;
  return da > db;
}

// ─── icônes SVG ──────────────────────────────────────────────────────────────

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconCreditCard = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const IconHeadphones = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconLogOut = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconExternal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

// ─── composants UI ────────────────────────────────────────────────────────────

function Card({ children, danger = false }) {
  return (
    <div className={`rounded-2xl border bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md ${danger ? "border-red-200 bg-red-50/40" : "border-slate-200"}`}>
      {children}
    </div>
  );
}

function SectionLabel({ icon, children, danger = false }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] ${danger ? "text-red-500" : "text-indigo-600"}`}>
      {icon}{children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function PlanBadge({ plan }) {
  const label = planLabel(plan);
  const styles = {
    Pro:        "bg-indigo-100 text-indigo-700 border-indigo-200",
    Starter:    "bg-sky-100 text-sky-700 border-sky-200",
    Entreprise: "bg-violet-100 text-violet-700 border-violet-200",
    Free:       "bg-slate-100 text-slate-600 border-slate-200",
    "—":        "bg-slate-100 text-slate-400 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${styles[label] || styles["—"]}`}>
      {label}
    </span>
  );
}

function StatusPill({ status }) {
  const active = isActive(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
      <span className="relative flex h-1.5 w-1.5">
        {active && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${active ? "bg-emerald-500" : "bg-amber-500"}`} />
      </span>
      {statusLabel(status)}
    </span>
  );
}

function BtnPrimary({ onClick, children, disabled = false, className = "" }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      {children}
    </button>
  );
}

function BtnGhost({ onClick, children, className = "" }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-sm font-semibold shadow-sm transition-all duration-150 active:scale-[0.98] ${className}`}>
      {children}
    </button>
  );
}

function BtnDanger({ onClick, disabled = false, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${disabled ? "border-red-200 bg-red-50 text-red-300 cursor-not-allowed" : "border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm"}`}>
      {children}
    </button>
  );
}

// ─── composant principal ──────────────────────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail]     = useState("");
  const [sub, setSub]         = useState(null);
  const [error, setError]     = useState("");

  const hasActiveSub = useMemo(() => isActive(sub?.status), [sub?.status]);

  const effectiveCancelDate = useMemo(() => {
    if (!sub) return null;
    if (sub.commitment_end && sub.current_period_end) {
      return isAfter(sub.commitment_end, sub.current_period_end) ? sub.commitment_end : sub.current_period_end;
    }
    return sub.current_period_end || sub.commitment_end || null;
  }, [sub]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true); setError("");
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (!user) { if (mounted) { setLoading(false); setError("Vous n'êtes pas connecté."); } return; }
      setEmail(user.email || "");
      const { data: s, error: e } = await supabase
        .from("subscriptions")
        .select("plan,status,cancel_at_period_end,current_period_end,created_at,commitment_end")
        .eq("user_id", user.id).maybeSingle();
      if (e) console.error("Settings subscriptions error:", e);
      if (mounted) { setSub(s || null); setLoading(false); }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleCancel = async () => {
    const ok = confirm("Voulez-vous vraiment résilier ? Vous garderez l'accès jusqu'à la fin de votre période (et de l'engagement si applicable).");
    if (!ok) return;
    try {
      const { data: sess } = await supabase.auth.getSession();
      const accessToken = sess?.session?.access_token;
      if (!accessToken) { alert("Session expirée. Reconnectez-vous."); return; }
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cancel-subscription`;
      const res = await fetch(fnUrl, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) { alert(`❌ ${json?.error || json?.details || "Erreur lors de la résiliation"}`); return; }
      alert("✅ Résiliation prise en compte. Votre accès reste actif jusqu'à la date effective.");
      window.location.reload();
    } catch (e) { alert(`❌ ${String(e?.message || e)}`); }
  };

  const handleManageBilling = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session");
      if (error) throw error;
      if (!data?.ok || !data?.url) throw new Error(data?.error || "NO_PORTAL_URL");
      window.location.href = data.url;
    } catch (e) { alert("❌ Impossible d'ouvrir le portail Stripe pour le moment."); }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("maiseom_selected_plan");
      sessionStorage.clear();
      navigate("/", { replace: true });
      window.location.reload();
    } catch (e) { alert("❌ Impossible de se déconnecter. Réessaie."); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-sm text-slate-400">Chargement des paramètres…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .su-1 { animation: fadeUp .35s ease both; }
        .su-2 { animation: fadeUp .35s ease .06s both; }
        .su-3 { animation: fadeUp .35s ease .12s both; }
        .su-4 { animation: fadeUp .35s ease .18s both; }
        .su-5 { animation: fadeUp .35s ease .24s both; }
      `}</style>

      <div className="space-y-6">

        {/* En-tête */}
        <div className="su-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Paramètres
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez votre abonnement, vos informations et la sécurité du compte.
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="su-1 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <IconAlert />{error}
          </div>
        )}

        {/* ── Compte ── */}
        <div className="su-2 max-w-xl">
          <Card>
            <SectionLabel icon={<IconUser />}>Compte</SectionLabel>

            <div className="mt-5 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold select-none">
                {email ? email[0].toUpperCase() : "?"}
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Adresse email</p>
                <p className="text-sm font-semibold text-slate-900">{email || "—"}</p>
              </div>
            </div>

            <div className="mt-4">
              <BtnGhost onClick={handleLogout}>
                <IconLogOut />Se déconnecter
              </BtnGhost>
            </div>
          </Card>
        </div>

        {/* ── Abonnement ── */}
        <div className="su-3 max-w-xl">
          <Card>
            <SectionLabel icon={<IconCreditCard />}>Abonnement</SectionLabel>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PlanBadge plan={sub?.plan} />
              <StatusPill status={sub?.status} />
            </div>

            <div className="mt-5 rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
              <InfoRow label="Début d'abonnement"        value={formatDateFR(sub?.created_at)} />
              <InfoRow label="Fin d'engagement (3 mois)" value={formatDateFR(sub?.commitment_end)} />
              <InfoRow label="Fin de période en cours"   value={formatDateFR(sub?.current_period_end)} />
            </div>

            {sub?.cancel_at_period_end && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-amber-500 shrink-0"><IconAlert /></span>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Résiliation programmée</p>
                    <p className="mt-1 text-sm text-amber-700">
                      Votre accès reste actif jusqu'au{" "}
                      <span className="font-semibold">{formatDateFR(effectiveCancelDate)}</span>.
                    </p>
                    <p className="mt-2 text-xs text-amber-600">
                      Vous pouvez réactiver votre abonnement via{" "}
                      <button onClick={handleManageBilling} className="font-semibold underline hover:text-amber-800 transition-colors">
                        Gérer mon abonnement
                      </button>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <BtnPrimary onClick={handleManageBilling}>
                <IconExternal />Gérer mon abonnement
              </BtnPrimary>
              
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Le portail Stripe permet de changer la carte, télécharger les factures et gérer la facturation.
            </p>
          </Card>
        </div>

        {/* ── Support ── */}
        <div className="su-4 max-w-xl">
          <Card>
            <SectionLabel icon={<IconHeadphones />}>Support</SectionLabel>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Une question ou un blocage ? Écrivez-nous, nous répondons rapidement.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <BtnPrimary onClick={() => window.location.href = "mailto:contact@maiseom.com?subject=Support%20MaiSeoM"}>
                <IconMail />Contacter le support
              </BtnPrimary>
              <BtnGhost onClick={() => window.location.href = "/cgv"}>CGV</BtnGhost>
              <BtnGhost onClick={() => window.location.href = "/privacy"}>Confidentialité</BtnGhost>
            </div>
          </Card>
        </div>

        {/* ── Zone sensible ── */}
        <div className="su-5 max-w-xl">
          <Card danger>
            <SectionLabel icon={<IconAlert />} danger>Zone sensible</SectionLabel>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              La suppression du compte sera disponible prochainement. Cette action supprimera
              définitivement toutes vos données et coupera votre accès, conformément au RGPD.
            </p>
            <div className="mt-4">
              <BtnDanger disabled title="À activer bientôt">
                Supprimer mon compte — bientôt disponible
              </BtnDanger>
            </div>
          </Card>
        </div>

      </div>
    </>
  );
}