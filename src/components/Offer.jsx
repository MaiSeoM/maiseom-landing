export default function Offer() {
  return (
    <section className="py-14">
      <div className="container">
        <div className="card p-8 text-center">
          <span className="badge">Offre de lancement</span>
          <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">
            -30% à vie pour les 50 premiers inscrits
          </h3>
          <p className="mt-2 text-gray-600">
            Rejoignez la bêta dès maintenant et verrouillez un tarif préférentiel à vie.
          </p>
          <a href="#cta" className="btn-primary mt-6 inline-flex">Profiter de l’offre</a>
        </div>
      </div>
    </section>
  );
}
