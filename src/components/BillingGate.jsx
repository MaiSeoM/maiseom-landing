import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth/AuthContext.jsx";

function isActive(status) {
  return status === "active" || status === "trialing";
}

export default function BillingGate() {
  const { user, loading: authLoading } = useAuth(); // 🔥 IMPORTANT
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (authLoading) return; // attend que auth soit prête

    let mounted = true;

    async function run() {
      if (!user) {
        if (mounted) {
          setHasAccess(false);
          setLoading(false);
        }
        return;
      }

      const { data: sub, error } = await supabase
        .from("subscriptions")
        .select("status, plan")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("BillingGate error:", error);
      }

      const ok = isActive(sub?.status);

      if (mounted) {
        setHasAccess(ok);
        setLoading(false);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [user, authLoading, location.pathname]);

  // 🔥 laisser passer welcome page
  if (location.pathname.startsWith("/app/welcome")) {
    return <Outlet />;
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement de votre accès…</p>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/app/billing" replace />;
  }

  return <Outlet />;
}
