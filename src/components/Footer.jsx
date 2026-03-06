// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import ContactEmailModal from "./ContactEmailModal.jsx";

export default function Footer() {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <>
      <footer className="relative bg-gray-900 text-gray-300 pt-16 pb-10 mt-20">
        {/* Halo léger en arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800/80 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & intro */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.ico" alt="MaiSeoM" className="h-10 w-auto" />
              <span className="text-xl font-semibold text-white">MaiSeoM</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md text-gray-400">
              Optimisez votre SEO pour l’ère de l’IA.  
              <br />Des analyses intelligentes, des recommandations automatiques, et un impact mesurable.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                {/* Accueil (hero) */}
                <Link to="/#hero" className="hover:text-white transition">Accueil</Link>
              </li>
              <li>
                {/* Audit Gratuit */}
                <Link to="/audit/free" className="hover:text-white transition">Audit Gratuit</Link>
              </li>
              <li>
                {/* Tarifs (page dédiée) */}
                <Link to="/tarifs" className="hover:text-white transition">Tarifs</Link>
              </li>
              <li>
                {/* FAQ (section home) */}
                <Link to="/#faq" className="hover:text-white transition">FAQ</Link>
              </li>
              <li>
                {/* Contact = modale avec l'email */}
                <button
                  onClick={() => setShowEmail(true)}
                  className="hover:text-white transition"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-white font-semibold mb-3">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <button
                  onClick={() => window.maiseomOpenCookies?.()}
                  className="hover:text-white transition"
                >
                  Gérer mes cookies
                </button>
              </li>
              <li>
                <Link to="/mentions-legales" className="hover:text-white transition">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="hover:text-white transition">
                  Conditions Générales de Vente
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de page */}
        <div className="relative z-10 mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <strong className="text-white font-semibold">MaiSeoM</strong> -  
          Tous droits réservés - 60 rue François 1er, 75008 Paris
        </div>
      </footer>

      {/* Modale email de contact */}
      <ContactEmailModal open={showEmail} onClose={() => setShowEmail(false)} />
    </>
  );
}
