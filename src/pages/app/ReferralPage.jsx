// src/pages/app/ReferralPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient.js";
import { useAuth } from "../../auth/AuthContext.jsx";

function formatEuros(cents) {
  return `${((cents || 0) / 100).toFixed(2)}€`;
}

function buildFallbackCode(email) {
  const clean = String(email || "MAISEOM")
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);

  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${clean || "MAI"}${suffix}`;
}

export default function ReferralPage() {
  const { user } = useAuth() || {};

  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");
  const [error, setError] = useState("");

  const [referralCode, setReferralCode] = useState("");
  const [wallet, setWallet] = useState({
    validated_count: 0,
    credited_pairs: 0,
    pending_cents: 0,
    available_cents: 0,
    total_earned_cents: 0,
  });
  const [referrals, setReferrals] = useState([]);

  const unlockThresholdCents = 5000;

  const progressPercent = useMemo(() => {
    const pending = wallet?.pending_cents || 0;
    return Math.min(100, Math.round((pending / unlockThresholdCents) * 100));
  }, [wallet]);

  const referralLink = useMemo(() => {
    if (!referralCode) return "";
    return `${window.location.origin}/signup?ref=${referralCode}`;
  }, [referralCode]);

  useEffect(() => {
    let mounted = true;

    async function loadReferralData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setCopySuccess("");

      try {
        // 1) Charger le code parrain
        let { data: codeRow, error: codeErr } = await supabase
          .from("referral_codes")
          .select("code")
          .eq("user_id", user.id)
          .maybeSingle();

        if (codeErr) throw codeErr;

        // 2) Si pas de code -> en créer un automatiquement
        if (!codeRow?.code) {
          let generated = buildFallbackCode(user.email);

          for (let i = 0; i < 5; i++) {
            const { error: insertErr } = await supabase
              .from("referral_codes")
              .insert({
                user_id: user.id,
                code: generated,
              });

            if (!insertErr) {
              codeRow = { code: generated };
              break;
            }

            generated = buildFallbackCode(`${user.email || "MAI"}${i}`);
          }

          const { data: refreshedCode, error: refreshedErr } = await supabase
            .from("referral_codes")
            .select("code")
            .eq("user_id", user.id)
            .maybeSingle();

          if (refreshedErr) throw refreshedErr;
          codeRow = refreshedCode;
        }

        // 3) Charger / créer wallet
        let { data: walletRow, error: walletErr } = await supabase
          .from("referral_wallets")
          .select(
            "validated_count, credited_pairs, pending_cents, available_cents, total_earned_cents"
          )
          .eq("user_id", user.id)
          .maybeSingle();

        if (walletErr) throw walletErr;

        if (!walletRow) {
          const { error: insertWalletErr } = await supabase
            .from("referral_wallets")
            .insert({
              user_id: user.id,
            });

          if (insertWalletErr) throw insertWalletErr;

          const { data: refreshedWallet, error: refreshedWalletErr } = await supabase
            .from("referral_wallets")
            .select(
              "validated_count, credited_pairs, pending_cents, available_cents, total_earned_cents"
            )
            .eq("user_id", user.id)
            .single();

          if (refreshedWalletErr) throw refreshedWalletErr;
          walletRow = refreshedWallet;
        }

        // 4) Charger historique filleuls
        const { data: referralsRows, error: referralsErr } = await supabase
          .from("referrals")
          .select("id, referred_user_id, status, created_at, validated_at")
          .eq("referrer_user_id", user.id)
          .order("created_at", { ascending: false });

        if (referralsErr) throw referralsErr;

        if (!mounted) return;

        setReferralCode(codeRow?.code || "");
        setWallet(
          walletRow || {
            validated_count: 0,
            credited_pairs: 0,
            pending_cents: 0,
            available_cents: 0,
            total_earned_cents: 0,
          }
        );
        setReferrals(referralsRows || []);
      } catch (e) {
        console.error("ReferralPage load error:", e);
        if (mounted) {
          setError("Impossible de charger vos données de parrainage.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadReferralData();

    return () => {
      mounted = false;
    };
  }, [user]);

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopySuccess("Code copié ✅");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (e) {
      console.error(e);
      setCopySuccess("Impossible de copier le code.");
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess("Lien copié ✅");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (e) {
      console.error(e);
      setCopySuccess("Impossible de copier le lien.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-0">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            MaiSeoM Parrainage
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Partagez votre code, faites profiter vos filleuls de -15% sur leur premier paiement
            et cumulez vos crédits MaiSeoM.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-0 lg:py-10">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Chargement de votre espace parrainage…</p>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="space-y-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Votre code parrain</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Vos filleuls obtiennent <span className="font-semibold">-15%</span> sur leur
                      premier paiement avec ce code.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-extrabold tracking-wide text-slate-900">
                      {referralCode || "Aucun code"}
                    </div>
                    <button
                      onClick={handleCopyCode}
                      disabled={!referralCode}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      Copier mon code
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    Votre lien de parrainage
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Partagez directement ce lien pour préremplir automatiquement le code parrain.
                  </p>

                  <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    />
                    <button
                      onClick={handleCopyLink}
                      disabled={!referralLink}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Copier mon lien
                    </button>
                  </div>

                  {copySuccess && (
                    <div className="mt-3 text-xs font-medium text-emerald-600">
                      {copySuccess}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Filleuls validés"
                value={String(wallet?.validated_count || 0)}
                subtitle="Paiements confirmés"
              />
              <StatCard
                title="Crédits en attente"
                value={formatEuros(wallet?.pending_cents || 0)}
                subtitle="Déblocage à partir de 50€"
              />
              <StatCard
                title="Crédits débloqués"
                value={formatEuros(wallet?.available_cents || 0)}
                subtitle="Utilisables plus tard"
              />
              <StatCard
                title="Total cumulé"
                value={formatEuros(wallet?.total_earned_cents || 0)}
                subtitle="Gains générés"
              />
            </div>

            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Progression vers le déblocage
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Vos gains passent en crédits débloqués à partir de{" "}
                    <span className="font-semibold">50€</span>.
                  </p>
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  {formatEuros(wallet?.pending_cents || 0)} / 50.00€
                </div>
              </div>

              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Tous les 2 filleuls validés = 5€ de crédits MaiSeoM.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-900">Comment ça fonctionne</h2>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <InfoStep
                  number="1"
                  title="Partagez votre lien ou votre code"
                  text="Envoyez votre lien de parrainage ou votre code à vos contacts."
                />
                <InfoStep
                  number="2"
                  title="Le filleul obtient -15%"
                  text="La réduction s’applique une seule fois sur son premier paiement."
                />
                <InfoStep
                  number="3"
                  title="Vous cumulez vos crédits"
                  text="Tous les 2 filleuls validés, vous gagnez 5€."
                />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Historique des parrainages
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Suivez vos filleuls et l’état de validation de vos récompenses.
                  </p>
                </div>
              </div>

              {referrals.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Aucun filleul validé pour le moment.
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Filleul
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {referrals.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {item.referred_user_id?.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                item.status === "validated"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {item.status === "validated" ? "Validé" : "En attente"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">
                            {new Date(item.validated_at || item.created_at).toLocaleDateString("fr-FR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.section>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
    </motion.div>
  );
}

function InfoStep({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
        {number}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}