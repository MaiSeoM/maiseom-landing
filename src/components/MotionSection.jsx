import { motion } from "framer-motion";

/**
 * MotionSection
 * - Apparition douce (fade + slide) quand la section entre dans l’écran
 * - S'anime 1 seule fois (viewport.once = true)
 * - Props:
 *   - as: composant/élément à utiliser ("section" par défaut)
 *   - className, children
 *   - delay: délai d'animation (secondes)
 *   - y: distance verticale du slide initial (px)
 */
export default function MotionSection({
  as: Tag = "section",
  className = "",
  children,
  delay = 0,
  y = 28,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
      aria-live="polite"
    >
      {/* On rend le bon tag pour l’accessibilité/SEO */}
      <Tag className="contents">{children}</Tag>
    </motion.div>
  );
}
