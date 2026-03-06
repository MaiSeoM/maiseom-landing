// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// ⚠️ Vite: les variables doivent commencer par VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase env vars. Check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "sb-maiseom-auth", // ✅ évite collision si tu as plusieurs apps
  },
  global: {
    headers: {
      "x-application-name": "maiseom-landing",
    },
  },
});
