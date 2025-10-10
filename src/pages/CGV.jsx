// src/pages/CGV.jsx
import { motion } from "framer-motion";

export default function CGV() {
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
            Conditions Générales de Vente (CGV)
          </motion.h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Version applicable au 1er octobre 2025
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="max-w-4xl mx-auto px-6 py-16 leading-relaxed text-gray-700 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Présentation</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
            <strong> MaiSeoM </strong> (ci-après “l’Éditeur”) et toute personne physique ou morale (ci-après “le Client”)
            souhaitant utiliser les services proposés sur le site{" "}
            <a href="https://maiseom.com" className="text-indigo-600 hover:underline">
              www.maiseom.com
            </a>.
          </p>
          <p className="mt-3">
            MaiSeoM est une plateforme SaaS d’analyse, de recommandation et d’automatisation SEO assistée par intelligence artificielle.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Objet</h2>
          <p>
            Les présentes CGV ont pour objet de définir les conditions dans lesquelles MaiSeoM fournit
            ses services d’audit, d’analyse et d’optimisation SEO automatisée aux Clients, ainsi que les
            obligations réciproques des parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Description des services</h2>
          <p>
            MaiSeoM propose plusieurs formules d’abonnement (Starter, Pro et Entreprise), dont les caractéristiques,
            tarifs et conditions spécifiques sont détaillées sur la page{" "}
            <a href="/tarifs" className="text-indigo-600 hover:underline">
              Tarifs
            </a>.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>Starter :</strong> audits mensuels limités avec recommandations SEO à appliquer par le client.
            </li>
            <li>
              <strong>Pro :</strong> audits illimités, recommandations avancées et application automatique sur le site du client (via accès FTP/API/Plugin).
            </li>
            <li>
              <strong>Entreprise :</strong> fonctionnalités du plan Pro étendues à plusieurs sites, avec intégrations personnalisées et accompagnement dédié.
            </li>
          </ul>
          <p className="mt-3">
            MaiSeoM se réserve le droit de modifier à tout moment les fonctionnalités ou la présentation de ses services,
            dans une logique d’amélioration continue.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Commande et création de compte</h2>
          <p>
            L’accès aux services nécessite la création d’un compte sur la plateforme. Le Client s’engage à
            fournir des informations exactes et à les maintenir à jour. La validation d’une commande implique
            l’acceptation expresse des présentes CGV.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Durée et résiliation</h2>
          <p>
            Les abonnements sont souscrits pour une durée mensuelle renouvelable par tacite reconduction.
            Le Client peut résilier son abonnement à tout moment depuis son espace personnel.
          </p>
          <p className="mt-3">
            Toute période mensuelle entamée reste due. Aucun remboursement ne sera effectué pour le mois en cours.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Tarifs et modalités de paiement</h2>
          <p>
            Les tarifs applicables sont ceux affichés sur le site au moment de la souscription. Ils sont exprimés
            en euros et hors taxes (HT). Le paiement s’effectue par carte bancaire via une plateforme sécurisée
            (ex : Stripe).
          </p>
          <p className="mt-3">
            MaiSeoM se réserve le droit de modifier ses tarifs à tout moment. Les Clients déjà abonnés seront informés
            au moins 30 jours avant l’entrée en vigueur du nouveau tarif.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Obligations du Client</h2>
          <p>
            Le Client s’engage à fournir à MaiSeoM les accès nécessaires à la mise en œuvre de certaines
            fonctionnalités (API, FTP, CMS) dans le cadre du plan Pro ou Entreprise.
          </p>
          <p className="mt-3">
            Il est seul responsable de la sauvegarde de ses données, de la sécurité de son site et des actions
            entreprises à partir de son compte.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Responsabilité</h2>
          <p>
            MaiSeoM s’engage à fournir ses services avec diligence et compétence. Toutefois, MaiSeoM ne saurait être
            tenue responsable :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>des conséquences d’un mauvais paramétrage du site client,</li>
            <li>des modifications des algorithmes des moteurs de recherche,</li>
            <li>ou de tout incident technique indépendant de sa volonté.</li>
          </ul>
          <p className="mt-3">
            MaiSeoM ne garantit pas un positionnement précis dans les résultats de recherche.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Données personnelles et confidentialité</h2>
          <p>
            MaiSeoM respecte la réglementation européenne (RGPD). Les données collectées sont utilisées uniquement
            pour la gestion des comptes clients et la fourniture des services.
          </p>
          <p className="mt-3">
            Le Client dispose d’un droit d’accès, de rectification et de suppression de ses données personnelles
            en contactant :{" "}
            <a href="mailto:contact@maiseom.com" className="text-indigo-600 hover:underline">
              contact@maiseom.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Propriété intellectuelle</h2>
          <p>
            L’ensemble du contenu et des développements réalisés par MaiSeoM (outils, IA, codes, rapports, interfaces)
            demeure la propriété exclusive de MaiSeoM. Toute reproduction ou réutilisation sans autorisation écrite
            est strictement interdite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Force majeure</h2>
          <p>
            En cas de force majeure (catastrophe, guerre, panne générale d’infrastructure, etc.), les obligations
            de MaiSeoM sont suspendues pendant toute la durée de l’événement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Droit applicable et litiges</h2>
          <p>
            Les présentes CGV sont régies par le droit français. En cas de litige, les tribunaux compétents
            seront ceux du ressort de Paris (France).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGV, le Client peut contacter :
            <br />
            <strong>MaiSeoM</strong>
            <br />
            Email :{" "}
            <a href="mailto:contact@maiseom.com" className="text-indigo-600 hover:underline">
              contact@maiseom.com
            </a>
          </p>
        </section>
      </section>

      <div className="h-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600" />
    </main>
  );
}
