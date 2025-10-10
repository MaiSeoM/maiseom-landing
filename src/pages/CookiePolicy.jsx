// src/pages/CookiePolicy.jsx
import { motion } from "framer-motion";

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Bandeau haut premium */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-20 left-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="h-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600" />
        <div className="relative text-center py-20 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Politique relative aux cookies
          </motion.h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez comment <strong className="text-indigo-600">MaiSeoM</strong> utilise les cookies pour améliorer
            votre expérience et mesurer la performance du site.
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="max-w-4xl mx-auto px-6 py-16 leading-relaxed text-gray-700 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            1. Qu’est-ce qu’un cookie ?
          </h2>
          <p>
            Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, smartphone, tablette)
            lorsque vous visitez un site web. Il permet à ce site de reconnaître votre appareil et de mémoriser
            certaines informations pour faciliter votre navigation et améliorer les services proposés.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            2. Types de cookies utilisés sur MaiSeoM
          </h2>

          <ul className="list-disc list-inside mt-2 space-y-3">
            <li>
              <strong>Cookies strictement nécessaires</strong> — essentiels au bon fonctionnement du site
              (navigation, sécurité, gestion des sessions). Ces cookies ne nécessitent pas de consentement.
            </li>
            <li>
              <strong>Cookies de mesure d’audience (Google Analytics 4)</strong> — permettent de comprendre comment
              les utilisateurs interagissent avec le site (pages visitées, durée des sessions, provenance du trafic).
              Ces cookies sont activés uniquement après votre accord.
            </li>
            <li>
              <strong>Cookies marketing</strong> — utilisés pour personnaliser l’expérience et proposer du contenu
              pertinent. Ces cookies sont facultatifs et désactivés par défaut.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            3. Gestion du consentement
          </h2>
          <p>
            Lors de votre première visite sur{" "}
            <a href="https://maiseom.com" className="text-indigo-600 hover:underline">
              www.maiseom.com
            </a>
            , un bandeau de consentement apparaît pour vous permettre d’accepter, refuser ou personnaliser
            l’utilisation des cookies.
          </p>
          <p className="mt-3">
            Vous pouvez modifier vos préférences à tout moment en cliquant sur{" "}
            <button
              onClick={() => window.maiseomOpenCookies?.()}
              className="text-indigo-600 hover:underline font-medium"
            >
              Gérer mes cookies
            </button>{" "}
            en bas de chaque page.
          </p>
          <p className="mt-3">
            Votre choix est conservé pendant 6 mois. Passé ce délai, le bandeau vous sera de nouveau présenté.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            4. Outils de mesure d’audience
          </h2>
          <p>
            MaiSeoM utilise <strong>Google Analytics 4</strong> pour analyser le trafic et améliorer ses
            performances. Les données collectées sont anonymisées et ne permettent pas d’identifier un utilisateur.
          </p>
          <p className="mt-3">
            Si vous refusez les cookies analytiques, aucune donnée ne sera transmise à Google Analytics.
          </p>
          <p className="mt-3">
            Pour plus d’informations sur la politique de Google Analytics, consultez :{" "}
            <a
              href="https://policies.google.com/privacy"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://policies.google.com/privacy
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            5. Durée de conservation des cookies
          </h2>
          <p>
            La durée de vie des cookies varie en fonction de leur nature :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Cookies de session : supprimés dès la fermeture du navigateur</li>
            <li>Cookies analytiques : 13 mois maximum</li>
            <li>Cookies de consentement : 6 mois maximum</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            6. Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’opposition et de
            suppression de vos données personnelles.
          </p>
          <p className="mt-3">
            Pour exercer vos droits ou obtenir des informations complémentaires, contactez-nous à :
          </p>
          <p className="mt-3">
            <a
              href="mailto:contact@maiseom.com"
              className="text-indigo-600 hover:underline font-medium"
            >
              contact@maiseom.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            7. Mise à jour de la politique
          </h2>
          <p>
            Cette politique peut être mise à jour à tout moment pour refléter l’évolution de la réglementation
            ou des technologies utilisées sur le site.
          </p>
          <p className="mt-3">
            Dernière mise à jour : <strong>1er octobre 2025</strong>
          </p>
        </section>
      </section>

      <div className="h-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600" />
    </main>
  );
}
