// src/pages/app/Audit.jsx

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "../../lib/analytics.js";
import { generateAuditPdf } from "../../utils/generateAuditPdf.js";
import Logo from "../../assets/maiseom-logo.png";
import { useAuth } from "../../auth/AuthContext.jsx";

const AUDIT_ENDPOINT = "https://maiseom.app.n8n.cloud/webhook/audit";
const SEND_REPORT_ENDPOINT = import.meta.env.VITE_N8N_SEND_REPORT_WEBHOOK;
const WORKSPACE_ME_ENDPOINT = import.meta.env.VITE_API_WORKSPACE_ME;
const LAST_AUDIT_ENDPOINT = import.meta.env.VITE_API_LAST_AUDIT_ME;


// Helpers
function safeNumber(n, fallback = "—") {
  if (n === null || n === undefined || Number.isNaN(n)) return fallback;
  return Math.round(n);
}

function toneFromScore(score) {
  if (score == null) return "neutral";
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

const AuditPage = () => {
  const { user, subscription } = useAuth() || {};

  // Workspace (vient de workspace-me)
  const [workspace, setWorkspace] = useState(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState("");

  // Domaine utilisé pour l’audit (pré-rempli avec workspace.domain)
  const [domain, setDomain] = useState("");

  // Audit
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null); // { summary, pages, ... }

  // PDF / email
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [lastAudit, setLastAudit] = useState(null);
  const [loadingLastAudit, setLoadingLastAudit] = useState(true);


  const reportRef = useRef(null);

  // Plan effectif = workspace.plan > subscription.plan > Starter
  const effectivePlan =
    workspace?.plan || subscription?.plan || "Starter"; // "Starter" | "Pro" | "Entreprise"

  /* =========================
   * 1. Charger le workspace
   * ========================= */
  useEffect(() => {
    const loadWorkspace = async () => {
      setWorkspaceError("");
      setWorkspaceLoading(true);

      if (!WORKSPACE_ME_ENDPOINT || !user?.email) {
        setWorkspaceLoading(false);
        return;
      }

      try {
        const url = new URL(WORKSPACE_ME_ENDPOINT);
        url.searchParams.set("email", user.email);

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data || data.ok === false || !data.workspace) {
          setWorkspaceLoading(false);
          return;
        }

        const w = data.workspace;
        setWorkspace(w);

        // Pré-remplir le domaine si présent
        if (w.domain) {
          setDomain(w.domain);
        }
      } catch (e) {
        console.error("Erreur workspace-me (audit) :", e);
        setWorkspaceError(
          "Impossible de charger automatiquement vos informations d’espace."
        );
      } finally {
        setWorkspaceLoading(false);
      }
    };

    if (user?.email) {
      loadWorkspace();
    } else {
      setWorkspaceLoading(false);
    }
  }, [user]);

    /* =========================
   * 1bis. Charger le dernier audit pour la vue instantanée
   * ========================= */
  useEffect(() => {
    const loadLastAudit = async () => {
      setLoadingLastAudit(true);

      console.log("[Audit] user dans loadLastAudit :", user);
      console.log("[Audit] LAST_AUDIT_ENDPOINT :", LAST_AUDIT_ENDPOINT);

      if (!user?.email || !LAST_AUDIT_ENDPOINT) {
        console.log("[Audit] Pas d'email user ou pas d'endpoint, on stop.");
        setLoadingLastAudit(false);
        return;
      }

      try {
        const url = new URL(LAST_AUDIT_ENDPOINT);
        url.searchParams.set("email", user.email);

        console.log("[Audit] Appel de :", url.toString());

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

               const data = await res.json().catch(() => null);
        console.log("[Audit] Réponse last-audit-me :", res.status, data);

        let last = null;

        // 1) n8n renvoie un tableau → on prend le premier élément
        if (Array.isArray(data) && data.length > 0) {
          last = data[0];
        }
        // 2) objet avec propriété lastAudit
        else if (data?.lastAudit) {
          last = data.lastAudit;
        }
        // 3) objet "plat"
        else if (data && !Array.isArray(data)) {
          last = data;
        }

        console.log("[Audit] Dernier audit brut :", last);

        // ⭐ normalisation : si encore imbriqué, on récupère vraiment l'audit
        const normalized = last?.lastAudit ?? last ?? null;

        console.log("[Audit] Dernier audit normalisé :", normalized);
        setLastAudit(normalized);

      } catch (e) {
        console.error("Erreur chargement dernier audit :", e);
        setLastAudit(null);
      } finally {
        setLoadingLastAudit(false);
      }
    };

    if (!result) {
      loadLastAudit();
    } else {
      setLoadingLastAudit(false);
    }
  }, [user, result]);



  /* =========================
   * 2. Lancer l’audit
   * ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setResult(null);

    let cleanDomain = domain.trim();
    if (!cleanDomain) {
      setErrorMessage(
        "Merci d’indiquer un nom de domaine (ou mettez-le dans Mon Espace)."
      );
      return;
    }
    if (!/^https?:\/\//i.test(cleanDomain)) {
      cleanDomain = "https://" + cleanDomain;
    }

    setStatus("loading");

    const userEmail = workspace?.email || user?.email || null;

    try {
      trackEvent?.("audit_start", { plan: effectivePlan, domain: cleanDomain });

      const res = await fetch(AUDIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: cleanDomain,
          userEmail,
          plan: effectivePlan, // le plan vient du compte, pas du front
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || data.ok === false) {
        const msg =
          data?.error ||
          data?.message ||
          "Audit indisponible pour le moment. Réessayez dans un instant.";
        setErrorMessage(msg);
        setStatus("error");
        trackEvent?.("audit_error", {
          plan: effectivePlan,
          domain: cleanDomain,
          msg,
        });
        return;
      }

      // On enrichit légèrement le résultat avec le contexte workspace
      const enriched = {
        ...data,
        domain: cleanDomain,
        plan: effectivePlan,
        userEmail,
        clientFirstName: workspace?.clientFirstName || null,
        clientLastName: workspace?.clientLastName || null,
        clientCompany: workspace?.clientCompany || null,
        clientEmail: workspace?.email || user?.email || null,
      };

      setResult(enriched);
      setStatus("ok");
      trackEvent?.("audit_success", { plan: effectivePlan, domain: cleanDomain });
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Impossible de joindre l’agent d’audit. Vérifiez votre connexion ou réessayez."
      );
      setStatus("error");
      trackEvent?.("audit_error", {
        plan: effectivePlan,
        domain: cleanDomain,
        err: String(err),
      });
    }
  }

  /* =========================
   * 3. Gestion PDF / Email
   * ========================= */

  function handleOpenReportDialog() {
    if (!result) return;
    setIsReportDialogOpen(true);
  }

  async function handleDownloadPdf() {
    if (!result) return;
    try {
      setIsGeneratingPdf(true);

      const enrichedAudit = {
        ...result,
        clientFirstName: result.clientFirstName || workspace?.clientFirstName || null,
        clientLastName: result.clientLastName || workspace?.clientLastName || null,
        clientCompany: result.clientCompany || workspace?.clientCompany || null,
        clientEmail:
          result.clientEmail || workspace?.email || user?.email || null,
      };

      await generateAuditPdf({
        audit: enrichedAudit,
        logoUrl: Logo,
      });

      trackEvent?.("audit_pdf_download", {
        plan: enrichedAudit.plan,
        domain: enrichedAudit.domain,
      });
    } catch (error) {
      console.error("Erreur génération PDF :", error);
      setErrorMessage("Impossible de générer le PDF pour le moment.");
    } finally {
      setIsGeneratingPdf(false);
      setIsReportDialogOpen(false);
    }
  }

  async function handleSendPdfByEmail() {
    if (!result) return;

    const targetEmail = workspace?.email || user?.email || null;
    if (!targetEmail) {
      setErrorMessage(
        "Aucune adresse email disponible. Configurez-la dans Mon Espace."
      );
      return;
    }

    try {
      setIsSendingEmail(true);

      await fetch(SEND_REPORT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "EMAIL_REPORT_REQUEST",
          domain: result.domain,
          userEmail: targetEmail,
          plan: result.plan || effectivePlan,
          audit: result,
        }),
      });

      trackEvent?.("audit_report_email_requested", {
        plan: result.plan || effectivePlan,
        domain: result.domain,
        email: targetEmail,
      });

      alert("Ton rapport a été demandé par email. Tu le recevras bientôt ✅");
    } catch (error) {
      console.error("Erreur demande envoi email :", error);
      setErrorMessage(
        "Impossible de demander l'envoi du rapport par email pour le moment."
      );
    } finally {
      setIsSendingEmail(false);
      setIsReportDialogOpen(false);
    }
  }

    /* =========================
   * 4. Données de rendu
   * ========================= */

  const summary = result?.summary || null;
  const pages = Array.isArray(result?.pages) ? result.pages : [];
  const mainPage = pages[0] || null;

    // Visibilité IA / Google (estimations IA)
  const queryDiagnostics = result?.queryDiagnostics || null;
  const queryRanking = summary?.queryRanking || null;
  const mainQueryRanking = queryRanking?.main || null;


  // IA-SEO & SEO global pour la vue instantanée
  const iaScore =
    summary?.scoreIASEO_final_avg ??
    (lastAudit?.scoreIASEO != null ? Number(lastAudit.scoreIASEO) : null);

  const seoScore =
    summary?.scoreSEO_avg ??
    (lastAudit?.scoreSEO != null ? Number(lastAudit.scoreSEO) : null);

  // Perf mobile & score technique (utilisés dans Vue instantanée + Vue d'ensemble)
  const psiPerf =
    summary?.psiPerf_avg ??
    (lastAudit?.scorePerf != null ? Number(lastAudit.scorePerf) : null);

  const techScore =
    summary?.tech_avg ??
    (lastAudit?.scoreTech != null ? Number(lastAudit.scoreTech) : null);

  const eeatScore =
    summary?.eeat_avg ??
    (lastAudit?.scoreEEAT != null ? Number(lastAudit.scoreEEAT) : null);

  const seoWeighted =
    summary?.scoreSEO_perfWeighted_avg != null
      ? Number(summary.scoreSEO_perfWeighted_avg)
      : null;


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-0 lg:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-800 ring-1 ring-sky-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Audit IA-SEO en temps réel · Espace connecté
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Découvrez comment votre site est perçu par Google… et par les
                moteurs IA.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">
                Collez votre domaine (ou utilisez celui configuré dans Mon
                Espace), et laissez l’agent analyser le SEO, les Core Web Vitals
                et les signaux IA-SEO. Vous obtenez un rapport clair et
                actionnable, prêt à être partagé à vos clients.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <SmallTag label="Lecture seule, aucun risque" />
                <SmallTag label="Parfait pour freelances & agences" />
                <SmallTag label="Export PDF en un clic" />
              </div>
            </div>

            {/* Carte scores */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Vue instantanée
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Les deux scores principaux de votre site, mis à jour après chaque
                audit.
              </p>
              <div className="mt-4 flex items-center gap-6">
                <ScoreCircle label="IA-SEO" score={iaScore} />
                <ScoreCircle label="SEO global" score={seoScore} />
                <div className="flex flex-1 flex-col gap-2 text-xs text-slate-700">
                  <KpiStrip
                    label="Perf mobile (PSI)"
                    value={psiPerf != null ? `${safeNumber(psiPerf)}%` : "—"}
                    tone={toneFromScore(psiPerf)}
                  />
                  <KpiStrip
                    label="Score technique"
                    value={techScore != null ? `${safeNumber(techScore)}%` : "—"}
                    tone={toneFromScore(techScore)}
                  />

                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-400">
                Scorings indicatifs, basés sur la dernière analyse réalisée dans
                cet espace.
              </p>
              {!result && lastAudit?.date && (
              <p className="mt-1 text-[11px] text-slate-400">
                Dernier audit enregistré : {new Date(lastAudit.date).toLocaleDateString()}
              </p>
              )}

            </motion.div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-0 lg:py-10">
        {/* Formulaire + état */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Colonne gauche : Formulaire */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Lancer un nouvel audit
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Le domaine défini dans Mon Espace est pré-rempli
                  automatiquement. Vous pouvez le modifier ponctuellement pour
                  auditer une autre page.
                </p>
              </div>
              <PlanBadge plan={effectivePlan} />
            </div>

            {workspace && (
              <div className="mb-4 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
                <p className="font-medium text-slate-900">
                  Espace client configuré
                </p>
                <p className="mt-1">
                  {workspace.clientFirstName || workspace.clientLastName ? (
                    <>
                      {workspace.clientFirstName} {workspace.clientLastName}
                      {workspace.clientCompany && (
                        <> · {workspace.clientCompany}</>
                      )}
                    </>
                  ) : workspace.clientCompany ? (
                    workspace.clientCompany
                  ) : (
                    "Contact non renseigné."
                  )}
                </p>
                {workspace.email && (
                  <p className="mt-0.5 text-slate-500">{workspace.email}</p>
                )}
                <p className="mt-1 text-[11px] text-slate-500">
                  Pour modifier ces informations, rendez-vous dans Mon Espace.
                </p>
              </div>
            )}

            {workspaceError && (
              <div className="mb-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {workspaceError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-2 space-y-4 text-sm text-slate-800"
            >
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-900">
                  Nom de domaine à auditer
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="ex : https://www.votre-site.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Si vous laissez ce champ vide, l’audit ne pourra pas démarrer.
                  Le domaine par défaut est celui configuré dans votre espace.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  data-cta="audit_run"
                  data-cta-location="audit_page"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
                      Analyse en cours…
                    </>
                  ) : (
                    <>Lancer l’audit IA-SEO</>
                  )}
                </button>
                <p className="text-[11px] text-slate-500">
                  Aucune modification n’est faite sur votre site. L’agent lit
                  uniquement le HTML public, comme un moteur de recherche.
                </p>
              </div>

              <AnimatePresence>
                {status === "error" && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700"
                  >
                    {errorMessage}
                  </motion.div>
                )}
                {status === "ok" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
                  >
                    Audit terminé ✅ Faites défiler pour consulter le rapport
                    détaillé.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-6 grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
              <StepBadge
                number={1}
                label="Scan SEO & technique"
                desc="Titres, metas, robots, maillage interne…"
              />
              <StepBadge
                number={2}
                label="Perf & Web Vitals"
                desc="PageSpeed Insights & signaux Core Web Vitals."
              />
              <StepBadge
                number={3}
                label="Analyse IA-SEO"
                desc="Intent, FAQ, schémas, E-E-A-T estimé."
              />
            </div>
          </motion.section>

          {/* Colonne droite : état & résumé */}
          <section className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-800">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">État de l’agent</p>
                <StatusPill status={status} />
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {status === "idle" && "En attente d’un domaine à analyser."}
                {status === "loading" &&
                  "Analyse en cours… Vous pouvez rester sur cette page."}
                {status === "ok" &&
                  "Analyse terminée. Le rapport ci-dessous correspond au dernier audit effectué."}
                {status === "error" &&
                  "Une erreur s’est produite pendant l’audit. Vous pouvez relancer l’analyse."}
              </p>

              {result && mainPage && (
                <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 px-3 py-3 text-xs">
                  <p className="text-slate-500">Dernier domaine analysé</p>
                  <p className="truncate text-sky-700">{mainPage.url}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <SmallTag label={`Plan : ${result.plan || effectivePlan}`} />
                    {summary?.scoreSEO_avg != null && (
                      <SmallTag
                        label={`SEO global : ${safeNumber(
                          summary.scoreSEO_avg
                        )}%`}
                      />
                    )}
                    {summary?.scoreIASEO_final_avg != null && (
                      <SmallTag
                        label={`IA-SEO : ${safeNumber(
                          summary.scoreIASEO_final_avg
                        )}%`}
                      />
                    )}
                  </div>
                </div>
              )}

              {result && queryDiagnostics && (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs">
                  <p className="font-semibold text-slate-900">
                    Visibilité sur les moteurs IA & Google
                  </p>

                  <p className="mt-1">
                    Requête principale :{" "}
                    <span className="text-sky-700">
                      {queryDiagnostics.mainQuery || "—"}
                    </span>
                  </p>

                  <ul className="mt-2 space-y-1">
                    <li>
                      Google (position estimée) :{" "}
                      {queryDiagnostics.google ?? "—"}
                    </li>
                    <li>
                      Google SGE (AI Overview) :{" "}
                      {queryDiagnostics.sge ?? "—"}
                    </li>
                    <li>
                      ChatGPT :{" "}
                      {queryDiagnostics.chatgptCitationProb != null
                        ? `${safeNumber(
                            queryDiagnostics.chatgptCitationProb
                          )}% de chance de citation`
                        : "—"}
                    </li>
                    <li>
                      Perplexity :{" "}
                      {queryDiagnostics.perplexityCitationProb != null
                        ? `${safeNumber(
                            queryDiagnostics.perplexityCitationProb
                          )}% de chance de citation`
                        : "—"}
                    </li>
                    <li className="font-medium">
                      Position moyenne globale :{" "}
                      {queryDiagnostics.averagePosition ?? "—"}
                    </li>
                  </ul>

                  {queryRanking?.variants?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[11px] font-medium text-slate-500">
                        Quelques requêtes testées :
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {queryRanking.variants.slice(0, 4).map((v) => (
                          <span
                            key={v.query}
                            className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                          >
                            {v.query}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}


                  {queryRanking?.ranges && (
                    <p className="mt-2 text-[11px] text-slate-500">
                      Sur les requêtes proches (variantes), votre site se situe
                      généralement autour de{" "}
                      <span className="font-semibold">
                        {queryRanking.ranges.google?.avg ?? "—"}
                      </span>{" "}
                      sur Google (entre{" "}
                      {queryRanking.ranges.google?.min ?? "—"} et{" "}
                      {queryRanking.ranges.google?.max ?? "—"}), et autour de{" "}
                      <span className="font-semibold">
                        {queryRanking.ranges.sge?.avg ?? "—"}
                      </span>{" "}
                      dans Google SGE.
                    </p>
                  )}
                </div>
              )}


              {result && (
                <button
                  type="button"
                  onClick={handleOpenReportDialog}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  📄 Obtenir le rapport (PDF / Email)
                </button>
              )}
            </div>

           {(summary || lastAudit) && (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-800">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
      Vue d’ensemble
    </p>
    <p className="mt-1 text-sm font-medium text-slate-900">
      Vos indicateurs principaux
    </p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <KpiSmall
        label="Perf mobile (PSI)"
        value={psiPerf != null ? `${safeNumber(psiPerf)}%` : "—"}
        tone={toneFromScore(psiPerf)}
      />
      <KpiSmall
        label="Score technique"
        value={techScore != null ? `${safeNumber(techScore)}%` : "—"}
        tone={toneFromScore(techScore)}
      />
      <KpiSmall
        label="Score E-E-A-T estimé"
        value={eeatScore != null ? `${safeNumber(eeatScore)}%` : "—"}
        tone={toneFromScore(eeatScore)}
      />
      <KpiSmall
        label="SEO pondéré (70% contenu / 30% perf)"
        value={
          seoWeighted != null ? `${safeNumber(seoWeighted)}%` : "—"
        }
        tone={toneFromScore(seoWeighted)}
      />
    </div>
  </div>
)}

          </section>
        </div>

        {/* Bloc rapport détaillé */}
        {result && (
          <section
            ref={reportRef}
            className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Rapport détaillé IA-SEO
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Détails par page des scores SEO, performance, signaux IA-SEO et
                  quick wins recommandés.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <SmallTag label="Pensé pour le partage client" />
                <SmallTag label="Idéal pour documenter vos audits" />
              </div>
            </div>

            {/* Détails par page */}
            {pages.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Détails par page
                  </h3>
                  <p className="text-xs text-slate-500">
                    {pages.length} page{pages.length > 1 ? "s" : ""} analysée
                    {pages.length > 1 ? "s" : ""}.
                  </p>
                </div>
                <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full text-xs text-slate-800">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-2 text-left">URL</th>
                        <th className="px-3 py-2 text-left">SEO</th>
                        <th className="px-3 py-2 text-left">IA-SEO</th>
                        <th className="px-3 py-2 text-left">PSI</th>
                        <th className="px-3 py-2 text-left">LCP</th>
                        <th className="px-3 py-2 text-left">CLS</th>
                        <th className="px-3 py-2 text-left">TBT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.map((p, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="max-w-xs px-3 py-2 align-top">
                            <span
                              className="block truncate text-[12px] font-medium text-sky-700"
                              title={p?.url}
                            >
                              {p?.url || "(inconnue)"}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top">
                            {p?.scoreSEO != null ? `${p.scoreSEO}%` : "—"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {p?.scoreIASEO != null ? `${p.scoreIASEO}%` : "—"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {p?.psiPerfScore != null
                              ? `${p.psiPerfScore}%`
                              : "—"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {p?.lcpMs != null
                              ? `${safeNumber(p.lcpMs)} ms`
                              : "—"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {p?.cls != null ? p.cls.toFixed(3) : "—"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            {p?.tbtMs != null
                              ? `${safeNumber(p.tbtMs)} ms`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick wins & mots-clés */}
            {mainPage && (
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Quick wins IA-SEO
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Recommandations à forte priorité pour améliorer rapidement la
                    compréhension IA et la visibilité de la page.
                  </p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                    {(mainPage.aiDeep?.quickWins || []).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                    {!mainPage.aiDeep?.quickWins?.length && (
                      <li className="text-slate-500">
                        Aucune recommandation IA détaillée pour cette page.
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Mots-clés & FAQ suggérés
                  </h3>
                  <div className="mt-3">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Mots-clés focus
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(mainPage.aiDeep?.focusKeywords || []).map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-800"
                        >
                          {kw}
                        </span>
                      ))}
                      {!mainPage.aiDeep?.focusKeywords?.length && (
                        <span className="text-sm text-slate-500">—</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Idées de FAQ
                    </p>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                      {(mainPage.aiDeep?.faqIdeas || []).map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                      {!mainPage.aiDeep?.faqIdeas?.length && (
                        <li className="text-slate-500">—</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Modal Obtenir le rapport */}
        <AnimatePresence>
          {isReportDialogOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  Comment veux-tu récupérer ton rapport ?
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Tu peux le télécharger directement sur ton ordinateur ou te
                  l&apos;envoyer par email.
                </p>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {isGeneratingPdf
                      ? "Génération du PDF..."
                      : "💾 Télécharger sur mon ordinateur"}
                  </button>

                  <button
                    onClick={handleSendPdfByEmail}
                    disabled={isSendingEmail}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {isSendingEmail
                      ? "Demande d'envoi..."
                      : "📨 M'envoyer le rapport par email"}
                  </button>
                </div>

                <button
                  onClick={() => setIsReportDialogOpen(false)}
                  className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-600"
                >
                  Annuler
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

/* === Sous-composants UI === */

function PlanBadge({ plan }) {
  let label = "Starter";
  if (plan?.toLowerCase() === "pro") label = "Pro";
  if (plan?.toLowerCase() === "entreprise" || plan === "Enterprise")
    label = "Entreprise";

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      <span>Plan actuel :</span>
      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] text-white">
        {label}
      </span>
    </div>
  );
}

function StepBadge({ number, label, desc }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
        {number}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function ScoreCircle({ label, score }) {
  const s =
    typeof score === "number" && !Number.isNaN(score)
      ? Math.max(0, Math.min(100, score))
      : null;

  const deg = s != null ? (s / 100) * 360 : 0;
  const gradient =
    s != null
      ? `conic-gradient(from 0deg, rgb(56,189,248) 0deg, rgb(129,140,248) ${deg}deg, rgba(241,245,249,1) ${deg}deg)`
      : `conic-gradient(from 0deg, rgba(148,163,184,0.5) 0deg, rgba(241,245,249,1) 360deg)`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundImage: gradient }}
        />
        <div className="absolute inset-[4px] flex items-center justify-center rounded-full bg-white">
          <span className="text-sm font-bold text-slate-900">
            {s != null ? `${safeNumber(s)}%` : "—"}
          </span>
        </div>
      </div>
      <p className="mt-2 text-[11px] font-medium text-slate-700">{label}</p>
    </div>
  );
}

function KpiStrip({ label, value, tone = "neutral" }) {
  const colors =
    tone === "good"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : tone === "bad"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-slate-50 text-slate-800 border-slate-200";

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-[11px] ${colors}`}
    >
      <span className="opacity-80">{label}</span>
      <span className="text-xs font-semibold">{value}</span>
    </div>
  );
}

function KpiSmall({ label, value, tone }) {
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
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function StatusPill({ status }) {
  let label = "En attente";
  let dot = "bg-slate-300";
  let bg = "bg-slate-50 text-slate-700 border-slate-200";

  if (status === "loading") {
    label = "Analyse en cours";
    dot = "bg-amber-400";
    bg = "bg-amber-50 text-amber-800 border-amber-200";
  } else if (status === "ok") {
    label = "Audit terminé";
    dot = "bg-emerald-500";
    bg = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (status === "error") {
    label = "Erreur";
    dot = "bg-rose-500";
    bg = "bg-rose-50 text-rose-800 border-rose-200";
  }

  return (
    <div
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium " +
        bg
      }
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span>{label}</span>
    </div>
  );
}

function SmallTag({ label }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
      {label}
    </span>
  );
}

export default AuditPage;
