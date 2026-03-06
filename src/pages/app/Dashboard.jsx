// src/pages/app/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AUDITS_HISTORY_ENDPOINT = import.meta.env.VITE_API_AUDITS_HISTORY_ME;

/* =========================
 * Helpers généraux
 * ========================= */

function safeNumber(n, fallback = "—") {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return fallback;
  return Math.round(Number(n));
}

function toneFromScore(score) {
  if (score == null) return "neutral";
  const s = Number(score);
  if (s >= 80) return "good";
  if (s >= 60) return "warn";
  return "bad";
}

function numberOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

/* =========================
 * Helpers priorité & tendance
 * ========================= */

function computePriority(scoreIASEO) {
  if (scoreIASEO == null || Number.isNaN(Number(scoreIASEO))) {
    return {
      level: "none",
      code: "P?",
      label: "Non priorisé",
      description: "Score IA-SEO non disponible.",
    };
  }

  const s = Number(scoreIASEO);

  if (s < 50) {
    return {
      level: "p1",
      code: "P1",
      label: "Critique",
      description: "Des problèmes majeurs bloquent votre visibilité IA-SEO.",
    };
  }

  if (s < 70) {
    return {
      level: "p2",
      code: "P2",
      label: "Important",
      description: "Bon socle, mais des optimisations sont à prévoir.",
    };
  }

  return {
    level: "p3",
    code: "P3",
    label: "Confort",
    description: "Fondation solide, vous pouvez aller plus loin sur des détails.",
  };
}

function computeTrend(current, previous) {
  if (
    !current ||
    !previous ||
    current.scoreIASEO == null ||
    previous.scoreIASEO == null
  ) {
    return null;
  }

  const cur = Number(current.scoreIASEO);
  const prev = Number(previous.scoreIASEO);
  const delta = cur - prev;

  if (Number.isNaN(delta)) return null;

  if (delta > 0) {
    return {
      type: "up",
      delta,
      label: `+${Math.round(delta)} pts vs audit précédent`,
    };
  }
  if (delta < 0) {
    return {
      type: "down",
      delta,
      label: `${Math.round(delta)} pts vs audit précédent`,
    };
  }
  return {
    type: "flat",
    delta: 0,
    label: "Score identique à l’audit précédent",
  };
}

/* =========================
 * IA visibility à partir d'une ligne de sheet
 * ========================= */

function buildIAVisibilityFromAudit(audit) {
  if (!audit) return null;

  const mainQuery =
    audit.mainQuery ||
    audit.mainquery || // au cas où le header soit différent
    null;

  const google =
    numberOrNull(audit.google) != null
      ? numberOrNull(audit.google)
      : null;

  const sge =
    numberOrNull(audit.sge) != null ? numberOrNull(audit.sge) : null;

  const chatgptCitationProb =
    numberOrNull(audit.chatgptCitationProb) != null
      ? numberOrNull(audit.chatgptCitationProb)
      : null;

  const perplexityCitationProb =
    numberOrNull(audit.perplexityCitationProb) != null
      ? numberOrNull(audit.perplexityCitationProb)
      : null;

  const hasAny =
    mainQuery ||
    google != null ||
    sge != null ||
    chatgptCitationProb != null ||
    perplexityCitationProb != null;

  if (!hasAny) return null;

  // Optionnel : commentaire si tu l’as stocké un jour
  const comment =
    audit.queryComment ||
    audit.query_comment ||
    null;

  return {
    mainQuery,
    google,
    sge,
    chatgptCitationProb,
    perplexityCitationProb,
    comment,
  };
}

/* =========================
 * Composant principal
 * ========================= */

