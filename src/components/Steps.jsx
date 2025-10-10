export default function Steps() {
  const items = [
    { title: "1. Entrez votre domaine", desc: "Nous analysons structure, contenu, balises, performances & IA-SEO." },
    { title: "2. Recevez vos recommandations", desc: "Titres, metas, schémas, contenus, vitesse… prêtes à appliquer." },
    { title: "3. Corrigez en un clic", desc: "Intégrations WordPress/Shopify/Webflow. Rapports & alertes." },
  ];
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center">Comment ça marche</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <div key={i} className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-6">
              <h3 className="font-bold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
