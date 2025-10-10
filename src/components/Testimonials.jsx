const ITEMS = [
  {
    name: "Clara M.",
    role: "Fondatrice, boutique D2C",
    quote:
      "En 3 semaines, +24% de clics organiques. Les reco IA-SEO sont claires et rapides à appliquer.",
  },
  {
    name: "Yannis B.",
    role: "Consultant SEO",
    quote:
      "J’utilise MaiSeoM pour mes audits flash : titles, metas, schémas… gain de temps énorme.",
  },
  {
    name: "Sarah L.",
    role: "CMO, SaaS B2B",
    quote:
      "Les contenus optimisés sont repris dans des réponses IA. On voit la diff sur les requêtes brandées.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16">
      <div className="container">
        <h2 className="text-3xl font-extrabold text-center">Ils en parlent le mieux</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {ITEMS.map((t, i) => (
            <figure key={i} className="card p-6 text-left">
              <blockquote className="text-gray-800 leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{t.name}</span> — {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
