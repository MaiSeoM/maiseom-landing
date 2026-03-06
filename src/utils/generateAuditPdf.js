// src/utils/generateAuditPdf.js
import { jsPDF } from "jspdf";

/**
 * Rapport PDF IA-SEO Premium - Design SaaS moderne
 * Version corrigée avec toutes les valeurs récupérées
 */
export async function generateAuditPdf({ audit, logoUrl }) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Design tokens
  const colors = {
    primary: { r: 99, g: 102, b: 241 },
    secondary: { r: 139, g: 92, b: 246 },
    success: { r: 16, g: 185, b: 129 },
    warning: { r: 245, g: 158, b: 11 },
    danger: { r: 239, g: 68, b: 68 },
    dark: { r: 15, g: 23, b: 42 },
    gray: { r: 71, g: 85, b: 105 },
    lightGray: { r: 148, g: 163, b: 184 },
    bg: { r: 248, g: 250, b: 252 },
    white: { r: 255, g: 255, b: 255 }
  };

  const margin = { x: 20, y: 20 };
  const contentW = pageW - margin.x * 2;
  let y = margin.y;

  /* ========= Données - Extraction complète ========= */
  const summary = audit.summary || {};
  const pages = Array.isArray(audit.pages) ? audit.pages : [];
  const mainPage = pages[0] || {};
  const aiDeep = mainPage.aiDeep || {};

  const fmt = (v) => typeof v === "number" && !isNaN(v) ? `${Math.round(v)}%` : "—";
  
  const dateStr = audit.auditDate || new Date().toLocaleString("fr-FR", {
    year: "numeric", month: "2-digit", day: "2-digit", 
    hour: "2-digit", minute: "2-digit"
  });

  // Scores avec fallback complet
  const iaScore = summary.scores?.ia_final ?? summary.scoreIASEO_final_avg ?? mainPage.scoreIASEO ?? null;
  const seoScore = summary.scores?.seo ?? summary.scoreSEO_avg ?? mainPage.scoreSEO ?? null;
  const techScore = summary.scores?.technique ?? summary.tech_avg ?? mainPage.techScore ?? null;
  const perfScore = summary.scores?.performance ?? summary.psiPerf_avg ?? mainPage.psiPerfScore ?? null;
  const eeatScore = summary.scores?.eeat ?? summary.eeat_avg ?? mainPage.eeatScore ?? null;
  const seoWeighted = summary.scores?.weighted_seo ?? summary.scoreSEO_perfWeighted_avg ?? null;
  
  const domain = audit.domain || mainPage.url || "—";
  const clientEmail = audit.clientEmail || audit.userEmail || "—";
  const plan = audit.plan || "Starter";

  // Visibilité IA - extraction complète
  const rawQueryRanking = summary.queryRanking || audit.summary?.queryRanking || 
                          audit.queryRanking || audit.queryDiagnostics || 
                          summary.queryDiagnostics || null;
  
  let mainQueryRanking = rawQueryRanking?.main || null;
  if (!mainQueryRanking && rawQueryRanking && (
    rawQueryRanking.google != null || rawQueryRanking.sge != null || 
    rawQueryRanking.chatgptCitationProb != null || 
    rawQueryRanking.perplexityCitationProb != null || 
    rawQueryRanking.mainQuery
  )) {
    mainQueryRanking = rawQueryRanking;
  }

  const fmtPos = (pos) => {
    if (pos == null || isNaN(Number(pos))) return "—";
    return `${Math.round(Number(pos))}ᵉ`;
  };

  // Extraction des données SEO
  const seoData = {
    title: mainPage.title || "—",
    metaDesc: mainPage.metaDescription || mainPage.metaDesc || "—",
    h1: mainPage.h1Text || mainPage.h1 || "—",
    h1Count: mainPage.h1Count ?? "—",
    wordCount: mainPage.wordCount ?? "—",
    canonical: mainPage.canonical || "—",
    lang: mainPage.lang || "—"
  };

  // Extraction des données de performance
  const perfData = {
    lcp: mainPage.lcpMs,
    cls: mainPage.cls,
    tbt: mainPage.tbtMs
  };

  // Issues SEO
  const seoIssues = mainPage.seoIssues || summary.seoIssues || [];
  
  // Tech summary
  const techSummary = summary.techSummary || [];

  // Quick wins
  const quickWins = aiDeep.quickWins || [];
  const splitQW = (qw) => {
    if (!qw || !qw.length) return { p1: [], p2: [], p3: [] };
    return {
      p1: qw.slice(0, 3),
      p2: qw.slice(3, 6),
      p3: qw.slice(6, 9)
    };
  };
  const { p1, p2, p3 } = splitQW(quickWins);

  // FAQ et schemas
  const faqIdeas = aiDeep.faqIdeas || [];
  const schemas = aiDeep.recommendedSchemas || [];

  // Résumé IA
  const resumeGlobal = summary.resume || summary.text || 
    "Résumé détaillé non fourni par l'IA pour cet audit. Référez-vous aux sections ci-dessous.";

  /* ========= Helpers ========= */
  function getScoreColor(score) {
    if (score == null || isNaN(score)) return colors.lightGray;
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.danger;
  }

  function getScoreGrade(score) {
    if (score == null || isNaN(score)) return "N/A";
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  }

  function setColor(colorObj) {
    doc.setTextColor(colorObj.r, colorObj.g, colorObj.b);
  }

  function setFillColor(colorObj) {
    doc.setFillColor(colorObj.r, colorObj.g, colorObj.b);
  }

  function setDrawColor(colorObj) {
    doc.setDrawColor(colorObj.r, colorObj.g, colorObj.b);
  }

  function addHeader(pageNum = null, showLogo = false) {
    setFillColor(colors.white);
    doc.rect(0, 0, pageW, 25, "F");
    
    setDrawColor({ r: 226, g: 232, b: 240 });
    doc.setLineWidth(0.3);
    doc.line(0, 25, pageW, 25);

    if (showLogo && logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, "PNG", margin.x, 6, 16, 16);
      } catch (e) {
        console.warn("Erreur chargement logo:", e);
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      setColor(colors.dark);
      doc.text("MaiSeoM", margin.x + 20, 14);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setColor(colors.gray);
      doc.text("IA-SEO Analytics", margin.x + 20, 18.5);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(colors.lightGray);
      doc.text("MaiSeoM · Rapport d'audit IA-SEO", margin.x, 15);
    }

    if (pageNum) {
      setFillColor({ r: 243, g: 244, b: 246 });
      const pillW = 20;
      doc.roundedRect(pageW - margin.x - pillW, 10, pillW, 8, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setColor(colors.gray);
      doc.text(`${pageNum}`, pageW - margin.x - pillW/2, 15, { align: "center" });
    }
  }

  function addFooter(pageNum, total) {
    setDrawColor({ r: 226, g: 232, b: 240 });
    doc.setLineWidth(0.2);
    doc.line(margin.x, pageH - 15, pageW - margin.x, pageH - 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(colors.lightGray);
    doc.text("maiseom.com", margin.x, pageH - 9);
    doc.text(`${pageNum} / ${total}`, pageW - margin.x, pageH - 9, { align: "right" });
    
    setColor(colors.gray);
    const shortDate = dateStr.split(',')[0] || dateStr.substring(0, 10);
    doc.text(`Généré le ${shortDate}`, pageW/2, pageH - 9, { align: "center" });
  }

  function checkPageBreak(needed = 30) {
    if (y + needed > pageH - 25) {
      doc.addPage();
      addHeader();
      y = 35;
      return true;
    }
    return false;
  }

  function addSection(title, subtitle = null) {
    checkPageBreak(25);
    y += 12;

    setFillColor(colors.primary);
    doc.roundedRect(margin.x, y - 3, 3, 10, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setColor(colors.dark);
    doc.text(title, margin.x + 8, y + 4);

    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(colors.gray);
      doc.text(subtitle, margin.x + 8, y + 9);
      y += 5;
    }

    y += 12;
  }

  function addKpiCard(x, cardY, w, h, data) {
    const { label, value, unit = "", score, helper } = data;
    const color = getScoreColor(score);
    const grade = getScoreGrade(score);

    setFillColor(colors.white);
    doc.roundedRect(x, cardY, w, h, 4, 4, "F");
    
    setDrawColor(color);
    doc.setLineWidth(0.8);
    doc.roundedRect(x, cardY, w, h, 4, 4, "D");

    if (score != null) {
      const badgeW = 18;
      setFillColor(color);
      doc.roundedRect(x + w - badgeW - 4, cardY + 4, badgeW, 8, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setColor(colors.white);
      doc.text(grade, x + w - badgeW/2 - 4, cardY + 9, { align: "center" });
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setColor(colors.gray);
    const labelLines = doc.splitTextToSize(label, w - 10);
    doc.text(labelLines, x + 5, cardY + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    setColor(colors.dark);
    const valText = value != null ? `${value}${unit}` : "—";
    doc.text(valText, x + 5, cardY + h - 14);

    if (helper) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      setColor(colors.lightGray);
      const helperLines = doc.splitTextToSize(helper, w - 10);
      doc.text(helperLines, x + 5, cardY + h - 7);
    }
  }

  function addInfoBox(text, type = "info") {
    checkPageBreak(20);
    
    const boxColors = {
      info: { bg: { r: 239, g: 246, b: 255 }, border: colors.primary, icon: "" },
      success: { bg: { r: 220, g: 252, b: 231 }, border: colors.success, icon: "" },
      warning: { bg: { r: 254, g: 243, b: 199 }, border: colors.warning, icon: "" },
      danger: { bg: { r: 254, g: 226, b: 226 }, border: colors.danger, icon: "" }
    };

    const style = boxColors[type] || boxColors.info;
    
    setFillColor(style.bg);
    setDrawColor(style.border);
    doc.setLineWidth(0.5);
    
    const lines = doc.splitTextToSize(text, contentW - 20);
    const boxHeight = Math.max(15, lines.length * 4 + 8);
    
    doc.roundedRect(margin.x, y, contentW, boxHeight, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setColor(style.border);
    doc.text(style.icon, margin.x + 5, y + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(colors.dark);
    doc.text(lines, margin.x + 12, y + 6);

    y += boxHeight + 3;
  }

  function addBulletList(items) {
    items.forEach(item => {
      checkPageBreak(10);
      
      setFillColor(colors.primary);
      doc.circle(margin.x + 2, y + 1.5, 1.2, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setColor(colors.dark);
      const lines = doc.splitTextToSize(item, contentW - 8);
      doc.text(lines, margin.x + 6, y + 3);
      
      y += lines.length * 5 + 2;
    });
  }

  /* ========= Chargement du logo ========= */
  async function loadLogo() {
    if (!logoUrl) return null;
    if (logoUrl.startsWith("data:")) return logoUrl;
    try {
      const resp = await fetch(logoUrl);
      const blob = await resp.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn("Logo non chargé:", e);
      return null;
    }
  }

  const logoDataUrl = await loadLogo();

  /* ========= PAGE 1: Couverture Premium ========= */
  
  // Gradient de fond
  const gradientSteps = 50;
  for (let i = 0; i < gradientSteps; i++) {
    const ratio = i / gradientSteps;
    const r = Math.round(248 + (239 - 248) * ratio);
    const g = Math.round(250 + (246 - 250) * ratio);
    const b = Math.round(252 + (255 - 252) * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(0, (pageH / gradientSteps) * i, pageW, pageH / gradientSteps + 1, "F");
  }

  // Formes décoratives
  doc.setFillColor(99, 102, 241, 0.05);
  doc.circle(pageW * 0.85, pageH * 0.2, 60, "F");
  doc.circle(pageW * 0.15, pageH * 0.8, 40, "F");

  addHeader(null, true);

  // Badge
  y = 50;
  const badgeW = 50;
  setFillColor({ r: 239, g: 246, b: 255 });
  setDrawColor(colors.primary);
  doc.setLineWidth(0.5);
  doc.roundedRect((pageW - badgeW) / 2, y, badgeW, 10, 5, 5, "FD");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setColor(colors.primary);
  doc.text("RAPPORT D'AUDIT", pageW / 2, y + 6.5, { align: "center" });

  // Titre
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  setColor(colors.dark);
  doc.text("Audit IA-SEO", pageW / 2, y, { align: "center" });
  
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  setColor(colors.gray);
  doc.text("Analyse complète de votre visibilité IA", pageW / 2, y, { align: "center" });

  // Carte score principal
  y += 20;
  const mainCardW = 140;
  const mainCardH = 65;
  const mainCardX = (pageW - mainCardW) / 2;

  setFillColor(colors.white);
  doc.roundedRect(mainCardX, y, mainCardW, mainCardH, 8, 8, "F");
  setDrawColor({ r: 226, g: 232, b: 240 });
  doc.setLineWidth(0.3);
  doc.roundedRect(mainCardX, y, mainCardW, mainCardH, 8, 8, "D");

  const scoreColor = getScoreColor(iaScore);
  const centerX = mainCardX + mainCardW / 2;
  const centerY = y + 25;
  const radius = 18;

  // Cercle de fond
  setDrawColor({ r: 243, g: 244, b: 246 });
  doc.setLineWidth(4);
  doc.circle(centerX, centerY, radius, "D");

  // Cercle de progression
  if (iaScore != null) {
    setDrawColor(scoreColor);
    doc.setLineWidth(4);
    const segments = 30;
    for (let i = 0; i < segments * (iaScore / 100); i++) {
      const angle1 = (i / segments) * 2 * Math.PI - Math.PI / 2;
      const angle2 = ((i + 1) / segments) * 2 * Math.PI - Math.PI / 2;
      const x1 = centerX + radius * Math.cos(angle1);
      const y1 = centerY + radius * Math.sin(angle1);
      const x2 = centerX + radius * Math.cos(angle2);
      const y2 = centerY + radius * Math.sin(angle2);
      doc.line(x1, y1, x2, y2);
    }
  }

  // Score
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  setColor(colors.dark);
  doc.text(iaScore != null ? String(Math.round(iaScore)) : "—", centerX, centerY + 2, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setColor(colors.gray);
  doc.text("Score Global", centerX, centerY + 9, { align: "center" });

  // Grade
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  setColor(scoreColor);
  doc.text(getScoreGrade(iaScore), centerX, y + 55, { align: "center" });

  // Infos domaine
  y += mainCardH + 15;
  const infoCardH = 45;
  setFillColor(colors.white);
  doc.roundedRect(margin.x, y, contentW, infoCardH, 6, 6, "F");
  setDrawColor({ r: 226, g: 232, b: 240 });
  doc.setLineWidth(0.3);
  doc.roundedRect(margin.x, y, contentW, infoCardH, 6, 6, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(colors.gray);
  doc.text("DÉTAILS DE L'AUDIT", margin.x + 8, y + 10);

  const col1X = margin.x + 8;
  const col2X = margin.x + contentW / 2;
  let infoY = y + 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(colors.lightGray);
  doc.text("Domaine", col1X, infoY);
  doc.text("Date", col2X, infoY);

  infoY += 5;
  doc.setFont("helvetica", "bold");
  setColor(colors.dark);
  const domainText = domain.length > 30 ? domain.substring(0, 27) + "..." : domain;
  doc.text(domainText, col1X, infoY);
  const shortDate = dateStr.includes(',') ? dateStr.split(',')[0] : dateStr.substring(0, 16);
  doc.text(shortDate, col2X, infoY);

  infoY += 8;
  doc.setFont("helvetica", "normal");
  setColor(colors.lightGray);
  doc.text("Email", col1X, infoY);
  doc.text("Plan", col2X, infoY);

  infoY += 5;
  doc.setFont("helvetica", "bold");
  setColor(colors.dark);
  const emailText = clientEmail.length > 25 ? clientEmail.substring(0, 22) + "..." : clientEmail;
  doc.text(emailText, col1X, infoY);
  doc.text(plan, col2X, infoY);

  /* ========= PAGE 2: Sommaire ========= */
  doc.addPage();
  addHeader(1);
  y = 40;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  setColor(colors.dark);
  doc.text("Sommaire", margin.x, y);

  y += 15;

  const tocItems = [
    { num: "01", title: "Vue d'ensemble", page: "3" },
    { num: "02", title: "Scores & KPI principaux", page: "4" },
    { num: "03", title: "Visibilité IA & Moteurs", page: "5" },
    { num: "04", title: "Analyse SEO classique", page: "6" },
    { num: "05", title: "Performance & Technique", page: "7" },
    { num: "06", title: "IA-SEO Deep & E-E-A-T", page: "8" },
    { num: "07", title: "Plan d'action & Quick Wins", page: "9" },
    { num: "08", title: "FAQ & Schémas", page: "10" }
  ];

  tocItems.forEach((item, i) => {
    const itemY = y + i * 20;
    
    setFillColor(i % 2 === 0 ? colors.white : { r: 249, g: 250, b: 251 });
    doc.roundedRect(margin.x, itemY, contentW, 18, 3, 3, "F");

    setFillColor(colors.primary);
    doc.roundedRect(margin.x + 5, itemY + 4, 14, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(colors.white);
    doc.text(item.num, margin.x + 12, itemY + 11, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(colors.dark);
    doc.text(item.title, margin.x + 25, itemY + 11);

    setColor(colors.lightGray);
    doc.setFont("helvetica", "normal");
    let dotsX = margin.x + 25 + doc.getTextWidth(item.title) + 5;
    while (dotsX < pageW - margin.x - 20) {
      doc.text(".", dotsX, itemY + 11);
      dotsX += 3;
    }

    doc.setFont("helvetica", "bold");
    setColor(colors.gray);
    doc.text(item.page, pageW - margin.x - 8, itemY + 11, { align: "right" });
  });

  /* ========= PAGE 3: Vue d'ensemble ========= */
  doc.addPage();
  addHeader(2);
  y = 35;

  addSection("01 · Vue d'ensemble", "Synthèse globale de votre audit IA-SEO");

  addInfoBox(resumeGlobal, "info");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(colors.gray);
  doc.text("MÉTRIQUES PRINCIPALES", margin.x, y);

  y += 8;
  const metricW = (contentW - 10) / 3;
  
  [
    { label: "Pages analysées", value: pages.length, icon: "" },
    { label: "Issues détectées", value: seoIssues.length, icon: "" },
    { label: "Quick Wins", value: quickWins.length, icon: "" }
  ].forEach((metric, i) => {
    const x = margin.x + i * (metricW + 5);
    
    setFillColor(colors.white);
    doc.roundedRect(x, y, metricW, 20, 4, 4, "F");
    setDrawColor({ r: 226, g: 232, b: 240 });
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, metricW, 20, 4, 4, "D");

    doc.setFontSize(16);
    doc.text(metric.icon, x + 5, y + 11);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    setColor(colors.dark);
    doc.text(String(metric.value), x + 15, y + 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(colors.gray);
    doc.text(metric.label, x + 5, y + 16);
  });

  y += 28;

  /* ========= PAGE 4: Scores & KPI ========= */
  doc.addPage();
  addHeader(3);
  y = 35;

  addSection("02 · Scores & KPI principaux", "Performance détaillée par dimension");

  const kpiData = [
    { label: "IA-SEO Global", value: iaScore != null ? Math.round(iaScore) : null, unit: "%", 
      score: iaScore, helper: "Visibilité pour les IA" },
    { label: "SEO Classique", value: seoScore != null ? Math.round(seoScore) : null, unit: "%", 
      score: seoScore, helper: "Optimisation on-page" },
    { label: "Score Technique", value: techScore != null ? Math.round(techScore) : null, unit: "%", 
      score: techScore, helper: "Infrastructure & code" },
    { label: "Performance", value: perfScore != null ? Math.round(perfScore) : null, unit: "%", 
      score: perfScore, helper: "Vitesse mobile (PSI)" },
    { label: "E-E-A-T", value: eeatScore != null ? Math.round(eeatScore) : null, unit: "%", 
      score: eeatScore, helper: "Signaux de confiance" },
    { label: "SEO Pondéré", value: seoWeighted != null ? Math.round(seoWeighted) : null, unit: "%", 
      score: seoWeighted, helper: "Score ajusté perf" }
  ];

  const cardW = (contentW - 10) / 3;
  const cardH = 32;
  const gap = 5;

  kpiData.forEach((kpi, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = margin.x + col * (cardW + gap);
    const cardY = y + row * (cardH + gap);
    
    addKpiCard(x, cardY, cardW, cardH, kpi);
  });

  y += (Math.ceil(kpiData.length / 3) * (cardH + gap)) + 10;

  checkPageBreak(40);
  addInfoBox(
    "Ces scores reflètent la capacité de votre site à être compris et valorisé par les IA. Un score global supérieur à 70% indique une bonne préparation pour l'ère de l'IA.",
    "info"
  );

  /* ========= PAGE 5: Visibilité IA ========= */
  doc.addPage();
  addHeader(4);
  y = 35;

  addSection("03 · Visibilité IA & Moteurs", "Positionnement estimé sur les différentes plateformes");

  if (!mainQueryRanking) {
    addInfoBox(
      "Les données de visibilité IA ne sont pas encore disponibles pour cet audit. Effectuez un audit complet pour obtenir ces métriques.",
      "warning"
    );
  } else {
    const mainQuery = mainQueryRanking.mainQuery || rawQueryRanking.mainQuery || "—";
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(colors.gray);
    doc.text("REQUÊTE PRINCIPALE DÉTECTÉE", margin.x, y);
    
    y += 6;
    setFillColor({ r: 249, g: 250, b: 251 });
    doc.roundedRect(margin.x, y, contentW, 12, 3, 3, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(colors.dark);
    const queryLines = doc.splitTextToSize(`"${mainQuery}"`, contentW - 10);
    doc.text(queryLines[0], margin.x + 5, y + 7);
    
    y += 18;

    const posData = [
      { platform: "Google", icon: "", position: mainQueryRanking.google, 
        color: colors.success, label: "Position estimée" },
      { platform: "Google SGE", icon: "", position: mainQueryRanking.sge, 
        color: colors.primary, label: "Position estimée" },
      { platform: "ChatGPT", icon: "", 
        value: mainQueryRanking.chatgptCitationProb != null ? `${Math.round(mainQueryRanking.chatgptCitationProb)}%` : "—",
        label: "Prob. citation", color: colors.secondary },
      { platform: "Perplexity", icon: "", 
        value: mainQueryRanking.perplexityCitationProb != null ? `${Math.round(mainQueryRanking.perplexityCitationProb)}%` : "—",
        label: "Prob. citation", color: colors.warning }
    ];

    const posCardW = (contentW - 5) / 2;
    const posCardH = 45;

    posData.forEach((pos, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = margin.x + col * (posCardW + 5);
      const cardY = y + row * (posCardH + 5);

      setFillColor(colors.white);
      doc.roundedRect(x, cardY, posCardW, posCardH, 5, 5, "F");
      setDrawColor(pos.color);
      doc.setLineWidth(0.8);
      doc.roundedRect(x, cardY, posCardW, posCardH, 5, 5, "D");

      doc.setFontSize(20);
      doc.text(pos.icon, x + 6, cardY + 15);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setColor(colors.dark);
      doc.text(pos.platform, x + 18, cardY + 13);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      setColor(pos.color);
      const displayValue = pos.position != null ? fmtPos(pos.position) : (pos.value || "—");
      doc.text(displayValue, x + 6, cardY + 32);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setColor(colors.gray);
      doc.text(pos.label, x + 6, cardY + 38);
    });

    y += (Math.ceil(posData.length / 2) * (posCardH + 5)) + 10;

    if (rawQueryRanking && rawQueryRanking.comment) {
      checkPageBreak(20);
      addInfoBox(rawQueryRanking.comment, "info");
    }
  }

  /* ========= PAGE 6: SEO Classique ========= */
  doc.addPage();
  addHeader(5);
  y = 35;

  addSection("04 · Analyse SEO classique", "Fondamentaux on-page et optimisations");

  const seoElements = [
    { label: "Title", value: seoData.title, icon: "" },
    { label: "Meta Description", value: seoData.metaDesc, icon: "" },
    { label: "H1", value: seoData.h1, icon: "" },
    { label: "Canonical", value: seoData.canonical, icon: "" }
  ];

  seoElements.forEach(elem => {
    checkPageBreak(25);
    
    setFillColor({ r: 249, g: 250, b: 251 });
    doc.roundedRect(margin.x, y, contentW, 20, 4, 4, "F");

    doc.setFontSize(16);
    doc.text(elem.icon, margin.x + 5, y + 11);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setColor(colors.gray);
    doc.text(elem.label, margin.x + 15, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(colors.dark);
    const valueLines = doc.splitTextToSize(elem.value, contentW - 25);
    doc.text(valueLines.slice(0, 2), margin.x + 15, y + 12);

    y += 23;
  });

  y += 5;
  const statsW = (contentW - 10) / 3;
  
  [
    { label: "Nombre H1", value: seoData.h1Count },
    { label: "Mots", value: seoData.wordCount },
    { label: "Langue", value: seoData.lang }
  ].forEach((stat, i) => {
    const x = margin.x + i * (statsW + 5);
    
    setFillColor(colors.white);
    doc.roundedRect(x, y, statsW, 16, 3, 3, "F");
    setDrawColor({ r: 226, g: 232, b: 240 });
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, statsW, 16, 3, 3, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setColor(colors.dark);
    doc.text(String(stat.value), x + 5, y + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    setColor(colors.gray);
    doc.text(stat.label, x + 5, y + 13);
  });

  y += 22;

  if (seoIssues.length) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(colors.gray);
    doc.text("PROBLÈMES DÉTECTÉS", margin.x, y);
    y += 6;
    
    seoIssues.slice(0, 6).forEach(issue => {
      checkPageBreak(12);
      
      setFillColor({ r: 254, g: 226, b: 226 });
      doc.roundedRect(margin.x, y, contentW, 10, 2, 2, "F");
      
      setFillColor(colors.danger);
      doc.circle(margin.x + 5, y + 5, 1.5, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(colors.dark);
      const issueLines = doc.splitTextToSize(issue, contentW - 15);
      doc.text(issueLines[0], margin.x + 10, y + 6);
      
      y += 12;
    });
  }

  /* ========= PAGE 7: Performance ========= */
  doc.addPage();
  addHeader(6);
  y = 35;

  addSection("05 · Performance & Technique", "Core Web Vitals et infrastructure");

  const perfCardW = 80;
  const perfCardH = 50;
  const perfCardX = (pageW - perfCardW) / 2;

  setFillColor(colors.white);
  doc.roundedRect(perfCardX, y, perfCardW, perfCardH, 6, 6, "F");
  setDrawColor(getScoreColor(perfScore));
  doc.setLineWidth(1);
  doc.roundedRect(perfCardX, y, perfCardW, perfCardH, 6, 6, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(colors.gray);
  doc.text("Performance Mobile", perfCardX + perfCardW/2, y + 12, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  setColor(colors.dark);
  doc.text(fmt(perfScore), perfCardX + perfCardW/2, y + 28, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  setColor(getScoreColor(perfScore));
  doc.text(getScoreGrade(perfScore), perfCardX + perfCardW/2, y + 40, { align: "center" });

  y += perfCardH + 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(colors.gray);
  doc.text("CORE WEB VITALS", margin.x, y);
  y += 8;

  const vitals = [
    { label: "LCP (Largest Contentful Paint)", 
      value: perfData.lcp != null ? `${Math.round(perfData.lcp)} ms` : "—",
      score: perfData.lcp != null ? Math.max(0, 100 - (perfData.lcp / 40)) : null },
    { label: "CLS (Cumulative Layout Shift)", 
      value: perfData.cls != null ? perfData.cls.toFixed(3) : "—",
      score: perfData.cls != null ? Math.max(0, 100 - (perfData.cls * 400)) : null },
    { label: "TBT (Total Blocking Time)", 
      value: perfData.tbt != null ? `${Math.round(perfData.tbt)} ms` : "—",
      score: perfData.tbt != null ? Math.max(0, 100 - (perfData.tbt / 6)) : null }
  ];

  vitals.forEach(vital => {
    checkPageBreak(15);
    
    setFillColor(colors.white);
    doc.roundedRect(margin.x, y, contentW, 12, 3, 3, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(colors.dark);
    doc.text(vital.label, margin.x + 5, y + 5);

    doc.setFont("helvetica", "bold");
    doc.text(vital.value, margin.x + 5, y + 9);

    if (vital.score != null) {
      const barW = 60;
      const barH = 4;
      const barX = pageW - margin.x - barW - 5;
      const barY = y + 5;

      setFillColor({ r: 243, g: 244, b: 246 });
      doc.roundedRect(barX, barY, barW, barH, 2, 2, "F");

      const progress = Math.min(100, Math.max(0, vital.score));
      setFillColor(getScoreColor(progress));
      doc.roundedRect(barX, barY, (barW * progress) / 100, barH, 2, 2, "F");
    }

    y += 14;
  });

  y += 8;

  if (techSummary.length) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(colors.gray);
    doc.text("SIGNAUX TECHNIQUES", margin.x, y);
    y += 6;
    
    addBulletList(techSummary.slice(0, 5));
  } else {
    addInfoBox("Aucun signal technique détaillé n'a été remonté dans cet audit.", "info");
  }

  /* ========= PAGE 8: IA-SEO Deep ========= */
  doc.addPage();
  addHeader(7);
  y = 35;

  addSection("06 · IA-SEO Deep & E-E-A-T", "Analyse avancée de la compréhension IA");

  addInfoBox(
    "Les scores ci-dessous évaluent la façon dont votre page est comprise et peut être utilisée comme source par les IA génératives (ChatGPT, Gemini, Perplexity, etc.). Chaque score est sur 20.",
    "info"
  );

  const aiScores = [
    { label: "Coverage Intent", value: aiDeep.coverageIntent, 
      desc: "Couverture des intentions utilisateur" },
    { label: "Structure Clarity", value: aiDeep.structureClarity, 
      desc: "Clarté de la structure" },
    { label: "Answerability", value: aiDeep.answerability, 
      desc: "Capacité à répondre aux questions" },
    { label: "E-E-A-T Signals", value: aiDeep.eeatSignals, 
      desc: "Signaux de confiance et expertise" },
    { label: "AI Citation Ready", value: aiDeep.aiCitationReady, 
      desc: "Prêt pour citation par les IA" },
    { label: "Schema Adequacy", value: aiDeep.schemaAdequacy, 
      desc: "Qualité des schémas structurés" }
  ];

  aiScores.forEach(score => {
    checkPageBreak(12);
    
    const scoreValue = score.value != null ? score.value : 0;
    const scorePercent = (scoreValue / 20) * 100;

    setFillColor({ r: 249, g: 250, b: 251 });
    doc.roundedRect(margin.x, y, contentW, 10, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setColor(colors.dark);
    doc.text(score.label, margin.x + 5, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(colors.gray);
    doc.text(score.desc, margin.x + 5, y + 8.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(getScoreColor(scorePercent));
    doc.text(`${scoreValue}/20`, pageW - margin.x - 40, y + 6.5);

    const miniBarW = 30;
    const miniBarH = 3;
    const miniBarX = pageW - margin.x - 35;
    const miniBarY = y + 4;

    setFillColor({ r: 243, g: 244, b: 246 });
    doc.roundedRect(miniBarX, miniBarY, miniBarW, miniBarH, 1, 1, "F");

    setFillColor(getScoreColor(scorePercent));
    doc.roundedRect(miniBarX, miniBarY, (miniBarW * scorePercent) / 100, miniBarH, 1, 1, "F");

    y += 12;
  });

  if (aiDeep.focusKeywords && aiDeep.focusKeywords.length) {
    y += 8;
    checkPageBreak(20);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(colors.gray);
    doc.text("MOTS-CLÉS FOCUS DÉTECTÉS", margin.x, y);
    y += 6;

    setFillColor(colors.white);
    doc.roundedRect(margin.x, y, contentW, 15, 3, 3, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(colors.dark);
    const kwText = aiDeep.focusKeywords.slice(0, 8).join(" · ");
    const kwLines = doc.splitTextToSize(kwText, contentW - 10);
    doc.text(kwLines, margin.x + 5, y + 6);

    y += 18;
  }

  /* ========= PAGE 9: Quick Wins ========= */
  doc.addPage();
  addHeader(8);
  y = 35;

  addSection("07 · Plan d'action & Quick Wins", "Recommandations prioritaires sur 30 jours");

  if (!quickWins.length) {
    addInfoBox(
      "Aucune recommandation spécifique n'a été générée. Relancez un audit complet pour obtenir des actions détaillées.",
      "warning"
    );
  } else {
    addInfoBox(
      "Les actions sont classées par priorité pour maximiser l'impact sur votre score IA-SEO. Commencez par les P1 pour des résultats rapides.",
      "success"
    );

    if (p1.length) {
      checkPageBreak(25);
      y += 5;
      
      setFillColor({ r: 254, g: 226, b: 226 });
      doc.roundedRect(margin.x, y, contentW, 10, 3, 3, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setColor(colors.danger);
      doc.text("PRIORITÉ 1 · URGENT", margin.x + 5, y + 6.5);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Impact fort · À traiter immédiatement", pageW - margin.x - 5, y + 6.5, { align: "right" });
      
      y += 14;
      
      p1.forEach((item, i) => {
        checkPageBreak(18);
        
        setFillColor(colors.white);
        doc.roundedRect(margin.x, y, contentW, 16, 3, 3, "F");
        setDrawColor(colors.danger);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin.x, y, contentW, 16, 3, 3, "D");

        setFillColor(colors.danger);
        doc.circle(margin.x + 6, y + 8, 2.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setColor(colors.white);
        doc.text(String(i + 1), margin.x + 6, y + 9.5, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setColor(colors.dark);
        const lines = doc.splitTextToSize(item, contentW - 20);
        doc.text(lines.slice(0, 2), margin.x + 12, y + 6);

        y += 18;
      });
    }

    if (p2.length) {
      checkPageBreak(25);
      y += 5;
      
      setFillColor({ r: 254, g: 243, b: 199 });
      doc.roundedRect(margin.x, y, contentW, 10, 3, 3, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      setColor(colors.warning);
      doc.text("PRIORITÉ 2 · IMPORTANT", margin.x + 5, y + 6.5);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Consolidation · Après les P1", pageW - margin.x - 5, y + 6.5, { align: "right" });
      
      y += 14;
      
      p2.forEach((item, i) => {
        checkPageBreak(16);
        
        setFillColor(colors.white);
        doc.roundedRect(margin.x, y, contentW, 14, 3, 3, "F");
        
        setFillColor(colors.warning);
        doc.circle(margin.x + 6, y + 7, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setColor(colors.white);
        doc.text(String(i + 1), margin.x + 6, y + 8, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setColor(colors.dark);
        const lines = doc.splitTextToSize(item, contentW - 18);
        doc.text(lines.slice(0, 2), margin.x + 11, y + 5);

        y += 16;
      });
    }

    if (p3.length) {
      checkPageBreak(20);
      y += 5;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setColor(colors.gray);
      doc.text("PRIORITÉ 3 · BONUS", margin.x, y);
      y += 6;
      
      addBulletList(p3.slice(0, 4));
    }
  }

  if (aiDeep.titleSuggestion || aiDeep.metaDescriptionSuggestion) {
    checkPageBreak(35);
    y += 8;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(colors.gray);
    doc.text("SUGGESTIONS D'OPTIMISATION", margin.x, y);
    y += 6;

    if (aiDeep.titleSuggestion) {
      checkPageBreak(20);
      setFillColor({ r: 220, g: 252, b: 231 });
      doc.roundedRect(margin.x, y, contentW, 15, 3, 3, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setColor(colors.success);
      doc.text("Title optimisé", margin.x + 5, y + 5);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(colors.dark);
      const titleLines = doc.splitTextToSize(aiDeep.titleSuggestion, contentW - 10);
      doc.text(titleLines, margin.x + 5, y + 9);
      
      y += 17;
    }

    if (aiDeep.metaDescriptionSuggestion) {
      checkPageBreak(22);
      setFillColor({ r: 220, g: 252, b: 231 });
      doc.roundedRect(margin.x, y, contentW, 20, 3, 3, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setColor(colors.success);
      doc.text("Meta Description optimisée", margin.x + 5, y + 5);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(colors.dark);
      const metaLines = doc.splitTextToSize(aiDeep.metaDescriptionSuggestion, contentW - 10);
      doc.text(metaLines, margin.x + 5, y + 9);
      
      y += 22;
    }
  }

  /* ========= PAGE 10: FAQ & Schémas ========= */
  doc.addPage();
  addHeader(9);
  y = 35;

  addSection("08 · FAQ & Schémas recommandés", "Optimisations pour la compréhension IA");

  if (faqIdeas.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(colors.gray);
    doc.text("QUESTIONS FRÉQUENTES SUGGÉRÉES", margin.x, y);
    y += 6;

    addInfoBox(
      "Intégrez ces FAQ sur votre page pour améliorer la compréhension par les IA et les moteurs de recherche.",
      "info"
    );

    faqIdeas.slice(0, 6).forEach((faq, i) => {
      checkPageBreak(18);
      
      setFillColor(colors.white);
      doc.roundedRect(margin.x, y, contentW, 16, 3, 3, "F");
      setDrawColor(colors.primary);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin.x, y, contentW, 16, 3, 3, "D");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setColor(colors.primary);
      doc.text(`Q${i + 1}`, margin.x + 5, y + 6);

      doc.setFont("helvetica", "normal");
      setColor(colors.dark);
      const faqLines = doc.splitTextToSize(faq, contentW - 18);
      doc.text(faqLines.slice(0, 2), margin.x + 12, y + 6);

      y += 18;
    });
  } else {
    addInfoBox(
      "Aucune FAQ n'a été détectée ou suggérée. Ajoutez 3 à 5 questions-réponses pertinentes pour améliorer votre visibilité IA.",
      "warning"
    );
  }

  y += 8;

  if (schemas.length) {
    checkPageBreak(25);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(colors.gray);
    doc.text("SCHÉMAS JSON-LD RECOMMANDÉS", margin.x, y);
    y += 6;

    schemas.slice(0, 6).forEach(schema => {
      checkPageBreak(10);
      
      setFillColor({ r: 239, g: 246, b: 255 });
      doc.roundedRect(margin.x, y, contentW, 8, 2, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setColor(colors.primary);
      doc.text("●", margin.x + 4, y + 5);

      doc.setFont("helvetica", "normal");
      setColor(colors.dark);
      const schemaLines = doc.splitTextToSize(schema, contentW - 15);
      doc.text(schemaLines[0], margin.x + 10, y + 5);

      y += 10;
    });
  } else {
    checkPageBreak(15);
    addInfoBox(
      "Aucun schéma spécifique recommandé. Les schémas JSON-LD aident les IA à mieux comprendre votre contenu.",
      "info"
    );
  }

  /* ========= Ajout des footers ========= */
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) {
      addFooter(i, totalPages);
    }
  }

  /* ========= Export ========= */
  const safeEmail = clientEmail.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];

  doc.save(`MaiSeoM_Audit_IA-SEO_${safeEmail}_${timestamp}.pdf`);
}