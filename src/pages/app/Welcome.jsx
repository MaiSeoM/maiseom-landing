// src/pages/app/Welcome.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const WORKSPACE_ME_ENDPOINT = import.meta.env.VITE_API_WORKSPACE_ME;

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
  return plan || "—";
}

function formatDateFR(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

// ─── Confetti SVG animés (CSS only, pas de lib) ───────────────────────────────

function ConfettiPiece({ style, shape = "rect" }) {
  if (shape === "circle") {
    return <div className="confetti-piece confetti-circle" style={style} />;
  }
  if (shape === "triangle") {
    return <div className="confetti-piece confetti-triangle" style={style} />;
  }
  return <div className="confetti-piece" style={style} />;
}

const CONFETTI = Array.from({ length: 38 }, (_, i) => {
  const shapes = ["rect", "rect", "circle", "triangle", "rect"];
  const colors = [
    "#6366f1", "#818cf8", "#a5b4fc", "#4f46e5",
    "#06b6d4", "#67e8f9", "#0ea5e9",
    "#10b981", "#34d399",
    "#f59e0b", "#fbbf24",
    "#ec4899", "#f472b6",
  ];
  return {
    id: i,
    color: colors[i % colors.length],
    shape: shapes[i % shapes.length],
    left: `${(i * 37 + 11) % 100}%`,
    delay: `${(i * 0.13) % 2.2}s`,
    duration: `${1.8 + (i % 7) * 0.18}s`,
    size: `${6 + (i % 5) * 3}px`,
    rotate: `${(i * 47) % 360}deg`,
  };
});

// ─── Icônes SVG ──────────────────────────────────────────────────────────────

const IconRocket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const IconCheck = ({ color = "#10b981" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
  </svg>
);

const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconSparkle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/>
    <path d="M5 15l.75 2.25L8 18l-2.25.75L5 21l-.75-2.25L2 18l2.25-.75L5 15z" opacity=".6"/>
    <path d="M19 14l.6 1.8L21.4 16.4l-1.8.6L19 19l-.6-1.8L16.6 16.4l1.8-.6L19 14z" opacity=".4"/>
  </svg>
);

// ─── Feature list ─────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: "🔍", color: "#6366f1", bg: "#eef2ff", text: "Audit IA-SEO + SEO technique complet" },
  { icon: "⚡", color: "#0ea5e9", bg: "#e0f2fe", text: "Quick wins priorisés et actionnables" },
  { icon: "📄", color: "#10b981", bg: "#d1fae5", text: "Export PDF professionnel & partage" },
  { icon: "🤖", color: "#8b5cf6", bg: "#ede9fe", text: "Visibilité sur ChatGPT, Perplexity, SGE" },
];

// ─── Composant principal ──────────────────────────────────────────────────────

