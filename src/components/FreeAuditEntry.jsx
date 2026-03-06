import React from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../lib/analytics.js";

export default function FreeAuditEntry({
  ctaLabel = "Auditer mon site gratuitement",
  subLabel = "Résultat immédiat • 30 secondes • Sans carte bancaire",
  location = "hero",
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {ctaLabel}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {subLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            trackEvent?.("cta_click", { location, label: "free_audit_entry" });
            navigate("/audit/free");
          }}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Lancer l'analyse gratuite →
        </button>
      </div>
    </div>
  );
}
