import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export default function ContactEmailModal({ open, onClose }) {
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText("contact@maiseom.com");
    setCopied(true);
    audioRef.current?.play(); // petit son subtil
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Halo lumineux */}
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse-slow" />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-[92%] overflow-hidden border border-gray-100"
            initial={{ scale: 0.92, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 14 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ligne gradient top */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600" />

            <h2 className="text-2xl font-bold text-gray-900 text-center">📩 Contactez-nous</h2>
            <p className="mt-3 text-gray-600 text-center">
              Vous pouvez nous écrire directement à :
            </p>

            {/* Bloc email + bouton copier */}
            <div className="mt-6 bg-gray-100 rounded-xl p-4 flex flex-col gap-3 items-center justify-center shadow-inner text-center">
              <a
                href="mailto:contact@maiseom.com?subject=Demande%20d'information%20-%20MaiSeoM"
                className="text-indigo-600 font-semibold text-lg hover:underline"
              >
                contact@maiseom.com
              </a>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:opacity-90 transition"
              >
                Copier l’adresse
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Temps de réponse moyen : sous 24h (jours ouvrés)
            </p>

            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Fermer"
            >
              ✕
            </button>

            {/* Toast “copié ✅” */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg"
                >
                  ✅ Adresse copiée
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🔈 Son doux */}
            <audio ref={audioRef}>
              <source
                src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_bdbf3d9dd9.mp3?filename=correct-2-46134.mp3"
                type="audio/mpeg"
              />
            </audio>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
