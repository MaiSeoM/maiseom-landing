// src/contexts/WorkspaceContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useLocation } from "react-router-dom";

const WorkspaceContext = createContext(null);

function isAppRoute(pathname) {
  return pathname.startsWith("/app");
}

export const WorkspaceProvider = ({ children }) => {
  const location = useLocation();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(false); // ⚠️ false par défaut (important)
  const [error, setError] = useState("");

  const endpoint = import.meta.env.VITE_API_WORKSPACE_ME;

  const shouldLoadWorkspace = useMemo(() => {
    // ✅ pages publiques (audit gratuit inclus) => on NE charge PAS
    if (!isAppRoute(location.pathname)) return false;
    // ✅ pas d’endpoint => on ne tente rien
    if (!endpoint) return false;
    return true;
  }, [location.pathname, endpoint]);

  useEffect(() => {
    let mounted = true;

    const loadWorkspace = async () => {
      setError("");

      // ✅ ne rien faire sur pages publiques
      if (!shouldLoadWorkspace) {
        if (mounted) {
          setWorkspace(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        // ✅ on ne tente n8n QUE si l’utilisateur est connecté Supabase
        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user;

        if (!user) {
          if (mounted) {
            setWorkspace(null);
            setLoading(false);
          }
          return;
        }

        // ✅ IMPORTANT: sur localhost, évite les cookies n8n (CORS)
        // Si tu veux absolument des cookies n8n, il faudra configurer n8n en CORS credentials.
        const res = await fetch(endpoint, {
          method: "GET",
          credentials: "omit",
          headers: {
            "Content-Type": "application/json",
            // Optionnel: si ton n8n veut une preuve d’identité, on peut envoyer un token Supabase
            // "Authorization": `Bearer ${data.session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Workspace introuvable (n8n)");
        const json = await res.json();

        // format attendu: { ok: true, workspace: {...} }
        if (!json?.ok) throw new Error(json?.message || "Erreur workspace");

        if (mounted) setWorkspace(json.workspace);
      } catch (e) {
        console.error("Erreur workspace :", e);
        if (mounted) setError(e?.message || "Erreur workspace");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadWorkspace();

    return () => {
      mounted = false;
    };
  }, [shouldLoadWorkspace, endpoint, location.key]);

  return (
    <WorkspaceContext.Provider value={{ workspace, loading, error }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
