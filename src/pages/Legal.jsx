// src/pages/Legal.jsx
import { motion } from "framer-motion";

export default function Legal() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Bandeau */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-20 left-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="h-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600" />

        <div className="relative text-center py-20 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Mentions légales
          </motion.h1>

          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Informations légales concernant l’éditeur et l’hébergeur du site
            <strong className="text-indigo-600"> MaiSeoM</strong>.
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-4xl mx-auto px-6 py-16 leading-relaxed text-gray-700">

        {/* Editeur */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          1. Éditeur du site
        </h2>

        <p>
          Le site <strong>maiseom.com</strong> est édité par :
        </p>

        <p className="mt-3">
          <strong>MaiSeoM</strong> – Micro-entreprise
          <br />
          Dénomination commerciale : MaiSeoM
          <br />
          Représentée par : Melvyn Sel
          <br />
          Adresse : 60 rue François 1er, 75008 Paris, France
          <br />
          SIRET : 898 166 822 00020
          <br />
          Email : contact@maiseom.com
        </p>

        <p className="mt-3">
          Responsable de la publication : Melvyn Sel
        </p>

        {/* Hébergement */}
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          2. Hébergement
        </h2>

        <p>
          Le site est hébergé par :
        </p>

        <p className="mt-3">
          <strong>Vercel Inc.</strong>
          <br />
          440 N Barranca Ave #4133
          <br />
          Covina, CA 91723
          <br />
          États-Unis
        </p>

        {/* Propriété intellectuelle */}
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          3. Propriété intellectuelle
        </h2>

        <p>
          L’ensemble du contenu présent sur le site maiseom.com (textes, images,
          graphismes, logo, code, logiciels, interfaces, etc.) est la propriété
          exclusive de MaiSeoM sauf mention contraire.
        </p>

        <p className="mt-3">
          Toute reproduction, représentation, modification ou exploitation,
          totale ou partielle, du contenu du site sans autorisation préalable
          écrite est strictement interdite.
        </p>

        {/* Responsabilité */}
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          4. Responsabilité
        </h2>

        <p>
          MaiSeoM met tout en œuvre pour assurer l’exactitude des informations
          diffusées sur le site. Toutefois, l’éditeur ne saurait être tenu
          responsable des erreurs, omissions ou d’une indisponibilité temporaire
          des services.
        </p>

        <p className="mt-3">
          L’utilisateur reconnaît utiliser le site et les services proposés
          sous sa seule responsabilité.
        </p>

        {/* Données personnelles */}
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          5. Données personnelles
        </h2>

        <p>
          Les données personnelles collectées sur le site sont utilisées
          uniquement dans le cadre de la relation commerciale entre MaiSeoM
          et ses utilisateurs.
        </p>

        <p className="mt-3">
          Conformément au Règlement Général sur la Protection des Données
          (RGPD), vous disposez d’un droit d’accès, de rectification,
          d’opposition et de suppression de vos données.
        </p>

        <p className="mt-3">
          Pour exercer ces droits, vous pouvez contacter :
          <strong> contact@maiseom.com</strong>.
        </p>

      </section>

      <div className="h-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600" />
    </main>
  );
}