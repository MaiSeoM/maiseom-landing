// src/lib/analytics.js
// Gestion complète du consentement + Google Analytics 4

let loaded = false;
let measurementId = null;

/** Petit raccourci vers dataLayer */
function g() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

/** Initialise GA4 avec consentement par défaut "denied" */
export function initAnalytics(measId) {
  if (!measId) return;
  if (loaded && measurementId === measId) return;

  measurementId = measId;

  // Consentement par défaut RGPD : rien de stocké sans accord
  g("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });

  g("js", new Date());

  // Charge la librairie GA4
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measId}`;
  document.head.appendChild(s);

  // Pas de page_view auto
  g("config", measId, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
  });

  loaded = true;
}

/**
 * Applique le consentement choisi par l’utilisateur
 * @param {{analytics:boolean, ads:boolean}} prefs
 */
export function setConsent(prefs = { analytics: false, ads: false }) {
  const analyticsGranted = !!prefs.analytics;
  const adsGranted = !!prefs.ads;

  g("consent", "update", {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: adsGranted ? "granted" : "denied",
    ad_user_data: adsGranted ? "granted" : "denied",
    ad_personalization: adsGranted ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });
}

// --- Compatibilité avec l'ancien code ---
export function grantAnalyticsConsent() {
  // analytics = ON, ads = OFF (RGPD-friendly si tu ne fais pas de pub)
  setConsent({ analytics: true, ads: false });
}

export function revokeAnalyticsConsent() {
  // tout OFF
  setConsent({ analytics: false, ads: false });
}


/** Page view manuelle après consentement */
export function trackPageView(path = "/") {
  if (!measurementId) return;
  g("event", "page_view", {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
}

/** Événements personnalisés */
export function trackEvent(name, params = {}) {
  g("event", name, params);
}
