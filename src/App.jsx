// src/App.jsx
import { Routes, Route, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import StickyCTA from "./components/StickyCTA.jsx";
import FloatingCTA from "./components/FloatingCTA.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollToHash from "./components/ScrollToHash.jsx";

import Hero from "./components/Hero.jsx";
import Seo from "./components/Seo.jsx";
import FAQ, { FAQ_ITEMS } from "./components/FAQ.jsx";
import SocialProof from "./components/SocialProof.jsx";
import Benefits from "./components/Benefits.jsx";
import Pricing from "./components/Pricing.jsx";
import HomeSeoBlock from "./components/HomeSeoBlock.jsx";
import CTA from "./components/CTA.jsx";
import CookiePolicy from "./components/CookiePolicy.jsx";
import KeyMetrics from "./components/KeyMetrics.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import Privacy from "./pages/Privacy.jsx";
import Legal from "./pages/Legal.jsx";
import CGV from "./pages/CGV.jsx";
import Welcome from "./pages/app/Welcome.jsx";
import ReferralPage from "./pages/app/ReferralPage.jsx";
import FreeAuditPage from "./pages/FreeAuditPage.jsx";
import PublicOnly from "./components/PublicOnly.jsx";



// 🔥 nouvelle page marketing Audit
import AuditPage from "./pages/AuditPage.jsx";

// Zone app protégée
import BillingGate from "./components/BillingGate.jsx";
import BillingPage from "./pages/app/BillingPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import Dashboard from "./pages/app/Dashboard.jsx";
import Audit from "./pages/app/Audit.jsx";
import Settings from "./pages/app/Settings.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import MonEspace from "./pages/app/MonEspace.jsx";


import {
  initAnalytics,
  grantAnalyticsConsent,
  trackPageView,
  enableCtaAutotrack,
} from "./lib/analytics.js";

const MEASUREMENT_ID = "G-3BTKFKFJDV";


function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 relative">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/** Tracke automatiquement chaque changement de route */
function RouteChangeTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname || "/");
  }, [location]);
  return null;
}

function ReferralCapture() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("maiseom_referral_code", ref.trim().toUpperCase());
    }
  }, [searchParams]);

  return null;
}

export default function App() {
  useEffect(() => {
    if (localStorage.getItem("maiseom_cookie_ok") === "1") {
      initAnalytics(MEASUREMENT_ID);
      grantAnalyticsConsent();
      enableCtaAutotrack();
      trackPageView("/");
    }
  }, []);

  return (
    <>
      <ReferralCapture />
      <RouteChangeTracker />
      <ScrollToTop />
      <ScrollToHash />

      <Routes>
        {/* ====== Site public (landing) ====== */}
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <>
                <Seo
                  title="Audit SEO IA & Google SGE | MaiSeoM"
                  description="Audit SEO et IA-SEO pour Google SGE (AI Overviews), ChatGPT et Perplexity. Analyse gratuite, recommandations actionnables et visibilité mesurable."
                  canonical="https://www.maiseom.com/"
                  jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": FAQ_ITEMS.map((it) => ({
                    "@type": "Question",
                    "name": it.q,
                    "acceptedAnswer": {
                    "@type": "Answer",
                    "text": it.a,
                  },
                })),
              }}
            />

                <Hero />
                <Pricing />
                <KeyMetrics />
                <SocialProof />
                <Benefits />
                <HomeSeoBlock />
                <FAQ />
                <CTA />
                <CookiePolicy />
              </>
            }
          />

          {/* Page tarifs publique */}
          <Route path="/tarifs" element={<PricingPage />} />

          {/* Page Audit Gratuit */}
          <Route path="/audit/free" element={<FreeAuditPage />} />

          {/* ✅ Nouvelle route marketing d’audit */}
          <Route path="/audit" element={<AuditPage />} />

          {/* Pages légales */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/cgv" element={<CGV />} />
        </Route>

        {/* ====== App (espace connecté) protégée ====== */}
<Route element={<ProtectedRoute />}>
  {/* ✅ Page paiement accessible aux connectés même sans abonnement */}
  <Route path="/app/billing" element={<BillingPage />} />

  {/* ✅ Tout /app nécessite un abonnement actif */}
  <Route element={<BillingGate />}>
    <Route path="/app" element={<AppLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="audit" element={<Audit />} />
      <Route path="settings" element={<Settings />} />
      <Route path="mon-espace" element={<MonEspace />} />
      <Route path="parrainage" element={<ReferralPage />} />
      <Route path="welcome" element={<Welcome />} />
    </Route>
  </Route>
</Route>


        {/* ====== Auth publiques ====== */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/* éléments globaux */}
      <CookieBanner />
      <PublicOnly>
        <FloatingCTA />
        <StickyCTA />
      </PublicOnly>
    </>
  );
  
}