export default function Welcome() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading]     = useState(true);
  const [syncing, setSyncing]     = useState(true);
  const [email, setEmail]         = useState("");
  const [firstName, setFirstName] = useState("");
  const [sub, setSub]             = useState(null);
  const [error, setError]         = useState("");
  const [visible, setVisible]     = useState(false);
  const [countUp, setCountUp]     = useState(0);

  const plan   = useMemo(() => planLabel(sub?.plan), [sub?.plan]);
  const active = useMemo(() => isActive(sub?.status), [sub?.status]);
  const niceDate = useMemo(() => formatDateFR(new Date().toISOString()), []);

  // Count-up animation pour le chiffre "2 400+"
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = 2400;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCountUp(end); clearInterval(timer); }
      else setCountUp(start);
    }, 18);
    return () => clearInterval(timer);
  }, [visible]);

  // Déclenche visible après chargement
  useEffect(() => {
    if (!loading) setTimeout(() => setVisible(true), 80);
  }, [loading]);

  useEffect(() => {
    let mounted = true;

    async function loadWorkspaceName(userEmail) {
      if (!WORKSPACE_ME_ENDPOINT || !userEmail) return;
      try {
        const url = new URL(WORKSPACE_ME_ENDPOINT);
        url.searchParams.set("email", userEmail);
        const res = await fetch(url.toString(), { method: "GET", headers: { "Content-Type": "application/json" } });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.workspace) return;
        const w = data.workspace;
        const fn = w.clientFirstName || w.firstName || w.firstname || "";
        if (mounted) setFirstName(fn || "");
      } catch (e) { console.warn("[Welcome] workspace-me failed:", e); }
    }

    async function loadSubscription(userId) {
      const { data: s, error: e } = await supabase
        .from("subscriptions")
        .select("plan,status,cancel_at_period_end,current_period_end,created_at,updated_at")
        .eq("user_id", userId).maybeSingle();
      if (e) console.error("[Welcome] subscriptions error:", e);
      return s || null;
    }

    async function run() {
      setLoading(true); setError("");
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (!user) {
        if (mounted) { setLoading(false); setSyncing(false); setError("Vous devez être connecté pour accéder à cette page."); }
        return;
      }
      const userEmail = user.email || "";
      setEmail(userEmail);
      loadWorkspaceName(userEmail);
      setSyncing(true);
      let s = null;
      for (let i = 0; i < 8; i++) {
        s = await loadSubscription(user.id);
        if (s && isActive(s.status)) break;
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (mounted) { setSub(s); setLoading(false); setSyncing(false); }
    }

    run();
    return () => { mounted = false; };
  }, [sessionId]);

  const headlineName = firstName?.trim() ? firstName.trim() : null;

  // ── loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{welcomeStyles}</style>
        <div className="welcome-loading">
          <div className="welcome-spinner" />
          <p>Préparation de votre espace…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{welcomeStyles}</style>

      <div className={`welcome-root ${visible ? "welcome-visible" : ""}`}>

        

        <div className="welcome-inner">

          {/* ── Badge top ── */}
          <div className="welcome-badge wu-1">
            <span className="badge-dot" />
            Paiement confirmé · {niceDate ? `Le ${niceDate}` : "Aujourd'hui"}
          </div>

          {/* ── Headline ── */}
          <div className="welcome-headline wu-2">
            <h1>
              {headlineName ? (
                <>Bienvenue, <em>{headlineName}</em>&nbsp;</>
              ) : (
                <>Félicitations&nbsp;</>
              )}
            </h1>
            <p className="welcome-sub">
              Ton abonnement <strong>{plan}</strong>{" "}
              {active ? (
                <span className="status-active">est actif</span>
              ) : (
                <span className="status-pending">est en cours d'activation</span>
              )}
              . Tu fais désormais partie des meilleurs en IA-SEO.
            </p>
          </div>

          {/* ── Grid principal ── */}
          <div className="welcome-grid">

            {/* Colonne gauche */}
            <div className="welcome-left">

              {/* Card "ce que tu obtiens" */}
              <div className="feature-card wu-3">
                <div className="feature-card-header">
                  <span className="feature-card-icon"><IconSparkle /></span>
                  <span>Ce que vous obtenez maintenant</span>
                </div>
                <ul className="feature-list">
                  {FEATURES.map((f, i) => (
                    <li key={i} className="feature-item" style={{ animationDelay: `${0.45 + i * 0.09}s` }}>
                      <span className="feature-emoji-bg" style={{ background: f.bg }}>
                        {f.icon}
                      </span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card "objectif 3 min" */}
              <div className="objective-card wu-4">
                <div className="objective-steps">
                  {["Aller sur « Lancer un audit »", "Coller votre domaine principal", "Lancer l'analyse — résultat en 30s"].map((s, i) => (
                    <div key={i} className="objective-step">
                      <span className="step-num">{i + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <p className="objective-tip">
                  💡 Commencez par votre domaine principal pour les recommandations les plus impactantes.
                </p>
              </div>

              {syncing && (
                <div className="syncing-bar wu-4">
                  <span className="syncing-spin" />
                  Synchronisation de l'abonnement en cours…
                </div>
              )}

              {error && (
                <div className="error-bar wu-4">
                  {error}
                </div>
              )}
            </div>

            {/* Colonne droite */}
            <div className="welcome-right">

              {/* Card compte */}
              <div className="account-card wu-3">
                <div className="account-avatar">
                  {email ? email[0].toUpperCase() : "?"}
                </div>
                <div className="account-info">
                  <div className="account-plan">
                    <span className="plan-pill">{plan}</span>
                    {active && <span className="active-pill"><span className="active-dot" />Actif</span>}
                  </div>
                  <div className="account-email">{email}</div>
                </div>
              </div>

              {/* Stat card */}
              <div className="stat-card wu-4">
                <div className="stat-grid">
                  <div className="stat-item">
                    <div className="stat-num">{countUp.toLocaleString("fr-FR")}+</div>
                    <div className="stat-label">Sites analysés</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num">94%</div>
                    <div className="stat-label">Satisfaction</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num">+45%</div>
                    <div className="stat-label">Visibilité IA moy.</div>
                  </div>
                </div>
                <p className="stat-note">Vous rejoignez une communauté de professionnels SEO.</p>
              </div>

              {/* CTA principal */}
              <div className="cta-group wu-5">
                <button className="btn-primary" onClick={() => navigate("/app/audit")}>
                  <IconRocket />
                  Lancer mon premier audit
                  <IconArrow />
                </button>
                <button className="btn-ghost" onClick={() => navigate("/app")}>
                  Voir mon dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="welcome-footer wu-5">
            <IconMail />
            Besoin d'aide ?{" "}
            <a href="mailto:contact@maiseom.com?subject=Onboarding%20MaiSeoM">
              contact@maiseom.com
            </a>
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const welcomeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ─ Variables ─ */
  .welcome-root {
    --indigo: #6366f1;
    --indigo-dark: #4f46e5;
    --indigo-light: #eef2ff;
    --slate-900: #0f172a;
    --slate-700: #334155;
    --slate-500: #64748b;
    --slate-300: #cbd5e1;
    --slate-100: #f1f5f9;
    --slate-50: #f8fafc;
    --emerald: #10b981;
    --amber: #f59e0b;
    --white: #ffffff;
    font-family: 'DM Sans', sans-serif;
  }

  /* ─ Loading ─ */
  .welcome-loading {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-family: 'DM Sans', sans-serif;
    color: #64748b;
    font-size: 14px;
  }
  .welcome-spinner {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2.5px solid #e0e7ff;
    border-top-color: #6366f1;
    animation: spin 0.8s linear infinite;
  }

  /* ─ Root ─ */
  .welcome-root {
    min-height: 100vh;
    background: var(--white);
    padding: 32px 16px 48px;
    position: relative;
    overflow: hidden;
  }

  /* ─ Fond décoratif (orbs) ─ */
  .welcome-root::before {
    content: '';
    position: fixed;
    top: -180px; left: -180px;
    width: 520px; height: 520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .welcome-root::after {
    content: '';
    position: fixed;
    bottom: -140px; right: -140px;
    width: 440px; height: 440px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ─ Confettis ─ */
  .confetti-container {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }
  .confetti-piece {
    position: absolute;
    top: -16px;
    border-radius: 2px;
    opacity: 0;
    animation: confettiFall linear forwards;
  }
  .confetti-circle { border-radius: 50%; }
  .confetti-triangle {
    width: 0 !important; height: 0 !important;
    background: transparent !important;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 9px solid #6366f1;
  }

  @keyframes confettiFall {
    0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
    8%   { opacity: 1; }
    85%  { opacity: 0.8; }
    100% { opacity: 0; transform: translateY(100vh) rotate(var(--rotate, 360deg)); }
  }

  /* ─ Inner ─ */
  .welcome-inner {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ─ Animations d'entrée ─ */
  .wu-1, .wu-2, .wu-3, .wu-4, .wu-5,
  .feature-item {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .welcome-visible .wu-1 { opacity: 1; transform: none; transition-delay: 0.05s; }
  .welcome-visible .wu-2 { opacity: 1; transform: none; transition-delay: 0.15s; }
  .welcome-visible .wu-3 { opacity: 1; transform: none; transition-delay: 0.28s; }
  .welcome-visible .wu-4 { opacity: 1; transform: none; transition-delay: 0.38s; }
  .welcome-visible .wu-5 { opacity: 1; transform: none; transition-delay: 0.50s; }
  .welcome-visible .feature-item {
    opacity: 1; transform: none;
    /* delay set inline via style */
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  /* ─ Badge ─ */
  .welcome-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--slate-300);
    border-radius: 999px;
    background: var(--white);
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--slate-700);
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--emerald);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
    animation: pulseDot 2s ease infinite;
  }
  @keyframes pulseDot {
    0%, 100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
    50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.08); }
  }

  /* ─ Headline ─ */
  .welcome-headline {
    margin-top: 28px;
  }
  .welcome-headline h1 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 800;
    color: var(--slate-900);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .welcome-headline h1 em {
    font-style: normal;
    color: var(--indigo);
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .welcome-sub {
    margin-top: 14px;
    font-size: 16px;
    color: var(--slate-500);
    max-width: 600px;
    line-height: 1.65;
  }
  .welcome-sub strong { color: var(--slate-900); font-weight: 700; }
  .status-active  { color: var(--emerald); font-weight: 700; }
  .status-pending { color: var(--amber);   font-weight: 700; }

  /* ─ Grid ─ */
  .welcome-grid {
    margin-top: 36px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .welcome-grid { grid-template-columns: 1fr; }
  }

  /* ─ Feature card ─ */
  .feature-card {
    background: var(--white);
    border: 1px solid var(--slate-300);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
  }
  .feature-card:hover { box-shadow: 0 6px 28px rgba(99,102,241,0.10); }
  .feature-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--indigo);
  }
  .feature-card-icon { display: flex; }
  .feature-list { margin-top: 18px; display: flex; flex-direction: column; gap: 12px; }
  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: var(--slate-700);
    font-weight: 500;
  }
  .feature-emoji-bg {
    width: 34px; height: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  /* ─ Objective card ─ */
  .objective-card {
    margin-top: 16px;
    background: linear-gradient(135deg, var(--indigo-light), #f0f9ff);
    border: 1px solid #c7d2fe;
    border-radius: 20px;
    padding: 22px;
  }
  .objective-steps { display: flex; flex-direction: column; gap: 10px; }
  .objective-step {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--slate-700);
    font-weight: 500;
  }
  .step-num {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: var(--indigo);
    color: white;
    font-size: 11px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .objective-tip {
    margin-top: 14px;
    font-size: 12px;
    color: var(--indigo-dark);
    opacity: 0.8;
    line-height: 1.5;
  }

  /* ─ Syncing / error ─ */
  .syncing-bar {
    margin-top: 12px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--slate-100);
    border-radius: 12px;
    padding: 10px 16px;
    font-size: 12px;
    color: var(--slate-500);
  }
  .syncing-spin {
    width: 12px; height: 12px;
    border-radius: 50%;
    border: 2px solid #cbd5e1;
    border-top-color: var(--indigo);
    animation: spin 0.7s linear infinite;
  }
  .error-bar {
    margin-top: 12px;
    background: #fff1f2;
    border: 1px solid #fecdd3;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 13px;
    color: #e11d48;
  }

  /* ─ Account card ─ */
  .account-card {
    background: var(--white);
    border: 1px solid var(--slate-300);
    border-radius: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .account-avatar {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(99,102,241,0.30);
  }
  .account-info { flex: 1; min-width: 0; }
  .account-plan { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .plan-pill {
    background: var(--indigo-light);
    color: var(--indigo-dark);
    border: 1px solid #c7d2fe;
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.04em;
  }
  .active-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 11px;
    font-weight: 700;
  }
  .active-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--emerald);
    animation: pulseDot 2s ease infinite;
  }
  .account-email {
    font-size: 13px;
    color: var(--slate-500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ─ Stat card ─ */
  .stat-card {
    margin-top: 16px;
    background: var(--slate-900);
    border-radius: 20px;
    padding: 22px 24px;
    box-shadow: 0 8px 32px rgba(15,23,42,0.18);
  }
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: white;
    letter-spacing: -0.02em;
  }
  .stat-label {
    font-size: 10px;
    color: #94a3b8;
    font-weight: 500;
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .stat-note {
    margin-top: 14px;
    font-size: 12px;
    color: #64748b;
    text-align: center;
    line-height: 1.5;
  }

  /* ─ CTAs ─ */
  .cta-group {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .btn-primary {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 14px;
    padding: 15px 24px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    transition: all 0.2s;
    letter-spacing: -0.01em;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(99,102,241,0.45);
    background: linear-gradient(135deg, #818cf8, #6366f1);
  }
  .btn-primary:active { transform: scale(0.98); }
  .btn-ghost {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 14px;
    padding: 13px 24px;
    background: var(--white);
    color: var(--slate-700);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border: 1.5px solid var(--slate-300);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { background: var(--slate-50); border-color: #a5b4fc; }

  /* ─ Footer ─ */
  .welcome-footer {
    margin-top: 40px;
    padding-top: 22px;
    border-top: 1px solid var(--slate-300);
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--slate-500);
  }
  .welcome-footer a {
    color: var(--slate-700);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .welcome-footer a:hover { color: var(--indigo); }

  /* ─ Keyframes ─ */
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;