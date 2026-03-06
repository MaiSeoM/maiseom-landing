// src/lib/billing.js
import { supabase } from "../supabaseClient";

const PRICE_BY_PLAN = {
  Starter: "price_1SqDXBRrDyU3qBDhXq3fCvQz",
  Pro: "price_1SqE2qRrDyU3qBDhcMhZDkg7",
};

export async function startCheckout(planName) {
  const priceId = PRICE_BY_PLAN[planName];
  if (!priceId) throw new Error("UNKNOWN_PLAN");

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("NOT_LOGGED_IN");

  // IMPORTANT: invoke ajoute automatiquement apikey + authorization
  const { data, error } = await supabase.functions.invoke("create-checkout-session", {
    body: { priceId, plan: planName.toLowerCase() },
  });

  if (error) throw error;
  if (!data?.url) throw new Error("NO_CHECKOUT_URL");

  window.location.href = data.url;
}
