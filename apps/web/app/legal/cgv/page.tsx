export const metadata = {
  title: "Conditions générales de vente | MaiSeoM",
};

export default function CGV() {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">Conditions générales de vente</h1>
      <p>
        MaiSeoM propose des abonnements Essentiel, Pro et Ultime. Les abonnements sont facturés mensuellement via Stripe et se
        renouvellent tacitement. L’utilisateur peut résilier à tout moment via le portail client Stripe, la résiliation prenant
        effet à la fin de la période en cours.
      </p>
      <p>
        Les prix affichés sont hors taxes. Toute modification tarifaire sera notifiée au moins 30 jours à l’avance.
      </p>
      <p>
        En cas de retard de paiement, MaiSeoM se réserve le droit de suspendre l’accès aux fonctionnalités jusqu’à régularisation.
      </p>
    </article>
  );
}
