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
            Version applicable au 1er janvier 2026
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="max-w-4xl mx-auto px-6 py-16 leading-relaxed text-gray-700 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Présentation</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
            <strong> MaiSeoM</strong>, société domiciliée au 60 rue François 1er, 75008 Paris (France),
ci-après “l’Éditeur”.(ci-après “l’Éditeur”) et toute personne physique ou morale (ci-après “le Client”)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Commande, création de compte et activation</h2>
          <p>
            L’accès aux services MaiSeoM nécessite la création d’un compte sur la plateforme. Le Client s’engage à
            fournir des informations exactes, complètes et à jour, et demeure seul responsable de la confidentialité
            de ses identifiants.
          </p>
          <p className="mt-3">
            La souscription à un abonnement se fait en ligne via la page{" "}
            <a href="/tarifs" className="text-indigo-600 hover:underline">
              Tarifs
            </a>
            . La commande est considérée comme définitive dès la validation du paiement et l’acceptation expresse
            des présentes CGV.
          </p>
          <p className="mt-3">
            L’abonnement est activé à compter de la confirmation de commande affichée à l’écran et/ou envoyée par email.
            MaiSeoM se réserve le droit de refuser ou suspendre une commande en cas de suspicion de fraude, d’usage abusif
            ou de non-respect des présentes CGV.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Durée, engagement de 3 mois, renouvellement et résiliation</h2>
          <p>
            Les abonnements MaiSeoM sont souscrits avec un <strong>engagement initial ferme de 3 (trois) mois</strong>
            (ci-après la “Période d’Engagement”). Pendant cette période, l’abonnement ne peut pas être résilié
            pour convenance et les mensualités restent dues jusqu’à son terme, sauf dispositions légales impératives.
          </p>
          <p className="mt-3">
            À l’issue de la Période d’Engagement, l’abonnement se poursuit en <strong>renouvellement mensuel</strong> par tacite
            reconduction. Le Client peut alors résilier à tout moment depuis son espace personnel, et la résiliation prendra
            effet à la fin de la période de facturation mensuelle en cours.
          </p>
          <p className="mt-3">
            En cas de résiliation demandée pendant la Période d’Engagement, le Client conserve l’accès au service jusqu’à la fin
            de cette période, et reste redevable des sommes dues jusqu’à son terme. <strong>Aucun remboursement</strong> ne sera effectué
            pour une période entamée.
          </p>
          <p className="mt-3">
            MaiSeoM se réserve le droit de suspendre l’accès aux services en cas de défaut de paiement, jusqu’à régularisation.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Programme de parrainage</h2>
          <p>
            MaiSeoM peut proposer à ses utilisateurs un programme de parrainage permettant de recommander la plateforme à
            de nouveaux clients.
          </p>
          <p className="mt-3">
            Chaque utilisateur peut disposer d’un code de parrainage personnel. Lorsqu’un nouveau client utilise ce code
            lors de sa souscription à un abonnement payant, il peut bénéficier d’une réduction de <strong>15 % sur son premier paiement</strong>.
          </p>
          <p className="mt-3">
            En contrepartie, le parrain cumule des crédits MaiSeoM selon la règle suivante :
            <strong> 5 € de crédits tous les 2 abonnements payants validés</strong> réalisés via son code de parrainage.
          </p>
          <p className="mt-3">
            Les crédits de parrainage sont enregistrés dans l’espace utilisateur du parrain. Ils sont considérés comme
            <strong> en attente</strong> tant qu’un montant total minimum de <strong>50 €</strong> n’est pas atteint. Une fois ce seuil atteint,
            ils deviennent <strong>débloqués</strong>.
          </p>
          <p className="mt-3">
            Les crédits MaiSeoM ne constituent pas une monnaie, ne sont ni remboursables, ni convertibles en espèces,
            ni transférables à un tiers. MaiSeoM se réserve la faculté de définir librement les modalités futures
            d’utilisation de ces crédits.
          </p>
          <p className="mt-3">
            Un parrainage n’est considéré comme valide que si :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>le filleul est un nouveau client,</li>
            <li>la souscription a été valablement payée,</li>
            <li>aucune fraude, remboursement ou anomalie n’est constaté.</li>
          </ul>
          <p className="mt-3">
            Sont notamment interdits :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>l’auto-parrainage,</li>
            <li>la création de comptes multiples par une même personne,</li>
            <li>tout usage abusif, frauduleux ou détourné du programme.</li>
          </ul>
          <p className="mt-3">
            MaiSeoM se réserve le droit de suspendre, modifier ou supprimer le programme de parrainage à tout moment,
            sans indemnité, sous réserve du maintien des crédits déjà valablement acquis.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Obligations du Client</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Responsabilité</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Données personnelles et confidentialité</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Propriété intellectuelle</h2>
          <p>
            L’ensemble du contenu et des développements réalisés par MaiSeoM (outils, IA, codes, rapports, interfaces)
            demeure la propriété exclusive de MaiSeoM. Toute reproduction ou réutilisation sans autorisation écrite
            est strictement interdite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Force majeure</h2>
          <p>
            En cas de force majeure (catastrophe, guerre, panne générale d’infrastructure, etc.), les obligations
            de MaiSeoM sont suspendues pendant toute la durée de l’événement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Droit applicable et litiges</h2>
          <p>
            Les présentes CGV sont régies par le droit français. En cas de litige, les tribunaux compétents
            seront ceux du ressort de Paris (France).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">14. Contact</h2>
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