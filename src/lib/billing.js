// src/lib/billing.js
import { supabase } from "../supabaseClient.js";

const PRICE_ID_BY_PLAN = {
  Starter: "price_1SqDXBRrDyU3qBDhXq3fCvQz",
  Pro: "price_1SqE2qRrDyU3qBDhcMhZDkg7",
};

function isActiveStatus(status) {
  return status === "active" || status === "trialing";
}

export async function startCheckout(planName, referralCode = "") {
  const priceId = PRICE_ID_BY_PLAN[planName];
  if (!priceId) throw new Error(`UNKNOWN_PLAN:${planName}`);

  if (sessionStorage.getItem("checkout_in_progress") === "1") return;
  sessionStorage.setItem("checkout_in_progress", "1");

  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    const userId = data?.session?.user?.id;

    if (!token || !userId) throw new Error("NOT_LOGGED_IN");

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status, plan")
      .eq("user_id", userId)
      .maybeSingle();

    if (sub?.status && isActiveStatus(sub.status)) {
      window.location.href = "/app";
      return;
    }

    const code = String(referralCode || "").trim();
    const body = code ? { priceId, referralCode: code } : { priceId };

    const { data: out, error } = await supabase.functions.invoke(
      "create-checkout-session",
      { body }
    );

    if (error) throw new Error(error.message || "CHECKOUT_FAILED");
    if (!out?.url) throw new Error("MISSING_CHECKOUT_URL");

    window.location.href = out.url;
  } finally {
    sessionStorage.removeItem("checkout_in_progress");
  }
}