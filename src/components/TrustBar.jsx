export default function TrustBar() {
  const items = [
    { icon: "🔒", title: "Sécurisé", desc: "Données chiffrées, conformité RGPD" },
    { icon: "⚡", title: "Rapide", desc: "Audit en quelques secondes" },
    { icon: "💬", title: "Support", desc: "Réponse sous 24h ouvrées" },
    { icon: "↩️", title: "Garantie", desc: "Remboursé 14 jours (lancement)" },
  ];
  return (
    <section className="py-10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <div key={i} className="card p-5 text-center">
              <div className="text-2xl">{it.icon}</div>
              <div className="mt-2 font-semibold">{it.title}</div>
              <div className="text-xs text-gray-600">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
