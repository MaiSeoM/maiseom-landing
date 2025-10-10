// src/pages/Privacy.jsx
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Bandeau premium */}
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
            Politique de confidentialité
          </motion.h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Votre vie privée est essentielle. Voici comment{" "}
            <strong className="text-indigo-600">MaiSeoM</strong> collecte, utilise et protège vos données.
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="max-w-4xl mx-auto px-6 py-16 leading-relaxed text-gray-700 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            1. Responsable du traitement
          </h2>
          <p>
            Les données collectées via le site{" "}
            <a href="https://maiseom.com" className="text-indigo-600 hover:underline">
              www.maiseom.com
            </a>{" "}
            sont traitées par :
          </p>
          <p className="mt-3">
            <strong>MaiSeoM</strong>
            <br />
            Représentant légal : Melvyn Sel
            <br />
            Email :{" "}
            <a href="mailto:contact@maiseom.com" className="text-indigo-600 hover:underline">
              contact@maiseom.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            2. Données collectées
          </h2>
          <p>Nous collectons uniquement les données nécessaires à nos services :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Adresse e-mail (formulaires, inscriptions, accès aux offres)</li>
            <li>Données techniques (adresse IP, navigateur, durée de session)</li>
            <li>Données d’utilisation anonymisées à des fins de statistiques (Google Analytics 4)</li>
          </ul>
          <p className="mt-3">
            Ces données sont collectées directement via nos formulaires, ou automatiquement via des cookies
            (voir section “Cookies”).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            3. Finalités du traitement
          </h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Gérer votre inscription, votre compte et vos abonnements</li>
            <li>Améliorer nos services et l’expérience utilisateur</li>
            <li>Envoyer des communications commerciales ou informatives (si vous y avez consenti)</li>
            <li>Analyser les performances et l’audience du site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            4. Base légale du traitement
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679), le traitement
            repose sur :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Votre consentement explicite (formulaires, cookies)</li>
            <li>Notre intérêt légitime à améliorer nos services</li>
            <li>L’exécution d’un contrat (dans le cadre d’un abonnement MaiSeoM)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            5. Cookies et mesure d’audience
          </h2>
          <p>
            Le site{" "}
            <strong>MaiSeoM</strong> utilise des cookies pour mesurer l’audience et améliorer ses
            fonctionnalités. Certains cookies peuvent également être utilisés à des fins publicitaires, sous
            réserve de votre accord.
          </p>
          <p className="mt-3">
            Vous pouvez modifier vos préférences à tout moment via le bandeau de consentement ou le bouton{" "}
            <strong>“Gérer mes cookies”</strong> en bas de page.
          </p>
          <p className="mt-3">
            Pour plus d’informations, consultez notre{" "}
            <a href="#cookies" className="text-indigo-600 hover:underline">
              politique cookies
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            6. Conservation des données
          </h2>
          <p>
            Les données sont conservées uniquement le temps nécessaire à la réalisation des finalités mentionnées
            ci-dessus :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Données de contact : 3 ans après le dernier contact</li>
            <li>Données contractuelles : 5 ans après la fin de l’abonnement</li>
            <li>Données techniques (cookies) : 13 mois maximum</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            7. Partage et sous-traitance
          </h2>
          <p>
            Certaines données peuvent être partagées avec nos prestataires techniques pour le bon fonctionnement
            du service (hébergement, outils d’analyse, paiement). Ces prestataires s’engagent à respecter la
            confidentialité et la sécurité de vos données conformément au RGPD.
          </p>
          <p className="mt-3">
            Les données ne sont jamais revendues à des tiers et ne font pas l’objet d’un transfert hors de l’Union
            Européenne, sauf si le prestataire offre un niveau de protection adéquat (ex. : hébergeur américain
            certifié).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            8. Vos droits
          </h2>
          <p>
            Vous disposez, à tout moment, des droits suivants :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Droit d’accès à vos données personnelles</li>
            <li>Droit de rectification ou de suppression</li>
            <li>Droit d’opposition et de limitation du traitement</li>
            <li>Droit à la portabilité de vos données</li>
          </ul>
          <p className="mt-3">
            Pour exercer vos droits, contactez-nous à :
            <br />
            <a href="mailto:contact@maiseom.com" className="text-indigo-600 hover:underline">
              contact@maiseom.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            9. Sécurité des données
          </h2>
          <p>
            MaiSeoM met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour protéger
            vos données personnelles contre la perte, l’accès non autorisé, la divulgation ou la destruction.
          </p>
          <p className="mt-3">
            Nos serveurs sont hébergés sur des infrastructures sécurisées avec chiffrement HTTPS et sauvegardes
            régulières.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            10. Modifications de la politique
          </h2>
          <p>
            MaiSeoM se réserve le droit de modifier la présente politique à tout moment. Les utilisateurs seront
            informés des changements significatifs via le site ou par e-mail.
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
