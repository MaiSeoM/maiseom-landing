// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si on venait d'une page protégée, on y retourne. Sinon /app/mon-espace.
  const from = location.state?.from?.pathname || "/app/mon-espace";

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Merci de renseigner un email et un mot de passe.");
    return;
  }

  try {
    setLoading(true);
    await signIn({ email, password });

    // ✅ Si un plan avait été choisi avant login (pricing CTA)
    const selectedPlan = localStorage.getItem("maiseom_selected_plan");
    if (selectedPlan) {
      localStorage.removeItem("maiseom_selected_plan");
      window.location.href =
        "/tarifs?autopay=1&plan=" + encodeURIComponent(selectedPlan);
      return;
    }

    // ✅ Sinon: redirection premium (abonné => /app, sinon => /app/billing)
    // On laisse BillingGate décider proprement.
    window.location.href = "/app";
  } catch (e) {
    console.error(e);
    setError(e.message || "Impossible de se connecter pour le moment. Réessayez.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Connexion à MaiSeoM
        </h1>
        <p className="mt-1 text-sm text-slate-600 text-center">
          Accédez à votre espace d’audit IA-SEO.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-900">
              Email
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {error && (
            <p className="mt-2 text-xs text-rose-600 text-center">{error}</p>
          )}

          <p className="mt-4 text-xs text-slate-500 text-center">
            Pas encore de compte ?{" "}
            <Link
              to="/signup"
              className="font-semibold text-slate-900 hover:underline"
            >
              Créer mon espace MaiSeoM
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
