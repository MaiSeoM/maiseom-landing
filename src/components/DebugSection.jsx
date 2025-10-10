// Ce wrapper force un cadre propre autour de n'importe quel contenu.
// Il ajoute: max-width, padding horizontal, padding vertical, et un léger espacement interne.
export default function DebugSection({ id, className = "", children }) {
  return (
    <section id={id} className={`py-20 bg-white ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        {children}
      </div>
    </section>
  );
}
