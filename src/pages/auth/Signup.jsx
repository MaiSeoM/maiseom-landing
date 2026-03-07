// src/pages/auth/Signup.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import { supabase } from "../../supabaseClient.js";

const WORKSPACE_SAVE_ENDPOINT = import.meta.env.VITE_API_WORKSPACE_SAVE;

const Signup = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [domain, setDomain] = useState("");

  const [plan, setPlan] = useState("Starter");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pré-sélection du plan si l'utilisateur vient d'un clic sur un bouton tarif
  useEffect(() => {
    const selectedPlan = localStorage.getItem("maiseom_selected_plan");
    if (selectedPlan === "Starter" || selectedPlan === "Pro") {
      setPlan(selectedPlan);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email et mot de passe sont obligatoires.");
      return;
    }

    try {
      setLoading(true);

      // 1) Création du compte
      await signUp({ email, password });

      // 2) Récupérer l'utilisateur connecté
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 3) Enregistrer l’espace dans n8n / Google Sheet
      if (WORKSPACE_SAVE_ENDPOINT) {
        const payload = {
          domain: domain.trim() || null,
          clientFirstName: clientFirstName.trim() || null,
          clientLastName: clientLastName.trim() || null,
          clientCompany: clientCompany.trim() || null,
          email: email.trim(),
          plan,
          userId: user?.id || null,
        };

        try {
          await fetch(WORKSPACE_SAVE_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch (err) {
          console.warn("Workspace save failed during signup:", err);
        }
      }

      // 4) Si un plan a été choisi avant signup -> passer par /app/billing
      const selectedPlan = localStorage.getItem("maiseom_selected_plan");
      if (selectedPlan === "Starter" || selectedPlan === "Pro") {
        navigate("/app/billing", { replace: true });
        return;
      }

      // 5) Sinon -> comportement normal
      navigate("/app/mon-espace", { replace: true });
    } catch (e) {
      console.error(e);
      setError(
        e.message || "Impossible de créer le compte pour le moment. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Créer mon espace MaiSeoM
        </h1>
        <p className="mt-1 text-sm text-slate-600 text-center">
          Un seul compte pour tous vos audits IA-SEO.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-900">
              Email (compte)
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="vous@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-900">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-[11px] text-slate-500 hover:text-slate-700"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Minimum 6 caractères. Servira pour vous connecter.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-900">
              Plan choisi
            </label>
            <div className="flex gap-2 text-[11px]">
              {["Starter", "Pro", "Entreprise"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={
                    "flex-1 rounded-full border px-3 py-1.5 " +
                    (plan === p
                      ? "border-sky-500 bg-sky-50 text-sky-900"
                      : "border-slate-200 bg-white text-slate-600 hover:border-sky-400")
                  }
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Le paiement sera relié à ce plan plus tard.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-900">
                Prénom
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
                Nom
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

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-900">
              Domaine principal à auditer
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="https://www.votre-site.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <p className="text-[11px] text-slate-500">
              Vous pourrez modifier ces informations dans &quot;Mon espace
              MaiSeoM&quot;.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Création de votre compte..." : "Créer mon espace MaiSeoM"}
          </button>

          {error && (
            <p className="mt-2 text-xs text-rose-600 text-center">{error}</p>
          )}

          <p className="mt-4 text-xs text-slate-500 text-center">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/login"
              className="font-semibold text-slate-900 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;