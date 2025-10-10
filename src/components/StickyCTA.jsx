export default function StickyCTA() {
  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 sm:hidden">
      <div className="mx-auto max-w-md">
        <a
          href="#cta"
          className="block text-center py-3 rounded-2xl font-semibold text-white shadow-lg"
          style={{ backgroundImage: "linear-gradient(90deg,#2066CC 0%,#8C52FF 100%)" }}
          aria-label="Rejoindre la bêta maintenant"
        >
          Rejoindre la bêta — -30% à vie
        </a>
      </div>
    </div>
  );
}
