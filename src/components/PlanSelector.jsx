import { useEffect, useState } from "react";

const PLANS = ["Starter", "Pro", "Entreprise"];

export default function PlanSelector({ value, onChange }) {
  const [selected, setSelected] = useState(value || "Pro");

  useEffect(() => {
    // Pré-sélection depuis localStorage ou ?plan= dans l’URL
    const fromStorage = localStorage.getItem("maiseom_selected_plan");
    const fromQuery = new URLSearchParams(window.location.search).get("plan");
    const candidate = fromQuery ? capitalize(fromQuery) : fromStorage;
    const initial = PLANS.includes(candidate) ? candidate : selected;
    setSelected(initial);
    onChange?.(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(p) {
    setSelected(p);
    localStorage.setItem("maiseom_selected_plan", p);
    onChange?.(p);
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-2 grid grid-cols-3 gap-2 shadow-sm">
      {PLANS.map((p) => {
        const active = p === selected;
        return (
          <button
            key={p}
            type="button"
            onClick={() => select(p)}
            className={`h-10 rounded-xl text-sm font-semibold transition
              ${active ? "text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
            style={active ? { backgroundImage: "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)" } : {}}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
}
