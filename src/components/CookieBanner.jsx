import { useEffect, useState } from "react";
import { initAnalytics, setConsent } from "../lib/analytics.js";

// 👉 Mets ton ID GA4 (ex: "G-ABC123XYZ")
const MEASUREMENT_ID = "G-3BTKFKFJDV";

const LS_KEY_STATUS = "maiseom_cookie_status";   // "accepted" | "rejected" | "custom"
const LS_KEY_PREFS  = "maiseom_cookie_prefs";    // JSON { analytics: bool, ads: bool }

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, ads: false });
  const [customizing, setCustomizing] = useState(false);

  useEffect(() => {
    // Expose un hook global pour rouvrir la bannière (Footer “Gérer mes cookies”)
    window.maiseomOpenCookies = () => setShow(true);

    // Lire préférences
    const status = localStorage.getItem(LS_KEY_STATUS);
    const saved = localStorage.getItem(LS_KEY_PREFS);
    if (status) {
      try {
        const parsed = saved ? JSON.parse(saved) : { analytics: false, ads: false };
        setPrefs(parsed);
        // Si déjà “accepted/custom” -> initialiser & appliquer consent
        if (status === "accepted" || status === "custom") {
          initAnalytics(MEASUREMENT_ID);
          setConsent(parsed);
        }
        setShow(false);
      } catch {
        setShow(true);
      }
    } else {
      // Aucun choix encore -> afficher
      setShow(true);
    }
  }, []);

  const acceptAll = () => {
    const next = { analytics: true, ads: true };
    localStorage.setItem(LS_KEY_STATUS, "accepted");
    localStorage.setItem(LS_KEY_PREFS, JSON.stringify(next));
    initAnalytics(MEASUREMENT_ID);
    setConsent(next);
    setShow(false);
  };

  const rejectAll = () => {
    const next = { analytics: false, ads: false };
    localStorage.setItem(LS_KEY_STATUS, "rejected");
    localStorage.setItem(LS_KEY_PREFS, JSON.stringify(next));
    initAnalytics(MEASUREMENT_ID); // charge gtag mais tout reste en denied
    setConsent(next);
    setShow(false);
  };

  const saveCustom = () => {
    localStorage.setItem(LS_KEY_STATUS, "custom");
    localStorage.setItem(LS_KEY_PREFS, JSON.stringify(prefs));
    initAnalytics(MEASUREMENT_ID);
    setConsent(prefs);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="
        fixed inset-x-0 bottom-4 md:bottom-8
        z-[900] px-4
        md:mr-40  /* espace pour éviter le StickyCTA en bas-droite */
      "
      role="dialog"
      aria-live="polite"
      aria-label="Bannière de consentement aux cookies"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Cookies & confidentialité</h3>
            <p className="mt-1 text-sm text-gray-600">
              Nous utilisons des cookies pour mesurer l’audience et, si vous l’acceptez,
              activer des fonctionnalités marketing. Vous pouvez personnaliser votre choix.
            </p>

            {customizing && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mesure d’audience */}
                <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Mesure d’audience (GA4)</div>
                    <div className="text-xs text-gray-600">
                      Permet de comprendre l’usage du site (données agrégées, IP anonymisée).
                    </div>
                  </div>
                </label>

                {/* Marketing */}
                <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={prefs.ads}
                    onChange={(e) => setPrefs((p) => ({ ...p, ads: e.target.checked }))}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Marketing</div>
                    <div className="text-xs text-gray-600">
                      Active des cookies publicitaires (remarketing, personnalisation).
                    </div>
                  </div>
                </label>
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Vous pouvez modifier votre choix à tout moment :{" "}
              <button
                onClick={() => setCustomizing(true)}
                className="underline underline-offset-2 hover:text-blue-700"
              >
                personnaliser
              </button>{" "}
              ·{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-blue-700">
                politique cookies
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={rejectAll}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Tout refuser
            </button>

            {customizing ? (
              <button
                onClick={saveCustom}
                className="px-4 py-2 rounded-lg text-white font-semibold shadow transition hover:opacity-90"
                style={{ backgroundImage: "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)" }}
              >
                Enregistrer
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCustomizing(true)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition"
                >
                  Personnaliser
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 rounded-lg text-white font-semibold shadow transition hover:opacity-90"
                  style={{ backgroundImage: "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)" }}
                >
                  Tout accepter
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
