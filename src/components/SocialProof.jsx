export default function SocialProof() {
  const logos = [
    { name: "Google", src: "/logos/google.svg" },
    { name: "OpenAI", src: "/logos/openai.svg" },
    { name: "Perplexity", src: "/logos/perplexity.svg" },
    { name: "HubSpot", src: "/logos/hubspot.svg" },
    { name: "Notion", src: "/logos/notion.svg" },
  ];

  return (
    <section className="bg-gradient-to-r from-gray-50 to-white py-12 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Ils optimisent déjà avec l’IA
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-center">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex justify-center grayscale hover:grayscale-0 transition duration-300"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-8 sm:h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
