export default function Benefits() {
  const items = [
    {
      icon: "✅",
      title: "Audit SEO ultra-rapide",
      desc: "Titres, metas, schémas, performances, maillage interne… analysés en quelques secondes.",
      grad: "from-blue-600 to-purple-600",
    },
    {
      icon: "🤖",
      title: "Optimisations IA-SEO",
      desc: "Recommandations prêtes pour SGE, ChatGPT, Perplexity & co. Contenu mieux repris par les IA.",
      grad: "from-purple-600 to-cyan-400",
    },
    {
      icon: "📈",
      title: "Plus de clics (CTR)",
      desc: "Le bon contenu affiché dans les réponses d’IA → plus de clics qualifiés vers votre site.",
      grad: "from-cyan-400 to-blue-600",
    },
  ];

  return (
    <section id="benefits" className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Conçu pour convertir <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400">& durer</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            IA-SEO automatique, résultats concrets : visibilité dans les réponses d’IA + hausse du taux de clics.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((b) => (
            <div
              key={b.title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow hover:shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {/* Halo discret */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition"
                   style={{ background: "linear-gradient(120deg,#2066CC22,#8C52FF22,#00D4FF22)" }} />
              
              {/* Icône dans bulle dégradée */}
              <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-tr ${b.grad}`}>
                <span className="text-xl">{b.icon}</span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-900 text-center">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-600 text-center">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