export default function Dashboard() {
  const { user, subscription } = useAuth() || {};
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const plan =
  (subscription?.plan || "").toLowerCase() ||
  (user?.user_metadata?.plan || "").toLowerCase() ||
  "starter";

  useEffect(() => {
    const loadHistory = async () => {
      setError("");
      setLoading(true);

      if (!user?.email || !AUDITS_HISTORY_ENDPOINT) {
        setLoading(false);
        return;
      }

      try {
        const url = new URL(AUDITS_HISTORY_ENDPOINT);
        url.searchParams.set("email", user.email);

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const raw = await res.json().catch(() => null);
        console.log("[Dashboard] history response:", res.status, raw);

        // n8n renvoie typiquement [ { ok, audits, count } ]
        const data = Array.isArray(raw) ? raw[0] : raw;

        if (!res.ok || !data || data.ok === false) {
          setError("Impossible de charger l’historique de vos audits.");
          setAudits([]);
        } else {
          const list = Array.isArray(data.audits) ? data.audits : [];

          // tri par date croissante (sheet renvoie souvent déjà trié, mais on sécurise)
          list.sort((a, b) => {
            const da = a.date || a.timestamp || "";
            const db = b.date || b.timestamp || "";
            return String(da).localeCompare(String(db));
          });

          setAudits(list);
        }
      } catch (e) {
        console.error("Erreur historique audits :", e);
        setError("Erreur réseau lors du chargement des audits.");
        setAudits([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      loadHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const hasData = audits.length > 0;
  const lastAudit = hasData ? audits[audits.length - 1] : null;
  const prevAudit = audits.length > 1 ? audits[audits.length - 2] : null;

  const lastPriority = lastAudit ? computePriority(lastAudit.scoreIASEO) : null;
  const lastTrend = computeTrend(lastAudit, prevAudit);
  const lastIAVisibility = buildIAVisibilityFromAudit(lastAudit);

  // Données pour le graphique
  const chartData = audits.map((a) => {
    const d = a.timestamp || a.date;
    const dateObj = d ? new Date(d) : null;
    const label = dateObj
      ? dateObj.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        })
      : "";

    return {
      date: label,
      seo: a.scoreSEO != null ? Number(a.scoreSEO) : null,
      iaSeo: a.scoreIASEO != null ? Number(a.scoreIASEO) : null,
      perf: a.scorePerf != null ? Number(a.scorePerf) : null,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header de page */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 lg:px-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Suivez l’évolution de vos scores SEO & IA-SEO audit après audit.
            </p>
          </div>
          
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-0 lg:py-10">
        {/* Bloc résumé + graphique */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          {/* Résumé dernier audit */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Dernier audit
            </p>

            {loading ? (
              <p className="mt-3 text-sm text-slate-500">
                Chargement de vos audits…
              </p>
            ) : !hasData || !lastAudit ? (
              <p className="mt-3 text-sm text-slate-500">
                Aucun audit enregistré pour le moment. Lancez votre premier
                audit dans l’onglet{" "}
                <span className="font-semibold">“Lancer un audit”</span>.
              </p>
            ) : (
              <>
                <div className="mt-1 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Vue synthétique de votre dernier audit.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Domaine :{" "}
                      <span className="font-medium text-sky-700">
                        {lastAudit.domain || "—"}
                      </span>
                    </p>
                    {lastAudit.date && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        Date :{" "}
                        {new Date(
                          lastAudit.timestamp || lastAudit.date
                        ).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>

                  {/* priorité + tendance */}
                  <div className="flex flex-col items-end gap-1">
                    <PriorityPill priority={lastPriority} />
                    <TrendPill trend={lastTrend} />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  
                  <BigScore
                   label="Probabilité de recommandation IA"
                    value={lastAudit.queryDiagnostics?.averagePosition}
                    tone={toneFromScore(lastAudit.scoreVisibility)}
                  />
                  <SmallRank
                    label="Position Google"
                    value={lastAudit.queryDiagnostics?.google}
                    tone={toneFromScore(120 - (lastAudit.queryDiagnostics?.google || 100) * 3)}
                  />
                  
                  <BigScore
                    label="Score IA-SEO"
                    value={lastAudit.scoreIASEO}
                    tone={toneFromScore(lastAudit.scoreIASEO)}
                  />
                  <BigScore
                    label="Score SEO global"
                    value={lastAudit.scoreSEO}
                    tone={toneFromScore(lastAudit.scoreSEO)}
                  />
                  <SmallScore
                    label="Perf mobile (PSI)"
                    value={lastAudit.scorePerf}
                    tone={toneFromScore(lastAudit.scorePerf)}
                  />
                  <SmallScore
                    label="Score technique"
                    value={lastAudit.scoreTech}
                    tone={toneFromScore(lastAudit.scoreTech)}
                  />
                  
                </div>
                  <IAVisibilityCard audit={lastAudit} />

                
              </>
            )}

            {error && (
              <p className="mt-3 text-xs text-rose-600">{error}</p>
            )}
          </section>

          {/* Graphique d’évolution */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Évolution des scores
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              IA-SEO & SEO au fil des audits.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Chaque point correspond à un audit enregistré pour ce compte.
            </p>

            {loading ? (
              <p className="mt-6 text-sm text-slate-500">
                Chargement du graphique…
              </p>
            ) : !hasData ? (
              <p className="mt-6 text-sm text-slate-500">
                Le graphique apparaîtra dès que vous aurez réalisé un premier
                audit.
              </p>
            ) : (
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="seo"
                      name="SEO global"
                      stroke="#0f172a"
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="iaSeo"
                      name="IA-SEO"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </div>

        {/* Timeline des audits */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Historique des audits
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            Timeline de vos audits IA-SEO.
          </p>

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">
              Chargement de l’historique…
            </p>
          ) : !hasData ? (
            <p className="mt-4 text-sm text-slate-500">
              Aucun audit enregistré pour l’instant.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {[...audits]
                .slice()
                .reverse()
                .map((a, idx) => (
                  <TimelineItem key={idx} audit={a} />
                ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

/* === Sous-composants UI === */

function PlanBadge({ plan }) {
  if (!plan) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
        <span>Plan :</span>
        <span className="rounded-full bg-slate-400 px-2 py-0.5 text-[11px] text-white">
          Chargement…
        </span>
      </div>
    );
  }

  const p = String(plan).toLowerCase();

  const label =
    p === "pro" ? "Pro" :
    p === "starter" ? "Starter" :
    p === "entreprise" || p === "enterprise" ? "Entreprise" :
    p === "free" ? "Free" :
    plan; // fallback : affiche la valeur brute

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      <span>Plan :</span>
      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] text-white">
        {label}
      </span>
    </div>
  );
}


function BigScore({ label, value, tone }) {
  const palette =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : tone === "bad"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-slate-50 text-slate-800 border-slate-200";

  return (
    <div className={`rounded-2xl border px-3.5 py-3 ${palette}`}>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">
        {value != null ? `${safeNumber(value)}%` : "—"}
      </p>
    </div>
  );
}

function SmallScore({ label, value, tone }) {
  const palette =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : tone === "bad"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-slate-50 text-slate-800 border-slate-200";

  return (
    <div className={`rounded-2xl border px-3.5 py-2.5 ${palette}`}>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold">
        {value != null ? `${safeNumber(value)}%` : "—"}
      </p>
    </div>
  );
}

function SmallRank({ label, value }) {
  let tone = "neutral";

  if (value != null) {
    const pos = Number(value);
    if (pos <= 10) tone = "good";
    else if (pos <= 30) tone = "warn";
    else tone = "bad";
  }

  const palette =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : tone === "bad"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-slate-50 text-slate-800 border-slate-200";

  const rank = value != null ? `${value}ᵉ` : "—";

  return (
    <div className={`rounded-2xl border px-3.5 py-2.5 ${palette}`}>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-xl font-semibold">{rank}</p>

      <p className="text-[10px] text-slate-500 mt-0.5 italic">
        (Estimation de votre position)
      </p>
    </div>
  );
}



function PriorityPill({ priority }) {
  if (!priority) return null;

  let bg = "bg-slate-100 text-slate-700 ring-slate-100";
  if (priority.level === "p1") bg = "bg-rose-50 text-rose-700 ring-rose-100";
  if (priority.level === "p2") bg = "bg-amber-50 text-amber-700 ring-amber-100";
  if (priority.level === "p3")
    bg = "bg-emerald-50 text-emerald-700 ring-emerald-100";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${bg}`}
    >
      <span className="text-[10px] font-semibold">{priority.code}</span>
      <span>{priority.label}</span>
    </span>
  );
}

function TrendPill({ trend }) {
  if (!trend) return null;

  let color = "text-slate-600";
  let arrow = "•";

  if (trend.type === "up") {
    color = "text-emerald-700";
    arrow = "↑";
  } else if (trend.type === "down") {
    color = "text-rose-700";
    arrow = "↓";
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] ${color}`}>
      <span className="text-xs">{arrow}</span>
      <span>{trend.label}</span>
    </span>
  );
}

function IAVisibilityCard({ visibility }) {
  if (!visibility) return null;

  const {
    mainQuery,
    google,
    sge,
    chatgptCitationProb,
    perplexityCitationProb,
    comment,
  } = visibility;

  return (
    <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 px-3.5 py-3 text-xs text-slate-800">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
        Visibilité IA (estimation)
      </p>

      <p className="mt-1 text-xs text-slate-600">
        Requête principale estimée :{" "}
        <span className="font-semibold text-sky-800">
          {mainQuery || "—"}
        </span>
      </p>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-500">
            Position moyenne estimée
          </p>
          <div className="flex flex-wrap gap-1.5">
            <TagMetric
              label="Google"
              value={google != null ? `~${safeNumber(google)}` : "—"}
            />
            <TagMetric
              label="SGE"
              value={sge != null ? `~${safeNumber(sge)}` : "—"}
            />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-500">
            Probabilité d’être cité
          </p>
          <div className="flex flex-wrap gap-1.5">
            <TagMetric
              label="ChatGPT"
              value={
                chatgptCitationProb != null
                  ? `${safeNumber(chatgptCitationProb)}%`
                  : "—"
              }
            />
            <TagMetric
              label="Perplexity"
              value={
                perplexityCitationProb != null
                  ? `${safeNumber(perplexityCitationProb)}%`
                  : "—"
              }
            />
          </div>
        </div>
      </div>

      {comment && (
        <p className="mt-2 text-[11px] text-slate-500">{comment}</p>
      )}
    </div>
  );
}

function TagMetric({ label, value }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-sky-100">
      <span className="mr-1 text-[10px] uppercase text-slate-400">
        {label}
      </span>
      <span>{value}</span>
    </span>
  );
}

function TimelineItem({ audit }) {
  const d = audit.timestamp || audit.date;
  const dateObj = d ? new Date(d) : null;
  const dateLabel = dateObj
    ? dateObj.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : "Date inconnue";

  const priority = computePriority(audit.scoreIASEO);

  return (
    <li className="flex gap-3">
      {/* pastille score IA-SEO */}
      <div className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
        {audit.scoreIASEO != null ? safeNumber(audit.scoreIASEO) : "—"}
      </div>

      <div className="flex-1 border-b border-slate-100 pb-3 last:border-b-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium text-slate-900">
            Audit du {dateLabel}
          </p>
          <PriorityPill priority={priority} />
        </div>

        <p className="mt-0.5 text-xs text-slate-500 truncate">
          {audit.domain || "Domaine inconnu"}
        </p>

        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-600">
          {audit.scoreIASEO != null && (
            <span className="rounded-full bg-slate-50 px-2 py-0.5">
              IA-SEO : {safeNumber(audit.scoreIASEO)}%
            </span>
          )}
          {audit.scorePerf != null && (
            <span className="rounded-full bg-slate-50 px-2 py-0.5">
              Perf mobile : {safeNumber(audit.scorePerf)}%
            </span>
          )}
          {audit.scoreTech != null && (
            <span className="rounded-full bg-slate-50 px-2 py-0.5">
              Technique : {safeNumber(audit.scoreTech)}%
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
