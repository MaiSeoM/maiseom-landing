export default function LogoStrip() {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs uppercase tracking-widest text-gray-500">Ils nous font confiance</p>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-6 items-center opacity-70">
          <div className="text-center"><span className="text-sm font-semibold">WordPress</span></div>
          <div className="text-center"><span className="text-sm font-semibold">Shopify</span></div>
          <div className="text-center"><span className="text-sm font-semibold">Webflow</span></div>
          <div className="text-center hidden sm:block"><span className="text-sm font-semibold">Wix</span></div>
          <div className="text-center hidden sm:block"><span className="text-sm font-semibold">PrestaShop</span></div>
          <div className="text-center hidden sm:block"><span className="text-sm font-semibold">Framer</span></div>
        </div>
      </div>
    </section>
  );
}
