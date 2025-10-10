export default function CookiePolicy() {
  return (
    <section id="cookies" className="py-10 bg-white">
      {/* fine barre dégradée premium */}
      <div
        aria-hidden
        className="h-[2px] w-full mb-6"
        style={{ backgroundImage: "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)" }}
      />

      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-lg font-bold text-gray-900">
          Politique de cookies
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          Nous utilisons des cookies nécessaires au fonctionnement du site. Avec votre consentement,
          nous utilisons également des cookies de mesure d’audience (Google Analytics 4, IP anonymisée)
          et, si vous l’acceptez, des cookies marketing. Vous pouvez modifier votre choix à tout
          moment via le bouton ci-dessous.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>• <b>Nécessaires</b> : indispensables pour le bon fonctionnement du site.</li>
          <li>• <b>Mesure d’audience</b> (GA4) : statistiques d’usage agrégées, IP anonymisée.</li>
          <li>• <b>Marketing</b> : activation éventuelle de fonctionnalités publicitaires.</li>
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => window.maiseomOpenCookies?.()}
            className="px-4 py-2 rounded-lg text-white font-semibold shadow-sm hover:opacity-90 transition"
            style={{ backgroundImage: "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)" }}
          >
            Gérer mes cookies
          </button>

          <span className="text-xs text-gray-500">
            Vos préférences sont conservées (6–12 mois). Vous pouvez les mettre à jour à tout moment.
          </span>
        </div>
      </div>
    </section>
  );
}
