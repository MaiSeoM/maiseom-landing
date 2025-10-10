export default function CTA() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-6">
          Prêt à booster votre visibilité ?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Rejoignez dès maintenant la liste d’attente et profitez d’une
          optimisation SEO & IA exclusive avant vos concurrents.
        </p>
        <a
          href="#waitlist"
          className="inline-flex items-center px-8 py-3 rounded-full bg-white text-indigo-700 font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          🚀 Rejoindre la liste d’attente
        </a>
      </div>
    </section>
  );
}
