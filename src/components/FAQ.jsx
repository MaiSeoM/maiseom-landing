import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Comment fonctionne MaiSeoM ?",
    a: "Nous analysons votre site et générons automatiquement des recommandations SEO adaptées aux moteurs de recherche et aux IA (SGE, ChatGPT, Perplexity).",
  },
  {
    q: "Dois-je avoir des connaissances techniques ?",
    a: "Non. Tout est automatisé. Vous n’avez qu’à connecter votre site et suivre les recommandations claires dans votre tableau de bord.",
  },
  {
    q: "Puis-je résilier à tout moment ?",
    a: "Oui, tous nos abonnements sont sans engagement. Vous pouvez annuler en un clic depuis votre compte.",
  },
  {
    q: "Pourquoi est-ce mieux qu’un audit SEO classique ?",
    a: "Parce que nous optimisons aussi pour la visibilité dans les réponses générées par IA, là où les utilisateurs cliquent de plus en plus.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-extrabold text-center">
          Questions fréquentes
        </h2>
        <div className="mt-10 space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl shadow-sm bg-gray-50"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-900"
              >
                {item.q}
                <span className="ml-4 text-gray-500">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-600 text-sm">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
