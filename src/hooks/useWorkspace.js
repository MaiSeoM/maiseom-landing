// src/hooks/useWorkspace.js
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

const WORKSPACE_ME_ENDPOINT = import.meta.env.VITE_API_WORKSPACE_ME;

export function useWorkspace() {
  const { user } = useAuth() || {};
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWorkspace = async () => {
      setError(null);

      if (!WORKSPACE_ME_ENDPOINT || !user?.email) {
        setLoading(false);
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

        if (!res.ok || !data?.ok || !data.workspace) {
          setLoading(false);
          return;
        }

        setWorkspace(data.workspace);
      } catch (e) {
        console.error("Erreur useWorkspace :", e);
        setError("Impossible de charger votre espace.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      loadWorkspace();
    } else {
      setLoading(false);
    }
  }, [user]);

  return { workspace, loading, error };
}
