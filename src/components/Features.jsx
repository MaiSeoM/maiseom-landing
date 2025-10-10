import FeatureCard from "../ui/FeatureCard";

export default function Features() {
  return (
    <section className="mt-16 sm:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Audit complet en 1 clic"
          desc="Titres, metas, schémas, performance, accessibilité : détectez ce qui freine votre visibilité."
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2"/><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2"/></svg>}
        />
        <FeatureCard
          title="Optimisations IA"
          desc="Contenus et balisage prêts pour SGE, ChatGPT, Perplexity & co."
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2"/></svg>}
        />
        <FeatureCard
          title="Corrections automatiques"
          desc="Connecteurs WordPress / Shopify / Webflow : appliquez les fix en un clic."
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"/></svg>}
        />
      </div>
    </section>
  );
}
