// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

const AuthContext = createContext(null);

function isActive(status) {
  return status === "active" || status === "trialing";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null); // ✅ null au départ
  const [loading, setLoading] = useState(true);

  const loadSubscription = async (userId) => {
    if (!userId) {
      setSubscription(null);
      return;
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .select("plan,status,current_period_end,stripe_price_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[AuthContext] loadSubscription error:", error);
      setSubscription(null);
      return;
    }

    // data peut être null si pas encore payé
    setSubscription(
      data
        ? {
            ...data,
            hasAccess: isActive(data.status),
          }
        : null
    );
  };

  useEffect(() => {
    let unsub = null;

    const init = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("[AuthContext] getSession error:", error);

      const session = data?.session;

      if (session?.user) {
        setUser(session.user);
        await loadSubscription(session.user.id);
      } else {
        setUser(null);
        setSubscription(null);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadSubscription(session.user.id);
        } else {
          setUser(null);
          setSubscription(null);
        }
      }
    );

    unsub = listener?.subscription;

    return () => {
      unsub?.unsubscribe?.();
    };
  }, []);

  const signUp = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // ✅ après login, recharge le plan
    const u = data?.user;
    if (u?.id) await loadSubscription(u.id);

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSubscription(null);
  };

  const value = {
    user,
    subscription,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSubscription: () => loadSubscription(user?.id),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
