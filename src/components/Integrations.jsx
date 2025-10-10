export default function Integrations() {
  const badges = ["WordPress", "Shopify", "Webflow", "Wix", "PrestaShop", "API"];
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Intégrations</h2>
        <p className="text-gray-600 mt-2">Appliquez vos corrections sans effort sur vos outils.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {badges.map((b) => (
            <span key={b} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
