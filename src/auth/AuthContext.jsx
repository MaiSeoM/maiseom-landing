// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState({ plan: "Starter" });
  const [loading, setLoading] = useState(true);

  const didInit = useRef(false);

  useEffect(() => {
    // ✅ évite double init en dev (React.StrictMode)
    if (didInit.current) return;
    didInit.current = true;

    let unsub = null;
    let timeoutId = null;

    const initAuth = async () => {
      setLoading(true);

      // ✅ fallback: si Supabase met trop longtemps, on stoppe le loader
      timeoutId = window.setTimeout(() => {
        console.warn("[Auth] init timeout → forcing loading=false");
        setLoading(false);
      }, 4000);

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("[Auth] getSession error:", error);

        const session = data?.session || null;

        if (session?.user) {
          setUser(session.user);
          // TODO: plus tard -> récupérer vrai plan depuis subscriptions
          setSubscription({ plan: "Starter" });
        } else {
          setUser(null);
          setSubscription({ plan: "Starter" });
        }
      } catch (e) {
        console.error("[Auth] initAuth catch:", e);
        setUser(null);
        setSubscription({ plan: "Starter" });
      } finally {
        window.clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // ✅ on stoppe loading si jamais l'event arrive avant init
      setLoading(false);
    });

    unsub = listener?.subscription;

    return () => {
      window.clearTimeout(timeoutId);
      unsub?.unsubscribe?.();
    };
  }, []);

  const signUp = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const value = { user, subscription, loading, signIn, signUp, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
