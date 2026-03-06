import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const METRICS = [
  {
    label: "Clics non-brand",
    note: "Requêtes clés (Search Console, 60 jours)",
    value: 37,
    prefix: "+",
    suffix: "%",
    gradient: "from-emerald-500 to-lime-400",
  },
  {
    label: "CTR pages business",
    note: "Pages produits / services (médiane clients)",
    value: 22,
    prefix: "+",
    suffix: "%",
    gradient: "from-sky-600 to-cyan-400",
  },
  {
    label: "Erreurs SEO",
    note: "Balisage, métas, maillage, Core Web Vitals",
    value: 32,
    prefix: "-",
    suffix: "%",
    gradient: "from-blue-700 to-indigo-500",
  },
  {
    label: "Positions gagnées",
    note: "Top 10 URLs cibles (moyenne)",
    value: 12,
    suffix: "",
    gradient: "from-violet-600 to-fuchsia-500",
  },
  {
    label: "Temps économisé",
    note: "Par mois / Par domaine",
    value: "6 à 12h",
    isText: true,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    label: "Mise en place",
    note: "Sans développeur, plugin & 1 clic",
    value: "15 min",
    isText: true,
    gradient: "from-purple-600 to-pink-500",
  },
];

export default function KeyMetrics() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const items = Array.from(wrap.querySelectorAll("[data-counter]"));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.dataset.done === "1") return;
        animateNumber(el);
        el.dataset.done = "1";
      });
    }, { threshold: 0.35 });

    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="chiffres-cles"
      className="relative py-20 bg-gradient-to-b from-white to-gray-50 scroll-mt-24 md:scroll-mt-28"
    >
      {/* halos doux */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_260px_at_10%_0%,rgba(32,102,204,0.08),transparent),radial-gradient(800px_240px_at_90%_120%,rgba(140,82,255,0.08),transparent)]" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
          >
            Impact mesurable
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
            className="mt-3 text-3xl lg:text-4xl font-extrabold tracking-tight"
          >
            Chiffres clés
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="mt-2 text-gray-600"
          >
            Des résultats concrets, directement liés à vos objectifs business.
          </motion.p>
        </div>

        <div
          ref={wrapRef}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 * i }}
              className={`relative p-[2px] rounded-2xl bg-gradient-to-r ${m.gradient} transition-transform duration-300 hover:scale-[1.02]`}
            >
              <div className="rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-md p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r ${m.gradient}`} />
                  <span className="text-sm font-semibold text-gray-900">{m.label}</span>
                </div>

                <div className="mt-3 flex items-end gap-2">
                  {m.isText ? (
                    <span className="text-4xl leading-none font-extrabold text-gray-900 tracking-tight">
                      {m.value}
                    </span>
                  ) : (
                    <span
                      className="text-4xl leading-none font-extrabold text-gray-900 tracking-tight"
                      data-counter
                      data-target={m.value}
                      data-decimals={m.decimals || 0}
                      data-prefix={m.prefix || ""}
                      data-suffix={m.suffix || ""}
                    >
                      0
                    </span>
                  )}
                  {!m.isText && m.suffix === "%" && (
                    <span className="text-lg leading-none font-semibold text-gray-900">%</span>
                  )}
                </div>

                {m.note && (
                  <p className="mt-2 text-[12px] leading-snug text-gray-600">{m.note}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- helpers --- */
function animateNumber(el) {
  const target = parseFloat(el.dataset.target || "0");
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";

  const duration = 1100 + Math.min(1200, target * 8); // ~1.1–2.3s
  const start = performance.now();

  function tick(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(p);
    const current = target * eased;
    el.textContent = `${prefix}${current.toFixed(decimals)}${suffix === "%" ? "" : ""}`;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
