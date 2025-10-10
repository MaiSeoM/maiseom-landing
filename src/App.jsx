import { Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import StickyCTA from "./components/StickyCTA.jsx";
import FloatingCTA from "./components/FloatingCTA.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Hero from "./components/Hero.jsx";
import SocialProof from "./components/SocialProof.jsx";
import Benefits from "./components/Benefits.jsx";
import Pricing from "./components/Pricing.jsx";
import FAQ from "./components/FAQ.jsx";
import CTA from "./components/CTA.jsx";
import CookiePolicy from "./components/CookiePolicy.jsx";
import KeyMetrics from "./components/KeyMetrics.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import Privacy from "./pages/Privacy.jsx";
import Legal from "./pages/Legal.jsx";
import CGV from "./pages/CGV.jsx";
import ScrollToHash from "./components/ScrollToHash.jsx";

import { initAnalytics, grantAnalyticsConsent, trackPageView } from "./lib/analytics.js";

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

export default function App() {
  useEffect(() => {
    if (localStorage.getItem("maiseom_cookie_ok") === "1") {
      initAnalytics(MEASUREMENT_ID);
      grantAnalyticsConsent();
      trackPageView("/");
    }
  }, []);

  return (
    <>
      <ScrollToTop />
      <ScrollToHash/>
      <Routes>
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Pricing />
                <KeyMetrics />
                <SocialProof />
                <Benefits />
                <FAQ />
                <CTA />
                <CookiePolicy />
              </>
            }
          />
          <Route path="/tarifs" element={<PricingPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/cgv" element={<CGV />} />
        </Route>
      </Routes>

      {/* éléments globaux */}
      <CookieBanner />
      <FloatingCTA />
      <StickyCTA />
    </>
  );
}
