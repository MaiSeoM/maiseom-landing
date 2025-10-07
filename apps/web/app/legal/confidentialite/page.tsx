export const metadata = {
  title: "Politique de confidentialité | MaiSeoM",
};

export default function Confidentialite() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">Politique de confidentialité</h1>
      <p>
        Nous collectons les informations nécessaires à la fourniture du service : nom, email, domaines analysés, résultats
        d’audits et données de facturation. Ces informations sont stockées de manière sécurisée sur nos fournisseurs cloud.
      </p>
      <p>
        Les données d’accès OAuth (Google/GitHub) sont utilisées uniquement pour l’authentification. Les informations de
        paiement sont traitées par Stripe et ne transitent pas par nos serveurs.
      </p>
      <p>
        Conformément au RGPD, vous pouvez exercer vos droits d’accès, de rectification ou de suppression en écrivant à
        privacy@maiseom.com.
      </p>
    </article>
  );
}
